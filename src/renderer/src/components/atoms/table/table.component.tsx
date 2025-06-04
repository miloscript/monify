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
  OnChangeFn,
  useReactTable
} from '@tanstack/react-table'
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
}

export function Table<TData, TValue>({
  columns,
  data,
  globalFilter,
  onGlobalFilterChange,
  columnFilters,
  onColumnFiltersChange
}: TableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters
    },
    onGlobalFilterChange,
    onColumnFiltersChange
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
