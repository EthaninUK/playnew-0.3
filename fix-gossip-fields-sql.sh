#!/bin/bash

echo "=== 修复gossip记录缺失字段 ==="

# 使用PostgreSQL直接更新
# 1. 设置content_published_at为published_at（如果published_at存在）
# 2. 计算hotness_score = credibility_score * 0.5 + likes_count * 0.3 + comments_count * 2

PGPASSWORD=Mygcdjmyxzg2026! psql -h localhost -U directus -d directus_play <<EOF

-- 显示更新前的状态
SELECT
  id,
  title,
  hotness_score,
  content_published_at,
  credibility_score,
  likes_count,
  comments_count
FROM gossip
WHERE news_type = 'gossip'
  AND content_published_at IS NULL
ORDER BY published_at DESC
LIMIT 5;

-- 更新content_published_at
UPDATE gossip
SET content_published_at = COALESCE(published_at, NOW())
WHERE news_type = 'gossip'
  AND content_published_at IS NULL;

-- 更新hotness_score
UPDATE gossip
SET hotness_score = ROUND(
  COALESCE(credibility_score, 60) * 0.5 +
  COALESCE(likes_count, 0) * 0.3 +
  COALESCE(comments_count, 0) * 2
)::INTEGER
WHERE news_type = 'gossip'
  AND hotness_score IS NULL;

-- 显示更新后的状态
SELECT
  COUNT(*) as total_gossip,
  COUNT(CASE WHEN hotness_score IS NOT NULL THEN 1 END) as with_hotness,
  COUNT(CASE WHEN content_published_at IS NOT NULL THEN 1 END) as with_published_at
FROM gossip
WHERE news_type = 'gossip';

-- 显示最热门的5条gossip
SELECT
  title,
  hotness_score,
  TO_CHAR(content_published_at, 'YYYY-MM-DD HH24:MI') as published_time
FROM gossip
WHERE news_type = 'gossip'
  AND status = 'published'
ORDER BY hotness_score DESC, content_published_at DESC
LIMIT 5;

EOF

echo ""
echo "✓ 修复完成！"
