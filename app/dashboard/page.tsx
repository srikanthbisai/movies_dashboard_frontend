// app/dashboard/page.tsx 
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import CastList from '../components/CastList'
import MovieList from '../components/MovieList'
import type { Movie } from '../types'
import MovieMetricsChart from '../components/MovieMetricsChart'
import MovieTable from '../components/MovieTable'
import AddMovieDialog from '../components/AddMovieDialog'

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [title, setTitle] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [castMember, setCastMember] = useState({
    name: '',
    email: '',
    phone: '',
    place: ''
  })
  
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

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title })
      })
      if (res.ok) {
        setTitle('')
        fetchMovies()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddCast = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setCastMember({ name: '', email: '', phone: '', place: '' })
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <MovieTable movies={movies} />
          {/* Add Movie Form */}
          {/* <div className="bg-black text-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
            <form onSubmit={handleAddMovie} className="flex gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Movie Title"
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Movie
              </button>
            </form>
          </div> */}
          {/* Add Movie Dialog */}
          <div className="flex justify-end">
            <AddMovieDialog onAddMovie={handleAddMovie} />
          </div>


          {/* Movie List */}
          <MovieList movies={movies} onSelectMovie={handleSelectMovie} />

         <MovieMetricsChart movies={movies} />


          {/* Add Cast Form */}
          {selectedMovie && (
            <div className="bg-black text-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Add Cast Member to {selectedMovie.title}
              </h2>
              <form onSubmit={handleAddCast} className="space-y-4">
                <input
                  type="text"
                  value={castMember.name}
                  onChange={(e) => setCastMember({...castMember, name: e.target.value})}
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="email"
                  value={castMember.email}
                  onChange={(e) => setCastMember({...castMember, email: e.target.value})}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="tel"
                  value={castMember.phone}
                  onChange={(e) => setCastMember({...castMember, phone: e.target.value})}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  value={castMember.place}
                  onChange={(e) => setCastMember({...castMember, place: e.target.value})}
                  placeholder="Place"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Cast Member
                </button>
              </form>
              
              {/* Cast List */}
              <CastList movie={selectedMovie} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}