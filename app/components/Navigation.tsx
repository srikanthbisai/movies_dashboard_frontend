// app/components/Navigation.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-gray-800 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          <Link 
            href="/dashboard" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/dashboard' ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`}
          >
            My Movies
          </Link>
          <Link 
            href="/movies" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/movies' ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`}
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </nav>
  )
}