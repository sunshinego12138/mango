import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  All,
  Option,
  Patch,
  Custom,
  Autowired,
  WebSocket,
  Cron,
  createParameterDecorator,
  Proxy
} from '@mango/core'
import { paramsSchema, querySchema } from './schema'
import { TestServe } from './serve'
import type { Context, WebSocketContext } from '@mango/types'
import { t } from 'elysia'

const Logger = createParameterDecorator(async ({ query }) => {
  return true
})

@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
@Logger
export default class DemoController {
  @Autowired
  serve: TestServe

  @Get('/login', {
    query: querySchema,
  })
  login({ query }: Context) {
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
  test({ query }: Context<'query', typeof querySchema.static>) {
    return this.serve.test
  }

  @Get('')
  index(param: Context<'redirect', any>) {
    // return 'index'
    return this.serve.serve.name
    // return param
  }

  @Get('/param/:id/:name', {
    params: paramsSchema,
    
  })
  param(param: Context<'params', typeof paramsSchema.static>) {
    return param.params
  }

  @WebSocket('/ws', {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  })
  websocket(ws: WebSocketContext, message: any) {
    ws.send(message)
  }

  // @Cron({
  //   name: 'task1',
  //   pattern: '*/20 * * * * *',
  // })
  // cronTask() {
  //   console.log('任务1')
  // }

  // @Get('/stop/task')
  // stopTask({ stopCronTask }: Context) {
  //   stopCronTask('task1')
  //   return '停止任务1'
  // }
}
