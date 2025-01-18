import { Elysia, t } from 'elysia'
import DemoService from './view'
import { querySchema } from './schema'
import { type Context, Controller, Get, Provider } from 'packages/mongo-core'
import { TestServe } from './serve'

@Controller()
export default class DemoController {
  @Provider()
  serve: TestServe

  @Get('/login', {
    query: querySchema,
  })
  login({ query }: Context) {
    return new Response(JSON.stringify(this.serve.serve), {
      status: 200, // HTTP 状态码
      headers: {
        'Content-Type': 'application/json', // 设置内容类型为 JSON
      },
    })
  }

  @Get('/test', {
    query: querySchema,
  })
  test({ query }: Context<'query', typeof querySchema.static>) {
    return query.id
  }
}
