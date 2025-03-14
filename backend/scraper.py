import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("API_KEY")  # Fetch API key from .env file

def fetch_news():
    url = f"https://newsapi.org/v2/everything?q=Donald+Trump&apiKey={API_KEY}"
    response = requests.get(url).json()
    articles = response.get("articles", [])

    news_urls = [item["url"] for item in articles[:5] if "url" in item]

    return news_urls

