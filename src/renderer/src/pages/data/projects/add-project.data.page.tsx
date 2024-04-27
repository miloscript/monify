import { zodResolver } from '@hookform/resolvers/zod'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Button } from '@renderer/components/elements/button/button.component'
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

const generateFormFields = (additionalFields: string[]) => {
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
  additionalFields.forEach((field) => {
    formFields.push({
      name: field,
      label: field,
      placeholder: `Enter ${field}`
    })
  })
  return formFields
}

export const AddProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const { addProject, app } = useDataStore((state) => state)

  const additionalFields = app.config.project.additionalFields

  const generateFormSchema = (additionalFields: string[]) => {
    const schema = {
      projectName: z
        .string()
        .transform((value) => value.trim())
        .pipe(z.string().min(3, '123')),
      hourlyRate: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: 'Expected number, received a string'
      })
    }
    additionalFields.forEach((field) => {
      schema[field] = z
        .string()
        .transform((value) => value.trim())
        .pipe(z.string().min(3, '123'))
    })
    return z.object(schema)
  }

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(generateFormSchema(additionalFields)),
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
      ],
      additionalFields: additionalFields.map((field) => ({
        name: field,
        value: data[field]
      }))
    }
    addProject(clientId, project)
    navigate('/data/projects')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'View Projects', path: '/data/projects' },
        { name: 'Add Project', path: '/data/projects/add' }
      ]}
    >
      <Button form="add-project" variant="default">
        Submit
      </Button>

      <Form {...form}>
        <form id="add-project" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {generateFormFields(additionalFields).map((formField) => (
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
