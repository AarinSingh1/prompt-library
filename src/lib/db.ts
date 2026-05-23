import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env.PRISMA_DATABASE_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    // eslint-disable-next-line no-console
    console.error('[db] FATAL: No database URL set. Expected PRISMA_DATABASE_URL or DATABASE_URL.')
    throw new Error('Missing PRISMA_DATABASE_URL environment variable')
  }
  // eslint-disable-next-line no-console
  console.log('[db] Initializing PrismaPg adapter (host:', connectionString.split('@')[1]?.split('/')[0], ')')
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
