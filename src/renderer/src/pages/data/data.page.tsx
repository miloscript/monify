import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import { Link } from 'react-router-dom'

export const DataPage: React.FC = () => {
  return (
    <MainLayout crumbs={[{ name: 'Data', path: '/data' }]}>
      <Typography element="h3" className="mb-4">
        Data
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Link to="/data/clients">
          <Typography element="p">Clients</Typography>
        </Link>
        <Link to="/data/projects">
          <Typography element="p">Projects</Typography>
        </Link>
        <Link to="/data/settings">
          <Typography element="p">Settings</Typography>
        </Link>
        <Link to="/data/export">
          <Typography element="p">Export</Typography>
        </Link>
      </div>
    </MainLayout>
  )
}
