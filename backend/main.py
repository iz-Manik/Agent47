from fastapi import FastAPI
from summarizer import summarize_article
from tone_changer import change_tone
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import traceback

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Security-Policy"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' data:"
    return response

# Global cache for storing fetched news
cached_news = []

load_dotenv()

API_KEY = os.getenv("API_KEY")  # Fetch API key from .env file


def fetch_news():
    url = f"https://newsapi.org/v2/everything?q=Donald+Trump&apiKey={API_KEY}"
    response = requests.get(url).json()
    articles = response.get("articles", [])

    news_urls = [item["url"] for item in articles[:10] if "url" in item]
    return news_urls


def load_news():
    """Fetch news once and store in cached_news."""
    global cached_news
    try:
        urls = fetch_news()  # Get only URLs from the scraper
        cached_news = []

        for url in urls:
            title, author, publish_date, summary = summarize_article(url)

            cached_news.append({
                "title": title,
                "neutral_summary": summary,  # Store neutral summary
                "url": url,
                "author": author,
                "publish_date": publish_date
            })
    except Exception as e:
        traceback.print_exc()
        cached_news = []

@app.on_event("startup")
def fetch_initial_news():
    """Fetch news when the server starts."""
    load_news()

@app.get("/news")
def get_news(tone: str = "neutral"):
    try:
        if not cached_news:
            load_news()

        processed_news = []

        for item in cached_news:
            if tone == "neutral":
                final_text = item["neutral_summary"]
            else:
                final_text = change_tone(item["neutral_summary"], tone)

            processed_news.append({
                "title": item["title"],
                "summary": final_text,
                "url": item["url"],
                "author": item["author"],
                "publish_date": item["publish_date"]
            })

        return {"news": processed_news}
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}
