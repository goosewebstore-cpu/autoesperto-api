import json

with open('scripts/full_guides_info.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("========================================")
print("CATEGORY: ACQUISTO (43 articles)")
print("========================================")
for i, g in enumerate(data['acquisto'], 1):
    print(f"{i:02d}. [{g['slug']}]")
    print(f"    TITLE: {g['title']}")
    print(f"    DESC : {g['desc']}")

print("\n========================================")
print("CATEGORY: VENDITA (30 articles)")
print("========================================")
for i, g in enumerate(data['vendita'], 1):
    print(f"{i:02d}. [{g['slug']}]")
    print(f"    TITLE: {g['title']}")
    print(f"    DESC : {g['desc']}")
