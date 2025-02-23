import Elysia, { type InferContext, type InferHandler } from 'elysia'
import { sep } from 'path'
import { swagger, type ElysiaSwaggerConfig } from '@elysiajs/swagger'
import { DBExtends, swiggerExtends } from '@mango/extends'
import type { Mango } from '@mango/types'
import { loadEnv } from '@mango/utils'
import controllerLoader from './loader/controller'
import optionsInit from './loader/options'
import { infoLoader } from './loader/info'
import { swaggerLoader } from './loader/swagger'
import serveLoader from './loader/serve'
import cors from '@elysiajs/cors'
import { Logestic } from 'logestic'

/**
 * 初始化框架
 * @param options
 * @returns
 */
export const init = (options: Mango.MongoStartOptions) => {
  optionsInit(options)
  const app = new Elysia()
    .use(controllerLoader(options))
    .decorate('env', loadEnv())
    .derive(({ store }: any) => {
      return {
        /**
         * 停止定时任务
         * @param taskName 任务名称
         */
        stopCronTask: (taskName: string) => {
          const stopFunc = store?.cron?.[taskName]
          if (stopFunc && stopFunc.stop) {
            stopFunc.stop()
          }
        },
      }
    })
  // serveLoader(options)
  // 输出启动信息
  infoLoader(app, options)
  // 加载swagger文档
  swaggerLoader(app, options)
  // 是否开启cors
  if (options.cors) {
    app.use(cors())
  }
  // 是否开启日志
  if (options.logger) {
    app.use(Logestic.preset(options.logger))
  }
  return app
}

export default { init }
export * from './decorators'
