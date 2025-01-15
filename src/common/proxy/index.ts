import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

type ElysaProxy = {
  url: string
}
export const ElysaProxy = (options: ElysaProxy) => {
  return new Elysia().all('/*', async (args) => {
    try {
      const { query, body, request, headers, path } = args
      const tUrl = options.url + path
      if (!tUrl) throw new Error('Need URL')
      const targetUrl = new URL(tUrl as string)

      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid Protocol')
      }
      console.log('tUrl', tUrl)
      const tRequest = new Request({
        method: request.method,
        url: tUrl as string,
        // @ts-ignore
        headers: { ...headers, host: targetUrl.host },
        // @ts-ignore
        body: body ? JSON.stringify(body) : undefined,
      })
      return fetch(tRequest)
    } catch (e: any) {
      console.log('e', e)
      let eMsg = e.message
      if (eMsg === 'Type error') eMsg = 'Invalid URL'
      return Response.json({ message: eMsg }, { status: 400 })
    }
  })
}

const app = new Elysia()
  .use(cors())
  .use(ElysaProxy({ url: 'https://api.chatanywhere.org' }))
  .listen(9876)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
