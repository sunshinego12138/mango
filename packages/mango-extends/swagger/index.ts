import swagger from '@elysiajs/swagger'
import type { MangoStartOptions } from '@mango/types'
import { Elysia } from 'elysia'

/**
 * 数据库插件
 */
export const swiggerExtends = (options: MangoStartOptions) =>
  swagger({
    documentation: {
      info: {
        title: options.name as string,
        version: options.version as string,
      },
    },
  })
