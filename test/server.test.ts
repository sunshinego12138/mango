import { DecoratorKey, Injectable, Autowired } from '@mango/core'

// @Injectable('test')
class Serve {
  age: number = 1
  name: string = '张三'
}

class Serve2 {
  age: number = 2
  name: string = '李四'
}

@Injectable()
class Test {
  @Autowired()
  server: Serve

  @Autowired()
  server2: Serve2

  age: number = 1
  test() {
    console.log('this.server', this.server)
    return 'ok'
  }
}

function loadServer() {
  const mockModules = [Test]
  for (const module of mockModules) {
    let data = Reflect.getMetadata(DecoratorKey.Injectable, module)
    // 只有被Controller或者Injectable装饰的类才可以注入
    if (data && data.key && (data.key === DecoratorKey.Controller || data.key === DecoratorKey.Injectable)) {
    }
  }
}

loadServer()

const a = new Test()
a.test()
