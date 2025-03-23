import MongoCore, { logger } from '@mango/core'
import { InferContext } from 'elysia'

const app = MongoCore.init({
  businessPath: 'src',
  controllerPath: 'modules',
  name: 'Mango elysia',
  version: '1.0.0',
  swagger: {},
  static: {},
  logger: true
})
  .onBeforeHandle(({}) => {})
  .listen(8899)

export type Context = InferContext<typeof app>
