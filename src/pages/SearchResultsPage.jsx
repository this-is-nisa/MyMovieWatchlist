import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { posterUrl, releaseYear, searchMovies } from '../lib/tmdb'

export default function SearchResultsPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() || ''
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = query ? `Search: ${query} · MyMovieWatchlist` : 'Search · MyMovieWatchlist'
  }, [query])

  useEffect(() => {
    if (!query) {
      setMovies([])
      setError('')
      return undefined
    }

    let cancelled = false
    setLoading(true)
    setError('')

    searchMovies(query)
      .then((results) => {
        if (!cancelled) setMovies(results)
      })
      .catch((err) => {
        if (!cancelled) {
          setMovies([])
          setError(err.message || 'Search failed')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query])

  return (
    <main className="page">
      <SearchBar initialQuery={query} />
      <div className="section-heading">
        <h2>{query ? `Results for “${query}”` : 'Search'}</h2>
      </div>

      {!query && <p className="status">Type a movie title and press Enter.</p>}
      {loading && <p className="status">Loading results…</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && query && movies.length === 0 && (
        <p className="status">No movies matched that search.</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => {
          const poster = posterUrl(movie.poster_path, 'w342')
          const year = releaseYear(movie.release_date)
          const rating = typeof movie.vote_average === 'number' && movie.vote_average > 0
            ? movie.vote_average.toFixed(1)
            : null

          return (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              state={{ fromSearch: query }}
              className="movie-card"
            >
              {poster && <img src={poster} alt="" />}
              <div className="movie-card-copy">
                <h3>{movie.title}</h3>
                <p className="muted">
                  {[year, rating && `${rating}/10`].filter(Boolean).join(' · ') || 'No extra details'}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
