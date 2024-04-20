'use server'

import { drizzle_orm } from '@/lib/drizzle'
import { group } from '@/schema/drizzle/schema'
import { GroupEntrySchemaType } from '@/schema/entry-form/group'
import { GroupType } from '@/types/group-type'
import {
  ServerMessageGETType,
  ServerMessagePOSTType
} from '@/types/server-message'
import { eq } from 'drizzle-orm'
import { v4 } from 'uuid'

export async function getGroups (): Promise<ServerMessageGETType<GroupType[]>> {
  try {
    const groups = await drizzle_orm
      .select({
        group_id: group.groupId,
        name: group.name,
        other: group.other,
        created_at: group.createdAt
      })
      .from(group)
      .where(eq(group.trashed, false))
      .orderBy(group.name)
    return {
      status: 'success',
      heading: 'Groups',
      description: 'Groups fetched successfully',
      result: groups
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}

export async function createGroup ({
  name,
  other
}: {
  name: string
  other?: string
}): Promise<ServerMessagePOSTType<GroupType> & { trashed?: boolean }> {
  try {
    const existingGroup = await drizzle_orm
      .select()
      .from(group)
      .where(eq(group.name, name))
    if (existingGroup.length > 0) {
      if (existingGroup[0].trashed) {
        return {
          status: 'error',
          heading: 'Group Already Exists',
          description: `Group already exists in Trash. Please try again with a 
                        different name or delete the group from Trash if you want to
                        use the same name.`,
          result: {
            group_id: existingGroup[0].groupId,
            name: existingGroup[0].name,
            other: existingGroup[0].other,
            created_at: existingGroup[0].createdAt
          },
          trashed: true
        }
      } else {
        return {
          status: 'error',
          heading: 'Group Already Exists',
          description:
            'Group already exists. Please try again with a different name'
        }
      }
    }
    const group_id = `grp_${v4()}`
    await drizzle_orm.insert(group).values({
      groupId: group_id,
      name,
      other
    })

    return {
      status: 'success',
      heading: 'Group Created',
      description: 'Group has been created successfully',
      result: {
        group_id,
        name,
        other,
        created_at: new Date().toUTCString()
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

export async function updateGroup ({
  name,
  other,
  group_id
}: Partial<GroupEntrySchemaType> & {
  group_id: string
}): Promise<ServerMessagePOSTType<GroupType>> {
  try {
    await drizzle_orm
      .update(group)
      .set({
        ...(name ? { name } : {}),
        ...(other ? { other } : {})
      })
      .where(eq(group.groupId, group_id))
    const updatedGroup = await drizzle_orm
      .select()
      .from(group)
      .where(eq(group.groupId, group_id))

    return {
      status: 'success',
      heading: 'Group Updated',
      description: 'Group Info has been updated successfully',
      result: {
        group_id: updatedGroup[0].groupId,
        name: updatedGroup[0].name,
        other: updatedGroup[0].other,
        created_at: updatedGroup[0].createdAt
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

export async function trashGroup (
  group_id: string
): Promise<ServerMessagePOSTType> {
  try {
    await drizzle_orm
      .update(group)
      .set({ trashed: true })
      .where(eq(group.groupId, group_id))
    return {
      status: 'success',
      heading: 'Group Trashed',
      description: 'Group has been trashed successfully'
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}

export async function restoreGroup (
  group_id: string
): Promise<ServerMessagePOSTType<GroupType>> {
  try {
    await drizzle_orm
      .update(group)
      .set({ trashed: false })
      .where(eq(group.groupId, group_id))
    const group_info = await drizzle_orm
      .select({
        group_id: group.groupId,
        name: group.name,
        other: group.other,
        created_at: group.createdAt
      })
      .from(group)
      .where(eq(group.groupId, group_id))
    return {
      status: 'success',
      heading: 'Group Restored',
      description: 'Group has been restored successfully',
      result: group_info[0]
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong. Please try again later'
    }
  }
}
