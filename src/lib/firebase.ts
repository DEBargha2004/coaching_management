import { env } from '@/schema/env/server'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

export const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const storageDB = getStorage(app)

export { storageDB }
