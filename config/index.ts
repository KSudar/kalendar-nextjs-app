import { join } from 'path'

const dev = process.env.NODE_ENV !== 'production'

export const basePath = dev ? process.cwd() : join(process.cwd(), '.next/server/chunks')

// in practice, 'http://localhost:3000' would be env variable also
export const server = dev ? 'http://localhost:3000' : ''
