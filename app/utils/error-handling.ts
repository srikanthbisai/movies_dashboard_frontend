// utils/error-handling.ts
import { toast } from 'react-hot-toast'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function handleApiRequest<T>(
  request: Promise<Response>,
  successMessage?: string
): Promise<T> {
  try {
    const response = await request
    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(error.message || 'Something went wrong', response.status)
    }
    
    const data = await response.json()
    if (successMessage) {
      toast.success(successMessage)
    }
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
    throw error
  }
}
