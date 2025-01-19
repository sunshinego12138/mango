import MongoCore from '@mongo/core'

MongoCore.init({
  businessPath: 'src',
  controllerPath: 'modules',
  name: 'Mongo elysia',
  version: '1.0.0',
  swagger: {},
}).listen(8000)
