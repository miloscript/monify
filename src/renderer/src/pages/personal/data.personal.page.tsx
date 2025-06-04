import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { PersonalBankTransaction } from '@shared/data.types'
import { CellContext } from '@tanstack/react-table'
import * as pdfjsLib from 'pdfjs-dist'
import { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import * as pdfJS from 'pdfjs-dist'
import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url'
pdfJS.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL

export const PersonalDataPage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const {
    personalAccounts,
    addPersonalAccount,
    addPersonalTransactions,
    personalLabels,
    clearPersonalTransactions
  } = useDataStore()

  // For demo, use the first personal account or create one
  const account = personalAccounts[0] || { id: 'personal-1', number: 'personal', transactions: [] }
  if (personalAccounts.length === 0) {
    addPersonalAccount(account)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
      setImportError(null)
    }
  }

  // PDF parsing logic using pdfjs-dist
  const parsePdfToTransactions = async (): Promise<PersonalBankTransaction[]> => {
    if (!pdfFile) throw new Error('No PDF file selected')

    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const transactions: PersonalBankTransaction[] = []

    console.log(pdf)

    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)

      console.log(page)

      const textContent = await page.getTextContent()

      console.log(textContent)

      const text = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str
          }
          return ''
        })
        .join(' ')

      // Split text into lines and process each line
      const lines = text.split('\n')
      let currentBalance = 0

      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue

        // Try to parse transaction data from the line
        // This is a simplified example - you'll need to adjust the regex patterns
        // based on your actual PDF format
        const dateMatch = line.match(/(\d{2}\.\d{2}\.\d{4})/)
        const amountMatch = line.match(/([+-]?\d+[.,]\d{2})/)
        const descriptionMatch = line.match(/([A-Za-z0-9\s]+)(?=\s*[+-]?\d+[.,]\d{2})/)

        if (dateMatch && amountMatch) {
          const date = dateMatch[1]
          const amount = parseFloat(amountMatch[1].replace(',', '.'))
          const description = descriptionMatch ? descriptionMatch[1].trim() : 'Unknown'

          // Update balance
          currentBalance += amount

          transactions.push({
            id: uuidv4(),
            valueDate: date,
            amount,
            balance: currentBalance,
            description,
            type: amount > 0 ? 'in' : 'out',
            labelId: undefined
          })
        }
      }
    }

    return transactions
  }

  const handleImport = async () => {
    if (!pdfFile) {
      setImportError('Please select a PDF file to import.')
      return
    }
    setIsImporting(true)
    setImportError(null)
    try {
      const transactions = await parsePdfToTransactions()
      addPersonalTransactions(transactions, account.id)
    } catch (err) {
      setImportError('Failed to parse PDF.')
      console.error('PDF parsing error:', err)
    } finally {
      setIsImporting(false)
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'valueDate',
        header: 'Date',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) => cell.getValue() as string
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) =>
          new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(cell.getValue() as number)
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) =>
          new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(cell.getValue() as number)
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) => cell.getValue() as string
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) =>
          cell.getValue() as 'in' | 'out'
      },
      {
        accessorKey: 'labelId',
        header: 'Label',
        cell: (cell: CellContext<PersonalBankTransaction, unknown>) => {
          const labelId = cell.getValue() as string | undefined
          const label = personalLabels.find((l) => l.id === labelId)
          return label ? label.name : '-'
        }
      }
    ],
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
        <label className="font-medium">Import Transactions from PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? 'Importing...' : 'Import PDF'}
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
        <Table data={account.transactions} columns={columns} />
      </div>
    </MainLayout>
  )
}
