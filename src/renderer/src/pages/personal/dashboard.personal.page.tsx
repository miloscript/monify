import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { SummaryCard } from '@renderer/components/atoms/cards/summary-card.component'
import { PieChart } from '@renderer/components/atoms/charts/pie-chart.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { DatePicker } from '@renderer/components/atoms/date-picker/date-picker.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/elements/tooltip/tooltip.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { isWithinInterval, startOfDay } from 'date-fns'
import { useMemo, useState } from 'react'

// Types for dashboard tables
interface Transaction {
  id: string
  date: string
  recipient: string
  amount: number
  type: 'in' | 'out'
  labelId?: string
  labelName?: string
}

interface LabelExpense {
  label: string
  amount: number
}

const transactionsTableConfig = () => {
  const columnHelper = createColumnHelper<Transaction>()
  return [
    columnHelper.accessor('date', {
      header: () => 'Date',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('recipient', {
      header: () => 'Recipient',
      cell: (info) => {
        const description = info.getValue()
        const truncated =
          description.length > 50 ? `${description.substring(0, 50)}...` : description
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{truncated}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[300px] break-words">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
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
    }),
    columnHelper.accessor('labelName', {
      header: () => 'Label',
      cell: (info) => info.getValue() || '-'
    })
  ] as Array<ColumnDef<Transaction, unknown>>
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

export const PersonalDashboardPage = (): JSX.Element => {
  const { personalAccounts, personalLabels } = useDataStore((state) => ({
    personalAccounts: state.personalAccounts,
    personalLabels: state.personalLabels
  }))

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  })

  const [selectedLabel, setSelectedLabel] = useState<string>('')

  const { totalIncoming, totalOutgoing, labelSpending, topIncoming, topOutgoing, labelExpenses } =
    useMemo(() => {
      let allTransactions = personalAccounts.flatMap((account) => account.transactions)

      // Filter transactions by date range if set
      if (dateRange.from && dateRange.to) {
        const startDate = startOfDay(dateRange.from)
        const endDate = startOfDay(dateRange.to)
        allTransactions = allTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.valueDate)
          return isWithinInterval(transactionDate, { start: startDate, end: endDate })
        })
      }

      // Filter by label if selected
      if (selectedLabel) {
        if (selectedLabel === 'unlabeled') {
          allTransactions = allTransactions.filter((t) => !t.labelId)
        } else {
          allTransactions = allTransactions.filter((t) => t.labelId === selectedLabel)
        }
      }

      const labelSpendingMap = new Map<string, number>()

      // Process transactions
      const processedTransactions = allTransactions.map((transaction) => {
        // Calculate label spending
        if (transaction.type === 'out') {
          let labelName = 'Unlabeled'
          if (transaction.labelId) {
            const label = personalLabels.find((l) => l.id === transaction.labelId)
            if (label) {
              labelName = label.name
            }
          }
          const currentAmount = labelSpendingMap.get(labelName) || 0
          labelSpendingMap.set(labelName, currentAmount + transaction.amount)
        }

        return {
          id: transaction.id,
          date: transaction.valueDate,
          recipient: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          labelId: transaction.labelId,
          labelName: transaction.labelId
            ? personalLabels.find((l) => l.id === transaction.labelId)?.name
            : undefined
        }
      })

      // Get top transactions
      const topIncoming = processedTransactions
        .filter((t) => t.type === 'in')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      const topOutgoing = processedTransactions
        .filter((t) => t.type === 'out')
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)

      // Convert label spending to array for pie chart
      const labelSpendingData = Array.from(labelSpendingMap.entries()).map(([name, value]) => ({
        name,
        value
      }))

      // Calculate expenses by label for the table
      const labelExpenses = Array.from(labelSpendingMap.entries())
        .map(([label, amount]) => ({
          label,
          amount
        }))
        .sort((a, b) => b.amount - a.amount)

      return {
        totalIncoming: allTransactions
          .filter((t) => t.type === 'in')
          .reduce((sum, t) => sum + t.amount, 0),
        totalOutgoing: allTransactions
          .filter((t) => t.type === 'out')
          .reduce((sum, t) => sum + t.amount, 0),
        labelSpending: labelSpendingData,
        topIncoming,
        topOutgoing,
        labelExpenses
      }
    }, [personalAccounts, personalLabels, dateRange, selectedLabel])

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Dashboard', path: '/personal/dashboard' }
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
            Clear Dates
          </button>
          <ComboBox
            items={[
              { value: '', label: 'All Labels' },
              { value: 'unlabeled', label: 'Unlabeled' },
              ...personalLabels.map((l) => ({ value: l.id, label: l.name }))
            ]}
            value={selectedLabel}
            onValueChange={setSelectedLabel}
            selectPlaceholder="Filter by label..."
            searchPlaceholder="Search labels..."
            noResultsText="No labels found."
          />
          {selectedLabel && (
            <button
              className="px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 transition"
              onClick={() => setSelectedLabel('')}
              type="button"
            >
              Clear Label
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Top 5 Incoming Transactions
              </Typography>
              <Table data={topIncoming} columns={transactionsTableConfig()} />
            </div>

            <div>
              <Typography element="h3" className="mb-4">
                Top 5 Outgoing Transactions
              </Typography>
              <Table data={topOutgoing} columns={transactionsTableConfig()} />
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
