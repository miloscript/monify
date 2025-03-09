import { Button } from '@renderer/components/elements/button/button.component'
import { maxChars, minChars } from '@renderer/systems/validation/validation.core'
import { ProjectField } from '@shared/data.types'
import * as z from 'zod'
import { TableAction } from '@renderer/components/atoms/table/table.component'
import { createColumnHelper } from '@tanstack/react-table'

export const projectFieldsTableConfig = (actions: TableAction<ProjectField>[]) => {
  const columnHelper = createColumnHelper<ProjectField>()

  const columns = [
    columnHelper.accessor('value', {
      header: () => 'Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('index', {
      header: () => 'Index',
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

export const projectFieldsFormConfig = [
  {
    title: 'Project additional fields',
    fields: [
      {
        name: 'fieldIndex',
        label: 'Field Index',
        placeholder: 'Enter field index'
      },
      {
        name: 'fieldName',
        label: 'Field Name',
        placeholder: 'Enter field name'
      }
    ]
  }
]

export const projectFieldsSchema = z.object({
  fieldIndex: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  fieldName: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60))
})
