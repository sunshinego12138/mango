import { Injectable, Provider } from "packages/mongo-core";

// @Injectable()
export class TestServe {

  @Provider()
  serve: Server2

  test: string = 'test'

  app() {
    console.log(this.serve.name)
    return '123'
  }
}

export class Server2 {
  age: number = 18
  name: string = '张三'
}