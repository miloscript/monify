import { TableAction } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { Client } from '@shared/data.types'
import { createColumnHelper } from '@tanstack/react-table'

export const allClientsTableConfig = (actions: TableAction<Client>[]) => {
  const columnHelper = createColumnHelper<Client>()

  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor((row) => row.taxId, {
      id: 'taxId',
      header: () => 'Tax ID',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('address.street', {
      header: () => 'Address',
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
