import Elysia from 'elysia'
import app from '@/app'

let _context: FirstArgType | null = null

/** 提供context支持 */
export const contextMiddleware = new Elysia()
  .onBeforeHandle((data) => {
    console.log('111')
    _context = data as any
  })
  .onAfterHandle((data) => {
    console.log('222')
    _context = null
  })
// 创建一个类型别名来捕获 `app.get` 方法的类型
type AppGetType = typeof app.get
// 使用条件类型和类型推断来提取第二个参数的类型
type SecondArgument<T> = T extends (path: string, handler: infer U) => any ? U : never
// 获取 `app.get` 方法的第二个参数的类型
type GetHandlerType = SecondArgument<AppGetType>
type FirstArgumentType<T> = T extends (arg1: infer A, ...args: any[]) => any ? A : never
type FirstArgType = FirstArgumentType<GetHandlerType>

export function useContext() {
  const store = _context
  if (!store) {
    throw new Error('useContext must be called within a request context')
  }
  return store
}
