import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { allAccountsTableConfig } from './accounts.table.config'

export const AccountsPage: React.FC = () => {
  const {
    user: { bankAccounts }
  } = useDataStore((state) => state)

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Accounts', path: '/data/accounts' }
      ]}
    >
      <Table data={bankAccounts} columns={allAccountsTableConfig([])} />
    </MainLayout>
  )
}
