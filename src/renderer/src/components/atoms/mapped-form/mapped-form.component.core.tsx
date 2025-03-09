import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { ControllerRenderProps } from 'react-hook-form'
import { z } from 'zod'

// TODO: add each prop of the component and get rid of the placehodler/name/label props
export type MappedFormItem = {
  name: string
  label: string
  required: boolean
  placeholder: string
  disabled?: boolean
  type: 'input'
}

export const genericSchema = <T extends z.ZodTypeAny>(schema: T) => schema

export const determineFormField = (
  mappedField: MappedFormItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>
) => {
  if (mappedField.type === 'input') {
    return <FormInput {...field} placeholder={mappedField.placeholder} />
  }
  return null
}
