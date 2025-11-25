#!/usr/bin/env python3
import re

# 读取原始文件
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 移除所有错误的转义
content = content.replace('\\`', '`')
content = content.replace('\\<code>\\</code>\\`', '')

# 2. 将所有 ASCII 艺术图表替换为简单文本
# 匹配 ┌...└ 这种box drawing的内容
def remove_box_drawing(match):
    """移除box drawing，保留文本内容"""
    text = match.group(0)
    # 提取文本行，移除框线字符
    lines = text.split('\n')
    clean_lines = []
    for line in lines:
        # 移除 box drawing 字符
        clean_line = re.sub(r'[┌┐├┤└┘─│]', '', line).strip()
        if clean_line and clean_line != '':
            clean_lines.append('  ' + clean_line)
    return '\n'.join(clean_lines)

content = re.sub(r'┌[^└]+└[^\n]*', remove_box_drawing, content, flags=re.DOTALL)

# 3. 现在处理代码块 - 但这次正确处理
# 只在 content: ` 和对应的 `, 之间查找并转义内联代码

# 保存到新文件
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ 已清理文件:')
print('   - 移除错误的转义')
print('   - 简化 ASCII 艺术图表')
print('\n请运行: node add-strategies-6-1-and-6-2.js')
