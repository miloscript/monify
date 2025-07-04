import { Button } from '@renderer/components/elements/button/button.component'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem
} from '@renderer/components/elements/command/command.component'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@renderer/components/elements/popover/popover.component'
import { cn } from '@renderer/lib/utils'
import { CommandList } from 'cmdk'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import * as React from 'react'

export interface ComboBoxItem {
  value: string
  label: string
}

interface ComboBoxProps {
  value?: string
  onValueChange: (value: string) => void
  selectPlaceholder: string
  searchPlaceholder: string
  noResultsText: string
  items: ComboBoxItem[]
}

export const ComboBox = ({
  value: initialValue,
  selectPlaceholder,
  searchPlaceholder,
  noResultsText,
  onValueChange,
  items
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const [value, setValue] = React.useState(initialValue)

  // Filter items based on search value
  const filteredItems = React.useMemo(() => {
    if (!searchValue) return items
    return items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
  }, [items, searchValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? items.find((item) => item.value === value)?.label : selectPlaceholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>{noResultsText}</CommandEmpty>
          <CommandList className="max-h-[300px] overflow-y-auto">
            {filteredItems.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                  onValueChange(item.value)
                  setSearchValue('') // Clear search after selection
                }}
              >
                {item.label}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === item.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
