import json

with open('scripts/wikimedia_found_43.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for k, v in data.items():
    print(f"{k} -> {v.get('title')}")
