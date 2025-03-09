import { Client } from '@shared/data.types'
import * as z from 'zod'
import { MappedFormItem } from '@renderer/components/atoms/mapped-form/mapped-form.component.core'
import { maxChars, minChars } from '@renderer/systems/validation/validation.core'

export const addInvoiceFields: (clients: Client[], clientId: string) => MappedFormItem[] = (
  clients,
  clientId
) => {
  const mapped: MappedFormItem[] = [
    {
      name: 'invoiceDate',
      label: 'Invoice Date',
      placeholder: 'Enter invoice date',
      required: true,
      type: 'input'
    },

    {
      name: 'invoiceNumber',
      label: 'Invoice Number',
      placeholder: 'Enter invoice number',
      required: true,
      type: 'input'
    },
    {
      name: 'performancePeriod',
      label: 'Performance Period',
      placeholder: 'Enter performance period',
      required: true,
      type: 'input'
    },
    {
      name: 'companyName',
      label: 'Company Name',
      searchPlaceholder: 'Search',
      selectPlaceholder: 'Select company name',
      required: true,
      type: 'combobox',
      items: clients.map((client) => ({ value: client.id, label: client.name }))
    }
  ]

  if (clientId) {
    const projects = clients.find((client) => client.id === clientId)?.projects || []
    for (const project of projects) {
      mapped.push({
        name: `hours-${project.id}`,
        label: project.name,
        placeholder: 'Enter hours',
        type: 'input',
        required: false
      })
    }
  }

  return mapped
}

export const addInvoiceSchema = (clients: Client[], clientId: string) => {
  const schema = {
    companyName: z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60)),
    invoiceDate: z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60)),
    invoiceNumber: z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60)),
    performancePeriod: z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60))
  }

  if (clientId) {
    const projects = clients.find((client) => client.id === clientId)?.projects || []
    for (const project of projects) {
      schema[`hours-${project.id}`] = z
        .string()
        .transform((value) => value.trim())
        .pipe(minChars(1))
        .pipe(maxChars(60))
        .optional()
    }
  }
  return z.object(schema)
}
