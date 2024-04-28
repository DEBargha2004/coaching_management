"use server";

import { id_prefix } from "@/constants/id-prefix";
import { books_index } from "@/lib/algolia";
import { drizzle_orm } from "@/lib/drizzle";
import { firebaseConfig, storageDB } from "@/lib/firebase";
import { books, group, subject } from "@/schema/drizzle/schema";
import { BookEntrySchemaType, bookEntrySchema } from "@/schema/entry-form/book";
import { BookType } from "@/types/book-type";
import { ImageFile } from "@/types/miscellaneous";
import {
  ServerMessageGETType,
  ServerMessagePOSTType,
} from "@/types/server-message";
import { and, eq } from "drizzle-orm";
import { UploadResult, ref, uploadBytes, uploadString } from "firebase/storage";
import { v4 } from "uuid";

export async function getBooks(
  subject_id: string
): Promise<ServerMessageGETType<BookType[]>> {
  try {
    const res = await drizzle_orm
      .select({
        book_id: books.bookId,
        title: books.title,
        subject_id: books.subjectId,
        created_at: books.createdAt,
        group_id: books.groupId,
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
      .orderBy(books.createdAt);
    return {
      status: "success",
      heading: "Books",
      description: "Books fetched successfully",
      result: res,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}

export async function createBook({
  data,
  subject_id,
}: {
  data: BookEntrySchemaType;
  subject_id: string;
}): Promise<ServerMessagePOSTType<BookType>> {
  try {
    console.log(data);
    const { success } = bookEntrySchema.safeParse(data);

    if (!subject_id) {
      return {
        status: "error",
        heading: "Subject not found",
        description:
          "Subject was found missing. Get into an existing subject or create a new one",
      };
    }
    if (!success) {
      return {
        status: "error",
        heading: "Validation Error",
        description: "Book data is invalid",
      };
    }
    const book_id = `${id_prefix.book}${v4()}`;
    const existing_book = await drizzle_orm
      .select()
      .from(books)
      .where(and(eq(books.title, data.title), eq(books.groupId, data.group)));

    if (existing_book.length) {
      return {
        status: "error",
        heading: "Book Already Exists",
        description: "Book with the same title and group already exists",
      };
    }

    await drizzle_orm.insert(books).values({
      bookId: book_id,
      title: data.title,
      subjectId: subject_id,
      groupId: data.group,
      description: data.description,
    });

    await books_index.saveObject({
      objectID: book_id.replace(id_prefix.book, ""),
      title: data.title,
      group: data.group,
      description: data.description,
      subject_id: subject_id,
    });

    return {
      status: "success",
      heading: "Book Created",
      description: "Book has been created successfully",
      result: {
        book_id,
        title: data.title,
        group_id: data.group,
        description: data.description,
        created_at: new Date().toUTCString(),
        subject_id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      heading: "Internal Server Error",
      description: "Something went wrong. Please try again later",
    };
  }
}
