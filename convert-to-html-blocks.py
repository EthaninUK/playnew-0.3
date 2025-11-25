#!/usr/bin/env python3
import re

# 读取文件
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 将三个反引号的代码块替换为 <pre> 标签
# 匹配 ```\n内容\n``` 格式
def replace_code_block(match):
    code_content = match.group(1)
    return f'<pre>{code_content}</pre>'

content = re.sub(r'```\n(.*?)\n```', replace_code_block, content, flags=re.DOTALL)

# 2. 将单个反引号的内联代码替换为 <code> 标签
# 匹配 `text` 格式，但不匹配已经是 <pre> 或 <code> 标签的
def replace_inline_code(match):
    code_text = match.group(1)
    return f'<code>{code_text}</code>'

# 只在非 HTML 标签中替换
content = re.sub(r'`([^`\n]+?)`', replace_inline_code, content)

# 保存
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ 已将 Markdown 代码块转换为 HTML 格式')
print('   - ``` 代码块 → <pre> 标签')
print('   - `内联代码` → <code> 标签')
print('\n请运行: node add-strategies-6-1-and-6-2.js')
