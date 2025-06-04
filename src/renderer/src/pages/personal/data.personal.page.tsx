import isplateUrl from '@renderer/_import/personal_isplate.txt?url'
import uplateUrl from '@renderer/_import/personal_uplate.txt?url'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { PersonalBankTransaction } from '@shared/data.types'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  createColumnHelper
} from '@tanstack/react-table'
import { CheckIcon, PaperclipIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Define a local type for the table and parsing
export type PersonalTableTransaction = {
  id: string
  valueDate: string
  creditAmount: number
  debitAmount: number
  description: string
  labelId?: string
  attachment?: {
    fileName: string
    filePath: string
    uploadedAt: string
  }
}

export const PersonalDataPage = () => {
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'valueDate', desc: true }])
  const {
    personalAccounts,
    addPersonalAccount,
    personalLabels,
    addPersonalTransactions,
    clearPersonalTransactions,
    labelPersonalTransaction
  } = useDataStore()

  // For demo, use the first personal account or create one
  const account = personalAccounts[0] || { id: 'personal-1', number: 'personal', transactions: [] }
  if (personalAccounts.length === 0) {
    addPersonalAccount(account)
  }

  // Parse transactions from text files
  const parseTransactionsFromFiles = async (): Promise<PersonalTableTransaction[]> => {
    try {
      console.log('Starting to read transaction files...')

      // Helper function to clean recipient description
      const cleanRecipientDescription = (description: string): string => {
        // Remove numbers in braces like (34534534)
        return description.replace(/\s*\(\d+\)\s*/g, '').trim()
      }

      // Try to read the files
      let incomingText: string
      let outgoingText: string

      try {
        const incomingResponse = await fetch(uplateUrl)
        if (!incomingResponse.ok) {
          throw new Error(
            `Failed to read uplate.txt: ${incomingResponse.status} ${incomingResponse.statusText}`
          )
        }
        incomingText = await incomingResponse.text()
        console.log('Successfully read uplate.txt')
      } catch (err) {
        console.error('Error reading uplate.txt:', err)
        throw new Error('Failed to read incoming transactions file')
      }

      try {
        const outgoingResponse = await fetch(isplateUrl)
        if (!outgoingResponse.ok) {
          throw new Error(
            `Failed to read isplate.txt: ${outgoingResponse.status} ${outgoingResponse.statusText}`
          )
        }
        outgoingText = await outgoingResponse.text()
        console.log('Successfully read isplate.txt')
      } catch (err) {
        console.error('Error reading isplate.txt:', err)
        throw new Error('Failed to read outgoing transactions file')
      }

      if (!incomingText && !outgoingText) {
        throw new Error('Both transaction files are empty')
      }

      const transactions: PersonalTableTransaction[] = []

      // Helper function to parse a single line
      const parseLine = (line: string, type: 'in' | 'out') => {
        try {
          const parts = line.split('\t').filter(Boolean)
          if (parts.length < 4) {
            console.warn('Skipping malformed line:', line)
            return null
          }

          const date = parts[0]
          const amount = parts[2]
          const description = parts[3] || 'Unknown'

          // Skip header line
          if (date === 'Datum valute') {
            console.log('Skipping header line')
            return null
          }

          const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
          if (isNaN(parsedAmount)) {
            console.warn('Invalid amount in line:', line)
            return null
          }

          // Set creditAmount and debitAmount
          let creditAmount = 0
          let debitAmount = 0
          if (type === 'in') {
            creditAmount = parsedAmount
          } else {
            debitAmount = parsedAmount
          }

          return {
            id: uuidv4(),
            valueDate: date,
            creditAmount,
            debitAmount,
            description: cleanRecipientDescription(description),
            labelId: undefined,
            attachment: {
              fileName: '',
              filePath: '',
              uploadedAt: ''
            }
          }
        } catch (err) {
          console.error('Error parsing line:', line, err)
          return null
        }
      }

      // Process incoming transactions
      console.log('Processing incoming transactions...')
      const incomingLines = incomingText.split('\n')
      console.log(`Found ${incomingLines.length} lines in uplate.txt`)

      incomingLines.forEach((line, index) => {
        if (!line.trim()) return
        const transaction = parseLine(line, 'in')
        if (transaction) {
          transactions.push(transaction)
        } else {
          console.warn(`Failed to parse incoming transaction at line ${index + 1}`)
        }
      })

      // Process outgoing transactions
      console.log('Processing outgoing transactions...')
      const outgoingLines = outgoingText.split('\n')
      console.log(`Found ${outgoingLines.length} lines in isplate.txt`)

      outgoingLines.forEach((line, index) => {
        if (!line.trim()) return
        const transaction = parseLine(line, 'out')
        if (transaction) {
          transactions.push(transaction)
        } else {
          console.warn(`Failed to parse outgoing transaction at line ${index + 1}`)
        }
      })

      console.log(`Successfully parsed ${transactions.length} transactions`)
      return transactions
    } catch (err) {
      console.error('Error in parseTransactionsFromFiles:', err)
      throw err
    }
  }

  const handleSync = async () => {
    setIsImporting(true)
    setImportError(null)
    try {
      console.log('Starting sync process...')
      const newTransactions = await parseTransactionsFromFiles()

      // Convert existing transactions to a comparable format
      const existingTransactions = (account.transactions as PersonalBankTransaction[]).map((t) => ({
        valueDate: t.valueDate,
        amount: t.type === 'in' ? t.amount : -t.amount,
        description: t.description.trim()
      }))

      // Helper function to compare amounts with a small tolerance for floating-point precision
      const areAmountsEqual = (a: number, b: number) => Math.abs(a - b) < 0.01

      // Filter out duplicates with improved comparison
      const uniqueTransactions = newTransactions.filter((newT) => {
        const newAmount = newT.creditAmount - newT.debitAmount
        return !existingTransactions.some(
          (existingT) =>
            existingT.valueDate === newT.valueDate &&
            areAmountsEqual(existingT.amount, newAmount) &&
            existingT.description === newT.description.trim()
        )
      })

      if (uniqueTransactions.length > 0) {
        // Convert to PersonalBankTransaction for the store
        const toStore = uniqueTransactions.map((t) => ({
          id: t.id,
          valueDate: t.valueDate,
          amount: Math.abs(t.creditAmount - t.debitAmount),
          balance: 0, // Not available from import
          description: t.description,
          type: t.creditAmount > 0 ? ('in' as const) : ('out' as const),
          labelId: t.labelId,
          attachment: t.attachment
        }))
        addPersonalTransactions(toStore, account.id)
        console.log(`Successfully added ${uniqueTransactions.length} new transactions`)
      } else {
        console.log('No new transactions to add')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync transactions'
      console.error('Sync error:', err)
      setImportError(errorMessage)
    } finally {
      setIsImporting(false)
    }
  }

  // Table columns
  const columnHelper = createColumnHelper<PersonalTableTransaction>()
  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('valueDate', {
          header: () => 'Date',
          cell: (info) => info.getValue(),
          sortingFn: (rowA, rowB) => {
            const dateA = new Date(
              (rowA.getValue('valueDate') as string).trim().split('.').reverse().join('-')
            )
            const dateB = new Date(
              (rowB.getValue('valueDate') as string).trim().split('.').reverse().join('-')
            )
            return dateA.getTime() - dateB.getTime()
          }
        }),
        columnHelper.accessor('creditAmount', {
          header: () => 'Credit Amount',
          cell: (info) =>
            new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(info.getValue()),
          filterFn: (row, id, value) => {
            if (!value) return true
            const amount = row.getValue(id) as number
            return amount > 0
          }
        }),
        columnHelper.accessor('debitAmount', {
          header: () => 'Debit Amount',
          cell: (info) =>
            new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(info.getValue()),
          filterFn: (row, id, value) => {
            if (!value) return true
            const amount = row.getValue(id) as number
            return amount > 0
          }
        }),
        columnHelper.accessor('description', {
          header: () => 'Description',
          cell: (info) => info.getValue()
        }),
        columnHelper.accessor('labelId', {
          header: () => 'Label',
          cell: (info) => {
            const labelId = info.getValue() || ''
            return (
              <ComboBox
                items={[
                  { value: '', label: 'No Label' },
                  ...personalLabels.map((l) => ({ value: l.id, label: l.name }))
                ]}
                value={labelId}
                onValueChange={(newLabelId) => {
                  const transaction = info.row.original
                  labelPersonalTransaction(transaction.id, newLabelId, account.id)
                }}
                selectPlaceholder="Select label..."
                searchPlaceholder="Search labels..."
                noResultsText="No labels found."
              />
            )
          },
          filterFn: (row, id, value) => {
            if (typeof value !== 'string') return true
            if (value === 'unlabeled') {
              return !row.getValue(id)
            }
            return value ? row.getValue(id) === value : true
          }
        }),
        columnHelper.accessor('attachment', {
          header: () => 'Attachment',
          cell: (info) => {
            const attachment = info.getValue()
            if (attachment) {
              return <CheckIcon className="w-4 h-4 text-green-500" />
            }
            return (
              <Button size="icon" variant="ghost">
                <PaperclipIcon className="w-4 h-4" />
              </Button>
            )
          }
        })
      ] as ColumnDef<PersonalTableTransaction, unknown>[],
    [personalLabels, account.id, labelPersonalTransaction]
  )

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Data', path: '/personal/data' }
      ]}
    >
      <Typography element="h3">Personal Data</Typography>
      <div className="my-6 p-4 border rounded bg-muted flex flex-col gap-4 max-w-lg">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSync}
            disabled={isImporting}
          >
            {isImporting ? 'Syncing...' : 'Sync Transactions'}
          </button>
          <button
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear all transactions? This action cannot be undone.'
                )
              ) {
                clearPersonalTransactions()
              }
            }}
          >
            Clear Transactions
          </button>
        </div>
        {importError && <span className="text-destructive text-sm">{importError}</span>}
      </div>
      <div className="mt-8">
        <div className="mb-4 flex gap-4 items-center">
          <ComboBox
            items={[
              { value: '', label: 'All Labels' },
              { value: 'unlabeled', label: 'Unlabeled' },
              ...personalLabels.map((l) => ({ value: l.id, label: l.name }))
            ]}
            value={(columnFilters.find((f) => f.id === 'labelId')?.value as string) || ''}
            onValueChange={(value) => {
              setColumnFilters((prev) => {
                const otherFilters = prev.filter((f) => f.id !== 'labelId')
                return value ? [...otherFilters, { id: 'labelId', value }] : otherFilters
              })
            }}
            selectPlaceholder="Filter by label..."
            searchPlaceholder="Search labels..."
            noResultsText="No labels found."
          />
          {/* Credit/Debit Toggles */}
          <button
            className={`px-3 py-1 rounded border ${columnFilters.some((f) => f.id === 'creditAmount') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => {
              setColumnFilters((prev) => {
                const hasCredit = prev.some((f) => f.id === 'creditAmount')
                return hasCredit
                  ? prev.filter((f) => f.id !== 'creditAmount')
                  : [...prev, { id: 'creditAmount', value: true }]
              })
            }}
            type="button"
          >
            Show Credits
          </button>
          <button
            className={`px-3 py-1 rounded border ${columnFilters.some((f) => f.id === 'debitAmount') ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => {
              setColumnFilters((prev) => {
                const hasDebit = prev.some((f) => f.id === 'debitAmount')
                return hasDebit
                  ? prev.filter((f) => f.id !== 'debitAmount')
                  : [...prev, { id: 'debitAmount', value: true }]
              })
            }}
            type="button"
          >
            Show Debits
          </button>
        </div>
        <Table<PersonalTableTransaction, unknown>
          columns={columns}
          data={account.transactions.map((t) => ({
            id: t.id,
            valueDate: t.valueDate,
            creditAmount: t.type === 'in' ? t.amount : 0,
            debitAmount: t.type === 'out' ? t.amount : 0,
            description: t.description,
            labelId: t.labelId,
            attachment: t.attachment
          }))}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      </div>
    </MainLayout>
  )
}
