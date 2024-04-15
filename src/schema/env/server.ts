import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

export const env = createEnv({
  server: {
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.number(),
    DB_NAME: z.string(),
    DB_CONNECTION_LIMIT: z.number(),
    CLERK_SECRET_KEY: z.string(),
    ALGOLIA_ADMIN_API_KEY: z.string(),
    ALGOLIA_API_KEY: z.string(),
    FIREBASE_API_KEY: z.string(),
    FIREBASE_AUTH_DOMAIN: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_STORAGE_BUCKET: z.string(),
    FIREBASE_MESSAGING_SENDER_ID: z.string(),
    FIREBASE_APP_ID: z.string(),
    FIREBASE_MEASUREMENT_ID: z.string(),
    ALGOLIA_STUDENTS_INDEX_NAME: z.string(),
    ALGOLIA_TEACHERS_INDEX_NAME: z.string(),
    ALGOLIA_TEACHERS_SALARY_INDEX_NAME: z.string(),
    DATABASE_URL: z.string()
  },
  runtimeEnv: {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    ALGOLIA_STUDENTS_INDEX_NAME: process.env.ALGOLIA_STUDENTS_INDEX_NAME,
    ALGOLIA_TEACHERS_INDEX_NAME: process.env.ALGOLIA_TEACHERS_INDEX_NAME,
    ALGOLIA_TEACHERS_SALARY_INDEX_NAME:
      process.env.ALGOLIA_TEACHERS_SALARY_INDEX_NAME,
    DATABASE_URL: process.env.DATABASE_URL
  }
})
