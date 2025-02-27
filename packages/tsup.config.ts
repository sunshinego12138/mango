import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['index.ts'],
  format: ['esm', 'cjs'], // 同时生成 ESM 和 CJS
  dts: true, // 生成类型声明
  sourcemap: true, // 按需启用
  clean: true, // 构建前清理 dist
  minify: false, // 后端项目通常不需要压缩
  target: 'node18', // 指定 Node.js 目标版本
  platform: 'node', // 明确指定为 Node 环境
  external: [
    // 排除 Node 内置模块
    'node:fs',
    'node:path',
    'node:child_process',
    'elysia',
  ],
  esbuildOptions(opt) {
    // 添加 Bun 运行时支持
    opt.define = {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }
  },
  // 自动复制 package.json 文件
  async onSuccess() {
    const { cpSync } = await import('fs')
    cpSync('package.json', 'dist/package.json')
  },
}))
