'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { subject } from '@/schema/drizzle/schema'
import { ServerMessageGETType } from '@/types/server-message'
import { SubjectType } from '@/types/subject-type'
import { eq } from 'drizzle-orm'

export default async function getSubjects (): Promise<
  ServerMessageGETType<SubjectType[]>
> {
  try {
    const subjects = await drizzle_orm
      .select({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        createdAt: subject.createdAt
      })
      .from(subject)
      .where(eq(subject.trashed, false))
      .orderBy(subject.createdAt)
    return {
      status: 'success',
      heading: 'Subjects',
      description: 'Subjects fetched successfully',
      result: subjects
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

export const getSubjectInfo = async (
  subject_id: string
): Promise<ServerMessageGETType<SubjectType | null>> => {
  try {
    const res = await drizzle_orm
      .select()
      .from(subject)
      .where(eq(subject.subjectId, subject_id))
    if (res.length) {
      return {
        status: 'success',
        heading: 'Subject',
        description: 'Subject fetched successfully',
        result: res[0]
      }
    } else {
      return {
        status: 'success',
        heading: 'Subject Not Found',
        description: 'No Subject found with this id',
        result: null
      }
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
