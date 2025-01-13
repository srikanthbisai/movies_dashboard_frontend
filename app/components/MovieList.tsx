'use client'
import { Movie } from "../types"
import CastList from "./CastList"
import AddCastDialog from "./AddCastDialog"

type MovieListProps = {
  movies?: Movie[]
  onSelectMovie: (movieId: string) => void
  selectedMovie: Movie | null
  onAddCast: (castMember: {
    name: string
    email: string
    phone: string
    place: string
  }) => Promise<void>
}

export default function MovieList({ 
  movies = [], 
  onSelectMovie, 
  selectedMovie,
  onAddCast 
}: MovieListProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="space-y-4 p-4 md:p-8">
        <h2 className="text-xl text-orange-300">Movies And Cast Info</h2>
        <div className="text-gray-400 text-center py-4">
          No movies available
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-orange-300">Movies And Cast Info</h2>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Movies List - Left Side */}
        <div className="w-full lg:w-1/2">
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className={`border p-3 md:p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer space-y-2 ${
                  selectedMovie?._id === movie._id ? 'ring-2 ring-teal-500' : ''
                }`}
                onClick={() => onSelectMovie(movie._id)}
              >
                <h3 className="font-medium text-white">{movie.title}</h3>
                <p className="text-sm">
                  Cast Members: <span className="text-orange-500">{movie.cast.length}</span>
                </p>
                <p className="text-gray-400 text-sm">Click for complete cast Info</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Divider  */}
        <div className="hidden lg:block w-px bg-gray-700"></div>

        {/* Cast Details - Right Side */}
        <div className="w-full lg:w-1/2">
          {selectedMovie ? (
            <div className="bg-gray-800 text-white rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-white">
                  Cast Members - {selectedMovie.title}
                </h2>
                <AddCastDialog
                  movie={selectedMovie}
                  onAddCast={onAddCast}
                />
              </div>
              
              <div className="rounded-lg bg-gray-800">
                <CastList movie={selectedMovie} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400">
              Select a movie to view cast details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}