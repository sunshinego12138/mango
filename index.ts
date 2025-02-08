import cron from '@elysiajs/cron'
import MongoCore from '@mango/core'
import { InferContext } from 'elysia'

MongoCore.init({
  businessPath: 'src',
  controllerPath: 'modules',
  name: 'Mango elysia',
  version: '1.0.0',
  swagger: {},
}).listen(8899)
