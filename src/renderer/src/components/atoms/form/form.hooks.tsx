import { useContext } from 'react'
import { FormFieldContext, FormItemContext } from './form.context'

import { FieldError, useFormContext } from 'react-hook-form'

interface FormField {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error?: FieldError
  invalid: boolean
  isDirty: boolean
  isTouched: boolean
}

const useFormField = (): FormField => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

export { useFormField }
