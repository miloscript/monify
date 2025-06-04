import { maxChars, minChars } from '@renderer/systems/validation/validation.core'
import * as z from 'zod'

export const addLabelSchema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(60)),
  recipient: z
    .string()
    .transform((value) => value.trim())
    .pipe(minChars(1))
    .pipe(maxChars(100))
})
