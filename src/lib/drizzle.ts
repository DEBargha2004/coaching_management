import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '../schema/drizzle/schema'

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT), // Maximum number of connections in the pool
  queueLimit: 0 // Unlimited queuing
})

export const drizzle_orm = drizzle(poolConnection, {
  schema: schema,
  mode: 'default'
})
