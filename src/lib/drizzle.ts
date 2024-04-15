import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '../schema/drizzle/schema'
import { env } from '@/schema/env/server'

const poolConnection = mysql.createPool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: Number(env.DB_CONNECTION_LIMIT), // Maximum number of connections in the pool
  queueLimit: 0 // Unlimited queuing
})

export const drizzle_orm = drizzle(poolConnection, {
  schema: schema,
  mode: 'default'
})
