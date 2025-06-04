import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { MappedForm } from '@renderer/components/atoms/mapped-form/mapped-form.component'
import { MappedFormItem } from '@renderer/components/atoms/mapped-form/mapped-form.component.core'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const labelSchema = z.object({
  name: z.string().min(1, 'Label name is required')
})

type LabelFormData = z.infer<typeof labelSchema>

const addLabelFormConfig = (): MappedFormItem[] => [
  {
    name: 'name',
    label: 'Label Name',
    type: 'input',
    placeholder: 'Enter label name',
    required: true
  }
]

export const AddLabelFinancesPage = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, addLabel, updateLabel } = useDataStore((state) => ({
    user: state.user,
    addLabel: state.addLabel,
    updateLabel: state.updateLabel
  }))

  const existingLabel = id ? user.app.config.transaction.labels.find((l) => l.id === id) : undefined

  const handleSubmit = (data: LabelFormData) => {
    if (id && existingLabel) {
      updateLabel(id, {
        ...existingLabel,
        name: data.name
      })
    } else {
      addLabel({
        id: uuidv4(),
        name: data.name
      })
    }
    navigate('/finances/labels')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Labels', path: '/finances/labels' },
        { name: existingLabel ? 'Edit Label' : 'Add Label', path: '/finances/labels/add' }
      ]}
    >
      <div className="p-4">
        <Typography element="h3" className="mb-4">
          {existingLabel ? 'Edit Label' : 'Add Label'}
        </Typography>
        <MappedForm
          handleFormSubmit={handleSubmit}
          initialValues={existingLabel ? { name: existingLabel.name } : undefined}
          formMap={addLabelFormConfig()}
          validationSchema={labelSchema}
        />
      </div>
    </MainLayout>
  )
}
