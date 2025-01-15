import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

export const db = new Elysia().decorate(
  'db',
  new PrismaClient({
    log: ['query'],
  }),
)

export default db
