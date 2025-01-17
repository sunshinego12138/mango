import { Elysia, t } from 'elysia'
import DemoService from './view'
import { querySchema } from './schema'
import { type Context, Controller, Get } from 'packages/mongo-core'

@Controller()
export default class DemoController {
  @Get('/login', {
    query: querySchema,
  })
  login({ query }: Context) {
    return query
  }

  @Get('/test', {
    query: querySchema,
  })
  test({ query }: Context<'query', typeof querySchema.static>) {
    return query.id
  }
}
