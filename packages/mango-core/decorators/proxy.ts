import type { ThirdParameterType } from '@mango/types'
import { DecoratorKey } from '.'
import type { ElysiaConfig } from 'elysia'

export type ProxyOption = {
  /** 代理路径 */
  proxyURL: string
  /** 请求头附加参数 */
  headers?: Record<string, any>
  prefix?: string | string[]
}

export interface ProxyInstance {
  beforeHandle?: (request: Request) => any
  afterHandle?: (context: Record<string, any>) => any
  requestHandle?: (data: any, context: Record<string, any>) => any
}

/**
 * Controller 转发代理
 * @param option 转发代理的配置
 * @returns
 */
export const Proxy = (option: ElysiaConfig<string> & ProxyOption) => (target: any) => {
  Reflect.defineMetadata(
    DecoratorKey.Proxy,
    {
      option,
      key: DecoratorKey.Proxy,
    },
    target,
  )
}
