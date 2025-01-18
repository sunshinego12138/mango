import { t } from 'elysia'

export const querySchema = t.Object({
  id: t.Number({ description: '设备id' }),
})

export const paramsSchema = t.Object({
  name: t.String({ description: '名称' }),
  id: t.String({ description: 'id' }),
})
