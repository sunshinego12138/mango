const { $ } = Bun
import { readdir, mkdir, copyFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

async function copyNodeFiles() {
  const sourceDir = 'node_modules/.prisma/client'
  const targetDir = 'dist/.prisma/client'

  // 只有生成了prisma的client才复制
  if (!existsSync(sourceDir)) {
    return
  }
  try {
    // 创建目标目录（如果不存在）
    await mkdir(targetDir, { recursive: true })
    const files = await readdir(sourceDir)
    for (const file of files) {
      if (file.endsWith('.node') || file === 'schema.prisma') {
        const sourceFilePath = join(sourceDir, file)
        const targetFilePath = join(targetDir, file)
        await copyFile(sourceFilePath, targetFilePath)
      }
    }
  } catch (error) {
    console.error('发生错误:', error)
  }
}

async function main() {
  await $`bun run build:linux`
  await copyNodeFiles()
}

main()
