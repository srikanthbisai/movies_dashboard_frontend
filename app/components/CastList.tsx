'use client'
import { Movie } from '../types'

type CastListProps = {
  movie: Movie
}

export default function CastList({ movie }: CastListProps) {
  return (
    <div className="mt-6 ">
      <div className="grid gap-4 md:grid-cols-2">
        {movie.cast.map((member, index) => (
          <div key={index} className=" border flex flex-col gap-2 text-white p-4 rounded-lg shadow">
            <p className="font-medium overflow-hidden bg-gradient-to-r from-blue-200 via-indigo-500 to-orange-500 bg-clip-text text-transparent">{member.name}</p>
            <p className="text-gray-300 overflow-clip  text-sm">{member.email}</p>
            <p className="text-gray-300 text-sm">{member.phone}</p>
            <p className="text-gray-300 text-sm">{member.place}</p>
          </div>
        ))}
      </div>
    </div>
  )
}