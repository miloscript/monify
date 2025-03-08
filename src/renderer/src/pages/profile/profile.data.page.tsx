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
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { getCurrentUserId } from '@renderer/store/data.selectors'
import useDataStore from '@renderer/store/data.store'
import { InfoIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { profileFormSchema } from './profile.form.schema'
import { profileFormConfig } from './profile.form.config'
import z from 'zod'

export const ProfilePage: React.FC = () => {
  const { user, setProfileInfo } = useDataStore((state) => state)
  const { userId } = useDataStore((state) => getCurrentUserId(state))

  const { watch, ...form } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: user.company.name,
      taxId: user.company.taxId,
      street: user.company.address.street,
      number: user.company.address.number,
      city: user.company.address.city,
      zip: user.company.address.zip,
      country: user.company.address.country,
      personName: user.company.contact?.name,
      phone: user.company.contact?.phone,
      email: user.company.contact?.email,
      userName: user.name,
      userEmail: user.email
    }
  })

  const onSubmit = (data) => {
    let id = userId
    if (!id) {
      id = uuidv4()
    }
    setProfileInfo(
      {
        ...user,
        id,
        name: data.userName,
        email: data.userEmail
      },
      {
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
    )
  }

  useEffect(() => {
    const subscription = watch(() => {
      form.trigger()
      return form.handleSubmit(onSubmit)()
    })
    return () => subscription.unsubscribe()
  }, [form.handleSubmit, watch])

  return (
    <MainLayout crumbs={[{ name: 'Profile information', path: '/profile' }]}>
      <Form {...form} watch={watch}>
        <form className="grid grid-cols-2 grid-rows-1 gap-4 mt-2">
          {profileFormConfig.map((group) => (
            <div className="gap-2 flex flex-col" key={group.title}>
              <div className="gap-2 flex flex-col border rounded">
                <div className="border-b bg-background flex flex-row justify-between items-center py-1 px-2">
                  <p className="text-sm uppercase font-medium">{group.title}</p>
                  <button>
                    <InfoIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-2.5 py-1 gap-2 flex flex-col mb-2">
                  {group.fields.map((formField) => (
                    <FormField
                      key={formField.name}
                      control={form.control}
                      name={formField.name as keyof z.infer<typeof profileFormSchema>}
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
              </div>
            </div>
          ))}
        </form>
      </Form>
    </MainLayout>
  )
}
