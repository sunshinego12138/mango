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

// 使用装饰器的示例类
@LogMethodCalls()
class Example {
  greet(name: string) {
    return `Hello, ${name}!`
  }

  farewell(name: string) {
    return `Goodbye, ${name}!`
  }
}

// 测试
const example = new Example()
console.log(example.greet('Alice'))
// console.log(example.farewell('Bob'))
