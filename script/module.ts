import { $ } from 'bun'
import { readdir } from 'fs/promises'

// 获取所有子包目录
const packages = await readdir('packages', { withFileTypes: true }).then((dirs) =>
  dirs.filter((d) => d.isDirectory()).map((d) => `packages/${d.name}`),
)

// 并行构建所有包
await Promise.all(
  packages.map(async (pkg) => {
    console.log(`📦 Building ${pkg}...`)

    await $`cd ${pkg} && bun run build`

    // 验证产物
    const checks = [Bun.file(`${pkg}/dist/index.js`), Bun.file(`${pkg}/dist/index.d.ts`)]

    if ((await Promise.all(checks.map((f) => f.exists()))).every(Boolean)) {
      console.log(`✅ ${pkg} built successfully`)
    } else {
      console.error(`❌ ${pkg} build failed`)
      process.exit(1)
    }
  }),
)
