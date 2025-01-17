import 'reflect-metadata'

// 装饰器类型
export enum DecoratorKey {
  /** 控制器 */
  Controller = 'controller',
  /** 方法 */
  Method = 'method',
  /** 服务 */
  Injectable = 'injectable',
  /**  */
}
export * from './controller'
export * from './method'
export * from './server'
