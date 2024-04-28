"use client";

import BookCard from "@/components/custom/book";
import { BookEntryForm } from "@/components/custom/book-entry-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { BookEntrySchemaType, bookEntrySchema } from "@/schema/entry-form/book";
import { createBook, getBooks } from "@/server-actions/books";
import { getSubjectInfo } from "@/server-actions/subject";
import { useGroupStore } from "@/store/group-store";
import { BookType } from "@/types/book-type";
import { ImageFile } from "@/types/miscellaneous";
import { SubjectType } from "@/types/subject-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page({
  params: { subjectId },
}: {
  params: { subjectId: string };
}) {
  const [subjectInfo, setSubjectInfo] = useState<SubjectType | null>();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState({
    books: true,
  });
  const [dialogBoxState, setDialogBoxState] = useState({
    book_entry_form: false,
  });

  const { toast } = useToast();
  const { groups } = useGroupStore();
  const form = useForm<BookEntrySchemaType>({
    resolver: zodResolver(bookEntrySchema),
  });

  console.log(form.formState.isSubmitting);

  const handleCreateBook = async (
    data: BookEntrySchemaType & { image?: ImageFile }
  ) => {
    console.log(data);
    const serverMessage_CreateBook = await createBook({
      data,
      subject_id: subjectId,
    });
    console.log(serverMessage_CreateBook);
    if (serverMessage_CreateBook.status === "success") {
      const formData = new FormData();
      formData.append("file", data.image!);
      formData.append("fileId", serverMessage_CreateBook.result!.book_id);
      formData.append("pathPrefix", "books");
      await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });
      toast({
        title: serverMessage_CreateBook.heading,
        description: serverMessage_CreateBook.description,
        variant: "default",
      });

      setBooks((prev) => [...prev, serverMessage_CreateBook.result!]);
      form.reset();
      setDialogBoxState((prev) => ({ ...prev, book_entry_form: false }));
    } else {
      toast({
        title: serverMessage_CreateBook.heading,
        description: serverMessage_CreateBook.description,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    (async () => {
      setLoading((prev) => ({ ...prev, books: true }));
      const subjectInfoRes = await getSubjectInfo(subjectId);
      if (subjectInfoRes.status === "error") {
        toast({
          title: subjectInfoRes.heading,
          description: subjectInfoRes.description,
          variant: "destructive",
        });
        setLoading((prev) => ({ ...prev, books: false }));
      } else {
        if (!subjectInfoRes.result) {
          toast({
            title: subjectInfoRes.heading,
            description: subjectInfoRes.description,
            variant: "default",
          });
          setLoading((prev) => ({ ...prev, books: false }));
        } else {
          setSubjectInfo(subjectInfoRes.result);
          const book_Res = await getBooks(subjectId);
          if (book_Res.status === "error") {
            toast({
              title: book_Res.heading,
              description: book_Res.description,
              variant: "destructive",
            });
            setLoading((prev) => ({ ...prev, books: false }));
          } else {
            setBooks(book_Res.result || []);
            setLoading((prev) => ({ ...prev, books: false }));
          }
        }
      }
    })();
  }, []);

  return (
    <div className="px-2">
      <div className="flex justify-end items-center ">
        <Dialog
          open={dialogBoxState.book_entry_form}
          onOpenChange={(e) => {
            setDialogBoxState((prev) => ({ ...prev, book_entry_form: e }));
            form.reset();
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!subjectInfo?.subjectId}>
              <Book className="h-4 w-4 mr-3" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100%-200px)] overflow-auto scroller p-2">
            <DialogHeader>Book Entry form</DialogHeader>
            <BookEntryForm
              form={form}
              onSubmit={handleCreateBook}
              groups={groups}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4 my-4">
        {loading.books
          ? Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="w-full aspect-video rounded-lg" />
            ))
          : books?.map((book) => <BookCard key={book.book_id} {...book} />)}
      </div>
    </div>
  );
}
