import { Elysia } from 'elysia'
import { Buffer } from 'node:buffer'
import type { ProxyInstance, ProxyOption } from '../decorators/proxy'
import { isArray, isBoolean } from '../utils'
import { logger } from '../extends/logger'

export function ProxyLoader(app: Elysia, path: string | string[], option: ProxyOption, funcData: ProxyInstance = {}) {
  path = path.length ? path : '/*'
  if (isArray(path)) {
    ;(path as string[]).forEach((_path) => {
      app.all(_path, async ({ request, path }) => {
        return await proxyFunc(request, option, path, funcData)
      })
    })
  } else {
    app.all(path as string, async ({ request, path }) => {
      return await proxyFunc(request, option, path, funcData)
    })
  }
}

async function proxyFunc(request: Request, option: ProxyOption, path: string, funcData: ProxyInstance) {
  const TARGET_SERVER = option.proxyURL
  const _headers = option.headers || {}
  const url = new URL(request.url)
  const targetUrl = new URL(path, TARGET_SERVER)
  targetUrl.search = url.search

  // 流式处理的上下文对象
  const context = {}
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('host')
  Object.keys(_headers).forEach((key) => {
    requestHeaders.set(key, _headers[key])
  })
  if (funcData.beforeHandle) {
    let res = {}
    const str = funcData.beforeHandle.toString()
    if (str.includes('async') || str.includes('Promise.resolve')) {
      // 是promise的话
      res = await funcData.beforeHandle(request)
    } else {
      res = funcData.beforeHandle(request)
    }
    if (isBoolean(res)) {
      if (!res) {
        return new Response(null, {
          status: 500,
        })
      }
    } else if (res) {
      return res
    }
  }

  return 'okkkkk'
  try {
    const abortController = new AbortController()

    // 客户端断开连接处理
    const cleanup = () => {
      abortController.abort()
      logger.error(`客户端断开连接: ${targetUrl}`)
    }
    request.signal.addEventListener('abort', cleanup)

    // 处理请求体
    // const body =
    //   request.method === 'GET' || request.method === 'HEAD' ? undefined : Buffer.from(await request.arrayBuffer())
    const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body

    // 发送 fetch 请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body,
      signal: abortController.signal,
    })

    // 处理响应头
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('content-type', response.headers.get('content-type') || 'application/octet-stream')

    // SSE 处理
    if (responseHeaders.get('content-type')?.includes('text/event-stream')) {
      responseHeaders.set('cache-control', 'no-cache')
      responseHeaders.set('connection', 'keep-alive')

      // SSE 流转换处理
      let buffer = '' // 新增缓冲区来保存不完整的数据
      const transformStream = new TransformStream({
        transform: async (chunk, controller) => {
          try {
            buffer += new TextDecoder().decode(chunk)
            // 使用更可靠的事件分割方式
            while (true) {
              // 查找第一个事件结束标记
              const eventEnd = buffer.indexOf('\n\n')
              if (eventEnd === -1) break

              // 提取完整事件
              const event = buffer.slice(0, eventEnd)
              buffer = buffer.slice(eventEnd + 2)

              // 处理事件
              // const processedEvent = event
              //   .split('\n\n')
              //   .map(async (line) => {
              //     if (line.startsWith('data: ')) {
              //       const content = line.slice(6)
              //       if (content === '[DONE]') return line

              //       try {
              //         const data = JSON.parse(content)
              //         if (funcData.requestHandle) {
              //           let res = {}
              //           const str = funcData.requestHandle.toString()
              //           if (str.includes('async') || str.includes('Promise.resolve')) {
              //             // 是promise的话
              //             res = await funcData.requestHandle(data, context)
              //           } else {
              //             res = funcData.requestHandle(data, context)
              //           }
              //           if (isBoolean(res)) {
              //             if (!res) {
              //               return `data: ${JSON.stringify({})}`
              //             }
              //           } else if (res) {
              //             return `data: ${JSON.stringify(res)}`
              //           }
              //         }
              //         return `data: ${JSON.stringify(data)}`
              //       } catch (err) {
              //         return line // 返回原始数据避免中断
              //       }
              //     }
              //     return line
              //   })
              //   .join('\n')
              const lines = event.split('\n\n')
              const processedLines = []

              for (const line of lines) {
                let processedLine = line

                if (line.startsWith('data: ')) {
                  const content = line.slice(6)

                  if (content === '[DONE]') {
                    processedLines.push(line)
                    continue
                  }

                  try {
                    const data = JSON.parse(content)

                    if (funcData.requestHandle) {
                      let res = {}
                      const str = funcData.requestHandle.toString()
                      // 统一使用 await 处理异步
                      if (str.includes('async') || str.includes('Promise')) {
                        res = await funcData.requestHandle(data, context)
                      } else {
                        res = funcData.requestHandle(data, context)
                      }

                      // 处理返回值逻辑
                      if (typeof res === 'boolean') {
                        if (!res) processedLine = `data: ${JSON.stringify({})}`
                        else processedLine = `data: ${JSON.stringify(data)}`
                      } else if (res) {
                        processedLine = `data: ${JSON.stringify(res)}`
                      }
                    } else {
                      processedLine = `data: ${JSON.stringify(data)}`
                    }
                  } catch (err) {
                    processedLine = line // 解析失败保持原数据
                  }
                }

                processedLines.push(processedLine)
              }

              const processedEvent = processedLines.join('\n')

              controller.enqueue(new TextEncoder().encode(processedEvent + '\n\n'))
            }
          } catch (err) {
            logger.error(`SSE processing error: ${err}`)
          }
        },
        flush(controller) {
          // 处理剩余数据（如果有）
          if (buffer) {
            controller.enqueue(new TextEncoder().encode(buffer))
          }
          funcData.afterHandle && funcData.afterHandle(context)
        },
      })

      return new Response(response.body?.pipeThrough(transformStream), {
        headers: responseHeaders,
        status: response.status,
      })
    }

    // 非流式响应处理
    const contentType = responseHeaders.get('content-type') || ''
    const buffer = Buffer.from(await response.arrayBuffer())
    let processedResponse: Response = new Response()
    // 根据内容类型处理
    switch (true) {
      case contentType.includes('application/json'):
        const json = JSON.parse(buffer.toString())
        if (funcData.requestHandle) {
          let res = {}
          const str = funcData.requestHandle.toString()
          if (str.includes('async') || str.includes('Promise.resolve')) {
            // 是promise的话
            res = await funcData.requestHandle(json, context)
          } else {
            res = funcData.requestHandle(json, context)
          }
          if (isBoolean(res)) {
            if (!res) {
              processedResponse = new Response(null, {
                headers: responseHeaders,
                status: 500,
              })
            }
          } else if (res) {
            processedResponse = new Response(JSON.stringify(res), {
              headers: responseHeaders,
              status: response.status,
            })
          }
        } else {
          processedResponse = new Response(JSON.stringify(json), {
            headers: responseHeaders,
            status: response.status,
          })
        }
        break

      case contentType.startsWith('text/'):
        processedResponse = new Response(buffer.toString(), {
          headers: responseHeaders,
          status: response.status,
        })
        break

      default:
        processedResponse = new Response(buffer, {
          headers: responseHeaders,
          status: response.status,
        })
    }
    if (funcData.afterHandle) {
      let res = {}
      const str = funcData.afterHandle.toString()
      if (str.includes('async') || str.includes('Promise.resolve')) {
        // 是promise的话
        res = await funcData.afterHandle(context)
      } else {
        res = funcData.afterHandle(context)
      }
      if (isBoolean(res)) {
        if (!res) {
          return new Response(null, {
            status: 500,
          })
        }
      } else if (res) {
        return res
      }
    }
    return processedResponse
  } catch (error: any) {
    logger.error(`代理错误: ${error}`)
    return new Response(error instanceof Error ? error.message : 'Internal Server Error', {
      status: error?.status || 500,
    })
  }
}
