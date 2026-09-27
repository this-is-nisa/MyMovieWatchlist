import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

function formatAdded(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Watchlist() {
  const { items, loading, error, toggleWatched, removeMovie } = useWatchlist()
  const [pendingRemoveId, setPendingRemoveId] = useState(null)
  const [actionError, setActionError] = useState('')

  async function onToggle(item) {
    setActionError('')
    try {
      await toggleWatched(item.movie_id, !item.watched)
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function onRemove(movieId) {
    setActionError('')
    try {
      await removeMovie(movieId)
      setPendingRemoveId(null)
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <section className="watchlist">
      <div className="section-heading">
        <h2>Watchlist</h2>
        <p className="muted">Unwatched movies stay on top. Checked movies move to the bottom.</p>
      </div>

      {loading && <p className="status">Loading watchlist…</p>}
      {error && <p className="status error">{error}</p>}
      {actionError && <p className="status error">{actionError}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="status">Your watchlist is empty. Search for a movie and add it.</p>
      )}

      <ul className="watch-list">
        {items.map((item) => {
          const confirming = pendingRemoveId === item.movie_id
          return (
            <li key={item.movie_id} className={item.watched ? 'watch-row watched' : 'watch-row'}>
              <input
                type="checkbox"
                checked={item.watched}
                aria-label={`Mark ${item.title} as ${item.watched ? 'unwatched' : 'watched'}`}
                onChange={() => onToggle(item)}
              />
              {item.poster_url && (
                <img className="watch-poster" src={item.poster_url} alt="" />
              )}
              <div className="watch-copy">
                <Link to={`/movie/${item.movie_id}`} className="watch-title">{item.title}</Link>
                {item.date_added && (
                  <span className="muted">Added {formatAdded(item.date_added)}</span>
                )}
              </div>
              {confirming ? (
                <div className="confirm-remove">
                  <button type="button" className="button primary" onClick={() => onRemove(item.movie_id)}>
                    Confirm
                  </button>
                  <button type="button" className="button ghost" onClick={() => setPendingRemoveId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" className="button ghost" onClick={() => setPendingRemoveId(item.movie_id)}>
                  Remove
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
