import { Button } from '@renderer/components/elements/button/button.component'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from '@renderer/components/elements/table/table.component'
import { cn } from '@renderer/lib/utils'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { TableFilter } from '../table-filter/table-filter.component'

export type TableAction<T> = {
  name: string
  icon: React.ReactNode
  onClick: (row: T) => void
}

type TableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
}

export function Table<TData, TValue>({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  columnFilters,
  onColumnFiltersChange,
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange
}: TableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])
  const sorting = controlledSorting ?? internalSorting
  const onSortingChange = controlledOnSortingChange ?? setInternalSorting

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      columnFilters,
      sorting
    },
    onGlobalFilterChange,
    onColumnFiltersChange,
    onSortingChange
  })

  return (
    <div className="space-y-4">
      {onGlobalFilterChange && (
        <div className="flex items-center py-4">
          <TableFilter
            value={globalFilter ?? ''}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <TableRoot>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(index === headerGroup.headers.length - 1 && 'text-end')}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn('flex items-center gap-2', 'cursor-pointer select-none')}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <Button variant="ghost" size="icon" className="h-4 w-4">
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUp className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </div>
  )
}
