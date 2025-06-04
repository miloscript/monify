import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import useDataStore from '@renderer/store/data.store'
import { TransactionLabel } from '@shared/data.types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const labelsTableConfig = (onDelete: (id: string) => void, onEdit: (id: string) => void) => {
  const columnHelper = createColumnHelper<TransactionLabel>()

  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('id', {
      header: () => 'Actions',
      cell: (cell) => (
        <div className="flex flex-row justify-end items-center gap-x-1">
          <Button size="icon" variant="link" onClick={() => onEdit(cell.row.original.id)}>
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="link" onClick={() => onDelete(cell.row.original.id)}>
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </div>
      )
    })
  ] as Array<ColumnDef<TransactionLabel, unknown>>
  return columns
}

export const PersonalLabelsPage: React.FC = () => {
  const navigate = useNavigate()
  const { deletePersonalLabel, personalLabels } = useDataStore((state) => ({
    deletePersonalLabel: state.deletePersonalLabel,
    personalLabels: state.personalLabels
  }))

  const handleAddLabel = () => {
    navigate('/personal/labels/add')
  }

  const handleEditLabel = (id: string) => {
    navigate(`/personal/labels/${id}/edit`)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Labels', path: '/personal/labels' }
      ]}
      actions={[
        {
          name: 'Add Label',
          onClick: handleAddLabel,
          icon: <PlusIcon className="w-4 h-4" />
        }
      ]}
    >
      <Table
        data={personalLabels}
        columns={labelsTableConfig(deletePersonalLabel, handleEditLabel)}
      />
    </MainLayout>
  )
}
