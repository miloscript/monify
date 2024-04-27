import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

export const StatsPage: React.FC = () => {
  const { transactions } = useDataStore((state) => ({
    account: state.accounts[0],
    transactions: state.accounts[0].transactions
  }))

  // we want to generate chart data and split it by label like : {name: 'labelName', value: sum of all transactions with this label}
  const generateChartData = () => {
    const chartData: { name: string; value: number }[] = []
    const labels = transactions.map((transaction) => transaction.label.name)
    const uniqueLabels = [...new Set(labels)]
    uniqueLabels.forEach((label) => {
      const sum = transactions
        .filter((transaction) => transaction.label.name === label)
        .reduce((acc, transaction) => {
          if (transaction.type === 'out') {
            return acc + transaction.amount
          }
          return acc + transaction.amount
        }, 0)
      chartData.push({ name: label, value: sum })
    })

    return (
      chartData
        .filter((data) => data.name !== '')
        // map the value to a float number with 2 dec places
        .map((data) => ({ ...data, value: parseFloat(data.value.toFixed(2)) }))
    )
  }

  // 30 random colors for the pie chart
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AF19FF',
    '#FF1919',
    '#19FF90',
    '#FF19E7',
    '#FF19E7',
    '#19FF90',
    '#FF1919',
    '#AF19FF',
    '#FF8042'
  ]

  return (
    <MainLayout
      crumbs={[
        { name: 'Expenses', path: '/expenses' },
        { name: 'Stats', path: '/expenses/stats' }
      ]}
    >
      <PieChart width={500} height={500}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={generateChartData()}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={(data) => {
            return `${data.name} - ${data.value.toLocaleString()}`
          }}
        >
          {generateChartData().map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <pre>
        {`
        - selectable by month
        - table view with all transactions, sortable and paginated, with a total footer
      `}
      </pre>
    </MainLayout>
  )
}
