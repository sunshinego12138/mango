import type { ElysiaConfig } from 'elysia'
import 'reflect-metadata'
import type { ThirdParameterType } from '..'

// 装饰器类型
export enum DecoratorKey {
  Controller = 'controller',
  Method = 'method',
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

// 请求装饰器元数据类型
export interface MethodMetadata {
  method: MethodTyp
  key: string
  option: ThirdParameterType
  route: string
  fn: Function
}

/**
 * controller 只用于收集路由前缀
 * @param name 一般为文件名全小写，使用controller[name]能访问到该方法
 * @param prefix 路径前缀，选填，默认为`/${name}`
 * @returns
 */
export const Controller = (option: ElysiaConfig<string, false> = {}) => (target: any) => {
  Reflect.defineMetadata(DecoratorKey.Controller, {
    option,
    key:DecoratorKey.Controller 
  }, target)
}

// 创建工厂
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