import { defineConfig } from 'tsup'
import { cpSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig((options) => ({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  // format: ['esm'],
  dts: true, // 生成类型声明
  sourcemap: false,
  clean: true, // 构建前清理 dist
  minify: true, // 是否压缩
  target: 'node20', // 指定 Node.js 目标版本
  cjsInterop: false,
  external: [
    // 排除 Node 内置模块
    'node:fs',
    'node:path',
    'node:child_process',
    'elysia',
    'prisma',
    '@prisma/client',
  ],
  esbuildOptions(opt) {
    // 添加 Bun 运行时支持
    opt.define = {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }
  },
  // 自动复制 package.json 文件
  async onSuccess() {
    // const { cpSync, readFileSync, writeFileSync, existsSync } = await import('fs')
    // const { resolve } = await import('path')
    cpSync('package.json', 'dist/package.json')
    // 如果存在CHANGELOG.md的话则复制到dist中
    if (existsSync('CHANGELOG.md')) {
      cpSync('CHANGELOG.md', 'dist/CHANGELOG.md')
    }
    if (existsSync('README.md')) {
      cpSync('README.md', 'dist/README.md')
    }

    // 重写package.json
    const pkg = JSON.parse(readFileSync('dist/package.json', 'utf-8'))
    // 将dist/package.json中的name从@mango/xxx改名为mango-xxx
    pkg.name = pkg.name.replace('@mango/', 'mango-')
    // 修改入口
    pkg.main = './index.cjs'
    pkg.module = './index.js'
    pkg.types = './index.d.ts'
    pkg.typings = './index.d.cts'
    pkg.exports = {
      '.': {
        import: './index.js',
        require: './index.cjs',
        default: './index.js',
      },
    }
    pkg.typesVersions = {
      '*': {
        '*': ['./index.d.ts', './index.d.cts'],
      },
    }
    writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2))
  },
}))
