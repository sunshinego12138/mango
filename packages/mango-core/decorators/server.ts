import { DecoratorKey } from '.'

// 被Server装饰的类都会被实例化并保存到这里
const InjectMap: Map<any, any> = new Map()

/**
 *  注入装饰器
 * 这个暂时无用
 * @returns
 */
export const Injectable =
  (key: any = undefined) =>
  (target: any) => {
    if (key) {
      InjectMap.set(key, target)
    }
    // InjectMap.set(target.name, target)
    Reflect.defineMetadata(
      DecoratorKey.Injectable,
      {
        target,
        key: DecoratorKey.Injectable,
      },
      target,
    )
  }

/**
 * Autowired 获取注入值
 * 暂时所有的类都可以被注入，只要被Autowired装饰就可以
 */
export const Autowired = (target: any, propertyKey: string) => {
  // 根据类型注入
  const instanceClass = Reflect.getMetadata('design:type', target, propertyKey)
  if (typeof instanceClass === "function" && /^\s*class\s+/.test(instanceClass.toString())) {
    // 是class
    target[propertyKey] = new instanceClass()
  } else {
    // 不是class，是interface或者其他
    target[propertyKey] = {}
    console.error(`【注入失败】:${target.constructor.name} -> ${propertyKey} 无法被实例化`)
  }
  Reflect.defineMetadata(
    DecoratorKey.Autowired,
    {
      target,
      propertyKey,
      key: DecoratorKey.Autowired,
    },
    target,
  )
}
// export const Autowired =
//   (key: any = undefined) =>
//   (target: any, propertyKey: string) => {
//     let instanceClass
//     if (!key) {
//       // 没有传key，根据类型注入
//       const type = Reflect.getMetadata('design:type', target, propertyKey)
//       if (typeof type === 'function') {
//         instanceClass = type
//       }
//     } else {
//       // 有key，根据key注入
//       if (typeof key === 'function') {
//         // 如果传了个类进来
//         instanceClass = key
//       } else {
//         // 如果传了个字符串进来
//         instanceClass = InjectMap.get(key)
//       }
//     }
//     if (instanceClass) {
//       target[propertyKey] = new instanceClass()

//       // // 获取待注入类上的元数据
//       // const metaData = Reflect.getMetadata(DecoratorKey.Injectable, instanceClass)
//       // // 只有被Injectable或者Controller装饰的才可以被注入
//       // if (
//       //   metaData &&
//       //   metaData?.key &&
//       //   (metaData?.key === DecoratorKey.Injectable || metaData?.key === DecoratorKey.Controller)
//       // ) {
//       //   target[propertyKey] = new instanceClass()
//       // }
//     }
//     Reflect.defineMetadata(
//       DecoratorKey.Autowired,
//       {
//         target,
//         propertyKey,
//         key: DecoratorKey.Autowired,
//       },
//       target,
//     )
//   }
