import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

/**
 * 数据库插件
 */
export const DBExtends = new Elysia().decorate(
  'db',
  new PrismaClient({
    log: ['query'],
  }),
)
