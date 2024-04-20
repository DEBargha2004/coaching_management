'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { subject } from '@/schema/drizzle/schema'
import { ServerMessagePOSTType } from '@/types/server-message'
import { eq } from 'drizzle-orm'

export default async function trashSubject (
  subject_id: string
): Promise<ServerMessagePOSTType<null>> {
  try {
    await drizzle_orm
      .update(subject)
      .set({ trashed: true })
      .where(eq(subject.subjectId, subject_id))
    return {
      status: 'success',
      heading: 'Subject Trashed',
      description: 'Subject has been trashed successfully'
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
