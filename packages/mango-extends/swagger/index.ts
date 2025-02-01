import swagger from '@elysiajs/swagger'
import type { Mongo } from '@mango/types'
import { Elysia } from 'elysia'

/**
 * 数据库插件
 */
export const swiggerExtends = (options: Mongo.MongoStartOptions) =>
  swagger({
    documentation: {
      info: {
        title: options.name as string,
        version: options.version as string,
      },
    },
  })
