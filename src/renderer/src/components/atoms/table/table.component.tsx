import {
  TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import { cn } from '@renderer/lib/utils'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

export type TableAction<T> = {
  name: string
  icon: React.ReactNode
  onClick: (row: T) => void
}

type TableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
}

export function Table<TData, TValue>({ columns, data }: TableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
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
          <>
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          </>
        ))}
      </TableBody>
    </TableRoot>
  )
}
