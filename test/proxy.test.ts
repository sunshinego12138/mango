import { Elysia } from 'elysia'
import { Buffer } from 'node:buffer'

const TARGET_SERVER = process.env.OPENAI_URL

const router = new Elysia({
  prefix: '/v1',
}).all('/*', async ({ request, path }) => {
  const url = new URL(request.url)
  const targetUrl = new URL(path, TARGET_SERVER)
  targetUrl.search = url.search

  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('host')
  requestHeaders.set('Authorization', `Bearer ${process.env.OPENAI_KEY}`)

  try {
    const abortController = new AbortController()

    // 客户端断开连接处理
    const cleanup = () => {
      abortController.abort()
      console.log(`[${new Date().toISOString()}] 客户端断开连接: ${targetUrl}`)
    }
    request.signal.addEventListener('abort', cleanup)

    // 处理请求体
    const body =
      request.method === 'GET' || request.method === 'HEAD' ? undefined : Buffer.from(await request.arrayBuffer())

    // 发送 fetch 请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: body,
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
        transform(chunk, controller) {
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
              const processedEvent = event
                .split('\n')
                .map((line) => {
                  if (line.startsWith('data: ')) {
                    const content = line.slice(6)
                    if (content === '[DONE]') return line

                    try {
                      const data = JSON.parse(content)
                      data.proxyProcessed = true
                      return `data: ${JSON.stringify(data)}`
                    } catch (err) {
                      console.error('Partial JSON:', content)
                      return line // 返回原始数据避免中断
                    }
                  }
                  return line
                })
                .join('\n')

              controller.enqueue(new TextEncoder().encode(processedEvent + '\n\n'))
            }
          } catch (err) {
            console.error('SSE processing error:', err)
          }
        },
        flush(controller) {
          // 处理剩余数据（如果有）
          if (buffer) {
            controller.enqueue(new TextEncoder().encode(buffer))
          }
          console.log('请求结束')
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
    let processedResponse: Response

    // 根据内容类型处理
    switch (true) {
      case contentType.includes('application/json'):
        const json = JSON.parse(buffer.toString())
        json.proxyProcessed = true
        processedResponse = new Response(JSON.stringify(json), {
          headers: responseHeaders,
          status: response.status,
        })

      case contentType.startsWith('text/'):
        processedResponse = new Response(buffer.toString(), {
          headers: responseHeaders,
          status: response.status,
        })

      default:
        processedResponse = new Response(buffer, {
          headers: responseHeaders,
          status: response.status,
        })
        console.log('请求结束')

        return processedResponse
    }
  } catch (error: any) {
    console.error('Proxy error:', error)
    return new Response(error instanceof Error ? error.message : 'Internal Server Error', {
      status: error?.status || 500,
    })
  }
})

const app = new Elysia().use(router).listen(8899)

console.log(`Proxy running at ${app.server?.url}`)
