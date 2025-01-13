import { useState, useMemo, useCallback } from "react";
import { Movie } from "../types";
import { useMovieStore } from "../store/useStore";

interface SortConfig {
  field: "title" | "castCount";
  direction: "asc" | "desc";
}

export const useMovieTable = (movies: Movie[]) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortConfig>({
    field: "title",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    hasCast: false,
    createdAfter: "",
  });

  const deleteMovie = useMovieStore((state) => state.deleteMovie);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCastFilter = !filters.hasCast || movie.cast.length > 0;
      const matchesDateFilter =
        !filters.createdAfter ||
        new Date(movie.createdAt) > new Date(filters.createdAfter);

      return matchesSearch && matchesCastFilter && matchesDateFilter;
    });
  }, [movies, searchTerm, filters]);

  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      const aValue = sort.field === "castCount" ? a.cast.length : a[sort.field];
      const bValue = sort.field === "castCount" ? b.cast.length : b[sort.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();
        return sort.direction === "asc" 
          ? aLower.localeCompare(bLower)
          : bLower.localeCompare(aLower);
      }

      return sort.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [filteredMovies, sort]);

  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMovies.slice(start, start + pageSize);
  }, [sortedMovies, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedMovies.length / pageSize);

  const handleSort = useCallback((field: SortConfig["field"]) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedRows((prev) => 
      prev.size === paginatedMovies.length
        ? new Set()
        : new Set(paginatedMovies.map((m) => m._id))
    );
  }, [paginatedMovies]);

  const handleRowSelect = useCallback((movieId: string) => {
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(movieId)) {
        newSelected.delete(movieId);
      } else {
        newSelected.add(movieId);
      }
      return newSelected;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete the selected movies?")) {
      selectedRows.forEach(deleteMovie);
      setSelectedRows(new Set());
    }
  }, [selectedRows, deleteMovie]);

  const exportToCsv = useCallback(() => {
    const csvContent = [
      ["Title", "Cast Count", "Created At"].join(","),
      ...paginatedMovies.map((movie) =>
        [
          `"${movie.title.replace(/"/g, '""')}"`,
          movie.cast.length,
          new Date(movie.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "movies.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [paginatedMovies]);

  return {
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    filters,
    setFilters,
    paginatedMovies,
    handleSort,
    handleSelectAll,
    handleRowSelect,
    handleBulkDelete,
    exportToCsv,
    totalPages,
  };
};