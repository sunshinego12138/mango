import MongoFunc from '@mongo/core'
import { type ElysiaSwaggerConfig } from '@elysiajs/swagger'
import type { InferContext, InferHandler } from 'elysia'

export declare namespace Mongo {
  export type MongoStartOptions = {
    /** 应用名称
     * @default Elysia SunShine
     */
    name?: string
    /** 应用版本
     * @default v1.0.0
     */
    version?: string
    /** 项目基础路径, 无需填写自动获取
     * @default 项目根目录
     */
    baseDir?: string
    /** 业务路径
     * @default src
     */
    businessPath?: string
    /**
     * 存放Elysia控制器的路径
     * @default modules
     */
    controllerPath?: string

    /**
     * 是否开启cors
     */
    cors?: boolean

    /**
     * swagger文档配置
     */
    swagger?: Omit<ElysiaSwaggerConfig, 'path'> & {
      path?: string
    }
  }

  // /** app实例的类型 */
  // export type App = AppType
  // /** 每个请求方法参数的类型 */
  // export type Context = ContextType
  // /** 每个请求方法的类型 */
  // export type Handler = HandlerType
  export type App = ReturnType<typeof MongoFunc.init>
  type _Context = InferContext<App>
  type Handler = InferHandler<App>
  type AppAllType = ReturnType<typeof MongoFunc.init>['all']

  /**
   * websocket相关
   */
  // websocket方法类型
  export type WebSocketMethodType = Parameters<ReturnType<typeof MongoFunc.init>['ws']>[1]
  // websocket方法中message方法的类型
  type WebSocketMessageMethodType = WebSocketMethodType['message']
  // websocket方法中message方法中第一个参数ws的类型
  export type WebSocket = Parameters<Exclude<WebSocketMessageMethodType, undefined>>[0]
  // 提取每个方法中第三个类型
  export type ThirdParameterType = Parameters<AppAllType>[2]

  /**
   * 上下文类型
   * 可以传递两个参数，用于间接的修改context中的类型
   * @example
   * @Get('/test', {
   *   query: querySchema,
   * })
   * test({ query }: Context<'query', typeof querySchema.static>) {
   *   return query
   * }
   *
   * @Get('/test2')
   * test2({ query }: Context) {
   *   return query
   * }
   */
  export type Context<K extends keyof _Context = keyof _Context, V = any> = K extends keyof _Context
    ? Omit<_Context, K> & { [P in K]: V }
    : _Context

  export type Merge<T, U> = {
    [K in keyof T | keyof U]: K extends keyof T
      ? K extends keyof U
        ? // ? T[K] | U[K] // 如果两个类型都有该属性，则合并为联合类型
          U[K] // 如果两个类型都有该属性，则使用后面的类型覆盖
        : T[K] // 否则保持 T 中的类型
      : K extends keyof U
      ? U[K] // 否则保持 U 中的类型
      : never // 这行其实不会被执行
  }
}
