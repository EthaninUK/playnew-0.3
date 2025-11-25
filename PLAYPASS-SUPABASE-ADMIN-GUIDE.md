# 🎛️ PlayPass Supabase 后台管理指南

**版本**: v2.1.0
**日期**: 2025-11-17
**目标**: 配置 Supabase 后台以便管理 PlayPass 定价和奖励规则

---

## 📋 目录

1. [访问 Supabase Dashboard](#访问-supabase-dashboard)
2. [配置定价规则表](#配置定价规则表-playpass_pricing_config)
3. [配置奖励规则表](#配置奖励规则表-playpass_reward_config)
4. [常见操作指南](#常见操作指南)
5. [安全注意事项](#安全注意事项)

---

## 🔑 访问 Supabase Dashboard

### 1. 登录 Supabase

访问: https://supabase.com/dashboard

登录您的 Supabase 账号

### 2. 选择项目

项目 URL: `cujpgrzjmmttysphjknu`

完整访问地址:
```
https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu
```

### 3. 进入 Table Editor

左侧菜单 → **Table Editor**

您应该能看到以下 PlayPass 相关表:
- ✅ `user_playpass`
- ✅ `playpass_transactions`
- ✅ `playpass_tasks`
- ✅ `user_task_progress`
- ✅ `user_unlocked_content`
- ✅ **`playpass_pricing_config`** ⭐ (定价规则)
- ✅ **`playpass_reward_config`** ⭐ (奖励规则)

---

## 💰 配置定价规则表 (playpass_pricing_config)

### 表字段说明

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `id` | UUID | 主键 | 自动生成 |
| `config_key` | VARCHAR(100) | 规则唯一标识 | `strategy_high_risk` |
| `config_name` | VARCHAR(200) | 规则名称 | `高风险策略定价` |
| `content_type` | VARCHAR(50) | 内容类型 | `strategy` / `arbitrage` / `news` / `gossip` |
| `pp_price` | INT | PP 价格 | `100` |
| `membership_discounts` | JSONB | 会员折扣 | `{"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.0}` |
| `apply_conditions` | JSONB | 应用条件 | `{"risk_level": [4, 5]}` |
| `priority` | INT | 优先级 | `100` (越大越优先) |
| `is_active` | BOOLEAN | 是否启用 | `true` |
| `free_preview_length` | INT | 免费预览长度 | `500` |
| `is_free_for_max` | BOOLEAN | MAX 会员免费 | `true` |
| `description` | TEXT | 说明 | 规则描述 |
| `created_at` | TIMESTAMP | 创建时间 | 自动生成 |
| `updated_at` | TIMESTAMP | 更新时间 | 自动生成 |

### 查看现有定价规则

1. 点击 `playpass_pricing_config` 表
2. 查看现有的 9 条定价规则:
   - 普通策略默认定价 (50 PP)
   - 高风险策略定价 (100 PP)
   - 空投策略免费 (0 PP)
   - 低风险套利定价 (30 PP)
   - 中风险套利定价 (50 PP)
   - 高风险套利定价 (100 PP)
   - 新闻免费 (0 PP)
   - 八卦内容定价 (5 PP)
   - Play Exchange 高级策略 (200 PP)

### 修改定价规则

#### 方法 1: 通过 Table Editor 修改

1. 点击要修改的行
2. 点击 **Edit** 按钮
3. 修改 `pp_price` 字段
4. 点击 **Save**
5. ✅ 修改立即生效!

**示例**: 将高风险策略价格从 100 PP 改为 150 PP

```
1. 找到 config_key = 'strategy_high_risk' 的行
2. 点击 Edit
3. 修改 pp_price: 100 → 150
4. Save
```

#### 方法 2: 通过 SQL Editor 修改

左侧菜单 → **SQL Editor** → **New query**

```sql
-- 修改高风险策略价格
UPDATE playpass_pricing_config
SET pp_price = 150,
    updated_at = NOW()
WHERE config_key = 'strategy_high_risk';
```

点击 **Run** 执行

### 添加新的定价规则

#### 示例 1: VIP 专属内容定价

```sql
INSERT INTO playpass_pricing_config (
  config_key,
  config_name,
  content_type,
  pp_price,
  apply_conditions,
  membership_discounts,
  priority,
  is_active,
  description
) VALUES (
  'strategy_vip_exclusive',
  'VIP 专属策略',
  'strategy',
  500,
  '{"is_vip": true}'::jsonb,
  '{"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.0}'::jsonb,
  200,
  true,
  'VIP 专属高级策略定价'
);
```

#### 示例 2: 限时优惠定价

```sql
INSERT INTO playpass_pricing_config (
  config_key,
  config_name,
  content_type,
  pp_price,
  apply_conditions,
  membership_discounts,
  priority,
  is_active,
  description,
  valid_from,
  valid_until
) VALUES (
  'strategy_weekend_sale',
  '周末特惠策略',
  'strategy',
  30,
  '{"category_l1": "defi"}'::jsonb,
  '{"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.0}'::jsonb,
  150,
  true,
  '周末 DeFi 策略 40% OFF',
  '2025-12-21',
  '2025-12-22'
);
```

### 条件匹配语法

`apply_conditions` 字段支持以下条件类型:

#### 1. 数组条件 (值必须在数组中)

```json
{
  "risk_level": [4, 5]
}
```
匹配 `risk_level` 为 4 或 5 的内容

#### 2. 精确匹配

```json
{
  "category_l1": "airdrop"
}
```
匹配 `category_l1` 等于 "airdrop" 的内容

#### 3. 范围条件

```json
{
  "apy_min": {"min": 10, "max": 50}
}
```
匹配 `apy_min` 在 10-50 之间的内容

#### 4. 组合条件

```json
{
  "risk_level": [4, 5],
  "category_l1": "defi",
  "apy_min": {"min": 20}
}
```
匹配同时满足所有条件的内容

### 会员折扣配置

`membership_discounts` 字段格式:

```json
{
  "0": 1.0,   // Free 会员: 原价
  "1": 0.9,   // Pro 会员: 9折 (10% OFF)
  "2": 0.7,   // Premium 会员: 7折 (30% OFF)
  "3": 0.5,   // Partner 会员: 5折 (50% OFF)
  "4": 0.0    // MAX 会员: 免费
}
```

**示例**: 设置更大的会员优惠

```json
{
  "0": 1.0,   // Free: 100 PP
  "1": 0.8,   // Pro: 80 PP (20% OFF)
  "2": 0.5,   // Premium: 50 PP (50% OFF)
  "3": 0.3,   // Partner: 30 PP (70% OFF)
  "4": 0.0    // MAX: 免费
}
```

### 优先级规则

- 优先级数值越大,越优先匹配
- API 会按 `priority DESC` 排序
- 匹配到第一个符合条件的规则后停止

**示例优先级设置**:
```
特殊活动: 200
VIP 内容: 150
分类规则: 100
默认规则: 50
```

---

## 🎁 配置奖励规则表 (playpass_reward_config)

### 表字段说明

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `id` | UUID | 主键 | 自动生成 |
| `reward_key` | VARCHAR(100) | 奖励唯一标识 | `daily_signin` |
| `reward_name` | VARCHAR(200) | 奖励名称 | `每日签到` |
| `action_type` | VARCHAR(50) | 行为类型 | `daily_signin` |
| `pp_amount` | INT | 基础奖励 PP | `10` |
| `apply_multiplier` | BOOLEAN | 应用会员倍率 | `true` |
| `reward_multiplier` | DECIMAL(3,2) | 活动倍数 | `1.0` (双倍活动设为 `2.0`) |
| `limit_type` | VARCHAR(20) | 限制类型 | `daily` / `weekly` / `monthly` |
| `limit_count` | INT | 限制次数 | `1` |
| `cooldown_minutes` | INT | 冷却时间 | `0` |
| `count_towards_daily_limit` | BOOLEAN | 计入每日上限 | `true` |
| `priority` | INT | 优先级 | `100` |
| `is_active` | BOOLEAN | 是否启用 | `true` |
| `valid_from` | DATE | 生效日期 | `2025-12-21` |
| `valid_until` | DATE | 失效日期 | `2025-12-22` |
| `description` | TEXT | 说明 | 奖励描述 |
| `icon` | VARCHAR(50) | 图标 | `📅` |
| `display_order` | INT | 显示顺序 | `1` |

### 查看现有奖励规则

1. 点击 `playpass_reward_config` 表
2. 查看现有的 15 条奖励规则:
   - 每日签到 (10 PP)
   - 阅读策略 (5 PP)
   - 阅读套利 (5 PP)
   - 分享内容 (3 PP)
   - 优质评论 (20 PP)
   - 发布策略 (200 PP)
   - ... 等

### 修改奖励金额

#### 方法 1: 通过 Table Editor 修改

```
1. 找到 reward_key = 'daily_signin' 的行
2. 点击 Edit
3. 修改 pp_amount: 10 → 20
4. Save
```

#### 方法 2: 通过 SQL 修改

```sql
-- 提高每日签到奖励
UPDATE playpass_reward_config
SET pp_amount = 20,
    updated_at = NOW()
WHERE reward_key = 'daily_signin';
```

### 举办双倍 PP 活动

#### 周末双倍 PP 活动

```sql
-- 创建周末双倍阅读奖励活动
INSERT INTO playpass_reward_config (
  reward_key,
  reward_name,
  action_type,
  pp_amount,
  apply_multiplier,
  reward_multiplier,
  limit_type,
  limit_count,
  priority,
  is_active,
  valid_from,
  valid_until,
  description
) VALUES (
  'weekend_double_read',
  '周末双倍阅读奖励',
  'read_strategy',
  5,
  true,
  2.0,              -- 双倍!
  'daily',
  10,
  150,              -- 高优先级
  true,
  '2025-12-21',
  '2025-12-22',
  '周末阅读策略获得双倍 PP'
);
```

**计算**:
```
基础奖励: 5 PP
活动倍数: 2.0x
会员倍率 (Pro): 1.2x
最终奖励: 5 × 2.0 × 1.2 = 12 PP
```

#### 节日三倍 PP 活动

```sql
-- 春节三倍签到活动
UPDATE playpass_reward_config
SET reward_multiplier = 3.0,
    valid_from = '2025-01-28',
    valid_until = '2025-02-04',
    reward_name = '春节三倍签到',
    description = '春节期间签到获得三倍 PP',
    is_active = true
WHERE reward_key = 'daily_signin';
```

### 添加新的奖励规则

#### 示例 1: 首次发布策略奖励

```sql
INSERT INTO playpass_reward_config (
  reward_key,
  reward_name,
  action_type,
  pp_amount,
  apply_multiplier,
  limit_type,
  limit_count,
  priority,
  is_active,
  description,
  icon
) VALUES (
  'first_publish_strategy',
  '首次发布策略',
  'publish_strategy',
  500,
  false,            -- 不应用会员倍率
  'total',          -- 终身只能获得一次
  1,
  200,
  true,
  '首次发布策略获得 500 PP 新手奖励',
  '🎉'
);
```

#### 示例 2: 邀请好友奖励

```sql
INSERT INTO playpass_reward_config (
  reward_key,
  reward_name,
  action_type,
  pp_amount,
  apply_multiplier,
  limit_type,
  limit_count,
  priority,
  is_active,
  description,
  icon
) VALUES (
  'invite_friend',
  '邀请好友',
  'invite_friend',
  100,
  true,
  'total',
  10,               -- 最多邀请 10 人
  100,
  true,
  '每邀请一位好友注册获得 100 PP',
  '👥'
);
```

### 限制类型说明

| limit_type | 说明 | 重置时间 |
|------------|------|----------|
| `daily` | 每日限制 | 每天 00:00 重置 |
| `weekly` | 每周限制 | 每周一 00:00 重置 |
| `monthly` | 每月限制 | 每月 1 日 00:00 重置 |
| `total` | 终身限制 | 永不重置 |
| `null` | 无限制 | - |

### 冷却时间设置

防止用户刷奖励:

```sql
-- 阅读策略设置 5 分钟冷却
UPDATE playpass_reward_config
SET cooldown_minutes = 5
WHERE reward_key = 'read_strategy';
```

用户必须等待 5 分钟后才能再次获得阅读奖励

---

## 📖 常见操作指南

### 操作 1: 修改内容价格

**场景**: 将高风险策略价格从 100 PP 改为 80 PP

**步骤**:
1. 打开 Supabase Dashboard
2. Table Editor → `playpass_pricing_config`
3. 找到 `config_key = 'strategy_high_risk'`
4. 点击该行的 Edit 按钮
5. 修改 `pp_price`: `100` → `80`
6. 点击 Save
7. ✅ 前端 API 立即读取新价格!

**验证**:
```bash
curl -X POST 'http://localhost:3000/api/playpass/get-price' \
  -H 'Content-Type: application/json' \
  -d '{
    "content_id": "strategy-id",
    "content_type": "strategy",
    "user_membership_level": 0
  }'
```

### 操作 2: 举办限时活动

**场景**: 周末双倍签到活动

**步骤**:
1. SQL Editor → New query
2. 粘贴以下 SQL:

```sql
UPDATE playpass_reward_config
SET reward_multiplier = 2.0,
    valid_from = '2025-12-21',
    valid_until = '2025-12-22',
    updated_at = NOW()
WHERE reward_key = 'daily_signin';
```

3. Run
4. ✅ 活动自动在指定时间生效和结束!

### 操作 3: 临时禁用某个奖励

**场景**: 暂时禁用分享奖励

**步骤**:
```sql
UPDATE playpass_reward_config
SET is_active = false
WHERE reward_key = 'share_content';
```

**恢复**:
```sql
UPDATE playpass_reward_config
SET is_active = true
WHERE reward_key = 'share_content';
```

### 操作 4: 查看所有定价规则

```sql
SELECT
  config_key,
  config_name,
  content_type,
  pp_price,
  priority,
  is_active
FROM playpass_pricing_config
ORDER BY priority DESC, content_type, pp_price DESC;
```

### 操作 5: 查看所有奖励规则

```sql
SELECT
  reward_key,
  reward_name,
  action_type,
  pp_amount,
  reward_multiplier,
  limit_type,
  is_active
FROM playpass_reward_config
ORDER BY display_order;
```

### 操作 6: 批量更新会员折扣

**场景**: 所有策略都提高会员折扣力度

```sql
UPDATE playpass_pricing_config
SET membership_discounts = '{
  "0": 1.0,
  "1": 0.8,
  "2": 0.5,
  "3": 0.3,
  "4": 0.0
}'::jsonb,
updated_at = NOW()
WHERE content_type = 'strategy';
```

---

## 🔒 安全注意事项

### 1. 权限管理

确保只有管理员可以修改这两个表:

```sql
-- 撤销公开访问权限
REVOKE ALL ON playpass_pricing_config FROM anon, authenticated;
REVOKE ALL ON playpass_reward_config FROM anon, authenticated;

-- 只允许 service_role 访问
GRANT ALL ON playpass_pricing_config TO service_role;
GRANT ALL ON playpass_reward_config TO service_role;
```

### 2. 数据验证

修改数据前请验证:

✅ `pp_price` 必须 >= 0
✅ `pp_amount` 必须 > 0
✅ `priority` 建议在 0-500 范围
✅ `reward_multiplier` 建议在 0.1-10.0 范围
✅ 日期格式正确 (`YYYY-MM-DD`)

### 3. 备份数据

重要修改前先备份:

```sql
-- 备份定价规则
CREATE TABLE playpass_pricing_config_backup AS
SELECT * FROM playpass_pricing_config;

-- 备份奖励规则
CREATE TABLE playpass_reward_config_backup AS
SELECT * FROM playpass_reward_config;
```

### 4. 测试修改

修改后建议测试:

1. 使用 API 测试获取价格
2. 使用 API 测试获取奖励
3. 前端测试解锁流程
4. 前端测试签到流程

---

## 🎯 实用 SQL 查询

### 查询最贵的内容

```sql
SELECT
  config_name,
  content_type,
  pp_price,
  apply_conditions
FROM playpass_pricing_config
WHERE is_active = true
ORDER BY pp_price DESC
LIMIT 10;
```

### 查询最慷慨的奖励

```sql
SELECT
  reward_name,
  action_type,
  pp_amount,
  reward_multiplier,
  pp_amount * reward_multiplier AS max_reward
FROM playpass_reward_config
WHERE is_active = true
ORDER BY max_reward DESC
LIMIT 10;
```

### 查询当前活动

```sql
SELECT
  reward_name,
  action_type,
  reward_multiplier,
  valid_from,
  valid_until
FROM playpass_reward_config
WHERE is_active = true
  AND reward_multiplier > 1.0
  AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
  AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
ORDER BY reward_multiplier DESC;
```

### 统计定价分布

```sql
SELECT
  content_type,
  COUNT(*) as rule_count,
  MIN(pp_price) as min_price,
  MAX(pp_price) as max_price,
  AVG(pp_price)::INT as avg_price
FROM playpass_pricing_config
WHERE is_active = true
GROUP BY content_type
ORDER BY avg_price DESC;
```

---

## 📝 快速参考

### 常用价格

- 免费内容: `0` PP
- 普通内容: `30-50` PP
- 中等内容: `80-100` PP
- 高级内容: `150-200` PP
- VIP 内容: `500+` PP

### 常用奖励

- 每日签到: `10` PP
- 阅读内容: `5` PP
- 分享内容: `3` PP
- 优质评论: `20` PP
- 发布内容: `200` PP

### 活动倍数

- 正常: `1.0x`
- 双倍活动: `2.0x`
- 三倍活动: `3.0x`
- 限时特惠: `0.5x` (配合高价格使用)

---

## 🆘 常见问题

**Q: 修改价格后需要重启服务吗?**
A: 不需要!API 每次都从数据库读取最新配置。

**Q: 活动时间是否自动生效和结束?**
A: 是的!API 会检查 `valid_from` 和 `valid_until` 字段。

**Q: 如何快速禁用某个规则?**
A: 设置 `is_active = false` 即可。

**Q: 优先级如何设置?**
A: 特殊规则用高数值 (200+),默认规则用低数值 (50-100)。

**Q: MAX 会员一定免费吗?**
A: 默认是,但可以通过 `is_free_for_max = false` 设置为收费。

**Q: 会员倍率在哪里配置?**
A: 会员倍率固定在代码中 (1.0/1.2/1.5/2.0),但折扣在定价规则的 `membership_discounts` 字段。

---

## ✅ 配置检查清单

配置完成后,检查以下项目:

- [ ] 所有定价规则都有正确的 `priority`
- [ ] 所有奖励规则都有正确的 `limit_type`
- [ ] 活动时间设置正确 (`valid_from`, `valid_until`)
- [ ] `is_active` 字段设置正确
- [ ] 会员折扣配置合理
- [ ] 测试 API 返回正确价格
- [ ] 测试 API 返回正确奖励
- [ ] 前端解锁功能正常
- [ ] 前端签到功能正常

---

**最后更新**: 2025-11-17
**版本**: v2.1.0
**项目**: PlayNew.ai PlayPass 系统
**作者**: Claude Code (Anthropic)
