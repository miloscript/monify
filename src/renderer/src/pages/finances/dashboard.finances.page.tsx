import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { SummaryCard } from '@renderer/components/atoms/cards/summary-card.component'
import { PieChart } from '@renderer/components/atoms/charts/pie-chart.component'
import { DatePicker } from '@renderer/components/atoms/date-picker/date-picker.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { isWithinInterval, startOfDay } from 'date-fns'
import { useMemo, useState } from 'react'

type TopTransaction = {
  recipient: string
  amount: number
  type: 'in' | 'out'
}

type LabelExpense = {
  label: string
  amount: number
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

const labelExpensesTableConfig = () => {
  const columnHelper = createColumnHelper<LabelExpense>()

  return [
    columnHelper.accessor('label', {
      header: () => 'Label',
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
  ] as Array<ColumnDef<LabelExpense, unknown>>
}

export const FinancesDashboardPage = (): JSX.Element => {
  const { user } = useDataStore((state) => ({
    user: state.user
  }))

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  })

  const {
    totalIncoming,
    totalOutgoing,
    labelSpending,
    topSpenders,
    topEarners,
    labelExpenses,
    privateAccountExpenses
  } = useMemo(() => {
    let allTransactions = user.bankAccounts.flatMap((account) => account.transactions)

    // Filter transactions by date range if set
    if (dateRange.from && dateRange.to) {
      const startDate = startOfDay(dateRange.from)
      const endDate = startOfDay(dateRange.to)
      allTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.valueDate)
        return isWithinInterval(transactionDate, { start: startDate, end: endDate })
      })
    }

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

    // Calculate expenses by label for the table
    const labelExpenses = Array.from(labelSpendingMap.entries())
      .map(([label, amount]) => ({
        label,
        amount
      }))
      .sort((a, b) => b.amount - a.amount)

    // Calculate private account expenses
    const privateAccountLabel = user.app.config.transaction.labels.find(
      (label) => label.name.toLowerCase() === 'private account'
    )
    const privateAccountExpenses = privateAccountLabel
      ? labelSpendingMap.get(privateAccountLabel.name) || 0
      : 0

    return {
      totalIncoming: allTransactions.reduce((sum, t) => sum + t.creditAmount, 0),
      totalOutgoing: allTransactions.reduce((sum, t) => sum + t.debitAmount, 0),
      labelSpending: labelSpendingData,
      topSpenders,
      topEarners,
      labelExpenses,
      privateAccountExpenses
    }
  }, [user.bankAccounts, user.app.config.transaction.labels, dateRange])

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
        <div className="flex items-center gap-4">
          <DatePicker
            date={dateRange.from}
            onDateChange={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
          />
          <span>to</span>
          <DatePicker
            date={dateRange.to}
            onDateChange={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
          />
          <button
            className="ml-2 px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 transition"
            onClick={() => setDateRange({ from: undefined, to: undefined })}
            type="button"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Incoming" value={totalIncoming} isPositive={true} />
          <SummaryCard title="Total Outgoing" value={totalOutgoing} isPositive={false} />
          <SummaryCard
            title="Private Account Expenses"
            value={privateAccountExpenses}
            isPositive={false}
          />
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

        <div>
          <Typography element="h3" className="mb-4">
            Expenses by Label
          </Typography>
          <Table data={labelExpenses} columns={labelExpensesTableConfig()} />
        </div>
      </div>
    </MainLayout>
  )
}
