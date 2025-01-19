import { Prisma } from '@/db'
import { UserSchema } from './user.schema'
import { Provider } from '@mongo/core'

export class UserService {
  @Provider()
  prisma: Prisma

  async getList(query: typeof UserSchema.static) {
    return await this.prisma.user.findMany({
      where: {
        ...query,
      },
    })
  }
}
