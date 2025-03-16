import { useState, useEffect, useCallback } from "react";
import { Newspaper, RefreshCcw, AlertCircle, ExternalLink, Calendar, User, Sun, Moon, Clock, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import FilterPanel from "./FilterPanel";
import trumpImage from './images/image.png';
import AboutSection from "./About";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  publishDate: Date | null;
  status?: string;
}

interface FilterState {
  status: string;
  sources: string[];
  sortBy: string;
  searchQuery: string;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [tone, setTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(30 * 60);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sources: [],
    sortBy: "newest",
    searchQuery: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "about">("home");

  const fetchNews = useCallback(async (selectedTone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://agent-47.onrender.com/news?tone=${selectedTone}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();

      const processedNews = data.news
        .map((item: any) => ({
          ...item,
          publishDate: item.publish_date ? new Date(item.publish_date) : null,
          status: Math.random() > 0.3 ? "verified" : "disputed"
        }))
        .filter((item: NewsItem) => item.publishDate && !isNaN(item.publishDate.getTime()));

      setAllNews(processedNews);
      applyFilters(processedNews, filters);
      setLastUpdated(new Date());
      setNextUpdateIn(30 * 60);

      if (!initialLoad) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 10000);
      } else {
        setInitialLoad(false);
      }
    } catch (err) {
      setError("Failed to fetch news from the server.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, initialLoad]);

  const applyFilters = (newsItems: NewsItem[], currentFilters: FilterState) => {
    let result = [...newsItems];

    if (currentFilters.status !== "all") {
      result = result.filter(item => item.status === currentFilters.status);
    }

    if (currentFilters.sources.length > 0) {
      result = result.filter(item => {
        const publisherKey = item.publisher.toLowerCase().replace(/\s+/g, '');
        return currentFilters.sources.some(source =>
          publisherKey.includes(source) || source.includes(publisherKey)
        );
      });
    }

    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.publisher.toLowerCase().includes(query)
      );
    }

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

    setFilteredNews(result);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    applyFilters(allNews, newFilters);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdateIn(prev => prev <= 1 ? (fetchNews(tone), 30 * 60) : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchNews, tone]);

  useEffect(() => {
    fetchNews(tone);
  }, [tone, fetchNews]);

  useEffect(() => {
    if (allNews.length > 0) applyFilters(allNews, filters);
  }, [filters, allNews]);

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

  const formatLastUpdated = (date: Date) => date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatNextUpdate = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const renderHomeContent = () => (
    <>
      <header className="text-center mb-8 sm:mb-12 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2 sm:mb-4">
          Latest Trump News
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Stay updated with AI-generated news coverage
        </p>
        <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 w-12 sm:w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 order-2 lg:order-1 mb-6 lg:mb-0">
          <FilterPanel onFilterChange={handleFilterChange} />
        </aside>

        <main className="lg:col-span-3 order-1 lg:order-2">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

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
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1 mb-1 sm:mb-0">
                      <User className="w-4 h-4" />
                      <span className="truncate">{item.publisher}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1 sm:mb-0">
                      <Calendar className="w-4 h-4" />
                      <span className="truncate">{formatDate(item.publishDate)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-0">
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

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 leading-tight">{item.title}</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">{item.summary}</p>

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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {showNotification && (
        <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl animate-slide-in-right">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <img
                  src={trumpImage}
                  alt="Trump"
                  className="w-16 h-16 object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Trump News Updated!
                  </p>
                  <button
                    type="button"
                    className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowNotification(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  New articles have been loaded. Check out the latest updates on Trump!
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Updated at {formatLastUpdated(lastUpdated)}
                </p>
              </div>
            </div>
          </div>
          <div className="h-1 bg-indigo-600 animate-shrink"></div>
        </div>
      )}

      <nav className="bg-white/90 dark:bg-gray-900/90 shadow-md sticky top-0 z-50 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-auto py-2 md:h-16 items-center">
            <div className="flex items-center">
              {/* Logo section */}
              <div className="flex items-center gap-2 mr-4">
                <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trump AI News</span>
              </div>

              {/* Navigation buttons right next to the logo */}
              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => setCurrentView("home")}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                    currentView === "home"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-white/10 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setCurrentView("about")}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                    currentView === "about"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-white/10 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>About</span>
                </button>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Update time info - hide on smaller screens */}
              <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Next update in: {formatNextUpdate(nextUpdateIn)}</span>
                </div>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </button>

              {/* Tone selector */}
              <select
                onChange={(e) => setTone(e.target.value)}
                value={tone}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        {currentView === "home" ? renderHomeContent() : <AboutSection />}
      </div>
    </div>
  );
}

export default App;