import { PrismaClient } from '@prisma/client';
import type { Users } from '@prisma/client';

const prisma = new PrismaClient();

// Test type exports
const test = async () => {
  const user = await prisma.users.findFirst();
  console.log(user);
};

export { Users };
