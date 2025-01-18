import { Elysia, t } from 'elysia'
import DemoService from './view'
import { paramsSchema, querySchema } from './schema'
import { type Context, Controller, Get, Provider } from '@mongo/core'
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

  @Get('/param/:id/:name', {
    params: paramsSchema
  })
  param({ params }: Context<'params', typeof paramsSchema.static>) {
    return params
  }
}

