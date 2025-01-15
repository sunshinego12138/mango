import { type Mongo } from '@mongo/types'
import Elysia from 'elysia'
import { sep, resolve } from 'path'
import { globSync } from 'glob'

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
  for (const module of modules) {
    const mod = await import(module)
    app.use(mod.default)
  }
  return app
}

export default controllerLoader
