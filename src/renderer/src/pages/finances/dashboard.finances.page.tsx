import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { SummaryCard } from '@renderer/components/atoms/cards/summary-card.component'
import { PieChart } from '@renderer/components/atoms/charts/pie-chart.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

type TopTransaction = {
  recipient: string
  amount: number
  type: 'in' | 'out'
}

const topTransactionsTableConfig = () => {
  const columnHelper = createColumnHelper<TopTransaction>()

  return [
    columnHelper.accessor('recipient', {
      header: () => 'Recipient',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: (info) =>
        new Intl.NumberFormat('sr-RS', {
          style: 'currency',
          currency: 'RSD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(info.getValue())
    })
  ] as Array<ColumnDef<TopTransaction, unknown>>
}

export const FinancesDashboardPage = (): JSX.Element => {
  const { user } = useDataStore((state) => ({
    user: state.user
  }))

  const { totalIncoming, totalOutgoing, labelSpending, topSpenders, topEarners } = useMemo(() => {
    const allTransactions = user.bankAccounts.flatMap((account) => account.transactions)
    const labelSpendingMap = new Map<string, number>()
    const recipientAmounts = new Map<string, { incoming: number; outgoing: number }>()

    allTransactions.forEach((transaction) => {
      // Calculate totals
      if (transaction.creditAmount > 0) {
        const existing = recipientAmounts.get(transaction.beneficiaryOrderingParty) || {
          incoming: 0,
          outgoing: 0
        }
        existing.incoming += transaction.creditAmount
        recipientAmounts.set(transaction.beneficiaryOrderingParty, existing)
      }
      if (transaction.debitAmount > 0) {
        const existing = recipientAmounts.get(transaction.beneficiaryOrderingParty) || {
          incoming: 0,
          outgoing: 0
        }
        existing.outgoing += transaction.debitAmount
        recipientAmounts.set(transaction.beneficiaryOrderingParty, existing)

        // Calculate label spending
        if (transaction.labelId) {
          const label = user.app.config.transaction.labels.find((l) => l.id === transaction.labelId)
          if (label) {
            const currentAmount = labelSpendingMap.get(label.name) || 0
            labelSpendingMap.set(label.name, currentAmount + transaction.debitAmount)
          }
        }
      }
    })

    // Get top spenders and earners
    const topSpenders = Array.from(recipientAmounts.entries())
      .map(([recipient, amounts]) => ({
        recipient,
        amount: amounts.outgoing,
        type: 'out' as const
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    const topEarners = Array.from(recipientAmounts.entries())
      .map(([recipient, amounts]) => ({
        recipient,
        amount: amounts.incoming,
        type: 'in' as const
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Calculate unlabeled transactions
    const unlabeledAmount = allTransactions.reduce((sum, transaction) => {
      if (transaction.debitAmount > 0 && !transaction.labelId) {
        return sum + transaction.debitAmount
      }
      return sum
    }, 0)

    // Convert label spending to array for pie chart
    const labelSpendingData = [
      ...Array.from(labelSpendingMap.entries()).map(([name, value]) => ({
        name,
        value
      })),
      ...(unlabeledAmount > 0 ? [{ name: 'Unlabeled', value: unlabeledAmount }] : [])
    ]

    return {
      totalIncoming: allTransactions.reduce((sum, t) => sum + t.creditAmount, 0),
      totalOutgoing: allTransactions.reduce((sum, t) => sum + t.debitAmount, 0),
      labelSpending: labelSpendingData,
      topSpenders,
      topEarners
    }
  }, [user.bankAccounts, user.app.config.transaction.labels])

  return (
    <MainLayout
      crumbs={[
        {
          name: 'Finances',
          path: '/finances'
        },
        {
          name: 'Dashboard',
          path: '/finances/dashboard'
        }
      ]}
    >
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard title="Total Incoming" value={totalIncoming} isPositive={true} />
          <SummaryCard title="Total Outgoing" value={totalOutgoing} isPositive={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Typography element="h3">Spending by Label</Typography>
            <PieChart data={labelSpending} />
          </div>

          <div className="space-y-6">
            <div>
              <Typography element="h3" className="mb-4">
                Top 5 Spenders
              </Typography>
              <Table data={topSpenders} columns={topTransactionsTableConfig()} />
            </div>

            <div>
              <Typography element="h3" className="mb-4">
                Top 5 Earners
              </Typography>
              <Table data={topEarners} columns={topTransactionsTableConfig()} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
