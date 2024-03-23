import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import { Link } from 'react-router-dom'

export const InvoicesPage: React.FC = () => {
  return (
    <MainLayout crumbs={[{ name: 'Invoices', path: '/' }]}>
      <Typography element="h3" className="mb-4">
        Invoices
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Link to="/invoices">
          <Typography element="p">All Invoices</Typography>
        </Link>
        <Link to="/expenses/stats">
          <Typography element="p">Stats</Typography>
        </Link>
      </div>
    </MainLayout>
  )
}
