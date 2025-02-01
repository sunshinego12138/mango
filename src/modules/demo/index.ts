import { Controller, Get, Autowired, WebSocket, Cron } from '@mongo/core'
import { paramsSchema, querySchema } from './schema'
import { TestServe } from './serve'
import type { Mongo } from '@mongo/types'
import { t } from 'elysia'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @Autowired()
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

  @Get('')
  index(param: Mongo.Context<'redirect', any>) {
    // return 'index'
    // return this.serve.test
    return param
  }

  @Get('/param/:id/:name', {
    params: paramsSchema,
  })
  param(param: Mongo.Context<'params', typeof paramsSchema.static>) {
    return param.params
  }

  @WebSocket('/ws', {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  })
  websocket(ws: Mongo.WebSocket, message: any) {
    ws.send(message)
  }

  @Cron({
    name: 'task1',
    pattern: '* * */5 * * *',
  })
  cronTask() {
    console.log('任务1')
  }

  @Get('/stop/task')
  stopTask({ stopCronTask }: Mongo.Context) {
    stopCronTask('task1')
    return '停止任务1'
  }
}
