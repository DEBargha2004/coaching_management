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
import { CalendarIcon, Check, Loader2, Plus, PlusCircle, X } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { sexList } from '@/constants/sex'
import { months } from '@/constants/months'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '../ui/dialog'
import { CustomTooltipEntryForm } from './custom-tooltip-teacher-entry'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { membership_statuses } from '@/constants/membership-status'
import CustomCalendar from './custom-calendar'
import { ArrayElementType } from '@/types/array-element-type'
import {
  courseTypes,
  postgraduate_courses,
  undergraduate_courses
} from '@/constants/courses'
import { produce } from 'immer'

export default function TeacherEntryForm ({
  form,
  onSubmit
}: {
  form: UseFormReturn<z.infer<typeof teacherEntrySchema>, any, undefined>
  onSubmit: (data: z.infer<typeof teacherEntrySchema>) => void
}) {
  const [courseNameOther, setCourseNameOther] = useState<string>('')

  const deleteCourseNameOther = () => {
    setCourseNameOther('')
  }

  const qualificationObj = useMemo<
    ArrayElementType<typeof teacherEntrySchema._input.qualifications>
  >(() => {
    return {
      courseType: '',
      courseName: '',
      collegeName: '',
      major: '',
      startDate: '',
      endDate: ''
    }
  }, [])

  const courseNames = useCallback((courseType: string) => {
    switch (courseType) {
      case 'PG':
        return postgraduate_courses
      case 'UG':
        return undergraduate_courses
      default:
        return []
    }
  }, [])

  const [customCourseNames, setCustomCourseNames] = useState<string[][]>([[]])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 overflow-y-auto h-[calc(100vh-200px)] scroller p-2'
      >
        <section className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  First Name
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the first name of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
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
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the last name of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Das' {...field} />
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
                      <p>This is the phone number of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
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
                  <CustomTooltipEntryForm>
                    <div>
                      <p>This is the email of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Optional</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='bura@gmail.com' {...field} type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section className='space-y-2'>
          <h1>Qualifications</h1>
          {form
            .watch('qualifications')
            ?.map((qualification, qualification_idx) => (
              <div
                className='flex flex-col gap-4 p-4 border rounded-lg parental relative'
                key={`${qualification_idx}${qualification.courseType}${qualification.courseName}`}
              >
                <span
                  className='bg-destructive rounded-full absolute right-2 top-2 cursor-pointer'
                  onClick={() => {
                    const qualificationInfos = form.getValues(`qualifications`)
                    qualificationInfos.splice(qualification_idx, 1)
                    !qualificationInfos.length &&
                      qualificationInfos.push(qualificationObj)
                    form.setValue(`qualifications`, qualificationInfos)

                    setCustomCourseNames(prev => {
                      return produce((state: typeof prev) => {
                        state.splice(qualification_idx, 1)
                        if (!state.length) {
                          state.push([])
                        }
                      })(prev)
                    })
                  }}
                >
                  <X className='h-4 w-4 p-[2px] cancel cursor-pointer' />
                </span>
                <div className='grid grid-cols-3 gap-2'>
                  <FormField
                    control={form.control}
                    name={`qualifications.${qualification_idx}.courseType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          Course Type
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the Course type of the teacher.</p>
                              <Separator className='my-2' />
                              <p>Required</p>
                            </div>
                          </CustomTooltipEntryForm>
                        </FormLabel>

                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className='text-xs'>
                              <SelectValue placeholder='Course Type' />
                            </SelectTrigger>
                            <SelectContent>
                              {courseTypes.map((courseType, courseType_idx) => (
                                <SelectItem
                                  key={courseType_idx}
                                  value={courseType}
                                >
                                  {courseType}
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
                    name={`qualifications.${qualification_idx}.courseName`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          Course Name
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the Course Name of the teacher.</p>
                              <Separator className='my-2' />
                              <p>Required</p>
                            </div>
                          </CustomTooltipEntryForm>
                        </FormLabel>
                        <FormControl>
                          <Dialog>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className='text-xs'>
                                <SelectValue placeholder='Course Name' />
                              </SelectTrigger>
                              <SelectContent className='max-w-[250px] max-h-[300px]'>
                                <SelectGroup>
                                  {courseNames(qualification.courseType).map(
                                    (courseName, courseName_idx) => (
                                      <SelectItem
                                        key={courseName_idx}
                                        value={courseName}
                                      >
                                        {courseName}
                                      </SelectItem>
                                    )
                                  )}

                                  {qualification.courseType ? (
                                    <>
                                      <SelectSeparator />
                                      {customCourseNames[qualification_idx].map(
                                        (courseNames, courseNames_idx) => {
                                          return (
                                            <SelectItem
                                              key={courseNames_idx}
                                              value={courseNames}
                                            >
                                              {courseNames}
                                            </SelectItem>
                                          )
                                        }
                                      )}
                                      <DialogTrigger asChild>
                                        <div className='flex justify-start items-center gap-2 text-sm cursor-pointer p-2 hover:bg-muted rounded'>
                                          <span className='h-4 w-4' />
                                          <span className='w-fit'>Other</span>
                                        </div>
                                      </DialogTrigger>
                                    </>
                                  ) : null}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <DialogContent className=''>
                              <DialogHeader>Specify Course Name</DialogHeader>
                              <Input
                                placeholder='Course Name'
                                onChange={e =>
                                  setCourseNameOther(e.target.value)
                                }
                                type='text'
                              />
                              <DialogFooter>
                                <DialogClose className='space-x-2'>
                                  <Button
                                    variant={'outline'}
                                    onClick={deleteCourseNameOther}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setCustomCourseNames(prev => {
                                        return produce((state: typeof prev) => {
                                          state[qualification_idx].push(
                                            courseNameOther
                                          )
                                        })(prev)
                                      })
                                      deleteCourseNameOther()
                                    }}
                                  >
                                    Add
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`qualifications.${qualification_idx}.major`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          Major
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the major subject of the teacher.</p>
                              <Separator className='my-2' />
                              <i>Optional</i>
                            </div>
                          </CustomTooltipEntryForm>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Biotechnology' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {qualification.courseName === 'Other' ? (
                  <div>
                    <FormField
                      control={form.control}
                      name={`qualifications.${qualification_idx}.courseName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name</FormLabel>
                          <FormControl>
                            <Input placeholder='Other' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}
                <div>
                  <FormField
                    control={form.control}
                    name={`qualifications.${qualification_idx}.collegeName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          College Name
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the College Name of the teacher.</p>
                              <Separator className='my-2' />
                              <p>Required</p>
                            </div>
                          </CustomTooltipEntryForm>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='IIT Kanpur' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <FormField
                    control={form.control}
                    name={`qualifications.${qualification_idx}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          Start Date
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the Start date of the course.</p>
                              <Separator className='my-2' />
                              <p>Required</p>
                            </div>
                          </CustomTooltipEntryForm>
                        </FormLabel>
                        <FormControl>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className='w-full flex justify-between items-center bg-transparent border hover:bg-transparent'>
                                {/* {console.log('field value', field?.value)} */}
                                {field?.value
                                  ? format(new Date(field?.value), 'PPP')
                                  : 'Start Date'}
                                <CalendarIcon className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='flex flex-col justify-start items-center gap-1 p-8 w-fit'>
                              <CustomCalendar
                                fieldValue={field?.value}
                                onDateSelect={date => {
                                  field.onChange(new Date(date).toUTCString())
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`qualifications.${qualification_idx}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex justify-start items-center'>
                          End Date
                          <CustomTooltipEntryForm>
                            <div>
                              <p>This is the Start date of the course.</p>
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
                                  ? format(new Date(field?.value), 'PPP')
                                  : 'End Date'}
                                <CalendarIcon className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='flex flex-col justify-start items-center gap-1 p-8 w-fit'>
                              <CustomCalendar
                                fieldValue={field?.value}
                                onDateSelect={date =>
                                  field.onChange(new Date(date).toUTCString())
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          <Button
            type='button'
            onClick={() => {
              setCustomCourseNames(prev => [...prev, []])
              form.setValue('qualifications', [
                ...form.getValues('qualifications'),
                qualificationObj
              ])
            }}
          >
            <Plus className='h-4 w-4 mr-2' />
            <span>Add Qualification</span>
          </Button>
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
                      <p>
                        This is the address of the place where the teacher
                        lives.
                      </p>
                      <Separator className='my-2' />
                      <p>Optional</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Mohanpur East' {...field} />
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
                  Date Of Birth
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
                          ? format(new Date(field?.value), 'PPP')
                          : 'Enter DOB'}
                        <CalendarIcon className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col justify-start items-center gap-1 p-8 w-fit'>
                      <CustomCalendar
                        fieldValue={field?.value}
                        onDateSelect={date =>
                          field.onChange(new Date(date).toUTCString())
                        }
                      />
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section className='grid grid-cols-4 gap-2'>
          <FormField
            control={form.control}
            name='sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex justify-start items-center'>
                  Sex
                  <CustomTooltipEntryForm>
                    <div>
                      <p>Gender of the teacher.</p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
                </FormLabel>
                <FormControl>
                  <Select value={field?.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Gender' />
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
                  <CustomTooltipEntryForm>
                    <div>
                      <p>
                        This is the mother tongue of the teacher or the first
                        language spoken by the teacher. It could also be the one
                        in which the teacher is fluent.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
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
                  <CustomTooltipEntryForm>
                    <div>
                      <p>
                        This is the salary that is or will be paid to the
                        teacher.
                      </p>
                      <Separator className='my-2' />
                      <p>Required</p>
                    </div>
                  </CustomTooltipEntryForm>
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
                        This is the membership status of the teacher. It is to
                        define whether the teacher is currently a member or not.
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
