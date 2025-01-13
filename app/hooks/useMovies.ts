import { useState } from 'react'
import { Movie } from '../types'
import { handleApiRequest } from '../utils/error-handling'
export function useMovies() {
  const [isLoading, setIsLoading] = useState(false)

  const fetchMovies = async () => {
    setIsLoading(true)
    try {
      return await handleApiRequest<Movie[]>(
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  const createMovie = async (title: string) => {
    return handleApiRequest<Movie>(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title })
      }),
      'Movie created successfully'
    )
  }

  return {
    isLoading,
    fetchMovies,
    createMovie
  }
}