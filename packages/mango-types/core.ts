import MongoFunc from '@mango/core'
import type { ElysiaSwaggerConfig } from '@elysiajs/swagger'
import type { InferContext, InferHandler, ElysiaConfig } from 'elysia'

export type MangoStartOptions = {
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
  swagger?: ElysiaSwaggerConfig
  // swagger?: Omit<ElysiaSwaggerConfig, 'path'> & {
  //   path?: string
  // }
  /**
   * 是否启用日志
   */
  // logger?: 'common' | 'fancy' | 'commontz'
  logger?: boolean
  // logger?: LogesticOptions & {
  //   type: 'common' | 'fancy' | 'commontz'
  // }

  /** 静态服务相关 */
  static?: StaticOption

  /**
   * Elysia的配置
   */
  ElysiaOption?: ElysiaConfig<string>
}

export type StaticOption = {
  /**
   * @default "public"
   *
   * Asset path to expose as public path
   */
  assets?: string
  /**
   * @default '/public'
   *
   * Path prefix to create virtual mount path for the static directory
   */
  prefix?: string
  /**
   * @default 1024
   *
   * If total files exceed this number,
   * file will be handled via wildcard instead of static route
   * to reduce memory usage
   */
  staticLimit?: number
  /**
   * @default false unless `NODE_ENV` is 'production'
   *
   * Should file always be served statically
   */
  alwaysStatic?: boolean
  /**
   * @default [] `Array<string | RegExp>`
   *
   * Array of file to ignore publication.
   * If one of the patters is matched,
   * file will not be exposed.
   */
  ignorePatterns?: Array<string | RegExp>
  /**
   * Indicate if file extension is required
   *
   * Only works if `alwaysStatic` is set to true
   */
  noExtension?: boolean
  /**
   *
   * When url needs to be decoded
   *
   * Only works if `alwaysStatic` is set to false
   */
  enableDecodeURI?: boolean
  /**
   * Nodejs resolve function
   */
  resolve?: (...pathSegments: string[]) => string
  /**
   * Set headers
   */
  headers?: Record<string, string> | undefined
  /**
   * @default false
   *
   * If set to true, browser caching will be disabled
   */
  noCache?: boolean
  /**
   * @default public
   *
   * directive for Cache-Control header
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#directives
   */
  directive?:
    | 'public'
    | 'private'
    | 'must-revalidate'
    | 'no-cache'
    | 'no-store'
    | 'no-transform'
    | 'proxy-revalidate'
    | 'immutable'
  /**
   * @default 86400
   *
   * Specifies the maximum amount of time in seconds, a resource will be considered fresh.
   * This freshness lifetime is calculated relative to the time of the request.
   * This setting helps control browser caching behavior.
   * A `maxAge` of 0 will prevent caching, requiring requests to validate with the server before use.
   */
  maxAge?: number | null
  /**
   *
   */
  /**
   * @default true
   *
   * Enable serving of index.html as default / route
   */
  indexHTML?: boolean
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
export type WebSocketContext = Parameters<Exclude<WebSocketMessageMethodType, undefined>>[0]
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

/**
 * 合并两个类型
 * @example
 * type test = Merge<Context, {body: {id: string}}>
 */
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
