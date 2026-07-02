import os

directory = r'c:\Users\Shivam kumar\Downloads\TalklyAI-main\TalklyAI-main\frontend\src'
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace("'http://localhost:8000'", "'https://deploy-talkly-ai.onrender.com'")
            new_content = new_content.replace('"http://localhost:8000"', '"https://deploy-talkly-ai.onrender.com"')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {filepath}')
