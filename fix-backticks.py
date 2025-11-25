#!/usr/bin/env python3
import re

# 读取文件
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 在模板字符串中,将所有反引号转义
# 方法: 将 ` 替换为 \`，但跳过:
# 1. content: ` 这种开始模板字符串的反引号
# 2. 行尾 `, 这种结束模板字符串的反引号

def fix_backticks(match):
    """处理 content: ` ... ` 之间的内容"""
    start = match.group(1)  # "content: `"
    body = match.group(2)   # 中间的内容
    end = match.group(3)    # 结尾的 "`,"

    # 转义 body 中的所有反引号
    body = body.replace('`', r'\`')

    return f"{start}{body}{end}"

# 匹配 content: ` ... `,
pattern = r'(content: `)(.*?)(`(?:,|\s*tags:))'

content = re.sub(pattern, fix_backticks, content, flags=re.DOTALL)

# 保存
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ 已修复反引号问题')
print('请运行: node add-strategies-6-1-and-6-2.js')
