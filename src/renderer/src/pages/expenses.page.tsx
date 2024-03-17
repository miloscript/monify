import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import { Link } from 'react-router-dom'

export const ExpensesPage: React.FC = () => {
  return (
    <MainLayout>
      <Typography element="h3" className="mb-4">
        Expenses
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Link to="/expenses/imports">
          <Typography element="p">Imports</Typography>
        </Link>
        <Link to="/expenses/stats">
          <Typography element="p">Stats</Typography>
        </Link>
      </div>
    </MainLayout>
  )
}
