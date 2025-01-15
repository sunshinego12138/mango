import { Elysia, t } from 'elysia'
import DemoService from './view'

const demo = new Elysia({
  prefix: '/user',
})
  .get('/', DemoService.queryUserList, {})
  .get('/id/:id', ({ params, query }) => query)
  .post('/body', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  })

export default demo
