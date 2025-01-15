import app from '@/app'
import { Context, DefinitionBase, InputSchema, MergeSchema, UnwrapRoute } from 'elysia'
import { EphemeralType, MetadataBase, RouteSchema, SingletonBase } from 'elysia/dist/types'
import { Path } from 'typescript'
import { Diff } from './tools'

interface Definitions extends DefinitionBase {
  type: {}
  error: {}
}

interface LocalSchema extends InputSchema<keyof Definitions['type'] & string> {}
interface Metadata extends MetadataBase {
  schema: {}
  macro: {}
}
interface Ephemeral extends EphemeralType {
  derive: {}
  resolve: {}
  schema: {}
}
interface Volatile extends EphemeralType {
  derive: {}
  resolve: {}
  schema: {}
}

export interface Schema
  extends MergeSchema<
    UnwrapRoute<LocalSchema, Definitions['type']>,
    Metadata['schema'] & Ephemeral['schema'] & Volatile['schema']
  > {}

// 创建一个类型别名来捕获 `app.get` 方法的类型
type AppGetType = typeof app.get
// 使用条件类型和类型推断来提取第二个参数的类型
type SecondArgument<T> = T extends (path: string, handler: infer U) => any ? U : never
// 获取 `app.get` 方法的第二个参数的类型
type GetHandlerType = SecondArgument<AppGetType>
type FirstArgumentType<T> = T extends (arg1: infer A, ...args: any[]) => any ? A : never
export type FirstArgType = FirstArgumentType<GetHandlerType>


interface _ContextType extends Context<RouteSchema, SingletonBase, Path> { }
type typeContextType = _ContextType

/** 请求的参数 */
export type ContextType = _ContextType & FirstArgType

export type ElysiaModule = Diff<ContextType, typeContextType>


let a: _ContextType
let b: FirstArgType
let c: Omit<FirstArgType, 'body'>
let d: ElysiaModule

type A = {
  commonProp1: string;
  commonProp2: number;
};

type B = {
  commonProp1: string;
  commonProp2: number;
  uniqueToB1: boolean;
  uniqueToB2: string[];
};

type BMinusA = Diff<B, A>