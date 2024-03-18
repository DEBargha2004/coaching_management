'use client'

import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { sexList } from '@/constants/sex'
import { months } from '@/constants/months'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { CustomTooltipTeacherEntry } from './custom-tooltip-teacher-entry'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

export default function TeacherEntryForm ({
  form,
  onSubmit
}: {
  form: UseFormReturn<z.infer<typeof teacherEntrySchema>, any, undefined>
  onSubmit: (data: z.infer<typeof teacherEntrySchema>) => void
}) {
  const [dateObject, setDateObject] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  useEffect(() => {
    const updatedDate = new Date(`${dateObject.month}/01/${dateObject.year}`)
    form.setValue('dob', updatedDate)
  }, [dateObject])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  First Name
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>This is the first name of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Sujit' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Last Name
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>This is the last name of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Das' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Phone
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>This is the phone number of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='9612105704'
                    {...field}
                    type='number'
                    onChange={e => {
                      if (e.target.value.length <= 10) {
                        field.onChange(e.target.value)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Email{' '}
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>This is the email of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Optional</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input placeholder='bura@gmail.com' {...field} type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex justify-start items-center'>
                Address{' '}
                <CustomTooltipTeacherEntry>
                  <div>
                    <p>
                      This is the address of the place where the teacher lives.
                    </p>
                    <Separator className='my-2' />
                    <p>Optional</p>
                  </div>
                </CustomTooltipTeacherEntry>
              </FormLabel>
              <FormControl>
                <Input placeholder='Mohanpur East' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex justify-start items-center'>
                Date Of Birth{' '}
                <CustomTooltipTeacherEntry>
                  <div>
                    <p>This is the date of birth of the teacher.</p>
                    <Separator className='my-2' />
                    <p>Required</p>
                  </div>
                </CustomTooltipTeacherEntry>
              </FormLabel>
              <FormControl>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='w-full flex justify-between items-center bg-transparent border hover:bg-transparent'>
                      {field?.value ? format(field?.value, 'PPP') : 'Enter DOB'}
                      <CalendarIcon className='h-4 w-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col justify-start items-center gap-1 p-8 w-fit'>
                    <div className='w-full grid grid-cols-2 gap-3 px-4 mb-5'>
                      <Select
                        onValueChange={e =>
                          setDateObject({ ...dateObject, month: parseInt(e) })
                        }
                        value={dateObject.month.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue className='w-full' placeholder='Month' />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, month_idx) => (
                            <SelectItem
                              key={month_idx}
                              value={month.value.toString()}
                            >
                              {month.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={e =>
                          setDateObject({ ...dateObject, year: parseInt(e) })
                        }
                        value={dateObject.year.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue className='w-full' placeholder='Year' />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: new Date().getFullYear() - 1900 + 1 },
                            (_, i) => 1900 + i
                          ).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode='single'
                      selected={field?.value}
                      onSelect={field.onChange}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      month={
                        new Date(field?.value).getTime()
                          ? field?.value
                          : new Date()
                      }
                      onMonthChange={date => {
                        setDateObject({
                          month: date.getMonth() + 1,
                          year: date.getFullYear()
                        })
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Sex{' '}
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>Gender of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Select value={field?.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Male' />
                    </SelectTrigger>
                    <SelectContent>
                      {sexList.map(sex => (
                        <SelectItem key={sex.name} value={sex.value}>
                          {sex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='primaryLanguage'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Language
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>
                        This is the mother tongue of the teacher or the first
                        language spoken by the teacher. It could also be the one
                        in which the teacher is fluent.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Bengali' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='salary'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Salary (₹)
                  <CustomTooltipTeacherEntry>
                    <div>
                      <p>
                        This is the salary that is or will be paid to the
                        teacher.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipTeacherEntry>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='8000'
                    {...field}
                    type='number'
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full'>
          {form.formState.isSubmitting ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  )
}
