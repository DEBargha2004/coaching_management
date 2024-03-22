import * as z from 'zod'
import * as _ from 'lodash'
import { sexList } from '@/constants/sex'

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const sexListValues = sexList.map(sex => sex.value)

export const teacherEntrySchema = z.object({
  firstName: z.string({
    required_error: 'First name is required'
  }),
  lastName: z.string({
    required_error: 'Last name is required'
  }),
  email: z
    .string()
    .refine(
      email => {
        return emailRegex.test(email)
      },
      {
        message: 'Invalid email address',
        path: ['email']
      }
    )
    .optional(),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required'
    })
    .refine(phone => {
      return phone.length === 10
    }),
  address: z.string().optional(),
  sex: z.enum(sexListValues as [string, ...string[]], {
    required_error: 'Sex is required'
  }),
  primaryLanguage: z.string({
    required_error: 'Primary language is required'
  }),
  salary: z.number({ required_error: 'Salary is required' }),
  dob: z.string({ required_error: 'Date of birth is required' }),
  membershipStatus: z.string({
    required_error: 'Membership status is required'
  })
})
