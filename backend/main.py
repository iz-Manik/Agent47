from fastapi import FastAPI
from scraper import fetch_news
from summarizer import summarize_article
from tone_changer import change_tone
from fastapi.middleware.cors import CORSMiddleware
import traceback

app = FastAPI()

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

@app.get("/news")
def get_news(tone: str = "neutral"):
    try:
        urls = fetch_news()  # Get only URLs from the scraper
        processed_news = []

        for url in urls:
            title,author,publish_date,summary = summarize_article(url)
            final_text = change_tone(summary, tone)

            processed_news.append({
                "title": title,
                "summary": final_text,
                "url": url,
                "author": author,
                "publish_date": publish_date
            })

        return {"news": processed_news}
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}

# Start server with: uvicorn main:app --reload
