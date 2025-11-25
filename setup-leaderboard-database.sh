#!/bin/bash

# =====================================================
# 排行榜系统 - 数据库设置脚本
# =====================================================

echo "🚀 开始设置排行榜数据库..."

# 数据库连接信息
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="directus_play"
DB_USER="directus"
DB_PASSWORD="Mygcdjmyxzg2026!"

# 执行迁移脚本
echo "📝 执行数据库迁移..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f sql/001-add-leaderboard-fields.sql

if [ $? -eq 0 ]; then
  echo "✅ 数据库迁移成功!"
  echo ""
  echo "📊 检查迁移结果..."

  # 检查新增字段
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT
      column_name,
      data_type,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'strategies'
    AND column_name IN ('hotness_score', 'share_count', 'comment_count', 'featured_order', 'last_hotness_update')
    ORDER BY column_name;
  "

  echo ""
  echo "🎯 热度分 Top 10:"
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT
      title,
      hotness_score,
      view_count,
      bookmark_count
    FROM strategies
    WHERE status = 'published'
    ORDER BY hotness_score DESC
    LIMIT 10;
  "

  echo ""
  echo "✨ 数据库设置完成!"
else
  echo "❌ 数据库迁移失败,请检查错误信息"
  exit 1
fi