'use client'

import { SubjectEntrySchemaType } from '@/schema/entry-form/subject'
import { UseFormReturn } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { CustomTooltipEntryForm } from './custom-tooltip-entry-form'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export default function SubjectEntryForm ({
  form,
  onSubmit
}: {
  form: UseFormReturn<SubjectEntrySchemaType, any, undefined>
  onSubmit: (data: SubjectEntrySchemaType) => void
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='subject_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex'>
                Subject Name
                <CustomTooltipEntryForm>
                  <div className='inline'>
                    <p>Enter the name of the subject</p>
                    <Separator className='my-2' />
                    <span>Required</span>
                  </div>
                </CustomTooltipEntryForm>
              </FormLabel>
              <Input placeholder='Enter name' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>
          {form.formState.isSubmitting ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  )
}
