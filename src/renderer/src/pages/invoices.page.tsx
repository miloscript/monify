import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'

export const InvoicesPage: React.FC = () => {
  const state = useDataStore((state) => state)
  return (
    <MainLayout>
      <Typography element="h3">Invoice config</Typography>
      {state.company.name && <Typography element="h3">{state.company.name}</Typography>}
    </MainLayout>
  )
}
