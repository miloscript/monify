import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/atoms/form/form.component'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { determineFormField, genericSchema, MappedFormItem } from './mapped-form.component.core'
import { z } from 'zod'

type MappedFormProps = {
  initialValues?: z.infer<ReturnType<typeof genericSchema>>
  formMap: MappedFormItem[]
  validationSchema: ReturnType<typeof genericSchema>
  handleFormSubmit: (values: z.infer<ReturnType<typeof genericSchema>>) => void
}

export const MappedForm = forwardRef<HTMLFormElement, MappedFormProps>(
  ({ initialValues, formMap, validationSchema, handleFormSubmit }, ref) => {
    const form = useForm<z.infer<ReturnType<typeof genericSchema>>>({
      resolver: zodResolver(validationSchema),
      defaultValues: initialValues
    })
    const handleSubmit = () => {
      form.handleSubmit((values) => {
        handleFormSubmit(values)
      })()
    }
    return (
      <Form {...form}>
        <form
          ref={ref}
          className="space-y-4 active:border-none"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {formMap.map((mappedField) => (
            <FormField
              key={mappedField.name}
              control={form.control}
              name={mappedField.name}
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex flex-row justify-between items-center mb-3 ">
                      <FormLabel>{mappedField.label}</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>{determineFormField(mappedField, field)}</FormControl>
                  </FormItem>
                )
              }}
            />
          ))}
        </form>
      </Form>
    )
  }
)

MappedForm.displayName = 'MappedForm'
