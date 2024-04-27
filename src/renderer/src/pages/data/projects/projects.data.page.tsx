import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Button } from '@renderer/components/elements/button/button.component'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()

  const { clients, removeProject } = useDataStore((state) => state)

  const [clientId, setClientId] = useState<string>('')

  const projects = clients.find((client) => client.id === clientId)?.projects || []

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'View Projects', path: '/data/projects' }
      ]}
    >
      <Button
        disabled={!clientId}
        onClick={() => navigate(`/data/projects/${clientId}/add`)}
        variant="default"
        size="default"
      >
        <PlusIcon className="size-4" />
        Add Project
      </Button>
      <ComboBox
        onValueChange={setClientId}
        searchPlaceholder="Search clients..."
        selectPlaceholder="Select clients..."
        noResultsText="No clients found."
        items={clients.map((client) => ({ value: client.id, label: client.name }))}
      />

      {clientId && (
        <Table>
          <TableCaption>A list of your projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      navigate(`/data/projects/${clientId}/${project.id}/edit`)
                    }}
                    variant="ghost"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      removeProject(clientId, project.id)
                    }}
                    variant="ghost"
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </MainLayout>
  )
}
