import { useState, useMemo } from "react";
import { Movie } from "../types";
import { useMovieStore } from "../store/useStore"; 

interface SortConfig {
  field: keyof Movie | "castCount";
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

  // Filter movies
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

  // Sort movies
  const sortedMovies = useMemo(() => {
    return [...filteredMovies].sort((a, b) => {
      let aValue = sort.field === "castCount" ? a.cast.length : a[sort.field];
      let bValue = sort.field === "castCount" ? b.cast.length : b[sort.field];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMovies, sort]);

  // Paginate movies
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedMovies.slice(start, start + pageSize);
  }, [sortedMovies, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedMovies.length / pageSize);

  const handleSort = (field: SortConfig["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedMovies.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedMovies.map((m) => m._id)));
    }
  };

  const handleRowSelect = (movieId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(movieId)) {
      newSelected.delete(movieId);
    } else {
      newSelected.add(movieId);
    }
    setSelectedRows(newSelected);
  };

  const handleBulkDelete = async () => {
    if (confirm("Are you sure you want to delete the selected movies?")) {
      selectedRows.forEach((movieId) => {
        deleteMovie(movieId);
      });
      setSelectedRows(new Set());
    }
  };

  const exportToCsv = () => {
    const csvContent = [
      ["Title", "Cast Count"].join(","),
      ...paginatedMovies.map((movie) =>
        [
          movie.title,
          movie.cast.length,
          new Date(movie.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "movies.csv";
    a.click();
  };

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
