from PIL import Image, ImageDraw, ImageFont

def create_meme(text, image_path="trump.jpg", output_path="meme.jpg"):
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    font = ImageFont.truetype("arial.ttf", 40)
    draw.text((50, 50), text, fill="white", font=font)

    img.save(output_path)
    return output_path
