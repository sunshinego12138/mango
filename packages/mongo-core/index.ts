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
import serveLoader from './loader/serve'

/**
 * 初始化框架
 * @param options
 * @returns
 */
const init = (options: Mongo.MongoStartOptions) => {
  optionsInit(options)
  const app = new Elysia().use(DBExtends).use(controllerLoader(options)).decorate('loadEnv', loadEnv())
  // serveLoader(options)
  // 输出启动信息
  infoLoader(app, options)
  // 加载swagger文档
  swaggerLoader(app, options)
  return app
}

export default { init }
export * from './decorators'

// export type App = ReturnType<typeof init>
// // export type _Context = InferContext<App> & { [key: string]: any }
// export type _Context = InferContext<App>
// /** 每个方法的类型，这个目前没有用到 */
// export type Handler = InferHandler<App>
// // app.all方法第三个参数的类型
// type AppAllType = ReturnType<typeof init>['all']
// // 提取每个方法中第三个类型
// export type ThirdParameterType = Parameters<AppAllType>[2]

// /**
//  * 上下文类型
//  * 可以传递两个参数，用于间接的修改context中的类型
//  * @example
//  * @Get('/test', {
//  *   query: querySchema,
//  * })
//  * test({ query }: Context<'query', typeof querySchema.static>) {
//  *   return query
//  * }
//  *
//  * @Get('/test2')
//  * test2({ query }: Context) {
//  *   return query
//  * }
//  */
// export type Context<K extends keyof _Context = keyof _Context, V = any> = K extends keyof _Context
//   ? Omit<_Context, K> & { [P in K]: V }
//   : _Context