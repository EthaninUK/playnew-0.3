#!/usr/bin/env python3
import re

# Read the file
with open('/Users/m1/PlayNew_0.3/add-strategies-13-1-and-13-2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all content fields and escape backticks within them
# Pattern: content: `...`,
pattern = r"(content: )`((?:[^`]|\\`)*?)`,"

def escape_content(match):
    prefix = match.group(1)
    inner_content = match.group(2)
    # Replace any unescaped backticks with escaped ones
    # This is already escaped if it has a backslash before it
    escaped = inner_content.replace('\\`', '\x00')  # Temporarily mark already escaped
    escaped = escaped.replace('`', '\\`')  # Escape unescaped backticks
    escaped = escaped.replace('\x00', '\\`')  # Restore already escaped
    return f"{prefix}`{escaped}`,"

content = re.sub(pattern, escape_content, content, flags=re.DOTALL)

# Write back
with open('/Users/m1/PlayNew_0.3/add-strategies-13-1-and-13-2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed backtick escaping in strategy file")
