import type { ElysiaConfig } from 'elysia'
import { DecoratorKey, MethodTyp, type ThirdParameterType } from '..'

// 请求装饰器元数据类型
export interface MethodMetadata {
  method: MethodTyp
  key: string
  option: ThirdParameterType
  route: string
  fn: Function
}

/**
 * Controller 控制器
 * @param option Elysia的配置
 * @returns
 */
export const Controller =
  (option: ElysiaConfig<string, false> = {}) =>
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
