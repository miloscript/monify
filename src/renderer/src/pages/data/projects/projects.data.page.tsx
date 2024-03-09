import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@renderer/components/elements/breadcrumbs/breadcrumbs.component'
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
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()

  const { clients } = useDataStore((state) => state)

  return (
    <MainLayout>
      <Breadcrumb className="flex flex-row justify-between">
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => navigate('/data')}>Data</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem variant="active">View Projects</BreadcrumbItem>
        </BreadcrumbList>
        <Button onClick={() => navigate('/data/projects/add')} variant="default" size="default">
          <PlusIcon className="size-4" />
          Add Project
        </Button>
      </Breadcrumb>
      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Tax ID</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.taxId}</TableCell>
              <TableCell>
                {client.address.street} {client.address.number}, {client.address.zip}{' '}
                {client.address.city}, {client.address.country}
              </TableCell>
              <TableCell>{client.hourlyRate[0].rate}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    navigate(`/data/clients/${client.id}/edit`)
                  }}
                  variant="ghost"
                >
                  <EditIcon />
                </Button>
                <Button onClick={() => {}} variant="ghost">
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  )
}
