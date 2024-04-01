import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { studentEntrySchema } from '@/schema/entry-form/student'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { CustomTooltipEntryForm } from './custom-tooltip-teacher-entry'
import { Separator } from '../ui/separator'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { CalendarIcon, Loader2, PlusCircle, X, XCircleIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { months } from '@/constants/months'
import { ScrollArea } from '../ui/scroll-area'
import { sexList } from '@/constants/sex'
import { membership_statuses } from '@/constants/membership-status'

export default function StudentEntryForm ({
  form,
  onSubmit
}: {
  form: UseFormReturn<z.infer<typeof studentEntrySchema>>
  onSubmit: (data: z.infer<typeof studentEntrySchema>) => void
}) {
  const [dateObject, setDateObject] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const parentalRelations = useMemo(() => {
    const relations = [
      { label: 'Father', value: 'father' },
      { label: 'Mother', value: 'mother' },
      { label: 'Guardian', value: 'guardian' }
    ]
    return relations
  }, [form.watch('parentalInfo')])

  const parentInfoObj = useMemo(() => {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      relation: ''
    }
  }, [])

  useEffect(() => {
    const updatedDate = new Date(`${dateObject.month}/01/${dateObject.year}`)
    form.setValue('dob', format(updatedDate, 'yyyy-MM-dd'))
  }, [dateObject])
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full overflow-y-auto scroller h-[calc(100vh-200px)] space-y-4 p-1'
      >
        <section className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='First Name' {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Last Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Phone
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the phone number of the student</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Phone' type='number' {...field} />
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
                  Email
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the email of the student</p>
                      <Separator className='my-2' />
                      <i>Optional</i>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Email' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section>
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Address
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the address of the student</p>
                      <Separator className='my-2' />
                      <i>Optional</i>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section>
          <FormField
            control={form.control}
            name='dob'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Date Of Birth{' '}
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the date of birth of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className='w-full flex justify-between items-center bg-transparent border hover:bg-transparent'>
                        {field?.value
                          ? format(field?.value, 'PPP')
                          : 'Enter DOB'}
                        <CalendarIcon className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col justify-start items-center gap-1 p-8 w-fit'>
                      <div className='w-full grid grid-cols-2 gap-3 px-4 mb-5'>
                        <Select
                          onValueChange={e =>
                            setDateObject({
                              ...dateObject,
                              month: parseInt(e)
                            })
                          }
                          value={dateObject.month.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue
                              className='w-full'
                              placeholder='Month'
                            />
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
                            setDateObject({
                              ...dateObject,
                              year: parseInt(e)
                            })
                          }
                          value={dateObject.year.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue
                              className='w-full'
                              placeholder='Year'
                            />
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
                        selected={new Date(field?.value)}
                        onSelect={date =>
                          field.onChange(
                            format(date || field?.value, 'yyyy-MM-dd')
                          )
                        }
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        month={
                          new Date(field?.value).getTime()
                            ? new Date(field?.value)
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
        </section>
        <section className='space-y-2'>
          <h1>Parental Info</h1>
          {form.watch('parentalInfo')?.map((parent, parent_idx) => (
            <div
              className='space-y-2 p-4 border rounded-lg parental relative'
              key={parent_idx}
            >
              <span
                className='bg-destructive rounded-full absolute right-2 top-2 cursor-pointer'
                onClick={() => {
                  const parentInfos = form.getValues(`parentalInfo`)
                  parentInfos.splice(parent_idx, 1)
                  !parentInfos.length && parentInfos.push(parentInfoObj)
                  form.setValue(`parentalInfo`, parentInfos)
                }}
              >
                <X className='h-4 w-4 p-[2px] cancel cursor-pointer' />
              </span>

              <div className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name={`parentalInfo.${parent_idx}.relation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center'>
                        Relation
                        <CustomTooltipEntryForm>
                          <div>
                            <p>This is the relation of the parent</p>
                            <Separator className='my-2' />
                            <i>Required</i>
                          </div>
                        </CustomTooltipEntryForm>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={e => field.onChange(e)}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Relation' />
                          </SelectTrigger>
                          <SelectContent>
                            {parentalRelations.map((relation, relation_idx) => (
                              <SelectItem
                                key={relation_idx}
                                value={relation.value}
                                disabled={form
                                  .watch('parentalInfo')
                                  ?.map(p => p.relation)
                                  ?.includes(relation.value)}
                              >
                                {relation.label}
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
                  name={`parentalInfo.${parent_idx}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center'>
                        First Name
                        <CustomTooltipEntryForm>
                          <div>
                            <p>This is the first name of the parent</p>
                            <Separator className='my-2' />
                            <i>Required</i>
                          </div>
                        </CustomTooltipEntryForm>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='First Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parentalInfo.${parent_idx}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center'>
                        Last Name
                        <CustomTooltipEntryForm>
                          <div>
                            <p>This is the last name of the parent</p>
                            <Separator className='my-2' />
                            <i>Required</i>
                          </div>
                        </CustomTooltipEntryForm>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Last Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name={`parentalInfo.${parent_idx}.phoneNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center'>
                        Phone
                        <CustomTooltipEntryForm>
                          <div>
                            <p>This is the phone number of the parent</p>
                            <Separator className='my-2' />
                            <p>Required</p>
                          </div>
                        </CustomTooltipEntryForm>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Phone' type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parentalInfo.${parent_idx}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex justify-start items-center'>
                        Email
                        <CustomTooltipEntryForm>
                          <div>
                            <p>This is the email of the parent</p>
                            <Separator className='my-2' />
                            <i>Optional</i>
                          </div>
                        </CustomTooltipEntryForm>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='Email' type='email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() =>
              form.setValue('parentalInfo', [
                ...form.getValues('parentalInfo'),
                parentInfoObj
              ])
            }
            type='button'
            disabled={form.watch('parentalInfo')?.length >= 3}
          >
            <PlusCircle className='w-4 h-4 mr-2' /> Add Parent
          </Button>
        </section>
        <section className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Sex
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the sex of the student</p>
                      <Separator className='my-2' />
                      <i>Required</i>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Gender' />
                    </SelectTrigger>
                    <SelectContent>
                      {sexList.map((sex, sex_idx) => (
                        <SelectItem key={sex.value} value={sex.value}>
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
                  <CustomTooltipEntryForm>
                    <div>
                      <p>
                        This is the mother tongue of the student or the first
                        language spoken by the student. It could also be the one
                        in which the student is fluent.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Language' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='membershipStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Membership
                  <CustomTooltipEntryForm>
                    <div>
                      <p>
                        This is the membership status of the student. It is to
                        define whether the student is currently a member or not.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue className='' placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      {membership_statuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
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
