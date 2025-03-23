import 'reflect-metadata'

// 装饰器类型
export enum DecoratorKey {
  /** 控制器 */
  Controller = 'controller',
  /** 方法 */
  Method = 'method',
  /** 服务 */
  Injectable = 'injectable',
  /** 自动注入 */
  Autowired = 'autowired',
  /** websocket方法 */
  WebSocket = 'websocket',
  /** 定时任务 */
  Cron = 'cron',
  /** controller的装饰器 */
  BeforeHandle = 'beforeHandle',
  /** 转发代理 */
  Proxy = 'proxy'
}
export * from './controller'
export * from './method'
export * from './server'
export * from './cron'
export * from './custom'
export * from './proxy'