import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { getMovie, posterUrl, releaseYear } from '../lib/tmdb'

export default function MovieDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const fromSearch = location.state?.fromSearch || ''
  const { isOnWatchlist, addMovie, removeMovie } = useWatchlist()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setMovie(null)

    getMovie(id)
      .then((data) => {
        if (cancelled) return
        setMovie(data)
        document.title = `${data.title} · MyMovieWatchlist`
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load that movie')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const onList = movie ? isOnWatchlist(movie.id) : false

  async function onToggleList() {
    if (!movie) return
    setSaving(true)
    setActionError('')
    try {
      if (onList) await removeMovie(movie.id)
      else await addMovie(movie)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const poster = posterUrl(movie?.poster_path, 'w500')
  const backdrop = posterUrl(movie?.backdrop_path, 'w1280')
  const year = releaseYear(movie?.release_date)
  const rating = typeof movie?.vote_average === 'number' && movie.vote_average > 0
    ? `${movie.vote_average.toFixed(1)}/10`
    : null

  return (
    <main className="page">
      {fromSearch ? (
        <Link className="back-link" to={`/search?q=${encodeURIComponent(fromSearch)}`}>
          Back to results
        </Link>
      ) : (
        <Link className="back-link" to="/">Back to home</Link>
      )}

      {loading && <p className="status">Loading movie…</p>}
      {error && <p className="status error">{error}</p>}

      {movie && (
        <>
          {backdrop && (
            <img className="backdrop" src={backdrop} alt="" />
          )}
          <div className={poster ? 'detail' : 'detail detail-no-poster'}>
            {poster && <img className="detail-poster" src={poster} alt="" />}
            <div>
              <h1>{movie.title}</h1>
              <p className="muted detail-meta">
                {[year, rating, movie.runtime ? `${movie.runtime} min` : null].filter(Boolean).join(' · ')}
              </p>
              {movie.genres?.length > 0 && (
                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="chip">{genre.name}</span>
                  ))}
                </div>
              )}
              <p className="overview">{movie.overview || 'No overview is available for this movie.'}</p>
              <button type="button" className="button primary" onClick={onToggleList} disabled={saving}>
                {saving ? 'Saving…' : onList ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              {onList && !saving && <p className="muted inline-note">In watchlist</p>}
              {actionError && <p className="status error">{actionError}</p>}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
