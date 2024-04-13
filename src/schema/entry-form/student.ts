import * as z from 'zod'
import { sexList } from '@/constants/sex'

const sexListValues = sexList.map(sex => sex.value)

export const studentEntrySchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required'
    })
    .min(2, {
      message: 'First name must be at least 2 characters'
    }),
  lastName: z
    .string({
      required_error: 'Last name is required'
    })
    .min(2, {
      message: 'Last name must be at least 2 characters'
    }),
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({
      message: 'Invalid email address'
    })
    .optional(),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required'
    })
    .refine(
      ph => {
        return ph.length === 10
      },
      {
        message: 'Phone number must be 10 digits'
      }
    ),
  aadharNumber: z
    .string({
      required_error: 'Aadhar number is required'
    })
    .refine(
      res => {
        const formattedAadhar = res.replaceAll(' ', '')
        return formattedAadhar.length === 12 && Number(formattedAadhar)
      },
      {
        message: 'Aadhar number must be 12 digits'
      }
    ),
  address: z.string().optional(),
  dob: z.string({
    required_error: 'Date of birth is required'
  }),
  sex: z.enum(sexListValues as [string, ...string[]], {
    required_error: 'Sex is required'
  }),
  primaryLanguage: z.string({
    required_error: 'Primary language is required'
  }),
  membershipStatus: z.string({
    required_error: 'Membership status is required'
  }),
  parentalInfo: z
    .array(
      z.object({
        relation: z
          .string({
            required_error: 'Relation is required'
          })
          .min(2, {
            message: 'Relation must be at least 2 characters'
          }),
        firstName: z
          .string({
            required_error: 'First name is required'
          })
          .min(2, {
            message: 'First name must be at least 2 characters'
          }),
        lastName: z
          .string({
            required_error: 'Last name is required'
          })
          .min(2, {
            message: 'Last name must be at least 2 characters'
          }),
        phoneNumber: z
          .string({
            required_error: 'Phone number is required'
          })
          .refine(
            ph => {
              return ph.replaceAll(' ', '').length === 10
            },
            {
              message: 'Phone number must be 10 digits'
            }
          ),
        email: z.string().optional()
      })
    )
    .min(2, {
      message: 'Parental information of atleast 2 is required'
    })
})
