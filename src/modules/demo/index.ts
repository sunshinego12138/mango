import { Elysia, t } from 'elysia'
import DemoService from './view'
import { querySchema } from './schema'

const demo = new Elysia({
  prefix: '/user',
  name: '测试模块',
})
  .get('/', DemoService.queryUserList, {})
  .get(
    '/id/:id',
    ({ params, query }) => {
      return params
    },
    {
      params: querySchema,
    },
  )
  .post('/body', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  })

export default demo
