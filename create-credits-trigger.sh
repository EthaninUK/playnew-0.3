#!/bin/bash

# 通过 Docker 在 PostgreSQL 中创建触发器

echo "🔧 创建自动积分发放触发器..."

docker-compose exec -T directus-db psql -U directus -d directus_play << 'EOF'

-- 1. 添加字段用于跟踪积分是否已发放
ALTER TABLE user_submitted_plays
ADD COLUMN IF NOT EXISTS credits_awarded_at TIMESTAMP;

-- 2. 创建函数：自动发放积分
CREATE OR REPLACE FUNCTION auto_award_credits()
RETURNS TRIGGER AS $$
DECLARE
  current_user_credits INTEGER;
BEGIN
  -- 检查是否满足发放条件：
  -- 1. 新状态是 approved
  -- 2. 旧状态不是 approved（首次通过）
  -- 3. 还没有发放过积分
  IF NEW.status = 'approved'
     AND (OLD.status IS NULL OR OLD.status != 'approved')
     AND NEW.credits_awarded_at IS NULL
     AND NEW.credits_awarded > 0 THEN

    -- 获取用户当前积分
    SELECT COALESCE(credits, 0) INTO current_user_credits
    FROM user_profiles
    WHERE id = NEW.user_id;

    -- 增加积分
    UPDATE user_profiles
    SET credits = current_user_credits + NEW.credits_awarded
    WHERE id = NEW.user_id;

    -- 标记积分已发放
    NEW.credits_awarded_at = NOW();

    RAISE NOTICE 'Awarded % credits to user %. New balance: %',
      NEW.credits_awarded,
      NEW.user_id,
      current_user_credits + NEW.credits_awarded;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_auto_award_credits ON user_submitted_plays;

-- 4. 创建新触发器
CREATE TRIGGER trigger_auto_award_credits
  BEFORE INSERT OR UPDATE ON user_submitted_plays
  FOR EACH ROW
  EXECUTE FUNCTION auto_award_credits();

-- 5. 验证触发器
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_award_credits';

EOF

echo "✅ 触发器创建完成！"
echo ""
echo "📍 现在的工作流程："
echo "   1. 用户在会员中心提交玩法"
echo "   2. 管理员在 Directus 后台审核"
echo "   3. 修改 status 为 'approved' 并设置 credits_awarded"
echo "   4. 保存时，数据库自动给用户增加积分 ✨"
echo "   5. 用户刷新页面即可看到积分更新"
echo ""
