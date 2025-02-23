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
} from '@mango/core'
import { paramsSchema, querySchema } from './schema'
import { TestServe } from './serve'
import type { Mango } from '@mango/types'
import { t } from 'elysia'

const test = createParameterDecorator(({}) => {
  console.log('okkk')
  return true
})

function LogMethodCalls() {
  return function (target: Function) {
    // 获取类的方法名
    const methodNames = Object.getOwnPropertyNames(target.prototype).filter((name) => name !== 'constructor')

    // 遍历每个方法
    for (const methodName of methodNames) {
      // 保存原始方法的引用
      const originalMethod = target.prototype[methodName]

      // 替换为新的方法
      target.prototype[methodName] = function (...args: any[]) {
        console.log(`Calling method: ${methodName}`)
        // 调用原始方法并返回其结果
        return originalMethod.apply(this, args)
      }
    }
  }
}

@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
@LogMethodCalls()
export default class DemoController {
  @Autowired
  serve: TestServe

  @Get('/login', {
    query: querySchema,
  })
  login({ query }: Mango.Context) {
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
  @test
  test({ query }: Mango.Context<'query', typeof querySchema.static>) {
    console.log('test')
    return query.id
  }

  @Get('')
  index(param: Mango.Context<'redirect', any>) {
    // return 'index'
    return this.serve.serve.name
    // return param
  }

  @Get('/param/:id/:name', {
    params: paramsSchema,
  })
  param(param: Mango.Context<'params', typeof paramsSchema.static>) {
    return param.params
  }

  @WebSocket('/ws', {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  })
  websocket(ws: Mango.WebSocket, message: any) {
    ws.send(message)
  }

  @Cron({
    name: 'task1',
    pattern: '*/20 * * * * *',
  })
  cronTask() {
    console.log('任务1')
  }

  @Get('/stop/task')
  stopTask({ stopCronTask }: Mango.Context) {
    stopCronTask('task1')
    return '停止任务1'
  }
}
