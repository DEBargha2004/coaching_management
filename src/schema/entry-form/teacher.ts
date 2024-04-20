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
  qualifications: z
    .array(
      z.object({
        courseName: z
          .string({ required_error: 'Course name is required' })
          .min(2, {
            message: 'Course name is required'
          }),
        courseType: z
          .string({ required_error: 'Course type is required' })
          .min(2, {
            message: 'Course type is required'
          }),
        major: z.string().optional(),
        collegeName: z
          .string({ required_error: 'College name is required' })
          .min(2, {
            message: 'College name is required'
          }),
        startDate: z
          .string({ required_error: 'Start date is required' })
          .refine(
            date => {
              return !_.isEmpty(date)
            },
            {
              message: 'Start date is required'
            }
          ),
        endDate: z.string({ required_error: 'End date is required' }).refine(
          date => {
            return !_.isEmpty(date)
          },
          {
            message: 'End date is required'
          }
        )
      })
    )
    .min(1, {
      message: 'At least one qualification is required'
    }),
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

export type TeacherEntrySchemaType = z.infer<typeof teacherEntrySchema>
