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
import { ProjectField } from '@shared/data.types'
import { InfoIcon, Trash2Icon, MoonIcon, SunIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { Table } from '@renderer/components/atoms/table/table.component'
import {
  projectFieldsTableConfig,
  projectFieldsFormConfig,
  projectFieldsSchema
} from './settings.page.config'
import { useTheme } from '@renderer/providers/theme.provider'

export const SettingsPage: React.FC = () => {
  const {
    upsertProjectAdditionalField,
    removeProjectAdditionalField,
    user: { app }
  } = useDataStore((state) => state)
  const { isDarkMode, toggleDarkMode } = useTheme()

  const form = useForm({
    resolver: zodResolver(projectFieldsSchema),
    defaultValues: {
      fieldName: '',
      fieldIndex: ''
    }
  })

  const onSubmit = (data) => {
    const field: ProjectField = {
      id: uuidv4(),
      index: data.fieldIndex,
      value: data.fieldName
    }
    upsertProjectAdditionalField(field)
    form.reset()
  }

  const handleRemoveField = (fieldId: string) => {
    removeProjectAdditionalField(fieldId)
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Data', path: '/data' },
        { name: 'Settings', path: '/data/settings' }
      ]}
    >
      <div className="flex flex-col gap-4">
        <div className="gap-2 flex flex-col border">
          <div className="border-b bg-background flex flex-row justify-between items-center py-1 px-2">
            <p className="text-sm uppercase font-medium">Appearance</p>
          </div>
          <div className="px-2.5 py-1 gap-2 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
                <span>Dark Mode</span>
              </div>
              <Button variant="outline" size="sm" onClick={toggleDarkMode} className="w-20">
                {isDarkMode ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form className="grid grid-cols-1 grid-rows-2" onSubmit={form.handleSubmit(onSubmit)}>
            {projectFieldsFormConfig.map((group) => (
              <div className="gap-2 flex flex-col" key={group.title}>
                <div className="gap-2 flex flex-col border">
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
                        name={formField.name as keyof z.infer<typeof projectFieldsSchema>}
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
                  <div className="flex flex-1">
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      className="rounded-none w-full"
                      variant="default"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Table
              data={app.config.project.additionalFields}
              columns={projectFieldsTableConfig([
                {
                  name: 'Delete',
                  icon: <Trash2Icon className="size-3.5 mr-[-4px] text-destructive" />,
                  onClick: (row) => handleRemoveField(row.id)
                }
              ])}
            />
          </form>
        </Form>
      </div>
    </MainLayout>
  )
}
