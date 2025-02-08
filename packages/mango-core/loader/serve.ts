import { type Mango } from '@mango/types'
import Elysia from 'elysia'
import { sep, resolve } from 'node:path'
import { globSync } from 'glob'
import { DecoratorKey, type MethodMetadata } from '..'
import { isClass } from '@mango/utils'

/**
 * 加载被注入的serve
 * @param options
 * @returns
 */
const serveLoader = async (options: Mango.MangoStartOptions) => {
  // 获取businessPath下所有的服务并注册
  const modules = globSync(resolve(options.businessPath as string, `.${sep}**${sep}*.ts`), {
    ignore: ['**/node_modules/**'],
    windowsPathsNoEscape: true,
  })
  for (const moduleKey of modules) {
    const module = await import(moduleKey)
    Object.keys(module).forEach((key) => {
      if (isClass(module[key])) {
        let injectable = Reflect.getMetadata(DecoratorKey.Injectable, module[key])
        let controller = Reflect.getMetadata(DecoratorKey.Controller, module[key])

        if (injectable && injectable.key === DecoratorKey.Injectable) {
          // 需要被Injectable装饰的类才可以
          const Prototype = module[key].prototype

          Object.getOwnPropertyNames(Prototype).forEach((key) => {
            // 构造函数去掉
            if (key === 'constructor') {
              return
            }
            const injectableItem = Reflect.getMetadata('design:type', Prototype, key)
            if (injectableItem && isClass(injectableItem) && injectableItem.name !== 'Function') {
              Prototype[key] = new injectableItem()
            }
          })
        }

        if (controller && controller.key === DecoratorKey.Controller) {
          // 需要被Controller装饰的类才可以
          const Prototype = module[key].prototype
          Object.getOwnPropertyNames(Prototype).forEach((key) => {
            // 构造函数去掉
            if (key === 'constructor') {
              return
            }
            const controllerItem = Reflect.getMetadata('design:type', Prototype, key)
            if (controllerItem && isClass(controllerItem) && controllerItem.name !== 'Function') {
              // console.log('controllerItem', key, controllerItem.name)
              Prototype[key] = new controllerItem()
            }
          })
        }
      }
    })
  }
}

export default serveLoader
