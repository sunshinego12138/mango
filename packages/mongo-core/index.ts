import Elysia, { type InferContext, type InferHandler } from 'elysia'
import { sep } from 'path'
import { swagger, type ElysiaSwaggerConfig } from '@elysiajs/swagger'
import { DBExtends, swiggerExtends } from '@mongo/extends'
import type { Mongo } from '@mongo/types'
import { loadEnv } from '@mongo/utils'
import controllerLoader from './loader/serve'
import optionsInit from './loader/options'
import { infoLoader } from './loader/info'
import { swaggerLoader } from './loader/swagger'

/**
 * 初始化框架
 * @param options
 * @returns
 */
const init = (options: Mongo.MongoStartOptions) => {
  optionsInit(options)
  const app = new Elysia().use(DBExtends).use(controllerLoader(options)).decorate('loadEnv', loadEnv())

  // 输出启动信息
  infoLoader(app, options)
  // 加载swagger文档
  swaggerLoader(app, options)

  return app
}

export default { init }

export type App = ReturnType<typeof init>
export type Context = InferContext<App>
export type Handler = InferHandler<App>
