import { type Mongo } from '@mongo/types'
import Elysia from 'elysia'
import { sep, resolve } from 'path'
import { globSync } from 'glob'
import { DecoratorKey, type MethodMetadata } from '..'

/**
 * 加载controller
 * @param options
 * @returns
 */
const controllerLoader = async (options: Mongo.MongoStartOptions) => {
  const app = new Elysia()
  // 获取controllerPath下所有的子控制器并注册
  const modules = globSync(resolve(options.controllerPath as string, `.${sep}**${sep}index.ts`), {
    ignore: ['**/node_modules/**'],
    windowsPathsNoEscape: true,
  })
  for (const moduleKey of modules) {
    const module = await import(moduleKey)
    // 有默认导出才可以
    if (module.default) {
      let controller = Reflect.getMetadata(DecoratorKey.Controller, module.default)
      // 注册控制器
      // 需要被Controller装饰器装饰的类才会注册到elysia实例上
      if (controller && controller.key === DecoratorKey.Controller) {
        // 挂载到类上的属性，也就是controller设置的值
        const router: any = new Elysia(controller?.option || {})

        const Prototype = module.default.prototype

        Object.getOwnPropertyNames(Prototype).forEach((key) => {
          // 构造函数去掉
          if (key === 'constructor') {
            return
          }
          // 挂载到方法上的属性，也就是方法装饰器设置的值
          const option: MethodMetadata = Reflect.getMetadata(DecoratorKey.Method, Prototype, key)
          // 只有被方法装饰器装饰的方法才会注册到elysia实例上
          if (option && option.key === DecoratorKey.Method && option.method && typeof option.fn === 'function') {
            router[option.method](option.route, option.fn, option.option)
          }
          app.use(router)
        })
      }
    }
  }
  return app
}

export default controllerLoader
