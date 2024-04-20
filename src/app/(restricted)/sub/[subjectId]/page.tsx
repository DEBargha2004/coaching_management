'use client'

import BookCard from '@/components/custom/book'
import { BookEntryForm } from '@/components/custom/book-entry-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { BookEntrySchemaType, bookEntrySchema } from '@/schema/entry-form/book'
import getBooks from '@/server-actions/get-books'
import { getSubjectInfo } from '@/server-actions/get-subjects'
import { BookType } from '@/types/book-type'
import { ServerMessageGETType } from '@/types/server-message'
import { SubjectType } from '@/types/subject-type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Book } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Page ({
  params: { subjectId }
}: {
  params: { subjectId: string }
}) {
  const [subjectInfo, setSubjectInfo] = useState<SubjectType | null>()
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState({
    books: true
  })

  const { toast } = useToast()
  const form = useForm<BookEntrySchemaType>({
    resolver: zodResolver(bookEntrySchema)
  })

  const handleCreateBook = async (data: BookEntrySchemaType) => {}

  useEffect(() => {
    ;(async () => {
      setLoading(prev => ({ ...prev, books: true }))
      const subjectInfoRes = await getSubjectInfo(subjectId)
      if (subjectInfoRes.status === 'error') {
        toast({
          title: subjectInfoRes.heading,
          description: subjectInfoRes.description,
          variant: 'destructive'
        })
        setLoading(prev => ({ ...prev, books: false }))
      } else {
        if (!subjectInfoRes.result) {
          toast({
            title: subjectInfoRes.heading,
            description: subjectInfoRes.description,
            variant: 'default'
          })
          setLoading(prev => ({ ...prev, books: false }))
        } else {
          setSubjectInfo(subjectInfoRes.result)
          const book_Res = await getBooks(subjectId)
          if (book_Res.status === 'error') {
            toast({
              title: book_Res.heading,
              description: book_Res.description,
              variant: 'destructive'
            })
            setLoading(prev => ({ ...prev, books: false }))
          } else {
            setBooks(book_Res.result || [])
            setLoading(prev => ({ ...prev, books: false }))
          }
        }
      }
    })()
  }, [])

  return (
    <div className='px-2'>
      <div className='flex justify-end items-center'>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Book className='h-4 w-4 mr-3' />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <BookEntryForm form={form} onSubmit={handleCreateBook} />
          </DialogContent>
        </Dialog>
      </div>
      <div className='grid grid-cols-4 gap-4 my-4'>
        {loading.books
          ? Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className='w-full aspect-video rounded-lg' />
            ))
          : books?.map(book => <BookCard key={book.book_id} {...book} />)}
      </div>
    </div>
  )
}
