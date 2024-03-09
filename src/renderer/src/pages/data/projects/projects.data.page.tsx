import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'

export const ProjectsPage: React.FC = () => {
  return (
    <MainLayout>
      <Typography element="h3" className="mb-4">
        Projects
      </Typography>
    </MainLayout>
  )
}
