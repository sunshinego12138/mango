import { type Mango } from '@mango/types'
import Elysia from 'elysia'
import { sep, resolve } from 'node:path'
import { globSync } from 'glob'
import { DecoratorKey, type CronMetadata, type MethodMetadata, type WebSocketMetadata } from '..'
import { cron as cronExtends } from '@elysiajs/cron'

/**
 * 加载controller
 * @param options
 * @returns
 */
const controllerLoader = async (options: Mango.MangoStartOptions) => {
  const app = new Elysia()
  // 获取controllerPath下所有的子控制器并注册
  const modules = globSync(resolve(options.controllerPath as string, `.${sep}**${sep}index.ts`), {
    ignore: ['**/node_modules/**'],
    windowsPathsNoEscape: true,
  })
  for (const moduleKey of modules) {
    const module = await import(moduleKey)
    // Controller必须默认导出并且在index.ts中才生效
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
          /** 
           * 挂载方法
           */
          // 挂载到方法上的属性，也就是方法装饰器设置的值
          const methods: MethodMetadata = Reflect.getMetadata(DecoratorKey.Method, Prototype, key)
          // const websocket
          // 只有被方法装饰器装饰的方法才会注册到elysia实例上
          if (methods && methods.key === DecoratorKey.Method && methods.method && typeof methods.fn === 'function') {
            if (methods.customMethod) {
              // 自定义方法
              router.route(methods.customMethod, methods.route, methods.fn, methods.option)
            } else {
              router[methods.method](methods.route, methods.fn, methods.option)
            }
          }

          /** 
           * 挂载websocket方法 
           */
          const websocket: WebSocketMetadata = Reflect.getMetadata(DecoratorKey.WebSocket, Prototype, key)
          if (
            websocket &&
            websocket.key === DecoratorKey.WebSocket &&
            websocket.fn &&
            typeof websocket.fn === 'function'
          ) {
            router['ws'](websocket.route, {
              ...(websocket.option || {}),
              message: websocket.fn,
            })
          }

          /** 挂载cron方法 */
          const cron: CronMetadata = Reflect.getMetadata(DecoratorKey.Cron, Prototype, key)
          if (cron && cron.key === DecoratorKey.Cron && cron.fn && typeof cron.fn === 'function') {
            // router['cron'](cron.route, cron.fn, cron.option)
            router.use(
              cronExtends({
                ...cron.option,
                run: cron.fn as any,
              }),
            )
          }
          app.use(router)
        })
      }
    }
  }
  return app
}

export default controllerLoader
