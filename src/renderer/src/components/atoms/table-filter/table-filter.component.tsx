import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { cn } from '@renderer/lib/utils'
import { SearchIcon } from 'lucide-react'
import * as React from 'react'

interface TableFilterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

export const TableFilter = React.forwardRef<HTMLInputElement, TableFilterProps>(
  ({ className, placeholder = 'Filter...', ...props }, ref) => {
    return (
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <FormInput
          ref={ref}
          className={cn('pl-8', className)}
          placeholder={placeholder}
          {...props}
        />
      </div>
    )
  }
)
TableFilter.displayName = 'TableFilter'
