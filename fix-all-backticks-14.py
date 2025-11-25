#!/usr/bin/env python3
import re

filepath = '/Users/m1/PlayNew_0.3/add-strategies-14-3-and-14-4.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find content fields and escape all backticks inside
# We need to find: content: `...`, and replace backticks inside

def escape_backticks_in_content(text):
    result = []
    in_content = False
    backtick_count = 0
    buffer = []

    i = 0
    while i < len(text):
        # Check if we're at the start of a content field
        if text[i:i+10] == 'content: `':
            result.append('content: `')
            i += 10
            in_content = True
            backtick_count = 1
            continue

        if in_content:
            if text[i] == '`' and (i == 0 or text[i-1] != '\\'):
                # Check if this is the closing backtick
                # by looking ahead for `,\n`
                if i+1 < len(text) and text[i+1:i+3] == ',\n':
                    # This is the closing backtick
                    result.append('`')
                    i += 1
                    in_content = False
                    continue
                else:
                    # This is a backtick inside content, escape it
                    result.append('\\`')
                    i += 1
                    continue

            result.append(text[i])
            i += 1
        else:
            result.append(text[i])
            i += 1

    return ''.join(result)

fixed_content = escape_backticks_in_content(content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Fixed all backticks in content fields")
