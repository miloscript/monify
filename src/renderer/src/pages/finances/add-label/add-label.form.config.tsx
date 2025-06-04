import { MappedFormItem } from '@renderer/components/atoms/mapped-form/mapped-form.component.core'

export const addLabelFormConfig = (recipients: string[]): MappedFormItem[] => [
  {
    name: 'name',
    label: 'Label Name',
    placeholder: 'Enter label name',
    required: true,
    type: 'input'
  },
  {
    name: 'recipient',
    label: 'Recipient',
    searchPlaceholder: 'Search recipients...',
    selectPlaceholder: 'Select recipient...',
    required: true,
    type: 'combobox',
    items: recipients.map((recipient) => ({
      value: recipient,
      label: recipient
    }))
  }
]
