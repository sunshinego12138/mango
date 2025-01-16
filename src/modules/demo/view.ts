import { Mongo } from '@mongo/types'

export default abstract class DemoService {
  static async queryUserList({ prisma, loadEnv }: Mongo.Context) {
    const users = await prisma.user.findMany()
    return users
  }
}
