import { Button } from '@renderer/components/elements/button/button.component'
import { MainLayout } from '@renderer/components/main.layout.component'

import { ComboBox, ComboBoxItem } from '@renderer/components/atoms/combo-box/combo-box.component'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { getInvoiceById } from '@renderer/store/data.selectors'
import useDataStore from '@renderer/store/data.store'
import { Client, Invoice, InvoiceProject } from '@shared/data.types'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'

interface MappedField {
  formFieldType:
    | 'text'
    | 'number'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'combobox'
    | 'radio'
  name: string
  label: string
  placeholder: string
  items?: ComboBoxItem[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mappedFields: (clients: Client[], companyId?: any) => MappedField[] = (
  clients,
  companyId
) => {
  const mapped: MappedField[] = [
    {
      name: 'invoiceDate',
      label: 'Invoice Date',
      placeholder: 'Enter invoice date',
      formFieldType: 'text'
    },

    {
      name: 'invoiceNumber',
      label: 'Invoice Number',
      placeholder: 'Enter invoice number',
      formFieldType: 'text'
    },
    {
      name: 'performancePeriod',
      label: 'Performance Period',
      placeholder: 'Enter performance period',
      formFieldType: 'text'
    },
    {
      name: 'companyName',
      label: 'Company Name',
      placeholder: 'Enter company name',
      formFieldType: 'combobox',
      items: clients.map((client) => ({ value: client.id, label: client.name }))
    }
  ]

  if (companyId) {
    const projects = clients.find((client) => client.id === companyId)?.projects || []
    for (const project of projects) {
      mapped.push({
        name: `hours-${project.id}`,
        label: project.name,
        placeholder: 'Enter hours',
        formFieldType: 'text'
      })
    }
  }

  return mapped
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderMappedField = (mappedField: MappedField, field: any) => {
  switch (mappedField.formFieldType) {
    case 'text':
      return <FormInput {...field} name={mappedField.name} placeholder={mappedField.placeholder} />
    case 'combobox':
      if (!mappedField.items) return
      return (
        <ComboBox
          value={field.value}
          onValueChange={field.onChange}
          searchPlaceholder={mappedField.placeholder}
          selectPlaceholder={mappedField.placeholder}
          noResultsText="No clients found."
          items={mappedField.items}
        />
      )
    default:
      return null
  }
}

const generateFormSchema = () => {
  const schema = {
    companyName: z
      .string()
      .transform((value) => value.trim())
      .pipe(z.string().min(4, 'Required')),
    invoiceDate: z.string().min(1, 'Required'),
    invoiceNumber: z
      .string()
      .min(1, 'Required')
      .transform((value) => value.trim()),
    performancePeriod: z
      .string()
      .min(1, 'Required')
      .transform((value) => value.trim())
  }
  return z.object(schema)
}

const generateDefaultValues = (invoice: Invoice | undefined) => {
  const defaultValues = {
    companyName: invoice?.to.id,
    invoiceDate: invoice?.date,
    invoiceNumber: invoice?.number,
    performancePeriod: invoice?.performancePeriod
  }

  if (invoice) {
    for (const item of invoice.items) {
      defaultValues[`hours-${item.id}`] = item.hours
    }
  }

  return defaultValues
}

export const EditInvoicePage: React.FC = () => {
  const { company, clients, editInvoice } = useDataStore((state) => state)
  const { id } = useParams()
  const navigate = useNavigate()

  const invoice = useDataStore((state) => getInvoiceById(state, id as string))

  const form = useForm({
    shouldFocusError: false,
    defaultValues: generateDefaultValues(invoice)
  })

  form.watch('companyName')

  const onSubmit = (data) => {
    try {
      generateFormSchema().parse(data)
      const items = Object.keys(data).filter((key) => key.startsWith('hours-'))

      const invoiceProjects: InvoiceProject[] = []

      for (const item of items) {
        const value = data[item] ? data[item] : 0
        const projectId = item.replace('hours-', '')

        const client = clients.find((client) => client.id === data.companyName)
        const project = client?.projects?.find((project) => project.id === projectId)

        invoiceProjects.push({
          ...(project as InvoiceProject), // Type assertion to ensure 'id' is always a string
          hours: value
        })
      }

      const from = company
      const to = clients.find((client) => client.id === data.companyName)

      if (!to) return

      const edited: Invoice = {
        id: invoice?.id || '',
        createdAt: new Date().toISOString(),
        date: data.invoiceDate,
        number: data.invoiceNumber,
        performancePeriod: data.performancePeriod,
        from,
        to,
        items: invoiceProjects
      }
      editInvoice(edited)
      navigate('/invoices')
    } catch (error) {
      const zodError = error as z.ZodError
      zodError.errors.forEach((error) => {
        console.log(error)
        form.setError(
          error.path[0] as
            | 'companyName'
            | 'invoiceDate'
            | 'invoiceNumber'
            | 'performancePeriod'
            | `root.${string}`
            | 'root',
          {
            type: 'manual',
            message: 'Required'
          }
        )
      })
    }
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Invoices', path: '/' },
        { name: 'All invoices', path: '/invoices' },
        { name: 'Edit invoice', path: '/invoices/edit' }
      ]}
    >
      <Button form="add-client" variant="default">
        Submit
      </Button>

      <Form {...form}>
        <form id="add-client" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {mappedFields(clients, form.getValues().companyName).map((mappedField) => (
            <FormField
              key={mappedField.name}
              control={form.control}
              // as the type of formFields.name
              name={mappedField.name as 'companyName'}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row justify-between items-center mb-3 ">
                    <FormLabel>{mappedField.label}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>{renderMappedField(mappedField, field)}</FormControl>
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </MainLayout>
  )
}
