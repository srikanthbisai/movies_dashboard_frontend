// app/components/CastList.tsx
'use client'
import { Movie } from '../types'

type CastListProps = {
  movie: Movie
}

export default function CastList({ movie }: CastListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Cast Members for {movie.title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {movie.cast.map((member, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium">{member.name}</p>
            <p className="text-gray-600 text-sm">{member.email}</p>
            <p className="text-gray-600 text-sm">{member.phone}</p>
            <p className="text-gray-600 text-sm">{member.place}</p>
          </div>
        ))}
      </div>
    </div>
  )
}