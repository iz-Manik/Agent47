import requests

FACT_CHECK_API_KEY = "your_fact_check_api_key"

def fact_check_summary(summary):
    """Queries Google Fact Check API with the news summary."""
    url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?query={summary[:50]}&key={FACT_CHECK_API_KEY}"

    try:
        response = requests.get(url)
        data = response.json()

        return [
            {
                "verdict": check["claimReview"][0]["textualRating"] if "claimReview" in check else "Unknown",
                "source": check["claimReview"][0]["publisher"]["name"] if "claimReview" in check else "Unknown",
                "url": check["claimReview"][0]["url"] if "claimReview" in check else "Unknown"
            }
            for check in data.get("claims", []) if "claimReview" in check
        ]
    except Exception as e:
        return [{"error": str(e)}]
