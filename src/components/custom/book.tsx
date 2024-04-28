import { BookType } from "@/types/book-type";

export default function BookCard({ book_id, title, created_at }: BookType) {
  return (
    <div
      className={`w-full aspect-video rounded-lg overflow-hidden 
                    flex justify-center items-center border bg-muted`}
    >
      {title}
    </div>
  );
}
