import type { ElysiaConfig } from 'elysia'
import { DecoratorKey, MethodTyp } from '..'

/**
 * Controller 控制器
 * @param option Elysia的配置
 * @returns
 */
export const Controller =
  (option: ElysiaConfig<string> = {}) =>
  (target: any) => {
    Reflect.defineMetadata(
      DecoratorKey.Controller,
      {
        option,
        key: DecoratorKey.Controller,
      },
      target,
    )
  }
