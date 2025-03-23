import Elysia from 'elysia'
import chalk from 'chalk'
import { createLogger, format, transports, Logger as _Logger, type LeveledLogMethod } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// 自定义元数据类型
interface LogMetadata {
  [key: string]: unknown
  error?: Error
}

// 扩展 Winston 的 LogMethod 接口
interface TypedLogMethod {
  (message: string, meta?: LogMetadata): _Logger
}

// 合并到 Logger 接口
interface TypedLogger extends _Logger {
  error: LeveledLogMethod
  warn: LeveledLogMethod
  info: LeveledLogMethod
  debug: LeveledLogMethod
}
const getDateTimeString = (time: string) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return chalk.gray(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`)
}
const { combine, timestamp, printf, colorize, errors, json } = format
// 控制台输出的自定义格式
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : ''
  const stackString = stack ? `\n${stack}` : ''
  // return `[${level}] ${getDateTimeString(timestamp as any)} ${message}${metaString}${stackString}`
  return `[${level}] ${getDateTimeString(timestamp as any)} ${message}${metaString}${stackString}`
})

const getEnv = () => {
  if (typeof process !== 'undefined') {
    return process.env.NODE_ENV || 'development'
  }
  // 兜底
  return 'development'
}

// 创建日志记录器
export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
      silent: getEnv() === 'production', // 生产环境不输出到控制台
    }),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({
    //   filename: 'combined.log',
    // }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '2m', // 2MB
      maxFiles: '14d', // 保留14天
      zippedArchive: true, // 自动压缩旧日志
      auditFile: '.audit.json', // 轮转审计文件
    }),
  ],
}) as TypedLogger

export const Logger = new Elysia()
  .onRequest(({ request }) => {
    logger.info(`${chalk.green(request.method)} ${chalk.green(request.url)}`)
  })
  .onError({ as: 'global' }, ({ request, error, code }) => {
    error instanceof Error
      ? logger.error(`${chalk.red(request.method)} ${chalk.red(request.url)} ${chalk.red(JSON.stringify(error))}`)
      : logger.error(`${chalk.red(request.method)} ${chalk.red(request.url)} ${chalk.red(error)}`)
  })
