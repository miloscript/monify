import { zodResolver } from '@hookform/resolvers/zod'
import { openDirectoryDialog } from '@renderer/api/main.api'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { FormInput } from '@renderer/components/elements/form-input/form-input.component'
import { FormLabel } from '@renderer/components/elements/form-label/form-label.component'
import { useTheme } from '@renderer/providers/theme.provider'
import useDataStore from '@renderer/store/data.store'
import { ProjectField } from '@shared/data.types'
import { FolderIcon, InfoIcon, MoonIcon, SunIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'
import {
  projectFieldsFormConfig,
  projectFieldsSchema,
  projectFieldsTableConfig
} from './settings.page.config'

export const SettingsPage: React.FC = () => {
  const {
    upsertProjectAdditionalField,
    removeProjectAdditionalField,
    user: { app }
  } = useDataStore((state) => state)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [transactionPath, setTransactionPath] = useState(app.config.transaction?.storagePath || '')

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

  const handleSelectTransactionPath = async () => {
    const result = await openDirectoryDialog()
    if (result && result.filePaths && result.filePaths[0]) {
      setTransactionPath(result.filePaths[0])
      // Update the store with the new path
      useDataStore.setState((state) => ({
        user: {
          ...state.user,
          app: {
            ...state.user.app,
            config: {
              ...state.user.app.config,
              transaction: {
                ...state.user.app.config.transaction,
                storagePath: result.filePaths[0]
              }
            }
          }
        }
      }))
    }
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

        <div className="gap-2 flex flex-col border">
          <div className="border-b bg-background flex flex-row justify-between items-center py-1 px-2">
            <p className="text-sm uppercase font-medium">Transaction Storage</p>
            <button>
              <InfoIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="px-2.5 py-1 gap-2 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderIcon className="w-4 h-4" />
                <span>Storage Path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {transactionPath || 'No path selected'}
                </span>
                <Button variant="outline" size="sm" onClick={handleSelectTransactionPath}>
                  Select Path
                </Button>
              </div>
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
