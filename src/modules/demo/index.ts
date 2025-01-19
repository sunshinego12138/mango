import { Controller, Get, Provider } from '@mongo/core'
import { paramsSchema, querySchema } from './schema'
import { TestServe } from './serve'
import type { Mongo } from '@mongo/types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @Provider()
  serve: TestServe

  @Get('/login', {
    query: querySchema,
  })
  login({ query }: Mongo.Context) {
    return new Response(JSON.stringify(this.serve.serve), {
      status: 200, // HTTP 状态码
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  @Get('/test', {
    query: querySchema,
  })
  test({ query }: Mongo.Context<'query', typeof querySchema.static>) {
    return query.id
  }

  @Get('/param/:id/:name', {
    params: paramsSchema,
  })
  param({ params }: Mongo.Context<'params', typeof paramsSchema.static>) {
    return params
  }
}
