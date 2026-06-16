import os
from dotenv import load_dotenv

# Path to the active .env.local
env_path = r'c:\Users\Shivam kumar\Downloads\voice-ai 1 (2)\voice-ai (2)\voice-ai\backend\.env.local'

print(f"Checking {env_path}...")
load_dotenv(env_path, override=True)

openai_key = os.environ.get("OPENAI_API_KEY")
print(f"OPENAI_API_KEY: {openai_key[:10]}...{openai_key[-5:] if openai_key else ''}")

if openai_key and openai_key.startswith("sk-proj"):
    print("SUCCESS: Key is correct (sk-proj).")
else:
    print("FAILURE: Key is still incorrect or not found.")
