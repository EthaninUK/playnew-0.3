const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTrigger() {
  console.log('🔧 设置自动积分发放系统...\n');

  try {
    // 由于 Supabase 不允许直接执行 ALTER TABLE，
    // 我们需要使用 Supabase Dashboard 的 SQL Editor
    // 或者通过 Directus API 添加字段

    console.log('📝 需要执行的步骤:\n');

    console.log('方案 A: 使用 Supabase Dashboard');
    console.log('  1. 访问: https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu');
    console.log('  2. 进入 SQL Editor');
    console.log('  3. 执行以下 SQL:\n');

    const sql = `
-- 1. 添加字段
ALTER TABLE user_submitted_plays
ADD COLUMN IF NOT EXISTS credits_awarded_at TIMESTAMP;

-- 2. 创建自动发放积分的函数
CREATE OR REPLACE FUNCTION auto_award_credits()
RETURNS TRIGGER AS $$
DECLARE
  current_user_credits INTEGER;
BEGIN
  -- 检查发放条件
  IF NEW.status = 'approved'
     AND (OLD.status IS NULL OR OLD.status != 'approved')
     AND NEW.credits_awarded_at IS NULL
     AND NEW.credits_awarded > 0 THEN

    -- 获取当前积分
    SELECT COALESCE(credits, 0) INTO current_user_credits
    FROM user_profiles
    WHERE id = NEW.user_id;

    -- 增加积分
    UPDATE user_profiles
    SET credits = current_user_credits + NEW.credits_awarded
    WHERE id = NEW.user_id;

    -- 标记已发放
    NEW.credits_awarded_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 创建触发器
DROP TRIGGER IF EXISTS trigger_auto_award_credits ON user_submitted_plays;

CREATE TRIGGER trigger_auto_award_credits
  BEFORE INSERT OR UPDATE ON user_submitted_plays
  FOR EACH ROW
  EXECUTE FUNCTION auto_award_credits();
`;

    console.log(sql);
    console.log('\n方案 B: 使用应用层自动化');
    console.log('  由于无法直接操作 Supabase 数据库，我将创建一个定时任务');
    console.log('  每分钟检查新审核通过的记录并自动发放积分\n');

    console.log('⚡ 现在创建应用层解决方案...\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

setupTrigger();
