import { useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import Watchlist from '../components/Watchlist'

export default function HomePage() {
  useEffect(() => {
    document.title = 'MyMovieWatchlist'
  }, [])

  return (
    <main className="page">
      <SearchBar />
      <Watchlist />
    </main>
  )
}
