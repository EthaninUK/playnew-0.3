#!/usr/bin/env python3
import re

# Read the file
with open('/Users/m1/PlayNew_0.3/add-strategies-17-7-and-17-8.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace standalone ``` at the beginning of lines (with optional whitespace)
content = re.sub(r'([ \t]*)```\n', r'\1\\`\\`\\`\n', content)
content = re.sub(r'([ \t]*)```$', r'\1\\`\\`\\`', content, flags=re.MULTILINE)

# Write back
with open('/Users/m1/PlayNew_0.3/add-strategies-17-7-and-17-8.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed all code blocks!")
