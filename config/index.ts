const dev = process.env.NODE_ENV !== 'production'

// in practice, 'http://localhost:3000' would be env variable also
export const server = dev ? 'http://localhost:3000' : process.env.SERVER
