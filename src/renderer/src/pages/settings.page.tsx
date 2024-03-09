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
import { Button } from '@renderer/components/elements/button/button.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { Trash2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

const formSchema = z.object({
  additionalFieldName: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(4, '123'))
})

const formFields = [
  {
    name: 'additionalFieldName',
    label: 'Field Name',
    type: 'text',
    placeholder: 'Enter field name'
  }
]

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { addAdditionalField, removeAdditionalField, app } = useDataStore((state) => state)

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalFieldName: ''
    }
  })

  const onSubmit = (data) => {
    addAdditionalField(data.additionalFieldName)
    form.reset()
  }

  return (
    <MainLayout>
      <Breadcrumb className="flex flex-row justify-between">
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => navigate('/data')}>Data</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem variant="active">Settings</BreadcrumbItem>
        </BreadcrumbList>
        <Button form="add-form-field" variant="default">
          Submit
        </Button>
      </Breadcrumb>

      <Form {...form}>
        <form id="add-form-field" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {formFields.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              // as the type of formFields.name
              name={formField.name as 'additionalFieldName'}
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
      <Table>
        <TableCaption>A list of your fields.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {app.config.project.additionalFields.map((field, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{field}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    removeAdditionalField(field)
                  }}
                  variant="ghost"
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  )
}
