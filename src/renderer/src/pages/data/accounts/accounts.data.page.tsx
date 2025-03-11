import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allAccountsTableConfig } from './accounts.table.config'

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    removeBankAccount,
    user: { bankAccounts }
  } = useDataStore((state) => state)

  const handleRemoveClient = (accountId: string) => {
    removeBankAccount(accountId)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Clients', path: '/data/clients' }
      ]}
    >
      <Table
        data={bankAccounts}
        columns={allAccountsTableConfig([
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
