import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { useNavigate, useParams } from 'react-router-dom'

import { Project } from '@shared/data.types'
import { v4 as uuidv4 } from 'uuid'
import { SaveIcon } from 'lucide-react'
import { MappedForm } from '@renderer/components/atoms/mapped-form/mapped-form.component'
import { useRef } from 'react'
import { addProjectFormConfig } from './add-project.form.config'
import { addProjectFormSchema } from './add-project.form.schema'
import { getProjectById } from '@renderer/store/data.selectors'

// TODO: the fields should be generated from the app config and not hardcoded
export const AddProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const { clientId, id: projectId } = useParams()
  const formRef = useRef<HTMLFormElement>(null)

  const project = getProjectById(useDataStore(), clientId, projectId)
  const isEdit = !!project

  const {
    upsertProject,
    user: { app }
  } = useDataStore()

  const projectFields = app.config.project.additionalFields

  const onSubmit = (data) => {
    if (!clientId) return
    const field = projectFields.find((field) => field.index === 'costCenter')
    if (!field) return
    const project: Project = {
      id: isEdit ? projectId : uuidv4(),
      clientId,
      name: data.projectName,
      hourlyRate: [
        {
          rate: parseFloat(data.hourlyRate),
          dateActive: new Date()
        }
      ],
      additionalFields: [
        {
          field,
          value: data.costCenter
        }
      ]
    }
    upsertProject(project)
    navigate('/data/projects')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'View Projects', path: '/data/projects' },
        { name: 'Add Project', path: '/data/projects/add' }
      ]}
      actions={[
        {
          name: 'Cancel',
          variant: 'secondary',
          onClick: () => navigate('/data/projects')
        },
        {
          name: 'Save',
          icon: <SaveIcon className="size-4 mr-2" />,
          onClick: () => {
            if (!formRef.current) return
            formRef.current.dispatchEvent(
              new Event('submit', {
                bubbles: true
              })
            )
          }
        }
      ]}
    >
      <MappedForm
        ref={formRef}
        handleFormSubmit={onSubmit}
        initialValues={{
          projectName: project?.name || '',
          hourlyRate: project?.hourlyRate[0].rate || 0,
          costCenter:
            project?.additionalFields?.find((field) => field.field.index === 'costCenter')?.value ||
            ''
        }}
        formMap={addProjectFormConfig(projectFields)}
        validationSchema={addProjectFormSchema(projectFields)}
      />
    </MainLayout>
  )
}
