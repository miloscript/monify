import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Table } from '@renderer/components/atoms/table/table.component'

import useDataStore from '@renderer/store/data.store'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allProjectsTableConfig } from './all-projects.table.config'

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()

  const {
    user: { clients },
    removeProject
  } = useDataStore((state) => state)

  const [clientId, setClientId] = useState<string>(clients.length > 0 ? clients[0].id : '')
  const projects = clients.find((client) => client.id === clientId)?.projects || []

  const handleRemoveProject = (projectId: string) => {
    removeProject(projectId)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'View Projects', path: '/data/projects' }
      ]}
      actions={[
        {
          type: 'component',
          name: 'Add New',
          component: (
            <ComboBox
              value={clientId}
              onValueChange={setClientId}
              searchPlaceholder="Search clients..."
              selectPlaceholder="Select clients..."
              noResultsText="No clients found."
              items={clients.map((client) => ({ value: client.id, label: client.name }))}
            />
          )
        },
        {
          name: 'Add New',
          icon: <PlusIcon className="size-4 mr-2" />,
          onClick: () => navigate(`/data/projects/${clientId}/add`)
        }
      ]}
    >
      <Table
        data={projects}
        columns={allProjectsTableConfig([
          {
            name: 'Edit',
            icon: <EditIcon className="size-3.5" />,
            onClick: (row) => {
              navigate(`/data/projects/${clientId}/${row.id}/edit`)
            }
          },
          {
            name: 'Delete',
            icon: <Trash2Icon className="size-3.5 mr-[-4px] text-destructive" />,
            onClick: (row) => handleRemoveProject(row.id)
          }
        ])}
      />
    </MainLayout>
  )
}
