import { Autowired, createParameterDecorator, Proxy, ProxyInstance } from '@mango/core'

// const Logger = createParameterDecorator(async ({ query }) => {
//   return true
// })

class TestServer {
  age = 18
}

@Proxy({
  prefix: 'proxy/v1/*',
  proxyURL: process.env.OPENAI_URL as string,
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_KEY}`,
  },
})
export default class ProxyController implements ProxyInstance {
  @Autowired
  serve: TestServer

  beforeHandle(request: Request) {
    console.log('before')
  }
  afterHandle(context: Record<string, any>) {
    console.log('after', context)
  }
  requestHandle(data: any, context: any) {
    context.count = context.count || 0
    context.count += 1
    console.log(context)
    return {
      ...data,
      test: 1,
    }
  }
}
