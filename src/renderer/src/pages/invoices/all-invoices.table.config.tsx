import { TableAction } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { Invoice } from '@shared/data.types'
import { createColumnHelper } from '@tanstack/react-table'

export const allInvoicesTableConfig = (actions: TableAction<Invoice>[]) => {
  const columnHelper = createColumnHelper<Invoice>()

  const columns = [
    columnHelper.accessor('number', {
      header: () => 'Number',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('performancePeriod', {
      header: () => 'Performance period',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('date', {
      header: () => 'Date',
      cell: (info) => info.renderValue()
    }),
    columnHelper.accessor('to.name', {
      header: () => 'To',
      cell: (info) => info.renderValue()
    })
  ]

  if (actions.length > 0) {
    columns.push(
      columnHelper.accessor('id', {
        header: () => 'Actions',
        cell: (cell) => (
          <div className="flex flex-row justify-end items-center gap-x-1">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="icon"
                variant="link"
                onClick={() => action.onClick(cell.row.original)}
              >
                {action.icon}
              </Button>
            ))}
          </div>
        )
      })
    )
  }

  return columns
}
