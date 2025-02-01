import { Controller, Delete, Get, Post, Autowired, Put } from '@mango/core'
import type { Mongo } from '@mango/types'
import { DeleteUserSchema, UserSchema } from './user.schema'
import { t } from 'elysia'
import { UserService } from './user.service'

@Controller({
  name: '用户',
  prefix: '/user',
  detail: {
    tags: ['用户'],
  },
})
export default class UserController {
  @Autowired
  serve: UserService

  @Get('/list', {
    query: t.Partial(UserSchema),
    detail: {
      description: '获取用户列表',
    },
  })
  async getList({ query }: Mongo.Context<'query', typeof UserSchema.static>) {
    return await this.serve.getList(query)
    // return await prisma.user.findMany({
    //   where: {
    //     ...query,
    //   },
    // })
  }

  @Post('/create', {
    body: UserSchema,
    detail: {
      description: '添加用户',
    },
  })
  async add({ prisma, body }: Mongo.Context<'body', typeof UserSchema.static>) {
    const res = await prisma.user.create({
      data: body,
    })
    return res
  }

  @Delete('/delete/:id', {
    params: DeleteUserSchema,
    detail: {
      description: '删除用户',
    },
  })
  async delete({ prisma, params }: Mongo.Context<'params', typeof DeleteUserSchema.static>) {
    const res = await prisma.user.delete({
      where: {
        id: params.id,
      },
    })
    return res
  }

  @Put('/update:id', {
    params: DeleteUserSchema,
    body: UserSchema,
    detail: {
      description: '更新用户',
    },
  })
  async update({
    prisma,
    params,
    body,
  }: Mongo.Merge<
    Mongo.Context,
    {
      body: typeof UserSchema.static
      params: typeof DeleteUserSchema.static
    }
  >) {
    const res = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: body,
    })
    return res
  }
}
