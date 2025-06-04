import { Typography } from '@renderer/components/elements/typography/typography.component'
import { cn } from '@renderer/lib/utils'

interface SummaryCardProps {
  title: string
  value: number
  className?: string
  isPositive?: boolean
}

export const SummaryCard = ({ title, value, className, isPositive }: SummaryCardProps) => {
  const formattedValue = new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        isPositive !== undefined && (isPositive ? 'border-green-500' : 'border-red-500'),
        className
      )}
    >
      <Typography element="h3" className="text-sm font-medium text-muted-foreground">
        {title}
      </Typography>
      <Typography
        element="p"
        className={cn(
          'mt-2 text-2xl font-bold',
          isPositive !== undefined && (isPositive ? 'text-green-500' : 'text-red-500')
        )}
      >
        {formattedValue}
      </Typography>
    </div>
  )
}
