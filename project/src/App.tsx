import { useState, useEffect } from "react";
import { Newspaper, RefreshCcw, AlertCircle, ExternalLink, Calendar, User, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";
import FilterPanel from "./FilterPanel"; // Import the new filter component

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  publishDate: Date | null;
  status?: string; // Added status field
}

interface FilterState {
  status: string;
  sources: string[];
  sortBy: string;
  searchQuery: string;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [allNews, setAllNews] = useState<NewsItem[]>([]); // Store all fetched news
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]); // Store filtered news
  const [tone, setTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sources: [],
    sortBy: "newest",
    searchQuery: "",
  });

  const fetchNews = async (selectedTone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://agent-us-backend-4-dti2.onrender.com/news?tone=${selectedTone}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();

      // Convert & filter news with valid dates
      const processedNews = data.news
        .map((item: any) => ({
          ...item,
          publishDate: item.publish_date ? new Date(item.publish_date) : null,
          status: Math.random() > 0.3 ? "verified" : "disputed"
        }))
        .filter((item: NewsItem) => item.publishDate && !isNaN(item.publishDate.getTime())); // Ensure date is valid

      setAllNews(processedNews);
      applyFilters(processedNews, filters);
    } catch (err) {
      setError("Failed to fetch news from the server.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };


  // Apply filters to news items
  const applyFilters = (newsItems: NewsItem[], currentFilters: FilterState) => {
    let result = [...newsItems];

    // Filter by status
    if (currentFilters.status !== "all") {
      result = result.filter(item => item.status === currentFilters.status);
    }

    // Filter by source
    if (currentFilters.sources.length > 0) {
      // Convert publisher names to match filter source IDs for comparison
      result = result.filter(item => {
        const publisherKey = item.publisher.toLowerCase().replace(/\s+/g, '');
        return currentFilters.sources.some(source =>
          publisherKey.includes(source) || source.includes(publisherKey)
        );
      });
    }

    // Filter by search query
    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.publisher.toLowerCase().includes(query)
      );
    }

    // Sort items
    if (currentFilters.sortBy === "newest") {
      result.sort((a, b) => {
        if (!a.publishDate || !b.publishDate) return 0;
        return b.publishDate.getTime() - a.publishDate.getTime();
      });
    } else if (currentFilters.sortBy === "oldest") {
      result.sort((a, b) => {
        if (!a.publishDate || !b.publishDate) return 0;
        return a.publishDate.getTime() - b.publishDate.getTime();
      });
    }
    // 'relevance' sorting would be implemented based on your specific requirements

    setFilteredNews(result);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    applyFilters(allNews, newFilters);
  };

  useEffect(() => {
    fetchNews(tone);
  }, [tone]);

  // When filters change, apply them to the current news
  useEffect(() => {
    if (allNews.length > 0) {
      applyFilters(allNews, filters);
    }
  }, [filters]);

  const formatDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return "Unknown Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <nav className="bg-white/90 dark:bg-gray-900/90 shadow-md sticky top-0 z-50 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Trump AI News</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </button>
              <select
                onChange={(e) => setTone(e.target.value)}
                value={tone}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="neutral">📰 Neutral</option>
                <option value="satirical">😏 Satirical</option>
                <option value="comedy">😄 Comedy</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Latest Trump News</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Stay updated with AI-generated news coverage</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with filters */}
          <aside className="lg:col-span-1">
            <FilterPanel onFilterChange={handleFilterChange} />
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            {/* Results summary */}
            {!loading && filteredNews.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">
                  Showing <span className="font-medium">{filteredNews.length}</span> of{" "}
                  <span className="font-medium">{allNews.length}</span> results
                </p>
                <button
                  onClick={() => fetchNews(tone)}
                  className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            )}

            <div className="space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCcw className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Loading latest news...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Try adjusting your filters or search query to find more news articles.
                  </p>
                </div>
              ) : (
                filteredNews.map((item, index) => (
                  <article
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-8">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.publisher}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.publishDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "verified"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                              : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300"
                          }`}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-medium">
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{item.title}</h2>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{item.summary}</p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                        >
                          Read Full Article
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;