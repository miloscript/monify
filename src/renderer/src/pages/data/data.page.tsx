import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import { Link } from 'react-router-dom'

export const DataPage: React.FC = () => {
  return (
    <MainLayout>
      <Typography element="h3" className="mb-4">
        Data
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Link to="/data/companies">
          <Typography element="p">Companies</Typography>
        </Link>
        <Link to="/data/clients">
          <Typography element="p">Clients</Typography>
        </Link>
        <Link to="/data/projects">
          <Typography element="p">Projects</Typography>
        </Link>
        <Link to="/data/user">
          <Typography element="p">User</Typography>
        </Link>
      </div>
    </MainLayout>
  )
}
