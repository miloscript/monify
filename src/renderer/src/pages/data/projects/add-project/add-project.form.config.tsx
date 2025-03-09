import { MappedFormItem } from '@renderer/components/atoms/mapped-form/mapped-form.component.core'
import { ProjectField } from '@shared/data.types'

export const addProjectFormConfig = (additionalFields: ProjectField[]): MappedFormItem[] => {
  const formFields: MappedFormItem[] = [
    {
      name: 'projectName',
      label: 'Project Name',
      required: true,
      placeholder: 'Enter project name',
      type: 'input'
    },
    {
      name: 'hourlyRate',
      label: 'Hourly rate',
      required: true,
      placeholder: 'Enter hourly rate',
      type: 'input'
    }
  ]
  additionalFields.forEach((field) => {
    formFields.push({
      name: field.index,
      label: field.value,
      required: true,
      placeholder: `Enter ${field.value}`,
      type: 'input'
    })
  })
  return formFields
}
