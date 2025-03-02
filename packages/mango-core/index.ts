import cors from '@elysiajs/cors'
import type { MangoStartOptions } from '@mango/types'
import { loadEnv, omit } from '@mango/utils'
import Elysia from 'elysia'
import { Logestic } from 'logestic'
import staticPlugin from '@elysiajs/static'
import controllerLoader from './loader/controller'
import { infoLoader } from './loader/info'
import optionsInit from './loader/options'
import { swaggerLoader } from './loader/swagger'
import { existsSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'

/**
 * 初始化框架
 * @param options
 * @returns
 */
export const init = (options: MangoStartOptions) => {
  optionsInit(options)
  const app = new Elysia(options.ElysiaOption)
    .use(controllerLoader(options))
    .decorate('env', loadEnv())
    .derive(({ store }: any) => {
      return {
        /**
         * 停止定时任务
         * @param taskName 任务名称
         */
        stopCronTask: (taskName: string) => {
          const stopFunc = store?.cron?.[taskName]
          if (stopFunc && stopFunc.stop) {
            stopFunc.stop()
          }
        },
      }
    })
  // serveLoader(options)
  // 输出启动信息
  infoLoader(app, options)
  // 加载swagger文档
  swaggerLoader(app, options)
  // 是否开启cors
  if (options.cors) {
    app.use(cors())
  }
  // 是否开启日志
  if (options.logger?.type) {
    app.use(Logestic.preset(options.logger.type, omit(options.logger, ['type'])))
  }
  // 是否开启静态文件服务
  if (options.static) {
    // 如果不存在options.static.assets文件夹就创建一个
    const assets = options.static.assets || 'public'
    const assetsPath = resolve(process.cwd(), assets)
    if (!existsSync(assetsPath)) {
      try {
        mkdirSync(assetsPath)
      } catch (error) {
        console.error('创建静态文件夹失败', error)
        process.exit(1) // 关键目录创建失败时终止进程
      }
    }
    app.use(
      staticPlugin({
        prefix: '/public',
        assets: 'public',
        ...options.static,
      }),
    )
  }

  return app
}

export default { init }
export * from './decorators'
