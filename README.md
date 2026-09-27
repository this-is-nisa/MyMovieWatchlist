# MyMovieWatchlist

A single shared movie watchlist. Search The Movie Database, open a movie, and add it to a list stored in Supabase. Checking an item marks it watched and moves it to the bottom of the list. No accounts or login — everyone uses the same list.

**Deployed app:** _Add your Netlify URL after the one-time deploy._

**Demo video:** _Add your unlisted YouTube link (3–5 minutes)._

## What the app does

- **Home** has a search bar with live suggestions. Below it, the watchlist shows each movie’s poster, title, a watched checkbox, and a Remove button. Watched rows are dimmed, the title is struck through, and those rows sit under the unwatched ones. Remove asks you to confirm before deleting.
- **Search results** lists movies that match the query, with poster, title, year, and rating when TMDB provides them. Clicking a movie opens its detail page.
- **Movie detail** shows the poster, backdrop, overview, year, rating, runtime, and genres. **Add to Watchlist** saves it. If it is already saved, the button switches to **Remove from Watchlist**.

## Technologies used

- React and React Router, built with Vite
- [TMDB API](https://developer.themoviedb.org/docs) for search, suggestions, posters, and movie details
- A Netlify Function (and a matching Vite dev proxy) so the TMDB API key stays on the server
- [Supabase](https://supabase.com) Postgres for the watchlist table
- [Netlify](https://www.netlify.com) for hosting

Movie data comes from the TMDB API, not the Kaggle movies CSV. TMDB already has search, images, and detail endpoints, so the app does not need a custom search backend.

## Data

Watchlist row (`watchlist` table):

| Column | Purpose |
| --- | --- |
| `movie_id` | TMDB movie id (primary key) |
| `title` | Title shown on the home list |
| `poster_url` | Poster image URL, if TMDB has one |
| `watched` | Whether the checkbox is checked |
| `date_added` | When the movie was added |

Login is not included. The assignment asks for accounts only when the app needs separate users. This app is one shared list.

## Setup

### 1. TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Open [Settings → API](https://www.themoviedb.org/settings/api) and create an API key (Developer).
3. Copy the **API Key (v3 auth)** value. That is `TMDB_API_KEY`.

### 2. Supabase table

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the full script in [`supabase/schema.sql`](supabase/schema.sql).
3. In Project Settings → API, copy the project URL and the `anon` public key.

The policies in that script allow the public anon key to read and change the one watchlist table. Do not store private data in it.

### 3. Local environment

```bash
npm install
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in `.env`:

```
TMDB_API_KEY=your_tmdb_v3_key
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

`.env` is gitignored. Do not commit keys.

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 4. GitHub

Create a public repository and push this project. Commit as you go, with messages that say what changed. Example:

```bash
git remote add origin https://github.com/YOUR_USER/mymoviewatchlist.git
git push -u origin main
```

### 5. Netlify (deploy once, when the app works locally)

1. Push the repo to GitHub.
2. In Netlify, import the repository.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Before the first production deploy, set these environment variables:
   - `TMDB_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy once.

`VITE_` values are baked in at build time. If you add or change them later, trigger a new deploy so the site picks them up. `TMDB_API_KEY` is read by the function at runtime.

## Project structure

```
src/components   Nav bar, search bar, watchlist
src/pages        Home, search results, movie detail
src/context      Watchlist load/add/update/delete
src/lib          TMDB client and Supabase client
netlify/functions/tmdb.js   Server proxy for TMDB
supabase/schema.sql         Watchlist table and access policies
```

## Demo video checklist

Record the **deployed** site, not localhost (about 3–5 minutes), and upload it to YouTube as **unlisted**:

- Search with suggestions, open a result, add it to the watchlist
- On Home, check it as watched and remove something (this is the database)
- Briefly show this repo: pages, the watchlist context, and `supabase/schema.sql`
- Paste the YouTube link in this README and at the top of the file
