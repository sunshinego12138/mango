import type { Mongo } from '@mango/types'
import { resolve, sep } from 'path'

/**
 * 初始化配置
 * @param options
 */
const optionsInit = (options: Mongo.MongoStartOptions) => {
  options.name = options.name || 'Mongo Elysia'
  options.version = options.version || '1.0.0'
  options.baseDir = process.cwd()
  options.businessPath = resolve(options.baseDir || '', `.${sep}${options.businessPath || 'src'}`)
  options.controllerPath = resolve(options.businessPath, `.${sep}${options.controllerPath || 'modules'}`)
  return options
}

export default optionsInit
