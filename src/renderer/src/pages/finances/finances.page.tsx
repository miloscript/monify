import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import { Link } from 'react-router-dom'

export const FinancesPage: React.FC = () => {
  return (
    <MainLayout crumbs={[{ name: 'Finances', path: '/finances' }]}>
      <Typography element="h3" className="mb-4">
        Finances
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Link to="/finances/data">
          <Typography element="p">Data</Typography>
        </Link>
        <Link to="/finances/dashboard">
          <Typography element="p">Dashboard</Typography>
        </Link>
      </div>
    </MainLayout>
  )
}
