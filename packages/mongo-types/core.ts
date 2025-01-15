import type { App as AppType, Context as ContextType, Handler as HandlerType } from '@mongo/core'
import { type ElysiaSwaggerConfig } from '@elysiajs/swagger'

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
     * swagger文档配置
     */
    swagger?: Omit<ElysiaSwaggerConfig, 'path'> & {
      path?: string
    }
  }

  /** app实例的类型 */
  export type App = AppType
  /** 每个请求方法参数的类型 */
  export type Context = ContextType
  /** 每个请求方法的类型 */
  export type Handler = HandlerType
}
