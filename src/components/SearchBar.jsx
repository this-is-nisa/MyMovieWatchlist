import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { posterUrl, releaseYear, searchMovies } from '../lib/tmdb'

export default function SearchBar({ initialQuery = '' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [status, setStatus] = useState('')
  const wrapRef = useRef(null)
  const skipFetch = useRef(true)
  const listId = useId()

  useEffect(() => {
    setQuery(initialQuery)
    skipFetch.current = true
    setOpen(false)
  }, [initialQuery])

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false
      return undefined
    }

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setStatus('')
      setOpen(false)
      return undefined
    }

    let cancelled = false
    const handle = setTimeout(async () => {
      setStatus('Searching…')
      setOpen(true)
      try {
        const results = await searchMovies(trimmed)
        if (cancelled) return
        setSuggestions(results.slice(0, 6))
        setStatus(results.length === 0 ? 'No matches' : '')
        setOpen(true)
      } catch (err) {
        if (cancelled) return
        setSuggestions([])
        setStatus(err.message || 'Search failed')
        setOpen(true)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [query])

  useEffect(() => {
    function onPointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function goToResults(nextQuery) {
    const trimmed = nextQuery.trim()
    if (!trimmed) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function onKeyDown(event) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(suggestions.length > 0)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, -1))
    } else if (event.key === 'Escape') {
      setOpen(false)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        goToResults(suggestions[activeIndex].title)
      } else {
        goToResults(query)
      }
    }
  }

  return (
    <form
      className="search-wrap"
      ref={wrapRef}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        goToResults(query)
      }}
    >
      <label className="sr-only" htmlFor="movie-search">Search movies</label>
      <input
        id="movie-search"
        className="search-input"
        value={query}
        placeholder="Search for a movie"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(-1)
        }}
        onFocus={() => {
          if (suggestions.length > 0 || status) setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      {open && (
        <div className="suggestions" id={listId} role="listbox">
          {status && <div className="suggestion-status">{status}</div>}
          {suggestions.map((movie, index) => {
            const poster = posterUrl(movie.poster_path, 'w92')
            const year = releaseYear(movie.release_date)
            return (
              <button
                type="button"
                key={movie.id}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'suggestion active' : 'suggestion'}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToResults(movie.title)}
              >
                {poster && <img src={poster} alt="" />}
                <span className="suggestion-copy">
                  <span className="suggestion-title">{movie.title}</span>
                  {year && <span className="suggestion-year">{year}</span>}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </form>
  )
}
