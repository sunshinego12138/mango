import { Prisma } from '@/prisma'
import { UserSchema } from './user.schema'
import { Autowired } from '@mango/core'

export class UserService {
  @Autowired()
  prisma: Prisma

  async getList(query: typeof UserSchema.static) {
    return await this.prisma.user.findMany({
      where: {
        ...query,
      },
    })
  }
}
