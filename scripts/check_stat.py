import os
import glob
from PIL import Image, ImageStat

paths = [
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\db279a3e-9763-4c66-b296-6e55c1efbe93\.user_uploaded\media_1788182749670.jpg",
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\tempmediaStorage\media_1788210323480.jpg",
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\95ce3926-0d9b-4f17-9b43-ffd512600c7d\.user_uploaded\media_1788342964249.jpg",
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\43ac82ea-2c78-4093-9740-96372755aff5\.user_uploaded\media_1788384258532.jpg",
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\f75a1d59-16c4-49b1-be58-fd0e53874352\.user_uploaded\media_1788459075644.jpg"
]

for p in paths:
    if os.path.exists(p):
        im = Image.open(p)
        stat = ImageStat.Stat(im)
        print(p, im.size, stat.mean)
