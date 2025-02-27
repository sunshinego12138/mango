import type { Mango } from '@mango/types'
import { isBoolean, isPromise } from '@mango/utils'
import { DecoratorKey } from '..'
type ParametersHandlerType = boolean | Record<string, any>
/**
 * 自定义装饰器
 * @important 需要放置到请求装饰器下
 * 支持控制器和单个请求装饰
 * @example
 * export const logFirstParameter = createParameterDecorator((parameter, originalMethod) => {
 *  return true
 * })
 */
export function createParameterDecorator<T = {}>(
  handler: (
    parameter: Mango.Merge<Mango.Context<'redirect', any>, T>,
  ) => ParametersHandlerType | Promise<ParametersHandlerType>,
): any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 判断装饰器是应用于类还是方法
    if (typeof target === 'function') {
      // 装饰器应用于类
      Reflect.defineMetadata(
        DecoratorKey.BeforeHandle,
        {
          handler,
          key: DecoratorKey.BeforeHandle,
        },
        target,
      )
    } else {
      // 装饰器应用于方法
      const originalMethod = descriptor.value // 保存原始方法
      descriptor.value = async function (...args: any[]) {
        // const parameter = args[0]
        // let res = handler(parameter) as ParametersHandlerType
        // if (isPromise(res)) {
        //   res = await handler(parameter)
        // }
        // if (isBoolean(res)) {
        //   if (res) {
        //     return originalMethod.apply(this, args)
        //   } else {
        //     return null
        //   }
        // } else {
        //   return res
        // }
        const parameter = args[0]
        let res = {}
        const str = handler.toString()
        if (str.includes('async') || str.includes('Promise.resolve')) {
          // 是promise的话
          res = await handler(parameter)
        } else {
          res = handler(parameter)
        }
        if (isBoolean(res)) {
          if (res) {
            return originalMethod.apply(this, args)
          } else {
            return null
          }
        } else {
          return res
        }
      }
      target[propertyKey] = descriptor.value
      return descriptor
    }
  }
}

// 只支持类方法
// export function createParameterDecorator<T = {}>(
//   handler: (
//     parameter: Mango.Merge<Mango.Context<'redirect', any>, T>,
//   ) => ParametersHandlerType | Promise<ParametersHandlerType>,
// ) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value // 保存原始方法

//     descriptor.value = async function (...args: any[]) {
//       const parameter = args[0]
//       let res = handler(parameter) as ParametersHandlerType
//       if (isPromise(res)) {
//         res = await handler(parameter)
//       }
//       if (isBoolean(res)) {
//         if (res) {
//           return originalMethod.apply(this, args)
//         } else {
//           return null
//         }
//       } else {
//         return res
//       }
//     }
//     target[propertyKey] = descriptor.value
//     return descriptor
//   }
// }