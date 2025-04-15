import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { apiRouter } from './router'
import { existsSync } from 'fs'

const app = new Hono()

app.use(cors())
const routes = app.route('/api', apiRouter)
export type RPC = typeof routes


// -------Frontend------
if (existsSync("../frontend/dist/server/entry.mjs")) {
  //@ts-expect-error
  const { handler: ssrHandler } = await import("../../frontend/dist/server/entry.mjs")
  app.use("/*", serveStatic({ root: "../frontend/dist/client/" }))
  app.use((ctx) => ssrHandler(ctx))
} else {
  console.error("Frontend not founds")
}

// Error handling
app.notFound((c) => {
  return c.json({ message: 'Recurso no encontrado' }, 404)
})

app.onError((err, c) => {
  console.error(`[ERROR] ${err}`)
  return c.json({ message: 'Error interno del servidor', error: err.message }, 500)
})

// Start server
Bun.serve({
  fetch: app.fetch,
  port: parseInt(Bun.env.PORT || '3000'),
  development: process.env.NODE_ENV !== 'production',
})

console.log(`🚀 Servidor corriendo en http://localhost:${Bun.env.PORT ?? 3000}`)


