import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { TransactionLabel } from '@shared/data.types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

// Recipient data type for personal
type RecipientData = {
  recipient: string
  labelId?: string
  labelName?: string
  outgoingCount: number
  incomingCount: number
  totalCount: number
}

const recipientsTableConfig = (
  onLabelChange: (recipient: string, labelId: string) => void,
  personalLabels: TransactionLabel[]
) => {
  const columnHelper = createColumnHelper<RecipientData>()

  return [
    columnHelper.accessor('recipient', {
      header: () => 'Recipient',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('labelName', {
      header: () => 'Label',
      cell: (info) => info.getValue() || '-'
    }),
    columnHelper.accessor('outgoingCount', {
      header: () => 'Outgoing',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('incomingCount', {
      header: () => 'Incoming',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('totalCount', {
      header: () => 'Total',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('recipient', {
      id: 'actions',
      header: () => 'Actions',
      cell: (info) => {
        const recipient = info.getValue()
        const row = info.row.original
        return (
          <div className="flex items-center gap-2">
            <ComboBox
              value={row.labelId || ''}
              onValueChange={(value) => onLabelChange(recipient, value)}
              selectPlaceholder="Select label..."
              searchPlaceholder="Search labels..."
              noResultsText="No labels found."
              items={[
                { value: '', label: 'No Label' },
                ...personalLabels.map((label) => ({
                  value: label.id,
                  label: label.name
                }))
              ]}
            />
          </div>
        )
      }
    })
  ] as Array<ColumnDef<RecipientData, unknown>>
}

export const PersonalRecipientsPage = (): JSX.Element => {
  const { personalAccounts, personalLabels, labelPersonalTransactions } = useDataStore((state) => ({
    personalAccounts: state.personalAccounts,
    personalLabels: state.personalLabels,
    labelPersonalTransactions: state.labelPersonalTransactions
  }))
  const [globalFilter, setGlobalFilter] = useState('')

  const recipientsData = useMemo(() => {
    const recipients = new Map<string, RecipientData>()
    const allTransactions = personalAccounts.flatMap((account) => account.transactions)

    allTransactions.forEach((transaction) => {
      const recipient = transaction.description
      if (!recipient) return
      const existing = recipients.get(recipient)
      if (existing) {
        if (transaction.type === 'out') {
          existing.outgoingCount++
        }
        if (transaction.type === 'in') {
          existing.incomingCount++
        }
        existing.totalCount++
      } else {
        recipients.set(recipient, {
          recipient,
          outgoingCount: transaction.type === 'out' ? 1 : 0,
          incomingCount: transaction.type === 'in' ? 1 : 0,
          totalCount: 1
        })
      }
    })

    // Add labels to recipients
    recipients.forEach((data) => {
      // Find the label by looking at the transactions for this recipient
      const transaction = allTransactions.find((t) => t.description === data.recipient)
      if (transaction?.labelId) {
        const label = personalLabels.find(
          (label: TransactionLabel) => label.id === transaction.labelId
        )
        if (label) {
          data.labelId = label.id
          data.labelName = label.name
        }
      }
    })

    return Array.from(recipients.values()).sort((a, b) => b.totalCount - a.totalCount)
  }, [personalAccounts, personalLabels])

  const handleLabelChange = (recipient: string, labelId: string) => {
    // Find all transactions for this recipient across all personal accounts
    personalAccounts.forEach((account) => {
      const transactionIds = account.transactions
        .filter((transaction) => transaction.description === recipient)
        .map((transaction) => transaction.id)
      if (transactionIds.length > 0) {
        labelPersonalTransactions(transactionIds, labelId, account.id)
      }
    })
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Recipients', path: '/personal/recipients' }
      ]}
    >
      <div className="p-4">
        <Typography element="h3" className="mb-4">
          Recipients
        </Typography>
        <Table
          columns={recipientsTableConfig(handleLabelChange, personalLabels)}
          data={recipientsData}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      </div>
    </MainLayout>
  )
}
