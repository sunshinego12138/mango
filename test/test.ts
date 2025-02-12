import { Elysia, t } from 'elysia'

const app = new Elysia({
  prefix: '/abc'
})
const router = new Elysia()

const test1 = t.Object({
  id1: t.Optional(t.String()),
})

const test2 = t.Object({
  id2: t.Optional(t.String()),
})
const test3 = t.Object({
  id3: t.Optional(t.String()),
})
const test4 = t.Object({
  id4: t.Optional(t.String()),
})
const test5 = t.Object({
  id5: t.Optional(t.String()),
})

const test6 = t.Object({
  id6: t.Optional(t.String()),
})
router.get('/test2', () => 'test2', {
  query: test2
})
router.post('/test3', () => 'test3', {
  body: test3
})
router.post('/test4', () => 'test4', {
  params: test4
})
router.post('/4', () => '4', {
  body: test4
})
router.post('/test5', () => 'test5', {
  body: test5
})
router.post('/test6', () => 'test6', {
  query: test6
})


app.use(router)
app.listen(8899)
