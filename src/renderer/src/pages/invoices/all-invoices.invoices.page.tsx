import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'

import useDataStore from '@renderer/store/data.store'
import { Edit, FileIcon, PlusIcon, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allInvoicesTableConfig } from './all-invoices.table.config'

export const AllInvoices: React.FC = () => {
  const navigate = useNavigate()
  const {
    removeInvoice,
    user: { invoices }
  } = useDataStore()

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
      <Table
        data={invoices}
        columns={allInvoicesTableConfig([
          {
            name: 'View',
            icon: <FileIcon className="size-3.5" />,
            onClick: (row) => {
              navigate(`/invoices/${row.id}/view`)
            }
          },
          {
            name: 'Edit',
            icon: <Edit className="size-3.5" />,
            onClick: (row) => {
              navigate(`/invoices/${row.id}/edit`)
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
