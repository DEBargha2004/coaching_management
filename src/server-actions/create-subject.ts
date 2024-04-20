'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { subject } from '@/schema/drizzle/schema'
import { SubjectEntrySchemaType } from '@/schema/entry-form/subject'
import { ServerMessagePOSTType } from '@/types/server-message'
import { SubjectType } from '@/types/subject-type'
import { v4 } from 'uuid'

export default async function createSubject (
  data: SubjectEntrySchemaType
): Promise<ServerMessagePOSTType<SubjectType>> {
  try {
    const subject_id = `sub_${v4()}`
    await drizzle_orm.insert(subject).values({
      subjectId: subject_id,
      subjectName: data.subject_name
    })

    return {
      status: 'success',
      heading: 'Subject Created',
      description: 'Subject has been created successfully',
      result: {
        subjectId: subject_id,
        subjectName: data.subject_name,
        createdAt: new Date().toUTCString()
      }
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
