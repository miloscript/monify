/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { zodResolver } from '@hookform/resolvers/zod'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import useDataStore from '@renderer/store/data.store'
import { DataState } from '@shared/data.types'
import { InfoIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formConfig = [
  {
    title: 'Company Information',
    fields: [
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
  },
  {
    title: 'Company Address',
    fields: [
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
      }
    ]
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
    <MainLayout crumbs={[{ name: 'Edit profile', path: '/profile/edit' }]}>
      <Form {...form} watch={watch}>
        <form className="grid grid-cols-2 grid-rows-1 gap-4 mt-2">
          {formConfig.map((group) => (
            <div className="gap-2 flex flex-col" key={group.title}>
              <div className="gap-2 flex flex-col border rounded">
                <div className="border-b bg-background flex flex-row justify-between items-center py-1 px-2">
                  <p className="text-sm uppercase font-medium">{group.title}</p>
                  <button>
                    <InfoIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-2.5 py-1 gap-2 flex flex-col">
                  {group.fields.map((formField) => (
                    <FormField
                      key={formField.name}
                      control={form.control}
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
                        <FormItem className="gap-2">
                          <div className="flex flex-row justify-between items-center">
                            <FormLabel>{formField.label}</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <FormInput
                              {...field}
                              name={field.name}
                              placeholder={formField.placeholder}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="flex flex-row">
                  <Button variant="default" className="flex-1 rounded-none">
                    Save
                  </Button>
                  <div className="w-[1px] bg-white"></div>
                  <Button variant="default" className="flex-1 rounded-none">
                    Undo
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </form>
      </Form>
    </MainLayout>
  )
}
