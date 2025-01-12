'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        router.push('/login')
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (err) {
      console.error(err)
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-800 p-6">
      <div className="container flex justify-center items-center">
        <form
          className="flex flex-col gap-6 w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-300"
          onSubmit={handleSubmit}
          style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)',
          }}
        >
          <h1 className="font-bold text-2xl text-center text-white">Create Your Account</h1>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="p-3 text-black border border-solid border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 text-black border border-solid border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 text-black border border-solid border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          
          <button
            type="submit"
            className="bg-teal-700 p-3 text-white font-bold w-full rounded-md hover:bg-teal-800 transition duration-300"
          >
            Register
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <Link href="/login" className="text-center">
            <button className="text-red-500 font-bold w-full rounded-md  transition duration-300">
              Already have an account ? <span className='text-yellow-500 hover:text-teal-800'>Sign In</span> 
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}