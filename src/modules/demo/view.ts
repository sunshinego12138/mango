import {Mongo} from '@mongo/types'

export default abstract class DemoService {
  static async queryUserList({ db, loadEnv }: Mongo.Context) {
    const users = await db.user.findMany()
    return users
  }
}
