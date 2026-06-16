import requests
import json

api_key = "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"
headers = {
    "Authorization": f"Bearer {api_key}",
}

response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
if response.status_code == 200:
    models = response.json().get("data", [])
    audio_free_models = []
    for m in models:
        if ":free" in m["id"]:
            # Check for audio input
            arch = m.get("architecture", {})
            input_modes = arch.get("input_modalities", [])
            if "audio" in input_modes or "input_audio" in str(m).lower():
                audio_free_models.append(m["id"])
    
    print("Free Models with Audio Input:")
    for m in audio_free_models:
        print(m)
else:
    print(f"Error: {response.status_code}")
