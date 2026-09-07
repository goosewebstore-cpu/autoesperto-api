import json

with open(r'C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            print("--- USER INPUT ---")
            print(data.get('content'))
