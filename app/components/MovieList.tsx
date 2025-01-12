// app/components/MovieList.tsx
'use client'
import { Movie } from "../types"

type MovieListProps = {
  movies: Movie[]
  onSelectMovie: (movieId: string) => void
}

export default function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Movies</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectMovie(movie._id)}
          >
            <h3 className="font-medium">{movie.title}</h3>
            <p className="text-gray-600 text-sm mt-1">
              Cast Members: {movie.cast.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}