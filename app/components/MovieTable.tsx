"use client";
import { LineChart } from "recharts";
import Link from "next/link";
import { Trash, Download } from "lucide-react";
import { useMovieTable } from "../hooks/useMovieTable";
import { Movie } from "../types";

export default function MovieTable({ movies }: { movies: Movie[] }) {
  const {
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    paginatedMovies,
    handleSort,
    handleSelectAll,
    handleRowSelect,
    handleBulkDelete,
    exportToCsv,
    totalPages,
  } = useMovieTable(movies);

  type SortableField = "title" | "castCount";

  return (
    <div className="p-2 text-white rounded-lg shadow overflow-hidden w-full">
      <div className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md w-full sm:w-64 text-black"
            />
            <Link
              href="/chartanalysis"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
            >
              <LineChart className="w-4 h-4" />
              <span>View Metrics</span>
            </Link>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-400">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border rounded-md text-black"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-400">entries</span>
            </div>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedMovies.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              {[
                { field: "title", label: "Title" },
                { field: "castCount", label: "Cast Count" },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field as SortableField)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {field === "title" && <span>▾</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-gray-200">
            {paginatedMovies.map((movie) => (
              <tr key={movie._id} className="hover:bg-black text-white">
                <td className="px-4 sm:px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(movie._id)}
                    onChange={() => handleRowSelect(movie._id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 sm:px-6 py-4">{movie.title}</td>
                <td className="px-4 sm:px-6 py-4">{movie.cast.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-400 text-center sm:text-left">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, movies.length)} of {movies.length} entries
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 disabled:opacity-50 text-xl"
          >
            ◀️
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page ? "bg-blue-600 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 disabled:opacity-50 text-xl"
          >
            ▶️
          </button>
        </div>
      </div>
    </div>
  );
}