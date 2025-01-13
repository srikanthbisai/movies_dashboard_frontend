// app/chartanalysis/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Movie } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function ChartAnalysis() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
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
    
    fetchMovies()
  }, [])

  // Transform movie data for visualization
  const chartData = movies.map(movie => ({
    name: movie.title,
    castCount: movie.cast.length,
  }))

  return (
    <div className="min-h-screen bg-slate-800 p-8">
      <div className="w-[90%] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Movie Metrics Analysis</h1>
          <a href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </a>
        </div>
        
        <div className="w-full bg-black text-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Movies Cast Size Overview</h3>
          <div className="w-full overflow-x-auto">
            <LineChart 
              width={1500} 
              height={700} 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="0.5 0.5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="castCount" 
                stroke="orange" 
                name="Movie VS Cast Count" 
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  )
}