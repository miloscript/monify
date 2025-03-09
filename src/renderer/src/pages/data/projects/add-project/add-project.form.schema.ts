import { maxChars, minChars } from '@renderer/systems/validation/validation.core'
import { ProjectField } from '@shared/data.types'
import * as z from 'zod'

export const addProjectFormSchema = (additionalFields: ProjectField[]) => {
  const schema = {
    projectName: z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60)),
    hourlyRate: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          return parseFloat(val)
        }
        return val
      },
      z.number().positive({ message: 'Hourly rate must be greater than 0' })
    )
  }
  additionalFields.forEach((field) => {
    schema[field.index] = z
      .string()
      .transform((value) => value.trim())
      .pipe(minChars(1))
      .pipe(maxChars(60))
  })
  return z.object(schema)
}
