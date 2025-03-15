import { useState, useEffect } from "react";
import { Check, Search, X, RefreshCw, Filter } from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  status: string;
  sources: string[];
  sortBy: string;
  searchQuery: string;
}

const FilterPanel: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sources: [],
    sortBy: "newest",
    searchQuery: "",
  });

  // Available news sources
  const availableSources = [
    { id: "bbc", name: "BBC News" },
    { id: "gizmodo", name: "Gizmodo.com" },
    { id: "verge", name: "The Verge" },
    { id: "wired", name: "Wired" },
    { id: "reuters", name: "Reuters" },
    { id: "ap", name: "Associated Press" },
  ];

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle status selection
  const handleStatusChange = (status: string) => {
    setFilters({ ...filters, status });
  };

  // Handle source selection
  const handleSourceToggle = (sourceId: string) => {
    const updatedSources = filters.sources.includes(sourceId)
      ? filters.sources.filter(id => id !== sourceId)
      : [...filters.sources, sourceId];

    setFilters({ ...filters, sources: updatedSources });
  };

  // Handle sort selection
  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy });
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  // Clear search
  const clearSearch = () => {
    setFilters({ ...filters, searchQuery: "" });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      sources: [],
      sortBy: "newest",
      searchQuery: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-300">
      {/* Filter Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filters.sources.length > 0
              ? `${filters.sources.length} sources selected`
              : "All sources"}
          </span>
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            <svg
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isExpanded ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sources"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {filters.searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              {["all", "verified", "disputed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filters.status === status
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sort By</h3>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="relevance">Most Relevant</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-2"
                >
                  <div
                    onClick={() => handleSourceToggle(source.id)}
                    className={`w-5 h-5 flex items-center justify-center rounded border cursor-pointer ${
                      filters.sources.includes(source.id)
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                    }`}
                  >
                    {filters.sources.includes(source.id) && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSourceToggle(source.id)}>
                    {source.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;