import requests
import json

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
}

response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
if response.status_code == 200:
    models = response.json().get("data", [])
    free_models = [m["id"] for m in models if ":free" in m["id"] or "free" in m.get("name", "").lower()]
    print("Free Models:")
    for m in free_models:
        print(m)
    
    # Also check if gemini-flash-1.5:free exists
    target = "google/gemini-flash-1.5:free"
    found = any(m["id"] == target for m in models)
    print(f"\n{target} found: {found}")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
