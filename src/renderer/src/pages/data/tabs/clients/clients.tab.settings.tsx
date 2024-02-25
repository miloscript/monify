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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@renderer/components/elements/tabs/tabs.component'
import useDataStore from '@renderer/store/data.store'
import { Edit, Trash2 } from 'lucide-react'
import { AddClientForm } from './add-client.form'

export const ClientsTab: React.FC = () => {
  const { clients, removeClient } = useDataStore((state) => state)

  const handleRemoveClient = (clientId: string) => {
    removeClient(clientId)
  }

  return (
    <Tabs defaultValue="clients">
      <TabsList className="flex justify-between">
        <div>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </div>
        <TabsTrigger value="add-client">Add Client</TabsTrigger>
      </TabsList>
      <TabsContent value="clients">
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
                  <Button variant="ghost">
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

        {/* {clients.map((client) => (
          <div key={client.id}>
            <h2>{client.name}</h2>
            <p>{client.taxId}</p>
            <p>
              {client.address.street} {client.address.number}
            </p>
            <p>
              {client.address.zip} {client.address.city}
            </p>
            <p>{client.address.country}</p>
          </div>
        ))} */}
      </TabsContent>
      <TabsContent value="add-client">
        <AddClientForm />
      </TabsContent>
    </Tabs>
  )
}
