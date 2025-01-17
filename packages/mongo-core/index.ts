import Elysia, { type InferContext, type InferHandler } from 'elysia'
import { sep } from 'path'
import { swagger, type ElysiaSwaggerConfig } from '@elysiajs/swagger'
import { DBExtends, swiggerExtends } from '@mongo/extends'
import type { Mongo } from '@mongo/types'
import { loadEnv } from '@mongo/utils'
import controllerLoader from './loader/controller'
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

  // app.onError(({ code, error }) => {
  //   if (code === "VALIDATION") {
  //     const msg = JSON.parse(error.message)
  //     return msg.error
  //     // return new Response(JSON.stringify(msg.errors))
  //   }
  //   console.log('error', error, code)
  //   return new Response(error.toString())
  // })

  return app
}

export default { init }
export * from './decorators'

export type App = ReturnType<typeof init>
export type Context = InferContext<App>
export type Handler = InferHandler<App>
// app.all方法第三个参数的类型
type AppAllType = ReturnType<typeof init>['all']
// 提取每个方法中第三个类型
export type ThirdParameterType = Parameters<AppAllType>[2]