import * as z from 'zod'

export const minChars = (min: number) => {
  return z.string().min(min, 'Required')
}

export const maxChars = (max: number) => {
  return z.string().max(max, `Max ${max} characters`)
}
