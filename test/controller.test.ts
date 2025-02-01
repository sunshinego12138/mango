import { Controller, DecoratorKey, Get, MethodMetadata } from '@mango/core'
import Elysia, { ElysiaConfig } from 'elysia'

@Controller({
  name: '测试模块',
  prefix: '/user',
})
class Test {
  @Get('/login')
  login() {
    return 'login'
  }

  test() {
    return 'abc'
  }
}

const app = new Elysia()

function loadController(app: any) {
  const mockModules = [Test]
  for (const module of mockModules) {
    let data = Reflect.getMetadata(DecoratorKey.Controller, module)
    // 挂载到类上的属性，也就是controller设置的值
    const router: any = new Elysia(data || {})

    const Prototype = module.prototype

    Object.getOwnPropertyNames(Prototype).forEach((key) => {
      // 构造函数去掉
      if (key === 'constructor') {
        return
      }
      // 挂载到方法上的属性，也就是方法装饰器设置的值
      const option: MethodMetadata = Reflect.getMetadata(DecoratorKey.Method, Prototype, key)
      // 只有被方法装饰器装饰的方法才会注册到elysia实例上
      if (option && option.method && typeof option.fn === 'function') {
        router[option.method](option.route, option.fn, option.option)
      }
      app.use(router)
    })
  }
}

loadController(app)

app.listen(3000, ({port}) => {
  console.log('http://localhost:' + port)
})
