import { TableAction } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { BankAccount } from '@shared/data.types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

export const allAccountsTableConfig = (actions: TableAction<BankAccount>[]) => {
  const columnHelper = createColumnHelper<BankAccount>()

  const columns = [
    columnHelper.accessor('bank', {
      header: () => 'Bank',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('number', {
      header: () => 'Number',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor((row) => row.type, {
      id: 'type',
      header: () => 'Type',
      cell: (info) => info.renderValue()
    }),
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
  ] as Array<ColumnDef<BankAccount, unknown>>
  return columns
}
