#!/usr/bin/env python3
"""修正 STRATEGY-CONTENT-LIBRARY.md 中所有序号（完整版）"""

import re

# 读取文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
new_lines = []
current_category = 0

for i, line in enumerate(lines):
    # 检测主分类标题 (### X. )
    category_match = re.match(r'^### (\d+)\.\s+', line)
    if category_match:
        current_category = int(category_match.group(1))
        new_lines.append(line)
        continue

    # 检测子项 (#### X.Y )
    subitem_match = re.match(r'^#### (\d+)\.(\d+)\s+(.+)$', line)
    if subitem_match:
        old_major = int(subitem_match.group(1))
        minor = int(subitem_match.group(2))
        title = subitem_match.group(3)

        # 如果子项序号与当前分类不匹配，修正它
        if old_major != current_category:
            new_line = f'#### {current_category}.{minor} {title}'
            new_lines.append(new_line)
            print(f"修正: 行 {i+1}: {old_major}.{minor} → {current_category}.{minor} ({title[:30]}...)")
        else:
            new_lines.append(line)
        continue

    new_lines.append(line)

# 写回文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("\n✅ 序号修正完成！")
print(f"   共处理 {len(lines)} 行")
