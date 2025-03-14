import type { MangoStartOptions } from '@mango/types'
import { resolve, sep } from 'node:path'

/**
 * 初始化配置
 * @param options
 */
const optionsInit = (options: MangoStartOptions) => {
  options.name = options.name || 'Mango Elysia'
  options.version = options.version || '1.0.0'
  options.ElysiaOption = options.ElysiaOption || {}
  options.baseDir = process.cwd()
  options.businessPath = resolve(options.baseDir || '', `.${sep}${options.businessPath || 'src'}`)
  options.controllerPath = resolve(options.businessPath, `.${sep}${options.controllerPath || 'modules'}`)
  return options
}

export default optionsInit
