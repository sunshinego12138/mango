// 创建工厂
import type { ElysiaConfig } from 'elysia'
import 'reflect-metadata'
import { DecoratorKey } from '..'
import type { Mongo } from '@mongo/types'
import type { CronConfig } from '@elysiajs/cron'

// 请求装饰器元数据类型
export interface MethodMetadata {
  method: MethodTyp
  key: string
  // option: ThirdParameterType
  option: Mongo.ThirdParameterType
  route: string
  fn: Function
}

export interface WebSocketMetadata {
  key: string
  option: Mongo.WebSocketMethodType
  route: string
  fn: Function
}

// 请求类型
export enum MethodTyp {
  Get = 'get',
  POST = 'post',
  OPTIONS = 'options',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  ALL = 'all',
}

const method = (method: any) => {
  return (route: string, option: Mongo.ThirdParameterType = {}) => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      Reflect.defineMetadata(
        DecoratorKey.Method,
        {
          method,
          key: DecoratorKey.Method,
          route,
          option,
          fn: target[key].bind(target),
          // fn: descriptor.value.bind(target),
        },
        target,
        key,
      )
    }
  }
}

/**
 * 创建一个get请求
 * @param route 路由路径
 */
export const Get = method(MethodTyp.Get)

/**
 * 创建一个post请求
 * @param route 路由路径
 */
export const Post = method(MethodTyp.POST)

/**
 * 创建一个put请求
 * @param route 路由路径
 */
export const Put = method(MethodTyp.PUT)

/**
 * 创建一个patch请求
 * @param route 路由路径
 */
export const Patch = method(MethodTyp.PATCH)

/**
 * 创建一个delete请求
 * @param route 路由路径
 */
export const Delete = method(MethodTyp.DELETE)

/**
 * 创建一个all请求
 * @param route 路由路径
 */
export const All = method(MethodTyp.ALL)

/**
 * WebSocket装饰器
 * @param route
 * @param option
 * @returns
 */
export const WebSocket =
  (route: string, option: Omit<Mongo.WebSocketMethodType, 'message'> = {}) =>
  (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      DecoratorKey.WebSocket,
      {
        option,
        route,
        fn: target[key].bind(target),
        key: DecoratorKey.WebSocket,
      },
      target,
      key,
    )
  }

