import dotenv from 'dotenv'
import { createRequestHandler } from '@remix-run/express'
import { ServerBuild, installGlobals } from '@remix-run/node'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import payload from 'payload'
import invariant from 'tiny-invariant'

dotenv.config()
installGlobals()

async function startServer() {
  const app = express()

  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          }),
        )

  // Initialize Payload
  invariant(process.env.PAYLOAD_SECRET, 'PAYLOAD_SECRET is required')
  await payload.init({
    express: app,
    secret: process.env.PAYLOAD_SECRET,
    onInit: () => {
      payload.logger.info(`Payload Admin is running at ${payload.getAdminURL()}`)
    },
  })
  app.use(payload.authenticate)

  const remixHandler = createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build') as Promise<ServerBuild>
      : await import('./build/server/index.js'),
    getLoadContext: (req, res) => {
      return {
        payload: req.payload,
        user: req?.user,
        res,
      }
    },
  })

  app.use(compression())

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by')

  // handle asset requests
  if (viteDevServer) {
    app.use(viteDevServer.middlewares)
  } else {
    // Vite fingerprints its assets so we can cache forever.
    app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }))
  }

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('build/client', { maxAge: '1h' }))

  app.use(morgan('tiny'))

  // handle SSR requests
  app.all('*', remixHandler)

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`))
}

startServer()
