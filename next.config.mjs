import createJITI from 'jiti'
import { fileURLToPath } from 'node:url'

const jiti = createJITI(fileURLToPath(import.meta.url))

jiti('./src/schema/env/server.ts')
jiti('./src/schema/env/client.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
