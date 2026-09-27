import { useEffect } from 'react'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  useEffect(() => {
    document.title = 'MyMovieWatchlist'
  }, [])

  return (
    <main className="page">
      <SearchBar />
    </main>
  )
}
