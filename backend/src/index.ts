import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiRouter } from './router'

const app = new Hono()

app.use(cors())
const routes = app.route('/api', apiRouter)


Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT ?? 3000,
})