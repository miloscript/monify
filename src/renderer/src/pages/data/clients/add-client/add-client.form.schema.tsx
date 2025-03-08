import { maxChars, minChars } from '@renderer/systems/validation/validation.core'
import z from 'zod'

export const addClientSchema = z.object({
  companyName: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  taxId: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  street: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  number: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  city: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  zip: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  country: z
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
})
