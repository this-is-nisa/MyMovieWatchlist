import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function extractSubpath(pathname) {
  const markers = ['/api/tmdb', '/.netlify/functions/tmdb']
  for (const marker of markers) {
    const index = pathname.indexOf(marker)
    if (index !== -1) {
      return pathname.slice(index + marker.length) || '/'
    }
  }
  return pathname || '/'
}

// Local stand-in for the Netlify function. The browser calls /api/tmdb/...,
// and this adds the API key on the server side.
function tmdbDevProxy(apiKey) {
  return {
    name: 'tmdb-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', async (req, res) => {
        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            error: 'TMDB API key is not configured. Add TMDB_API_KEY to your .env file and restart the dev server.',
          }))
          return
        }

        try {
          const incoming = new URL(req.url || '/', 'http://localhost')
          const target = new URL(`https://api.themoviedb.org/3${extractSubpath(incoming.pathname)}`)
          incoming.searchParams.forEach((value, key) => {
            if (key !== 'api_key') target.searchParams.set(key, value)
          })
          target.searchParams.set('api_key', apiKey)

          const response = await fetch(target, { headers: { Accept: 'application/json' } })
          const body = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(body)
        } catch {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Could not reach TMDB.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tmdbDevProxy(env.TMDB_API_KEY)],
  }
})
