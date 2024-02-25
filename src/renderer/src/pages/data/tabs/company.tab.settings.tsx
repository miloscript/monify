/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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

export const CompanyTab: React.FC = () => {
  const { watch, ...form } = useForm({
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
      personName: '',
      phone: '',
      email: ''
    }
  })

  const onSubmit = (data) => window.electron.ipcRenderer.send('setData', data)

  useEffect(() => {
    const subscription = watch(() => {
      form.trigger()
      return form.handleSubmit(onSubmit)()
    })
    return () => subscription.unsubscribe()
  }, [form.handleSubmit, watch])

  return (
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
  )
}
