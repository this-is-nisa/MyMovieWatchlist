import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">MyMovieWatchlist</Link>
        <Link to="/" className="nav-home">Home</Link>
      </div>
    </header>
  )
}
