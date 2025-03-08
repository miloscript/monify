import { zodResolver } from '@hookform/resolvers/zod'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { useNavigate, useParams } from 'react-router-dom'
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
import { SaveIcon } from 'lucide-react'
import { addClientSchema } from './add-client.form.schema'
import { addClientFields } from './add-client.form.config'
import { z } from 'zod'
import { getClientById } from '@renderer/store/data.selectors'

export const AddClientPage: React.FC = () => {
  const navigate = useNavigate()
  const { upsertClient } = useDataStore()

  const { id: clientId } = useParams()
  const client = getClientById(useDataStore(), clientId)
  const isEdit = !!client

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      companyName: client?.name || '',
      taxId: client?.taxId || '',
      street: client?.address.street || '',
      number: client?.address.number || '',
      city: client?.address.city || '',
      zip: client?.address.zip || '',
      country: client?.address.country || '',
      hourlyRate: client?.hourlyRate[0].rate || 0
    }
  })

  const onSubmit = (data) => {
    const client: DataState['user']['clients'][0] = {
      id: isEdit ? clientId : uuidv4(),
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
    upsertClient(client)
    navigate('/data/clients')
  }

  return (
    <MainLayout
      className="px-4 py-3"
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Clients', path: '/data/clients' },
        { name: 'Add client', path: '/data/clients/add' }
      ]}
      actions={[
        {
          name: 'Cancel',
          variant: 'secondary',
          onClick: () => navigate('/data/clients')
        },
        {
          name: 'Save',
          icon: <SaveIcon className="size-4 mr-2" />,
          onClick: form.handleSubmit(onSubmit)
        }
      ]}
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {addClientFields.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              name={formField.name as keyof z.infer<typeof addClientSchema>}
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
