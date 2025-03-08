import { minChars, maxChars } from '@renderer/systems/validation/validation.core'
import * as z from 'zod'

export const profileFormSchema = z.object({
  companyName: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  taxId: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  street: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  number: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  city: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  zip: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  country: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  personName: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  phone: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  email: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  userName: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100)),
  userEmail: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100))
})
