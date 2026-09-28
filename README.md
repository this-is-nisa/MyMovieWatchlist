# MyMovieWatchlist

MyMovieWatchlist is a movie watchlist webapp where users can track the movies they are interested in watching. User search for a movie provided by "The Movie Database" api, open a movie, and add it to a list stored in Supabase. Users can manage the list including, adding movies to watchlist, removing movie from watchlist, and checking off a movie as watched, which it to the bottom of the list. No accounts or login needed.

**Deployed web app:** https://mymoviewatchlist-nisa.netlify.app

**Demo video:** _Add your unlisted YouTube link (3–5 minutes)._

## What the app does

- **Home Page** has a search bar with live search suggestions. Below it, the watchlist is displayed and shows each movie’s poster, title, a watched checkbox, and a Remove button. Watched rows are dimmed, the title is struck through, and those rows are moved under the unwatched ones. The Remove button asks you to confirm before deleting.
- **Search Results Page** lists all the movies that match the search query, displaying each movie with poster, title, year, and rating when TMDB provides them. Clicking a movie opens its detail page.
- **Movie Detail Page** shows the poster, backdrop, overview, year, rating, runtime, and genres of the movie selected. The **Add to Watchlist** button saves the movie to the watchlist on the Home Page. If it is already saved, the button switches to **Remove from Watchlist**, which removed the movie from the watchlist on the Home Page.

## Technologies used

- React and React Router, built with Vite to develop site 
- [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) for movie dataset to provide data for the web app's searching, suggestions, posters, and movie details
- A Netlify Function so the TMDB API key stays on the server
- [Supabase](https://supabase.com) Postgres for the watchlist table
- [Netlify](https://www.netlify.com) for hosting the web app


## Setup

### 1. TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Open [Settings → API](https://www.themoviedb.org/settings/api) and create an API key (Developer).
3. Include the **API Key (v3 auth)** value in an .env file as TMDB_API_KEY.

### 2. Supabase table

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the full script in [`supabase/schema.sql`](supabase/schema.sql).
3. In Project Settings → API, copy the project URL and the `anon` public key to the .env file as VITE_SUPABASE_URL and VITE_SUPABASE_ANON.

### 3. Local environment
TMDB_API_KEY=your_tmdb_v3_key
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

### 4. Netlify (deploy once, when the app works locally)

1. Clone this repository and push the repo to GitHub.
2. In Netlify, import the repository.
3. Build command: `npm run build`. Publish directory: `dist`.