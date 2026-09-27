import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import { WatchlistProvider } from './context/WatchlistContext'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'

export default function App() {
  return (
    <WatchlistProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </WatchlistProvider>
  )
}
