from telegram import Bot, Update
from telegram.ext import Updater, CommandHandler, CallbackContext
import requests

TOKEN = "7632568403:AAFZou_qAAuN89wwJgzeE_cwstp-AIbw5m4"

# Allowed tone values
def get_news(update: Update, context: CallbackContext):
    response = requests.get("http://localhost:8000/news?tone=satirical").json()
    news = "\n\n".join([f"📰 {n['title']}\n{n['summary']}" for n in response["news"]])
    update.message.reply_text(news)

def main():
    bot = Updater(TOKEN, use_context=True)
    dp = bot.dispatcher
    dp.add_handler(CommandHandler("news", get_news))
    bot.start_polling()
    bot.idle()

if __name__ == "__main__":
    main()


# Users can now request news with different tones:
# /news neutral
# /news satirical
# /news comedy
