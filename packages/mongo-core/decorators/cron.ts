import type { CronConfig } from '@elysiajs/cron'
import { DecoratorKey } from '.'

export interface CronMetadata {
  key: string
  option: Omit<CronConfig, 'run'>
  fn: Function
}

/**
 * 定时任务装饰器
 * @param option
 * @returns
 */
export const Cron = (option: Omit<CronConfig, 'run'>) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata(
    DecoratorKey.Cron,
    {
      option,
      fn: target[key].bind(target),
      key: DecoratorKey.Cron,
    },
    target,
    key,
  )
}