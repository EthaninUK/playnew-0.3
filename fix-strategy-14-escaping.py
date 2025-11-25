#!/usr/bin/env python3
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all content fields and escape backticks within them
    # Pattern: content: `...`,
    pattern = r"(content: )`((?:[^`]|\\`)*?)`,\s*(steps:)"

    def escape_content(match):
        prefix = match.group(1)
        inner_content = match.group(2)
        suffix = match.group(3)

        # Replace any unescaped backticks with escaped ones
        # First, temporarily mark already escaped backticks
        escaped = inner_content.replace('\\`', '\x00')
        # Escape unescaped backticks
        escaped = escaped.replace('`', '\\`')
        # Restore already escaped backticks
        escaped = escaped.replace('\x00', '\\`')

        return f"{prefix}`{escaped}`,\n  {suffix}"

    content = re.sub(pattern, escape_content, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed backtick escaping in {filepath}")

# Fix both files
fix_file('/Users/m1/PlayNew_0.3/add-strategies-14-3-and-14-4.js')
print("Done!")
