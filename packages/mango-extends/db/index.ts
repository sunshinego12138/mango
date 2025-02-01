import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

/**
 * 数据库插件
 */
export const DBExtends = new Elysia().decorate(
  'prisma',
  new PrismaClient({
    log: ['query'],
  }),
)
