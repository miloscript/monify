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
import { Project } from '@shared/data.types'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

const formFields = [
  {
    name: 'projectName',
    label: 'Project Name',
    placeholder: 'Enter project name'
  },
  {
    name: 'hourlyRate',
    type: 'number',
    label: 'Hourly rate',
    placeholder: 'Enter hourly rate'
  }
]

const formSchema = z.object({
  projectName: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(4, '123')),
  hourlyRate: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string'
  })
})

export const AddProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const { addProject } = useDataStore((state) => state)

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      hourlyRate: 0
    }
  })

  const onSubmit = (data) => {
    if (!clientId) return

    const project: Project = {
      id: uuidv4(),
      name: data.projectName,
      hourlyRate: [
        {
          rate: parseFloat(data.hourlyRate),
          dateActive: new Date()
        }
      ]
    }
    addProject(clientId, project)
    navigate('/data/projects')
  }

  return (
    <MainLayout>
      <Breadcrumb className="flex flex-row justify-between">
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => navigate('/data')}>Data</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem onClick={() => navigate('/data/projects')}>View Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem variant="active">Add Project</BreadcrumbItem>
        </BreadcrumbList>
        <Button form="add-project" variant="default">
          Submit
        </Button>
      </Breadcrumb>

      <Form {...form}>
        <form id="add-project" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {formFields.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              // as the type of formFields.name
              name={formField.name as 'projectName' | 'hourlyRate'}
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