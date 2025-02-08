import swagger from '@elysiajs/swagger'
import type { Mango } from '@mango/types'

/**
 * 文档loader
 * @param app
 * @param options
 */
export const swaggerLoader = (app: Mango.App, options: Mango.MangoStartOptions) => {
  if (options.swagger) {
    app.use(
      swagger({
        documentation: {
          info: {
            title: options.name as string,
            version: options.version as string,
            ...options?.swagger?.documentation?.info,
          },
          ...options?.swagger?.documentation,
        },
        ...options?.swagger,
      }),
    )
  }
}
