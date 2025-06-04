import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { TransactionLabel } from '@shared/data.types'
import { ColumnDef, ColumnFiltersState, createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

const recipientsTableConfig = (
  onLabelChange: (recipient: string, labelId: string) => void,
  labels: TransactionLabel[],
  accounts: {
    id: string
    number: string
    transactions: {
      id: string
      valueDate: string
      amount: number
      balance: number
      description: string
      type: 'in' | 'out'
      labelId?: string
    }[]
  }[]
) => {
  const columnHelper = createColumnHelper<{
    recipient: string
    incoming: number
    outgoing: number
    transactionCount: number
  }>()
  return [
    columnHelper.accessor('recipient', {
      header: () => 'Recipient',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('transactionCount', {
      header: () => 'Transactions',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('incoming', {
      header: () => 'Incoming',
      cell: (info) =>
        new Intl.NumberFormat('sr-RS', {
          style: 'currency',
          currency: 'RSD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(info.getValue())
    }),
    columnHelper.accessor('outgoing', {
      header: () => 'Outgoing',
      cell: (info) =>
        new Intl.NumberFormat('sr-RS', {
          style: 'currency',
          currency: 'RSD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(info.getValue())
    }),
    columnHelper.accessor('recipient', {
      id: 'label',
      header: () => 'Label',
      cell: (info) => {
        const recipient = info.getValue()
        const transaction = accounts
          .flatMap((account) => account.transactions)
          .find((t) => t.description === recipient)
        const currentLabelId = transaction?.labelId || ''

        return (
          <ComboBox
            items={[
              { value: '', label: 'No Label' },
              ...labels.map((l) => ({ value: l.id, label: l.name }))
            ]}
            value={currentLabelId}
            onValueChange={(newLabelId) => onLabelChange(recipient, newLabelId)}
            selectPlaceholder="Select label..."
            searchPlaceholder="Search labels..."
            noResultsText="No labels found."
          />
        )
      }
    })
  ] as ColumnDef<
    { recipient: string; incoming: number; outgoing: number; transactionCount: number },
    unknown
  >[]
}

export const PersonalRecipientsPage = (): JSX.Element => {
  const { personalAccounts, personalLabels, labelPersonalTransaction } = useDataStore((state) => ({
    personalAccounts: state.personalAccounts,
    personalLabels: state.personalLabels,
    labelPersonalTransaction: state.labelPersonalTransaction
  }))

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { recipients } = useMemo(() => {
    let allTransactions = personalAccounts.flatMap((account) => account.transactions)

    // Filter transactions by label if selected
    const labelFilter = columnFilters.find((f) => f.id === 'labelId')?.value as string
    if (labelFilter) {
      if (labelFilter === 'unlabeled') {
        allTransactions = allTransactions.filter((t) => !t.labelId)
      } else {
        allTransactions = allTransactions.filter((t) => t.labelId === labelFilter)
      }
    }

    const recipientAmounts = new Map<
      string,
      { incoming: number; outgoing: number; transactionCount: number }
    >()

    allTransactions.forEach((transaction) => {
      const existing = recipientAmounts.get(transaction.description) || {
        incoming: 0,
        outgoing: 0,
        transactionCount: 0
      }

      if (transaction.type === 'in') {
        existing.incoming += transaction.amount
      }
      if (transaction.type === 'out') {
        existing.outgoing += transaction.amount
      }
      existing.transactionCount++

      recipientAmounts.set(transaction.description, existing)
    })

    return {
      recipients: Array.from(recipientAmounts.entries())
        .map(([recipient, amounts]) => ({
          recipient,
          incoming: amounts.incoming,
          outgoing: amounts.outgoing,
          transactionCount: amounts.transactionCount
        }))
        .sort((a, b) => b.outgoing - a.outgoing)
    }
  }, [personalAccounts, columnFilters])

  const handleLabelChange = (recipient: string, labelId: string) => {
    // Find all transactions for this recipient
    const transactions = personalAccounts
      .flatMap((account) => account.transactions)
      .filter((t) => t.description === recipient)
      .map((t) => t.id)

    // Update labels for all transactions
    transactions.forEach((transactionId) => {
      labelPersonalTransaction(transactionId, labelId, personalAccounts[0].id)
    })
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Recipients', path: '/personal/recipients' }
      ]}
    >
      <Typography element="h3">Recipients</Typography>
      <div className="mt-8">
        <div className="mb-4">
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
        </div>
        <Table
          data={recipients}
          columns={recipientsTableConfig(handleLabelChange, personalLabels, personalAccounts)}
        />
      </div>
    </MainLayout>
  )
}
