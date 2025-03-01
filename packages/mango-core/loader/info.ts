import type { App, MangoStartOptions } from '@mango/types'
import { sep } from 'node:path'

/**
 * 程序启动时输入信息
 * @param app
 * @param options
 */
export const infoLoader = (app: App, options: MangoStartOptions) => {
  app.onStart(({ server }) => {
    const logo = `
  __  __                                _           _             _             _           _ 
 |  \\/  | __ _ _ __   __ _  ___     ___| |_   _ ___(_) __ _   ___| |_ __ _ _ __| |_ ___  __| |
 | |\\/| |/ _\` | '_ \\ / _\` |/ _ \\   / _ \\ | | | / __| |/ _\` | / __| __/ _\` | '__| __/ _ \\/ _\` |
 | |  | | (_| | | | | (_| | (_) | |  __/ | |_| \\__ \\ | (_| | \\__ \\ || (_| | |  | ||  __/ (_| |
 |_|  |_|\\__,_|_| |_|\\__, |\\___/   \\___|_|\\__, |___/_|\\__,_| |___/\\__\\__,_|_|   \\__\\___|\\__,_|
                     |___/                |___/                                                              
    `
    console.log(logo)
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
      console.log(`🐑 Swagger UI: ${server?.url}${options.swagger.path || 'swagger'}`)
    }
    console.log(`🦊【${options.name}】running at ${server?.url}`)
  })
}
