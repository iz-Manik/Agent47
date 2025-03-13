import requests

API_KEY = "ff6140b6401d478e9efba563553b4f8a"  # Replace with a valid API key

def fetch_news():
    url = f"https://newsapi.org/v2/everything?q=Donald+Trump&apiKey={API_KEY}"
    response = requests.get(url).json()
    articles = response.get("articles", [])

    news_urls = [item["url"] for item in articles[:5] if "url" in item]

    return news_urls

