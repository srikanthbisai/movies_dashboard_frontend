// app/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import MovieList from '../components/MovieList'
import type { Movie } from '../types'
import AddMovieDialog from '../components/AddMovieDialog'
import MovieTable from '../components/MovieTable'

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchMovies()
  }, [user])

  const fetchMovies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/movies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setMovies(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddMovie = async (title: string) => {
    try {
        const res = await fetch('http://localhost:5000/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title }),
        });
        if (res.ok) {
            fetchMovies();
        }
    } catch (err) {
        console.error(err);
    }
};

  const handleAddCast = async (castMember :{
    name: string
    email: string
    phone: string
    place: string
  }) => {
    if (!selectedMovie) return

    try {
      const res = await fetch(`http://localhost:5000/api/movies/${selectedMovie._id}/cast`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cast: castMember })
      })
      if (res.ok) {
        fetchMovies()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectMovie = (movieId: string) => {
    const movie = movies.find(m => m._id === movieId)
    if (movie) setSelectedMovie(movie)
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <Header />
      <main className="w-[90%] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="rounded-lg shadow-lg bg-gray-800 border border-gray-700"
               style={{
                 boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)',
               }}>
            <MovieTable movies={movies} />
          </div>

          <div className="flex justify-end">
            <AddMovieDialog onAddMovie={handleAddMovie} />
          </div>

          <div className="rounded-lg shadow-lg bg-gray-800 border border-gray-700"
               style={{
                 boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)',
               }}>
            <MovieList 
              movies={movies} 
              onSelectMovie={handleSelectMovie}
              selectedMovie={selectedMovie}
              onAddCast={handleAddCast}
            />
          </div>
        </div>
      </main>
    </div>
  )
}