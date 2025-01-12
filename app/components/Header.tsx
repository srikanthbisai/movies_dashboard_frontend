// app/components/Header.tsx
'use client'
import Link from 'next/link'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-gray-900">Movie Dashboard</h1>
          <Link 
            href="/movies" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Browse Movies
          </Link>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}