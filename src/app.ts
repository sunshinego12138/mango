import Elysia, { InferContext, t, InferHandler } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import demo from './modules/demo'
import db from './common/db'

import Mongo from '@mongo/core'

const app = new Elysia()
  .use(db)
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Elysia SunShine',
          version: '1.0.0',
        },
      },
    }),
  )
  .use(demo)

export default app

export type App = typeof app
export type Context = InferContext<App>
export type Handler = InferHandler<App>