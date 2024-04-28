'use server'

import { storageDB } from '@/lib/firebase'
import { ServerMessageGETType } from '@/types/server-message'
import { getDownloadURL, ref } from 'firebase/storage'

export default async function getFirebaseImageDownloadURL (
  url: string
): Promise<ServerMessageGETType<string>> {
  try {
    const downloadUrl = await getDownloadURL(ref(storageDB, url))
    return {
      status: 'success',
      heading: 'image url',
      result: downloadUrl
    }
  } catch (error) {
    return {
      status: 'error',
      heading: 'Internal Server Error',
      description: 'Something went wrong.Please try again later'
    }
  }
}
