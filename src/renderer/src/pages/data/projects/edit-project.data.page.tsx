import { zodResolver } from '@hookform/resolvers/zod'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@renderer/components/elements/breadcrumbs/breadcrumbs.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { useNavigate } from 'react-router-dom'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { DataState } from '@shared/data.types'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

const formFields = [
  {
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name'
  },
  {
    name: 'taxId',
    label: 'Tax ID',
    placeholder: 'Enter tax ID'
  },
  {
    name: 'street',
    label: 'Street',
    placeholder: 'Enter street'
  },
  {
    name: 'number',
    label: 'Number',
    placeholder: 'Enter number'
  },
  {
    name: 'city',
    label: 'City',
    placeholder: 'Enter city'
  },
  {
    name: 'zip',
    label: 'Zip',
    placeholder: 'Enter zip'
  },
  {
    name: 'country',
    label: 'Country',
    placeholder: 'Enter country'
  },
  {
    name: 'hourlyRate',
    type: 'number',
    label: 'Hourly rate',
    placeholder: 'Enter hourly rate'
  }
]

const formSchema = z.object({
  companyName: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(4, '123')),
  taxId: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(4, '123')),
  street: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  number: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  city: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  zip: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  country: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  hourlyRate: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string'
  })
})

export const EditProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const { addClient } = useDataStore((state) => state)

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      taxId: '',
      street: '',
      number: '',
      city: '',
      zip: '',
      country: '',
      hourlyRate: 0
    }
  })

  const onSubmit = (data) => {
    const client: DataState['clients'][0] = {
      id: uuidv4(),
      name: data.companyName,
      taxId: data.taxId,
      address: {
        street: data.street,
        number: data.number,
        city: data.city,
        zip: data.zip,
        country: data.country
      },
      hourlyRate: [
        {
          rate: parseFloat(data.hourlyRate),
          dateActive: new Date()
        }
      ]
    }
    addClient(client)
    navigate('/data/clients')
  }

  return (
    <MainLayout>
      <Breadcrumb className="flex flex-row justify-between">
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => navigate('/data')}>Data</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem onClick={() => navigate('/data/clients')}>View Clients</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem variant="active">Add Client</BreadcrumbItem>
        </BreadcrumbList>
        <Button form="add-client" variant="default">
          Submit
        </Button>
      </Breadcrumb>

      <Form {...form}>
        <form id="add-client" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {formFields.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              // as the type of formFields.name
              name={
                formField.name as
                  | 'number'
                  | 'companyName'
                  | 'taxId'
                  | 'street'
                  | 'city'
                  | 'zip'
                  | 'country'
                  | 'hourlyRate'
              }
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row justify-between items-center mb-3 ">
                    <FormLabel>{formField.label}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <FormInput
                      {...field}
                      name={field.name}
                      type={formField.type}
                      placeholder={formField.placeholder}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </MainLayout>
  )
}
