import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { ControllerRenderProps } from 'react-hook-form'
import { z } from 'zod'
import { ComboBox, ComboBoxItem } from '../combo-box/combo-box.component'

export type BaseFormItem = {
  name: string
  label: string
  required: boolean
  disabled?: boolean
}

export type InputFormItem = BaseFormItem & {
  type: 'input'
  placeholder: string
}

export type ComboboxFormItem = BaseFormItem & {
  type: 'combobox'
  searchPlaceholder: string
  selectPlaceholder: string
  items: ComboBoxItem[]
}

export type MappedFormItem = InputFormItem | ComboboxFormItem

export const genericSchema = <T extends z.ZodTypeAny>(schema: T) => schema

export const determineFormField = (
  mappedField: MappedFormItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, string>
) => {
  if (mappedField.type === 'input') {
    return <FormInput {...field} placeholder={mappedField.placeholder} />
  }
  if (mappedField.type === 'combobox') {
    return (
      <ComboBox
        {...field}
        onValueChange={field.onChange}
        searchPlaceholder={mappedField.searchPlaceholder}
        selectPlaceholder={mappedField.selectPlaceholder}
        noResultsText=""
        items={mappedField.items}
      />
    )
  }
  return null
}
