#!/usr/bin/env python3

# 读取文件
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 修复第26行：将 \` 改回 `
fixed_lines = []
for i, line in enumerate(lines, 1):
    # 如果是第26行，修复开头的反引号
    if i == 26 and line.strip().startswith('content: \\`'):
        line = line.replace('content: \\`', 'content: `', 1)
    fixed_lines.append(line)

# 保存
with open('/Users/m1/PlayNew_0.3/add-strategies-6-1-and-6-2.js', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print('✅ 已修复第26行的转义反引号')
