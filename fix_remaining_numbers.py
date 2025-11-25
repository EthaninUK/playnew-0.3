#!/usr/bin/env python3
"""
修复剩余的编号问题
"""

import re

# 读取文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复分类36-44下的子编号 (从30.x-38.x改为36.x-44.x)
fixes = [
    # 36分类 (原30)
    (r'#### 30\.([1-9]) ', r'#### 36.\1 '),
    # 37分类 (原31)
    (r'#### 31\.([1-9]) ', r'#### 37.\1 '),
    # 38分类 (原32)
    (r'#### 32\.([1-9]) ', r'#### 38.\1 '),
    # 39分类 (原33)
    (r'#### 33\.([1-9]) ', r'#### 39.\1 '),
    # 40分类 (原34)
    (r'#### 34\.([1-9]) ', r'#### 40.\1 '),
    # 41分类 (原35)
    (r'#### 35\.([1-9]) ', r'#### 41.\1 '),
    # 42分类 (原36)
    (r'#### 36\.([1-9]) ', r'#### 42.\1 '),
    # 43分类 (原37)
    (r'#### 37\.([1-9]) ', r'#### 43.\1 '),
    # 44分类 (原38)
    (r'#### 38\.([1-9]) ', r'#### 44.\1 '),
]

for pattern, replacement in fixes:
    content = re.sub(pattern, replacement, content)

# 写回文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 剩余编号修复完成!")
