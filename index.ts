// import app from './src/app'

// app.listen(8000, ({ hostname, port }) => {
//   console.log(`🦊 running at http://${hostname}:${port}`)
// })

import Mongo from '@mongo/core'

Mongo.init({
  businessPath: 'src',
  controllerPath: 'modules',
  name: 'Mongo elysia',
  version: '1.0.0',
  swagger: {},
}).listen(8000)
