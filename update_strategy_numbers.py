#!/usr/bin/env python3
"""
批量更新策略编号
原编号 21-38 → 新编号 27-44
"""

import re

# 读取文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义需要更新的映射 (从大到小,避免冲突)
mappings = [
    (38, 44), (37, 43), (36, 42), (35, 41), (34, 40),
    (33, 39), (32, 38), (31, 37), (30, 36), (29, 35),
    (28, 34), (27, 33), (26, 32), (25, 31), (24, 30),
    (23, 29), (22, 28), (21, 27)
]

# 更新分类标题和子编号
for old_num, new_num in mappings:
    # 更新分类标题 (### XX.)
    content = re.sub(
        rf'^### {old_num}\. ',
        f'### {new_num}. ',
        content,
        flags=re.MULTILINE
    )

    # 更新子编号 (#### XX.Y)
    for sub_num in range(1, 10):
        content = re.sub(
            rf'^#### {old_num}\.{sub_num} ',
            f'#### {new_num}.{sub_num} ',
            content,
            flags=re.MULTILINE
        )

# 写回文件
with open('STRATEGY-CONTENT-LIBRARY.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 策略编号更新完成!")
print("   原编号 21-38 → 新编号 27-44")
