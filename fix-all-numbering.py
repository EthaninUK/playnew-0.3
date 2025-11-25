#!/usr/bin/env python3
"""修正 STRATEGY-CONTENT-LIBRARY.md 中所有序号"""

import re

# 读取文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义主分类序号和它们的正确子分类起始序号
category_mapping = {
    30: 30,  # 结构性与事件套利
    31: 31,  # 成本与流程套利 (之前是43.x)
    # 第32-44个分类都需要重新编号
}

# 第30个分类 (structural-event-arbitrage) 从 42.2 开始错误
# 需要改成 30.2-30.9
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
        else:
            new_lines.append(line)
        continue

    new_lines.append(line)

# 写回文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("✅ 序号修正完成！")
print(f"   共处理 {len(lines)} 行")