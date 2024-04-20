import { UseFormReturn } from 'react-hook-form'
import { BookEntrySchemaType } from '@/schema/entry-form/book'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

export const BookEntryForm = ({
  form,
  onSubmit
}: {
  form: UseFormReturn<BookEntrySchemaType, any, undefined>
  onSubmit: (data: BookEntrySchemaType) => void
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Input placeholder='Enter title' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='group'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Input placeholder='Enter group' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='other'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other</FormLabel>
              <Input placeholder='Enter other Info' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
