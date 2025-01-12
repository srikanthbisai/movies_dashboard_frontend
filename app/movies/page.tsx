// app/movies/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { MovieCard } from '../components/MovieCard'

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  vote_count: number;
  poster_path: string;
}

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`,
          {
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjM2ZlZjEyOGI5NTYwOWUyZDdjMTRjZDk2ZTM0ZmE3MyIsIm5iZiI6MTczNTQzNTA3NS44NDMwMDAyLCJzdWIiOiI2NzcwYTM0MzAwNTgxMGMyM2Y5MjdhZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dKXO89--0juHvUiNw3QJPa3NG_lNKXDS7k9sF-tk7VA'
            }
          }
        )
        if (!response.ok) throw new Error('Failed to fetch movies')
        const data: MovieResponse = await response.json()
        
        if (currentPage === 1) {
          setMovies(data.results)
          setFilteredMovies(data.results)
        } else {
          const newMovies = [...movies, ...data.results]
          setMovies(newMovies)
          filterAndSortMovies(newMovies, searchTerm, sortOrder)
        }
        
        setTotalPages(Math.min(data.total_pages, 5)) // Limiting to 5 pages (100 movies)
      } catch (err) {
        setError('Error fetching movies. Please try again later.')
        console.error('Error fetching movies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [currentPage])

  const filterAndSortMovies = (moviesList: Movie[], search: string, order: 'asc' | 'desc') => {
    let filtered = moviesList;
    
    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (order === 'asc') {
        return a.vote_average - b.vote_average
      } else {
        return b.vote_average - a.vote_average
      }
    })
    
    setFilteredMovies(filtered)
  }

  useEffect(() => {
    filterAndSortMovies(movies, searchTerm, sortOrder)
  }, [searchTerm, sortOrder])

  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc')
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Popular Movies</h2>
      
      {/* Filter and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
        >
          <span>Rating</span>
          {sortOrder === 'desc' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Results count */}
      <div className="text-gray-600 mb-4">
        Showing {filteredMovies.length} results
      </div>
      
      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            rating={movie.vote_average}
            reviews={movie.vote_count}
          />
        ))}
      </div>
      
      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      )}
      
      {!loading && currentPage < totalPages && filteredMovies.length > 0 && searchTerm === '' && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMoreMovies}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Load More Movies
          </button>
        </div>
      )}
      
      {!loading && filteredMovies.length === 0 && (
        <div className="text-center mt-8 text-gray-600">
          No movies found matching your search criteria.
        </div>
      )}
    </div>
  )
}