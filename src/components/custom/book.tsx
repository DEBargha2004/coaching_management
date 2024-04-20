import { BookType } from '@/types/book-type'

export default function BookCard ({
  book_id,
  title,
  created_at,
  image_url
}: BookType) {
  return (
    <div className='w-full aspect-video rounded-lg overflow-hidden flex justify-center items-end'>
      {title}
    </div>
  )
}
