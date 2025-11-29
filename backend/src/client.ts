import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL as string,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma