import Elysia from 'elysia'

abstract class Base {
  static hi() {
    return 'hello word'
  }
}

const app = new Elysia()
  .get('/', Base.hi)
  .listen(9876)