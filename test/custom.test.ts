function example1(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('example1 executed');
  // 可以在这里修改 descriptor.value 或其他操作
}

function logFirstParameterAndModifyReturn(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // 保存原始方法

  descriptor.value = function (...args: any[]) {
      const firstParameter = args[0];
      console.log(`第一个参数: ${firstParameter}`);
      
      const result = originalMethod.apply(this, args);
      const modifiedResult = `Modified: ${result}`;
      return modifiedResult;
  };

  return descriptor;
}

class Test {
  @example1
  @logFirstParameterAndModifyReturn
  index() {
      return 'ok';
  }
}

// 使用示例
const testInstance = new Test();
const result = testInstance.index();
console.log(result); // 输出: Modified: ok