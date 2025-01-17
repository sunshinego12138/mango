import { t } from 'elysia'

export const querySchema = t.Object({
  id: t.Number({ description: '设备id' }),
})