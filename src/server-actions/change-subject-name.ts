'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { subject } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { eq } from 'drizzle-orm'

export default async function changeSubjectName (
  subject_id: string,
  subject_name: string
): Promise<ServerMessagePOSTType<string>> {
  try {
    await drizzle_orm
      .update(subject)
      .set({ subjectName: subject_name })
      .where(eq(subject.subjectId, subject_id))
    return {
      status: 'success',
      heading: 'Subject Updated',
      description: 'Subject Name has been updated successfully',
      result: subject_name
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
