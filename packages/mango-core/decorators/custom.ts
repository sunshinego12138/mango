import type { Mongo } from '@mango/types'

/**
 * 自定义装饰器
 * @important 需要放置到请求装饰器下
 * @example
 * export const logFirstParameter = createParameterDecorator((parameter, originalMethod) => {
 *  return originalMethod
 * })
 */
export function createParameterDecorator<T = {}>(
  handler: (parameter: Mongo.Merge<Mongo.Context<'redirect', any>, T>, originalMethod: Function) => any,
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value // 保存原始方法

    descriptor.value = function (...args: any[]) {
      const parameter = args[0]
      return handler(parameter, originalMethod.apply(this, args))
    }
    target[propertyKey] = descriptor.value
    return descriptor
  }
}