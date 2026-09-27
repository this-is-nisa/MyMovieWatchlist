import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { posterUrl } from '../lib/tmdb'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const WatchlistContext = createContext(null)

const SETUP_MESSAGE = 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file, run the SQL in supabase/schema.sql, then restart the dev server.'

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.watched !== b.watched) return a.watched ? 1 : -1
    return new Date(b.date_added) - new Date(a.date_added)
  })
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsRef = useRef([])
  itemsRef.current = items

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setItems([])
      setError(SETUP_MESSAGE)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('watchlist')
      .select('movie_id, title, poster_url, watched, date_added')

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setItems(sortItems(data || []))
    setError('')
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addMovie = useCallback(async (movie) => {
    if (!supabase) throw new Error(SETUP_MESSAGE)

    const row = {
      movie_id: movie.id,
      title: movie.title,
      poster_url: posterUrl(movie.poster_path, 'w342'),
      watched: false,
    }

    const { data, error: insertError } = await supabase
      .from('watchlist')
      .insert(row)
      .select('movie_id, title, poster_url, watched, date_added')
      .single()

    if (insertError) {
      if (insertError.code === '23505') return
      throw new Error(insertError.message)
    }

    setItems((current) => sortItems([...current.filter((item) => item.movie_id !== data.movie_id), data]))
  }, [])

  const removeMovie = useCallback(async (movieId) => {
    if (!supabase) throw new Error(SETUP_MESSAGE)
    const id = Number(movieId)
    const previous = itemsRef.current
    setItems(previous.filter((item) => item.movie_id !== id))

    const { error: deleteError } = await supabase.from('watchlist').delete().eq('movie_id', id)
    if (deleteError) {
      setItems(previous)
      throw new Error(deleteError.message)
    }
  }, [])

  const toggleWatched = useCallback(async (movieId, watched) => {
    if (!supabase) throw new Error(SETUP_MESSAGE)
    const id = Number(movieId)
    const previous = itemsRef.current
    setItems(sortItems(previous.map((item) => (
      item.movie_id === id ? { ...item, watched } : item
    ))))

    const { error: updateError } = await supabase
      .from('watchlist')
      .update({ watched })
      .eq('movie_id', id)

    if (updateError) {
      setItems(previous)
      throw new Error(updateError.message)
    }
  }, [])

  const value = useMemo(() => ({
    items,
    loading,
    error,
    addMovie,
    removeMovie,
    toggleWatched,
    isOnWatchlist: (movieId) => items.some((item) => item.movie_id === Number(movieId)),
  }), [items, loading, error, addMovie, removeMovie, toggleWatched])

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider')
  }
  return context
}
