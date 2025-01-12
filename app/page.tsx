//app/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './providers'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Only redirect after initial auth state is loaded
    if (user === null) {
      router.push('/login')
    } else if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}