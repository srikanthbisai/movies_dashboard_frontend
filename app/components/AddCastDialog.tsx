// components/AddCastDialog.tsx
'use client'
import { useState } from 'react'
import Modal from './Modal'
import { UserPlus } from 'lucide-react'
import type { Movie } from '../types'

interface AddCastDialogProps {
  movie: Movie
  onAddCast: (castMember: {
    name: string
    email: string
    phone: string
    place: string
  }) => Promise<void>
}

const AddCastDialog = ({ movie, onAddCast }: AddCastDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [castMember, setCastMember] = useState({
    name: '',
    email: '',
    phone: '',
    place: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onAddCast(castMember)
    setCastMember({ name: '', email: '', phone: '', place: '' })
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition duration-300"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Cast Member
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Add Cast Member to ${movie.title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={castMember.name}
            onChange={(e) => setCastMember({...castMember, name: e.target.value})}
            placeholder="Name"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="email"
            value={castMember.email}
            onChange={(e) => setCastMember({...castMember, email: e.target.value})}
            placeholder="Email"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="tel"
            value={castMember.phone}
            onChange={(e) => setCastMember({...castMember, phone: e.target.value})}
            placeholder="Phone"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="text"
            value={castMember.place}
            onChange={(e) => setCastMember({...castMember, place: e.target.value})}
            placeholder="Place"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition duration-300"
          >
            Add Cast Member
          </button>
        </form>
      </Modal>
    </>
  )
}

export default AddCastDialog