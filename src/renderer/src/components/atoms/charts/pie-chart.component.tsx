import { cn } from '@renderer/lib/utils'
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface PieChartProps {
  data: {
    name: string
    value: number
  }[]
  colors?: string[]
  className?: string
}

const defaultColors = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF6B6B'
]

export const PieChart = ({ data, colors = defaultColors, className }: PieChartProps) => {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              new Intl.NumberFormat('sr-RS', {
                style: 'currency',
                currency: 'RSD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value),
              'Amount'
            ]}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
