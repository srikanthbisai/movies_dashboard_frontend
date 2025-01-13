'use client'
import { useState } from 'react'
import Modal from './Modal'
import { PlusCircle } from 'lucide-react'

interface AddMovieDialogProps {
  onAddMovie: (title: string) => Promise<void>
}

const AddMovieDialog = ({ onAddMovie }: AddMovieDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onAddMovie(title)
    setTitle('')
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition duration-300"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Movie
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Movie"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Movie Title"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition duration-300"
          >
            Add Movie
          </button>
        </form>
      </Modal>
    </>
  )
}

export default AddMovieDialog
