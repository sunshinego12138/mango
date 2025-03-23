import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const type = readFileSync('dist/index.d.ts', 'utf-8')
const ctype = readFileSync('dist/index.d.cts', 'utf-8')
const js = readFileSync('dist/index.js', 'utf-8')
const cjs = readFileSync('dist/index.cjs', 'utf-8')
// 替换type中的@mango/xxx为mango-xxx
const newType = type.replaceAll(/@mango\//g, 'mango-')
const newCtype = ctype.replaceAll(/@mango\//g, 'mango-')
// 替换js中的@mango/xxx为mango-xxx
const newJS = js.replaceAll(/@mango\//g, 'mango-')
const newCJS = cjs.replaceAll(/@mango\//g, 'mango-')
writeFileSync(resolve('dist/index.d.ts'), newType)
writeFileSync(resolve('dist/index.d.cts'), newCtype)
writeFileSync(resolve('dist/index.js'), newJS)
writeFileSync(resolve('dist/index.cjs'), newCJS)
