import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { TransactionLabel } from '@shared/data.types'
import { useMemo, useState } from 'react'

type RecipientData = {
  recipient: string
  label?: string
  outgoingCount: number
  incomingCount: number
  totalCount: number
}

const recipientsTableConfig = [
  {
    accessorKey: 'recipient',
    header: 'Recipient'
  },
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row }) => row.original.label || '-'
  },
  {
    accessorKey: 'outgoingCount',
    header: 'Outgoing',
    cell: ({ row }) => row.original.outgoingCount
  },
  {
    accessorKey: 'incomingCount',
    header: 'Incoming',
    cell: ({ row }) => row.original.incomingCount
  },
  {
    accessorKey: 'totalCount',
    header: 'Total',
    cell: ({ row }) => row.original.totalCount
  },
  {
    accessorKey: 'recipient',
    id: 'actions',
    header: 'Actions',
    cell: () => null
  }
]

export const FinancesRecipientsPage = (): JSX.Element => {
  const { user } = useDataStore()
  const [globalFilter, setGlobalFilter] = useState('')

  const recipientsData = useMemo(() => {
    const recipients = new Map<string, RecipientData>()

    // Get all transactions from all bank accounts
    const allTransactions = user.bankAccounts.flatMap((account) => account.transactions)

    // Process each transaction
    allTransactions.forEach((transaction) => {
      const recipient = transaction.beneficiaryOrderingParty
      if (!recipient) return

      const existing = recipients.get(recipient)
      if (existing) {
        if (transaction.debitAmount) {
          existing.outgoingCount++
        }
        if (transaction.creditAmount) {
          existing.incomingCount++
        }
        existing.totalCount++
      } else {
        recipients.set(recipient, {
          recipient,
          outgoingCount: transaction.debitAmount ? 1 : 0,
          incomingCount: transaction.creditAmount ? 1 : 0,
          totalCount: 1
        })
      }
    })

    // Add labels to recipients
    recipients.forEach((data) => {
      const label = user.app.config.transaction.labels.find(
        (label: TransactionLabel) => label.recipient === data.recipient
      )
      if (label) {
        data.label = label.name
      }
    })

    return Array.from(recipients.values()).sort((a, b) => b.totalCount - a.totalCount)
  }, [user.bankAccounts, user.app.config.transaction.labels])

  return (
    <MainLayout
      crumbs={[
        {
          name: 'Finances',
          path: '/finances'
        },
        {
          name: 'Recipients',
          path: '/finances/recipients'
        }
      ]}
    >
      <div className="p-4">
        <Typography element="h3" className="mb-4">
          Recipients
        </Typography>
        <Table
          columns={recipientsTableConfig}
          data={recipientsData}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      </div>
    </MainLayout>
  )
}
