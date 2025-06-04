import { Button } from '@renderer/components/elements/button/button.component'
import { Calendar } from '@renderer/components/elements/calendar/calendar.component'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/elements/popover/popover.component'
import { cn } from '@renderer/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onDateChange} initialFocus />
        <div className="flex justify-end px-3 pb-2 pt-1">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:underline hover:text-primary transition"
            onClick={() => onDateChange?.(undefined)}
          >
            Clear
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
