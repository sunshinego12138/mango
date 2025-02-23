import { PrismaClient } from '@prisma/client'

export class PrismaService extends PrismaClient {
  private static instance: PrismaService

  constructor() {
    // 缓存prisma实例，防止重复实例化
    if (PrismaService.instance) {
      return PrismaService.instance as unknown as PrismaService
    }
    super({
      log: ['query'],
    })
    // 保存实例
    PrismaService.instance = this
  }
}
