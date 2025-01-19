import { t } from 'elysia'

export const UserSchema = t.Object({
  name: t.String({
    description: '用户名',
  }),

  age: t.Number({
    description: '年龄',
  }),

  email: t.String({
    description: '邮箱',
  }),
})

export const DeleteUserSchema = t.Object({
  id: t.String({
    description: '用户id',
  }),
})
