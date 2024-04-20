'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { books, subject } from '@/schema/drizzle/schema'
import { BookType } from '@/types/book-type'
import { ServerMessageGETType } from '@/types/server-message'
import { and, eq } from 'drizzle-orm'
import getFirebaseImageDownloadURL from './get-firebase-image-download-url'
import { orderBy } from 'lodash'

export default async function getBooks (
  subject_id: string
): Promise<ServerMessageGETType<BookType[]>> {
  try {
    const res = await drizzle_orm
      .select({
        book_id: books.bookId,
        title: books.title,
        subject_id: books.subjectId,
        created_at: books.createdAt,
        subject_name: subject.subjectName
      })
      .from(books)
      .innerJoin(subject, eq(books.subjectId, subject.subjectId))
      .where(
        and(
          eq(books.subjectId, subject_id),
          eq(subject.trashed, false),
          eq(books.trashed, false)
        )
      )
    const books_array: BookType[] = []
    await Promise.all(
      res.map(async (book, book_idx) => {
        const image_url = await getFirebaseImageDownloadURL(
          `book/${book.book_id}`
        )
        console.log(book)
        books_array.push({
          ...book,
          image_url: image_url.result
        })
      })
    )

    return {
      status: 'success',
      heading: 'Books',
      description: 'Books fetched successfully',
      result: orderBy(books_array, 'created_at')
    }
  } catch (error) {
    console.log(error)
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
