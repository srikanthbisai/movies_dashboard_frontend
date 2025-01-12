// store/useStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Movie, User, CastMember } from '../types'

interface MovieState {
  movies: Movie[]
  selectedMovie: Movie | null
  loading: boolean
  error: string | null
  // Movies actions
  setMovies: (movies: Movie[]) => void
  addMovie: (movie: Movie) => void
  updateMovie: (movieId: string, movie: Movie) => void
  deleteMovie: (movieId: string) => void
  setSelectedMovie: (movie: Movie | null) => void
  // Cast actions
  addCastMember: (movieId: string, castMember: CastMember) => void
  removeCastMember: (movieId: string, castMemberId: string) => void
  // Loading and error states
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useMovieStore = create<MovieState>()(
  devtools(
    (set) => ({
      movies: [],
      selectedMovie: null,
      loading: false,
      error: null,

      setMovies: (movies) => set({ movies }),
      addMovie: (movie) => set((state) => ({ 
        movies: [...state.movies, movie] 
      })),
      updateMovie: (movieId, updatedMovie) => set((state) => ({
        movies: state.movies.map((movie) => 
          movie._id === movieId ? updatedMovie : movie
        )
      })),
      deleteMovie: (movieId) => set((state) => ({
        movies: state.movies.filter((movie) => movie._id !== movieId)
      })),
      setSelectedMovie: (movie) => set({ selectedMovie: movie }),
      
      addCastMember: (movieId, castMember) => set((state) => ({
        movies: state.movies.map((movie) => 
          movie._id === movieId 
            ? { ...movie, cast: [...movie.cast, castMember] }
            : movie
        )
      })),
      removeCastMember: (movieId, castMemberId) => set((state) => ({
        movies: state.movies.map((movie) => 
          movie._id === movieId 
            ? { 
                ...movie, 
                cast: movie.cast.filter((cast) => cast.id !== castMemberId)
              }
            : movie
        )
      })),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    })
  )
)

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        logout: () => set({ user: null, token: null })
      }),
      {
        name: 'auth-storage'
      }
    )
  )
)