// 创建工厂
import type { ElysiaConfig } from 'elysia'
import 'reflect-metadata'
import { DecoratorKey, type ThirdParameterType } from '..'

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
  return (route: string, option: ThirdParameterType = {}) => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      Reflect.defineMetadata(
        DecoratorKey.Method,
        {
          method,
          key: DecoratorKey.Method,
          route,
          option,
          fn: descriptor.value,
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
