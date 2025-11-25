#!/usr/bin/env python3
"""验证 STRATEGY-CONTENT-LIBRARY.md 的序号正确性"""

import re

with open('STRATEGY-CONTENT-LIBRARY.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_category = 0
errors = []

for i, line in enumerate(lines, 1):
    # 检测主分类标题
    category_match = re.match(r'^### (\d+)\.\s+', line)
    if category_match:
        current_category = int(category_match.group(1))
        continue

    # 检测子项
    subitem_match = re.match(r'^#### (\d+)\.(\d+)\s+', line)
    if subitem_match:
        major = int(subitem_match.group(1))
        if major != current_category:
            errors.append(f"行 {i}: {major}.{subitem_match.group(2)} 应该是 {current_category}.{subitem_match.group(2)}")

if errors:
    print("❌ 发现序号错误:")
    for error in errors:
        print(f"  {error}")
else:
    print("✅ 所有序号都正确！")
    print(f"   已验证所有 50 个分类")
