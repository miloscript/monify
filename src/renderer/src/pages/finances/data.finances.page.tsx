import { openDialog } from '@renderer/api/main.api'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'

export const FinancesDataPage: React.FC = () => {
  const handleOpenDialog = () => {
    openDialog()
  }
  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Finance Data', path: '/finances/data' }
      ]}
    >
      <Typography element="h3" className="mb-4">
        Finance Data
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Button onClick={handleOpenDialog}>Dialog</Button>
      </div>
    </MainLayout>
  )
}
