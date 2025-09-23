import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create singleton Prisma client instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// In development, store the client on globalThis to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown function
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect()
}

// Transaction helper function
export const withTransaction = async <T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(callback)
}

// Health check function
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // For MongoDB, we can use a simple findFirst query to test connection
    await prisma.user.findFirst({ take: 1 })
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
