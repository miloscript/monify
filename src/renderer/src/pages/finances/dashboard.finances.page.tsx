import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'

export const FinancesDashboardPage: React.FC = () => {
  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Finance Data', path: '/finances/dashboard' }
      ]}
    >
      <Typography element="h3" className="mb-4">
        Finance Dashboard
      </Typography>
      <div className="flex flex-col gap-y-2">123</div>
    </MainLayout>
  )
}
