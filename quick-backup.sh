#!/bin/bash
# PlayNew 快速备份脚本
# 用法：./quick-backup.sh

echo "🔄 开始备份 PlayNew 数据..."
echo ""

# 运行备份脚本
node /Users/m1/PlayNew_0.3/backup-all-data.js

echo ""
echo "📋 备份文件位置: /Users/m1/PlayNew_0.3/backups/"
echo ""

# 显示最新的备份文件
cd /Users/m1/PlayNew_0.3/backups
echo "📁 最新备份文件:"
ls -lt *.json *.txt *.sh 2>/dev/null | head -5 | awk '{print "   ", $9, "(" $5 ")"}'

echo ""
echo "✅ 备份完成！"
echo ""
echo "💡 提示："
echo "   - 查看详细报告: cat backups/backup_report_*.txt | tail -50"
echo "   - 恢复数据: cd backups && ./restore_*.sh"
