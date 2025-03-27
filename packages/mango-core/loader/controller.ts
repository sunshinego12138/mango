import type { MangoStartOptions } from '@mango/types'
import Elysia, { type ElysiaConfig } from 'elysia'
import { sep, resolve } from 'node:path'
import { globSync } from 'glob'
import { DecoratorKey, type CronMetadata, type MethodMetadata, type ProxyOption, type WebSocketMetadata } from '..'
import { cron as cronExtends } from '@elysiajs/cron'
import { isBoolean } from '../utils'
import { ProxyLoader } from './proxy'

/**
 * 加载controller
 * @param options
 * @returns
 */
const controllerLoader = async (options: MangoStartOptions) => {
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
      let proxy = Reflect.getMetadata(DecoratorKey.Proxy, module.default)

      // 注册代理转发
      if (proxy && proxy.key === DecoratorKey.Proxy) {
        const instance = new module.default()
        const { proxyURL, headers, ...option }: ElysiaConfig<string> & ProxyOption = proxy.option
        const router = new Elysia({
          ...option,
          prefix: '',
        })
        const nothing = () => {}
        ProxyLoader(
          router,
          option.prefix || '',
          { proxyURL, headers, prefix: option.prefix || '/*' },
          {
            beforeHandle: instance.beforeHandle.bind(instance) || nothing,
            afterHandle: instance.afterHandle.bind(instance) || nothing,
            requestHandle: instance.requestHandle.bind(instance) || nothing
          },
        )
        app.use(router)
      }

      // 注册控制器
      // 需要被Controller装饰器装饰的类才会注册到elysia实例上
      if (controller && controller.key === DecoratorKey.Controller) {
        // 装饰Controller的装饰器
        const controllerBeforeHandler = Reflect.getMetadata(DecoratorKey.BeforeHandle, module.default)
        // 挂载到类上的属性，也就是controller设置的值
        const router: any = new Elysia(controller?.option || {})

        if (
          controllerBeforeHandler &&
          controllerBeforeHandler.key == DecoratorKey.BeforeHandle &&
          controllerBeforeHandler.handler
        ) {
          // 添加请求前置处理
          router.onBeforeHandle(async (parameter: any) => {
            // 避免proxy装饰器代理时，stream被提前消费掉
            const data = parameter
            let res = {}
            const str = controllerBeforeHandler.handler.toString()
            if (str.includes('async') || str.includes('Promise.resolve')) {
              // 是promise的话
              res = await controllerBeforeHandler.handler(data)
            } else {
              res = controllerBeforeHandler.handler(data)
            }
            if (isBoolean(res)) {
              if (!res) {
                return new Response(null, {
                  status: 500,
                })
              }
            } else {
              return res
            }
          })
        }

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
        })
        app.use(router)
      }
    }
  }
  return app
}

export default controllerLoader
