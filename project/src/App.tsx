import { useState, useEffect } from "react";
import { Newspaper, RefreshCcw, AlertCircle } from "lucide-react";
import { SignIn } from "./components/SignIn";

interface NewsItem {
  title: string;
  summary: string;
  url: string;
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
      console.log("Fetched data:", data); // Debugging log
      setNews(data.news);
    } catch (err) {
      setError("Failed to fetch news from the server.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news on component mount and when tone changes
  useEffect(() => {
    fetchNews(tone);
  }, [tone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">
                Trump AI News
              </span>
            </div>
            <SignIn />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Latest Trump News
          </h1>

          <div className="relative inline-block">
            <select
              onChange={(e) => setTone(e.target.value)}
              value={tone}
              className="appearance-none bg-white border-2 border-indigo-200 rounded-lg px-6 py-3 pr-12 text-lg font-medium text-gray-700 hover:border-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
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
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <main className="flex-1">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : (
                news.map((item, index) => (
                  <article
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </span>
                        <span>•</span>
                        <span>AI Generated</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>

          {/* ASIDE Section for News Links */}
          <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Read Full Articles
            </h3>
            <ul className="space-y-2">
              {news.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
