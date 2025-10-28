import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Best practice to prevent multiple instances of Prisma Client in development
 * due to hot reloading. In production, this ensures a single instance.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown - disconnect Prisma on app termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
