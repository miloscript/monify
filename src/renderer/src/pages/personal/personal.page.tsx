import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import { Link } from 'react-router-dom'

export const PersonalPage = () => (
  <MainLayout crumbs={[{ name: 'Personal', path: '/personal' }]}>
    <Typography element="h3" className="mb-4">
      Personal Overview
    </Typography>
    <div className="flex flex-col gap-y-2">
      <Link to="/personal/data">
        <Typography element="p">Data</Typography>
      </Link>
      <Link to="/personal/dashboard">
        <Typography element="p">Dashboard</Typography>
      </Link>
      <Link to="/personal/labels">
        <Typography element="p">Labels</Typography>
      </Link>
      <Link to="/personal/recipients">
        <Typography element="p">Recipients</Typography>
      </Link>
    </div>
  </MainLayout>
)
