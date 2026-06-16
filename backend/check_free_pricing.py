import requests
import json

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
}

response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
if response.status_code == 200:
    models = response.json().get("data", [])
    free_models = []
    for m in models:
        pricing = m.get("pricing", {})
        if pricing.get("prompt") == "0" and pricing.get("completion") == "0":
            free_models.append(m["id"])
    
    print("Zero-cost Models:")
    for m in free_models:
        print(m)
else:
    print(f"Error: {response.status_code}")
