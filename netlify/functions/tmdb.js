function extractSubpath(pathname) {
  const markers = ['/.netlify/functions/tmdb', '/api/tmdb']
  for (const marker of markers) {
    const index = pathname.indexOf(marker)
    if (index !== -1) {
      return pathname.slice(index + marker.length) || '/'
    }
  }
  return pathname || '/'
}

// Forwards /api/tmdb/* to TMDB and attaches the API key from the environment.
export async function handler(event) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'TMDB API key is not configured. Add TMDB_API_KEY in the Netlify environment settings.',
      }),
    }
  }

  const params = new URLSearchParams(event.rawQuery || '')
  params.delete('api_key')
  params.set('api_key', apiKey)

  const subpath = extractSubpath(event.path || '/')
  const url = `https://api.themoviedb.org/3${subpath}?${params.toString()}`

  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    const body = await response.text()
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body,
    }
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not reach TMDB.' }),
    }
  }
}
