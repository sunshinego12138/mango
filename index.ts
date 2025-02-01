import MongoCore from '@mongo/core'
import { InferContext } from 'elysia'

const app = MongoCore.init({
  businessPath: 'src',
  controllerPath: 'modules',
  name: 'Mongo elysia',
  version: '1.0.0',
  swagger: {},
}).listen(8899)

export type Context = InferContext<typeof app>
