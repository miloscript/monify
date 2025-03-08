import { TableAction } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { Project } from '@shared/data.types'
import { createColumnHelper } from '@tanstack/react-table'

export const allProjectsTableConfig = (actions: TableAction<Project>[]) => {
  const columnHelper = createColumnHelper<Project>()

  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => info.getValue()
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
