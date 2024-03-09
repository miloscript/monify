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
import { getProjectById } from '@renderer/store/data.selectors'
import { Project } from '@shared/data.types'
import { useForm } from 'react-hook-form'
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

const generateInitialValues = (project?: Project) => {
  const initialValues = {
    projectName: project?.name,
    hourlyRate: project?.hourlyRate[0].rate
  }
  project?.additionalFields?.forEach((field) => {
    initialValues[field.name] = field.value
  })
  return initialValues
}

export const EditProjectPage: React.FC = () => {
  const navigate = useNavigate()
  const { clientId, id } = useParams()
  const { editProject } = useDataStore((state) => state)
  const state = useDataStore((state) => state)

  const additionalFields = state.app.config.project.additionalFields

  const project = getProjectById(state, clientId as string, id as string)

  const generateFormSchema = (additionalFields: string[]) => {
    const schema = {
      projectName: z
        .string()
        .transform((value) => value.trim().toString())
        .pipe(z.string().min(4, '123')),
      hourlyRate: z
        .string()
        .transform((value) => value.toString())
        .refine((val) => !Number.isNaN(parseInt(val, 10)), {
          message: 'Expected number, received a string'
        })
    }
    additionalFields.forEach((field) => {
      schema[field] = z
        .string()
        .transform((value) => value.trim())
        .pipe(z.string().min(4, '123'))
    })
    return z.object(schema)
  }

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(generateFormSchema(additionalFields)),
    defaultValues: {
      ...generateInitialValues(project)
    }
  })

  const onSubmit = (data) => {
    if (!clientId) return

    const newProject: Project = {
      id: id as string,
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
    editProject(clientId, newProject)
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
