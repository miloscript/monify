import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { Edit, PlusIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allClientsTableConfig } from './all-clients.table.config'

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    removeClient,
    user: { clients }
  } = useDataStore((state) => state)

  const handleRemoveClient = (clientId: string) => {
    removeClient(clientId)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Clients', path: '/data/clients' }
      ]}
      actions={[
        {
          name: 'Add New',
          icon: <PlusIcon className="size-4 mr-2" />,
          onClick: () => navigate('/data/clients/add')
        }
      ]}
    >
      <Table
        data={clients}
        columns={allClientsTableConfig([
          {
            name: 'Edit',
            icon: <Edit className="size-3.5" />,
            onClick: (row) => {
              navigate(`/data/clients/${row.id}/edit`)
            }
          },
          {
            name: 'Delete',
            icon: <Trash2 className="size-3.5 mr-[-4px] text-destructive" />,
            onClick: (row) => handleRemoveClient(row.id)
          }
        ])}
      />
    </MainLayout>
  )
}
