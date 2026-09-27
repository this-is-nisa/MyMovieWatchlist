async function request(path) {
  const response = await fetch(`/api/tmdb${path}`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.status_message || data.error || 'Movie request failed')
  }
  return data
}

export function searchMovies(query) {
  const params = new URLSearchParams({
    query,
    include_adult: 'false',
    language: 'en-US',
  })
  return request(`/search/movie?${params.toString()}`).then((data) => data.results || [])
}

export function getMovie(id) {
  const params = new URLSearchParams({ language: 'en-US' })
  return request(`/movie/${id}?${params.toString()}`)
}

export function posterUrl(path, size = 'w342') {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function releaseYear(date) {
  if (!date) return null
  return String(date).slice(0, 4)
}
