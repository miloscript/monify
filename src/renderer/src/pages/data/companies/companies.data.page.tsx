/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@renderer/components/elements/breadcrumbs/breadcrumbs.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { DataState } from '@shared/data.types'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
    name: 'personName',
    label: 'Name',
    placeholder: 'Enter person name'
  },
  {
    name: 'phone',
    label: 'Phone',
    placeholder: 'Enter phone'
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email'
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
  personName: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  phone: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123')),
  email: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(1, '123'))
})

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate()
  const { company, setCompanyInfo } = useDataStore((state) => state)

  const { watch, ...form } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: company.name,
      taxId: company.taxId,
      street: company.address.street,
      number: company.address.number,
      city: company.address.city,
      zip: company.address.zip,
      country: company.address.country,
      personName: company.contact?.name,
      phone: company.contact?.phone,
      email: company.contact?.email
    }
  })

  const onSubmit = (data) => {
    const payload: Pick<DataState, 'company'> = {
      company: {
        name: data.companyName,
        taxId: data.taxId,
        address: {
          street: data.street,
          number: data.number,
          city: data.city,
          zip: data.zip,
          country: data.country
        },
        contact: {
          name: data.personName,
          phone: data.phone,
          email: data.email
        }
      }
    }
    setCompanyInfo(payload)
  }

  useEffect(() => {
    const subscription = watch(() => {
      form.trigger()
      return form.handleSubmit(onSubmit)()
    })
    return () => subscription.unsubscribe()
  }, [form.handleSubmit, watch])

  return (
    <MainLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => navigate('/data')}>Data</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem variant="active">Edit company</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form} watch={watch}>
        <form className="space-y-4">
          {formFields.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              // as the type of formFields.name
              name={
                formField.name as
                  | 'number'
                  | 'email'
                  | 'companyName'
                  | 'taxId'
                  | 'street'
                  | 'city'
                  | 'zip'
                  | 'country'
                  | 'personName'
                  | 'phone'
              }
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row justify-between items-center mb-3 ">
                    <FormLabel>{formField.label}</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <FormInput {...field} name={field.name} placeholder={formField.placeholder} />
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
