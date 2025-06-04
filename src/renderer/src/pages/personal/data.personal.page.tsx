import isplateUrl from '@renderer/_import/personal_isplate.txt?url'
import uplateUrl from '@renderer/_import/personal_uplate.txt?url'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
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
}

export const PersonalDataPage = () => {
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { personalAccounts, addPersonalAccount, personalLabels, clearPersonalTransactions } =
    useDataStore()
  const [parsedTransactions, setParsedTransactions] = useState<PersonalTableTransaction[]>([])

  // For demo, use the first personal account or create one
  const account = personalAccounts[0] || { id: 'personal-1', number: 'personal', transactions: [] }
  if (personalAccounts.length === 0) {
    addPersonalAccount(account)
  }

  // Parse transactions from text files
  const parseTransactionsFromFiles = async (): Promise<PersonalTableTransaction[]> => {
    try {
      console.log('Starting to read transaction files...')

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
            description,
            labelId: undefined
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
      setParsedTransactions(newTransactions)
      console.log(`Found ${newTransactions.length} new transactions`)
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
          cell: (info) => info.getValue()
        }),
        columnHelper.accessor('creditAmount', {
          header: () => 'Credit Amount',
          cell: (info) =>
            new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(info.getValue())
        }),
        columnHelper.accessor('debitAmount', {
          header: () => 'Debit Amount',
          cell: (info) =>
            new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(info.getValue())
        }),
        columnHelper.accessor('description', {
          header: () => 'Description',
          cell: (info) => info.getValue()
        }),
        columnHelper.accessor('labelId', {
          header: () => 'Label',
          cell: (info) => {
            const labelId = info.getValue()
            const label = personalLabels.find((l) => l.id === labelId)
            return label ? label.name : '-'
          }
        })
      ] as Array<ColumnDef<PersonalTableTransaction, unknown>>,
    [personalLabels]
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
            onClick={() => clearPersonalTransactions()}
          >
            Clear All Transactions
          </button>
        </div>
        {importError && <span className="text-destructive text-sm">{importError}</span>}
      </div>
      <div className="mt-8">
        <Table<PersonalTableTransaction, unknown> data={parsedTransactions} columns={columns} />
      </div>
    </MainLayout>
  )
}
