import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
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
import { Edit, PlusIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate()
  const { clients, removeClient } = useDataStore((state) => state)

  const handleRemoveClient = (clientId: string) => {
    removeClient(clientId)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Clients', path: '/data/clients' }
      ]}
    >
      <Button onClick={() => navigate('/data/clients/add')} variant="default" size="default">
        <PlusIcon className="size-4" />
        Add Client
      </Button>
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
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
                  <Edit />
                </Button>
                <Button onClick={() => handleRemoveClient(client.id)} variant="ghost">
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  )
}
