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
import { Edit, FileIcon, PlusIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AllInvoices: React.FC = () => {
  const navigate = useNavigate()
  const { invoices, removeInvoice } = useDataStore((state) => state)

  const handleRemoveClient = (invoiceId: string) => {
    removeInvoice(invoiceId)
  }

  return (
    <MainLayout
      className="p-0"
      actions={[
        {
          name: 'Add New',
          icon: <PlusIcon className="size-4 mr-2" />,
          onClick: () => navigate('/invoices/add')
        }
      ]}
      crumbs={[
        { name: 'Invoices', path: '/' },
        { name: 'All Invoices', path: '/invoices' }
      ]}
    >
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Number</TableHead>
            <TableHead>Performance period</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.number}</TableCell>
              <TableCell>{invoice.performancePeriod}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.to.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    navigate(`/invoices/${invoice.id}/view`)
                  }}
                  variant="ghost"
                >
                  <FileIcon />
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/invoices/${invoice.id}/edit`)
                  }}
                  variant="ghost"
                >
                  <Edit />
                </Button>
                <Button onClick={() => handleRemoveClient(invoice.id)} variant="ghost">
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
