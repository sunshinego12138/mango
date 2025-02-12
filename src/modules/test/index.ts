import { Controller, Get, Post, Put, Delete, All, Option, Patch, Custom, Autowired, WebSocket, Cron } from '@mango/core'
import type { Mango } from '@mango/types'
import { t } from 'elysia'
const test1 = t.Object({
  id1: t.Optional(t.String()),
})

const test2 = t.Object({
  id2: t.Optional(t.String()),
})
const test3 = t.Object({
  id3: t.Optional(t.String()),
})
const test4 = t.Object({
  id4: t.Optional(t.String()),
})
const test5 = t.Object({
  id5: t.Optional(t.String()),
})

const test6 = t.Object({
  id6: t.Optional(t.String()),
})
@Controller({
  name: 'abc',
  prefix: '/abc',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['abc'],
  },
})
export default class DemoController {
  // @Get('/test1', {
  //   query: test1,
  // })
  // test() {
  //   return 'test1'
  // }

  @Get('/test2', {
    query: test2,
  })
  test2() {
    return 'test2'
  }

  @Post('/test3', {
    body: test3,
  })
  test3() {
    return 'test3'
  }
  
  @Post('/test4', {
    body: test4,
  })
  test4() {
    return 'test4'
  }

  @Post('/test5', {
    body: test5,
  })
  test5() {
    return 'test5'
  }
  
  @Post('/test6', {
    query: test6
  })
  test6() {
    return 'test6'
  }
}
