import os
import re

base_dir = '/Users/apple/HOSPITAL'

def bump_cache_parameters(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # Define replacement patterns to increment versions
    replacements = [
        # style.css -> bump to v=1.3.2
        (r'style\.css(?:\?v=[a-zA-Z0-9\.\-_]+)?', 'style.css?v=1.3.2'),
        # admin.css -> bump to v=1.1.1
        (r'admin\.css(?:\?v=[a-zA-Z0-9\.\-_]+)?', 'admin.css?v=1.1.1'),
        # main.js -> bump to v=1.4.6
        (r'main\.js(?:\?v=[a-zA-Z0-9\.\-_]+)?', 'main.js?v=1.4.6'),
        # appointment.js -> bump to v=1.3.2
        (r'appointment\.js(?:\?v=[a-zA-Z0-9\.\-_]+)?', 'appointment.js?v=1.3.2'),
        # chat.js -> bump to v=1.1.1
        (r'chat\.js(?:\?v=[a-zA-Z0-9\.\-_]+)?', 'chat.js?v=1.1.1')
    ]

    for pattern, replacement in replacements:
        if re.search(pattern, content):
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                content = new_content
                modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Bumped asset versions in {file_path}")

def scan_directory(directory):
    for root, dirs, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                bump_cache_parameters(os.path.join(root, file))

if __name__ == '__main__':
    scan_directory(base_dir)
    print("Asset query parameters successfully updated across all files!")
