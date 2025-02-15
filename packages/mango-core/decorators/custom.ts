import type { Mango } from '@mango/types'
import { isPromise } from '@mango/utils'
type ParametersHandlerType = {
  /**
   * 是否通过
   * @true 通过
   * @false 不通过，返回response的值
   */
  status: boolean
  /** 当status为false时返回的值 */
  response?: any
}
/**
 * 自定义装饰器
 * @important 需要放置到请求装饰器下
 * @example
 * export const logFirstParameter = createParameterDecorator((parameter, originalMethod) => {
 *  return originalMethod
 * })
 */
export function createParameterDecorator<T = {}>(
  handler: (
    parameter: Mango.Merge<Mango.Context<'redirect', any>, T>,
  ) => ParametersHandlerType | Promise<ParametersHandlerType>,
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value // 保存原始方法

    descriptor.value = async function (...args: any[]) {
      const parameter = args[0]
      let res = handler(parameter) as ParametersHandlerType
      if (isPromise(res)) {
        res = await handler(parameter)
      }
      if (res.status) {
        return originalMethod.apply(this, args)
      } else {
        return res.response
      }
    }
    target[propertyKey] = descriptor.value
    return descriptor
  }
}

// export function createParameterDecorator<T = {}>(
//   handler: (parameter: Mango.Merge<Mango.Context<'redirect', any>, T>, originalMethod: Function) => any,
// ) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value // 保存原始方法

//     descriptor.value = function (...args: any[]) {
//       const parameter = args[0]
//       return handler(parameter, originalMethod.apply(this, args))
//     }
//     target[propertyKey] = descriptor.value
//     return descriptor
//   }
// }
