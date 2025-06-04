import { Typography } from '@renderer/components/elements/typography/typography.component'
import { cn } from '@renderer/lib/utils'
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  className?: string
}

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Sage
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B59B6', // Purple
  '#3498DB', // Light Blue
  '#E67E22', // Orange
  '#2ECC71' // Green
]

export function PieChart({ data, className }: PieChartProps): JSX.Element {
  return (
    <div className={cn('space-y-4', className)}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('sr-RS', {
                style: 'currency',
                currency: 'RSD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)
            }
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <Typography element="p" className="text-sm">
              {item.name}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
