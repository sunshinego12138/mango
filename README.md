# Mango

![npm downloads](https://img.shields.io/npm/dm/mango-core)
[![GitHub stars](https://img.shields.io/github/stars/sunshinego12138/mango?style=social)](https://github.com/sunshinego12138/mango)
[![GitHub forks](https://img.shields.io/github/forks/sunshinego12138/mango?style=social)](https://github.com/sunshinego12138/mango)



[![国内文档](https://img.shields.io/badge/国内文档-docs-ff0000?style=flat-square&logo=China)](http://sunshinego.top/mango-docs)
[![外网文档](https://img.shields.io/badge/外网文档-docs-007bff?style=flat-square&logo=globe)](https://sunshinego12138.github.io/mango-docs)


## 简介

**Mango** 是一个轻量级、高性能的 Web 框架，在`Elysia`的基础上进行的二次开发。它在既拥有智能类型提示的情况下又提供了一套完整的mvc开发方式

## 特性

- **高性能**：基于 Bun 的高效运行时，提供卓越的性能。
- **简单易用**：直观的 API 设计，让开发者可以快速上手。
- **生态**：基于Elysia改造而来，完全适配Elysia的插件、中间件、生态。
- **内置路由**：灵活的路由系统，支持动态路由和中间件。
- **TypeScript 支持**：内置对 TypeScript 的支持，提升开发体验。
- **支持 WebSocket**：轻松实现WebSocket功能。
- **支持 Cron**：轻松实现定时任务功能。

## 安装

```bash
bun add mango-core mango-types
```

## 快速开始

以下是一个使用 Mango 构建基本 Web 服务器的示例：

```typescript

import { Controller, Get} from 'mango-core'
import type { Context } from 'mango-types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @Get('/test')
  login(data: Context) {
    return 'Hello Word!'
  }
}
```

## 依赖注入
```typescript
import { Controller, Get} from 'mango-core'
import type { Context } from 'mango-types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {

  @Get()
  test(store: Context) {
    
  }
}
```

## 路由

Mango 提供了一个简单的路由系统，以下是一些常用的路由示例：

> 支持Get, Post, Put, Delete, All, Option, Patch, Custom请求
> 
> 其中被All装饰会命中所有的请求
> 
> Custom装饰器则是自定义请求方法

```typescript
import { Controller, Get, Post, Put, Delete, All, Option, Patch, Custom} from 'mango-core'
import type { Context } from 'mango-types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @Get('/test')
  test1(data: Context) {
    return 'Hello Word!'
  }

  @Post('/test')
  test2(data: Context) {
    return 'Hello Word!'
  } 
}
```

## 定时任务
> 基于`@elysiajs/cron`封装

```typescript
import { Controller, Get, Cron} from 'mango-core'
import type { Context } from 'mango-types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @Cron({
    name: 'task1',
    pattern: '*/20 * * * * *',
  })
  cronTask() {
    console.log('任务1')
  }

  @Get('/stop/task')
  stopTask({ stopCronTask }: Context) {
    stopCronTask('task1')
    return '停止任务1'
  }
}
```

## WebSocket
```typescript
import { Controller, WebSocket} from 'mango-core'
import type { WebSocketContext } from 'mango-types'
@Controller({
  name: '测试模块',
  prefix: '/test',
  detail: {
    description: '这是一段测试模块的备注',
    tags: ['测试'],
  },
})
export default class DemoController {
  @WebSocket('/ws', {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  })
  websocket(ws: WebSocketContext, message: any) {
    ws.send(message)
  }
}
```

## 自定义装饰器
> 注意，自定义装饰器必须在请求装饰器下面
```typescript
import { Controller, Get, Post, Put, Delete, All, Option, Patch, Custom} from 'mango-core'
import type { Context } from 'mango-types'
import { createParameterDecorator, HttpStatus, JsonResponse } from 'mango-core'

const test = createParameterDecorator<{
  body: any
}>((context) => {
  if (!context.body.name) {
    return JsonResponse(
      {
        code: HttpStatus.BAD_REQUEST,
        msg: '缺少名字',
      },
      HttpStatus.BAD_REQUEST,
    )
  }
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
export default class DemoController {
  @Post('/test')
  @test
  test1(data: Context) {
    return 'Hello Word!'
  }
}
```


## 贡献

欢迎贡献

## 许可证

该项目采用 MIT 许可证
