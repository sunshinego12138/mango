import { PrismaClient } from '@prisma/client'

export class Prisma extends PrismaClient {
  constructor() {
    super({
      log: ['query'],
    })
  }
}
