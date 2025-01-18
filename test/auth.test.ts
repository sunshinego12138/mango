import 'reflect-metadata'

const INJECTABLE_METADATA_KEY = Symbol('injectable')

function Injectable() {
  return function (target: Function) {
    // 将 Injectable 标记为 true
    target[INJECTABLE_METADATA_KEY] = true
  }
}

function Provider() {
  return function (target: any, propertyKey: string) {
    const classConstructor = target.constructor

    // 检查当前类是否被 Injectable 装饰
    const isInjectable = classConstructor[INJECTABLE_METADATA_KEY]

    console.log('isInjectable', isInjectable)

    // 这里可以定义其他 Provider 的逻辑，比如依赖注入等
    // 例如，可以将 Provider 的信息存储在元数据中
  }
}

// 示例类
@Injectable()
class Test {
  @Provider()
  server: Serve

  @Provider()
  server2: Serve2

  age: number = 1

  test() {
    console.log('this.server', this.server)
    return 'ok'
  }
}

// 示例类
class Serve {}
class Serve2 {}
