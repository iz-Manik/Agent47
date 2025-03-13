import { useState, useEffect } from "react";
import { Newspaper, RefreshCcw, AlertCircle, ExternalLink, Calendar, User } from "lucide-react";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  author: string;
  publishDate: string;
}

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [tone, setTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (selectedTone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/news?tone=${selectedTone}`);

      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setNews(data.news);
    } catch (err) {
      setError("Failed to fetch news from the server.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(tone);
  }, [tone]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">
                Trump AI News
              </span>
            </div>
            <div className="relative">
              <select
                onChange={(e) => setTone(e.target.value)}
                value={tone}
                className="appearance-none bg-white/50 border-2 border-indigo-200 rounded-full px-6 py-2 pr-12 text-base font-medium text-gray-700 hover:border-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              >
                <option value="neutral">📰 Neutral</option>
                <option value="satirical">😏 Satirical</option>
                <option value="comedy">😄 Comedy</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Latest Trump News
          </h1>
          <p className="text-xl text-gray-600">
            Stay updated with AI-generated news coverage
          </p>
        </header>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCcw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading latest news...</p>
            </div>
          ) : (
            news.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.publishDate)}</span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {item.summary}
                  </p>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
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
      </div>
    </div>
  );
}

export default App;