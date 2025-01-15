import type { Mongo } from '@mongo/types'
import { sep } from 'path'
import figlet from 'figlet'

/**
 * 程序启动时输入信息
 * @param app
 * @param options
 */
export const infoLoader = (app: Mongo.App, options: Mongo.MongoStartOptions) => {
  const logo = figlet.textSync(`${options.name?.replace(/[\u4e00-\u9fa5]/g, '')}   started`)
  console.log(logo)
  app.onStart(({ server }) => {
    console.log(`version ${options.version}`)
    console.log('')
    console.log(`-- [start] name: ${options.name}`)
    console.log(`-- [start] env: ${process.env._ENV}`)
    console.log(`-- [start] version: ${options.version}`)
    console.log(`-- [start] baseDir: ${options.baseDir}`)
    console.log(`-- [start] businessPath: ${options.businessPath?.split(sep).slice(-1)}`)
    console.log(`-- [start] controllerPath: ${options.controllerPath?.split(sep).slice(-2).join('/')}`)
    console.log('')
    if (options.swagger) {
      console.log(`🐑 Swagger UI: http://localhost:8000${options.swagger.path || '/swagger'}`)
    }
    console.log(`🦊【${options.name}】running at ${server?.url}`)
  })
}
