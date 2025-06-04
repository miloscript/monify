import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const recipientsTableConfig = () => {
  const columnHelper = createColumnHelper<{
    recipient: string
    outgoingCount: number
    incomingCount: number
    totalCount: number
    label?: string
  }>()

  const columns = [
    columnHelper.accessor('recipient', {
      header: () => 'Recipient',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('label', {
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
      cell: () => null
    })
  ] as Array<
    ColumnDef<
      {
        recipient: string
        outgoingCount: number
        incomingCount: number
        totalCount: number
        label?: string
      },
      unknown
    >
  >
  return columns
}

export const FinancesRecipientsPage: React.FC = () => {
  const { user } = useDataStore((state) => ({
    user: state.user
  }))

  // Get all unique recipients with their transaction counts
  const recipients = Array.from(
    new Set(
      user.bankAccounts.flatMap((account) =>
        account.transactions.map((t) => t.beneficiaryOrderingParty)
      )
    )
  )
    .filter(Boolean)
    .map((recipient) => {
      const transactions = user.bankAccounts.flatMap((account) =>
        account.transactions.filter((t) => t.beneficiaryOrderingParty === recipient)
      )
      const outgoingCount = transactions.filter((t) => t.debitAmount > 0).length
      const incomingCount = transactions.filter((t) => t.creditAmount > 0).length

      // Find the label for this recipient
      const label = user.app.config.transaction.labels.find(
        (label) => label.recipient === recipient
      )?.name

      return {
        recipient,
        outgoingCount,
        incomingCount,
        totalCount: outgoingCount + incomingCount,
        label
      }
    })
    .sort((a, b) => b.totalCount - a.totalCount) // Sort by total transaction count descending

  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Recipients', path: '/finances/recipients' }
      ]}
    >
      <Table data={recipients} columns={recipientsTableConfig()} />
    </MainLayout>
  )
}
