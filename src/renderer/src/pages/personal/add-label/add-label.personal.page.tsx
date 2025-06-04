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

export const AddLabelPersonalPage = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personalLabels, addPersonalLabel, updatePersonalLabel } = useDataStore((state) => ({
    personalLabels: state.personalLabels,
    addPersonalLabel: state.addPersonalLabel,
    updatePersonalLabel: state.updatePersonalLabel
  }))

  const existingLabel = id ? personalLabels.find((l) => l.id === id) : undefined

  const handleSubmit = (data: LabelFormData) => {
    if (id && existingLabel) {
      updatePersonalLabel(id, {
        ...existingLabel,
        name: data.name
      })
    } else {
      addPersonalLabel({
        id: uuidv4(),
        name: data.name
      })
    }
    navigate('/personal/labels')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Personal', path: '/personal' },
        { name: 'Labels', path: '/personal/labels' },
        { name: existingLabel ? 'Edit Label' : 'Add Label', path: '/personal/labels/add' }
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
