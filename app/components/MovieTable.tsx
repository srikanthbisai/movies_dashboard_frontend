// components/MovieTable.tsx
'use client'
import { useState, useMemo } from 'react'
import { Movie } from '../types'
import { useMovieStore } from '../store/useStore'
import { ChevronUp, ChevronDown, Trash, Edit, Eye, Download } from 'lucide-react'

interface SortConfig {
  field: keyof Movie | 'castCount'
  direction: 'asc' | 'desc'
}

const PAGE_SIZES = [5, 10, 25, 50]

export default function MovieTable({ movies }: { movies: Movie[] }) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState<SortConfig>({ field: 'title', direction: 'asc' })
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    hasCast: false,
    createdAfter: '',
  })

  const deleteMovie = useMovieStore((state) => state.deleteMovie)

  // Filter movies
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCastFilter = !filters.hasCast || movie.cast.length > 0
      const matchesDateFilter = !filters.createdAfter || 
        new Date(movie.createdAt) > new Date(filters.createdAfter)
      
      return matchesSearch && matchesCastFilter && matchesDateFilter
    })
  }, [movies, searchTerm, filters])

  // Sort movies
  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      let aValue = sort.field === 'castCount' ? a.cast.length : a[sort.field]
      let bValue = sort.field === 'castCount' ? b.cast.length : b[sort.field]
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredMovies, sort])

  // Paginate movies
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedMovies.slice(start, start + pageSize)
  }, [sortedMovies, currentPage, pageSize])

  const totalPages = Math.ceil(sortedMovies.length / pageSize)

  const handleSort = (field: SortConfig['field']) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedMovies.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedMovies.map(m => m._id)))
    }
  }

  const handleRowSelect = (movieId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(movieId)) {
      newSelected.delete(movieId)
    } else {
      newSelected.add(movieId)
    }
    setSelectedRows(newSelected)
  }

  const handleBulkDelete = async () => {
    if (confirm('Are you sure you want to delete the selected movies?')) {
      selectedRows.forEach((movieId) => {
        deleteMovie(movieId)
      })
      setSelectedRows(new Set())
    }
  }

  const exportToCsv = () => {
    const csvContent = [
      ['Title', 'Cast Count', 'Created Date'].join(','),
      ...paginatedMovies.map(movie => 
        [
          movie.title,
          movie.cast.length,
          new Date(movie.createdAt).toLocaleDateString()
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'movies.csv'
    a.click()
  }

  return (
    <div className="bg-black text-white rounded-lg shadow overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md w-64"
          />
          <div className="space-x-2">
            {selectedRows.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={exportToCsv}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasCast}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                hasCast: e.target.checked
              }))}
              className="rounded"
            />
            <span>Has Cast</span>
          </label>
          <input
            type="date"
            value={filters.createdAfter}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              createdAfter: e.target.value
            }))}
            className="px-3 py-2 border rounded-md"
          />
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded-md"
          >
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-black">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedRows.size === paginatedMovies.length}
                onChange={handleSelectAll}
                className="rounded"
              />
            </th>
            {[
              { field: 'title', label: 'Title' },
              { field: 'castCount', label: 'Cast Count' },
              { field: 'createdAt', label: 'Created Date' }
            ].map(({ field, label }) => (
              <th
                key={field}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort(field as SortConfig['field'])}
              >
                <div className="flex items-center space-x-1">
                  <span>{label}</span>
                  {sort.field === field && (
                    sort.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-black text-white divide-y divide-gray-200">
          {paginatedMovies.map((movie) => (
            <tr key={movie._id} className="hover:bg-black text-white">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedRows.has(movie._id)}
                  onChange={() => handleRowSelect(movie._id)}
                  className="rounded"
                />
              </td>
              <td className="px-6 py-4">{movie.title}</td>
              <td className="px-6 py-4">{movie.cast.length}</td>
              <td className="px-6 py-4">
                {new Date(movie.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => {/* Handle view */}}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4 inline" />
                </button>
                <button 
                  onClick={() => {/* Handle edit */}}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit className="w-4 h-4 inline" />
                </button>
                <button 
                  onClick={() => deleteMovie(movie._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedMovies.length)} of {sortedMovies.length} entries
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}