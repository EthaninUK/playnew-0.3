# 🚀 Phase 1 部署指南 - 数据库迁移

**版本**: v1.0
**创建时间**: 2025-11-19
**预计时间**: 30-60 分钟

---

## 📋 部署清单

- [ ] 执行 Directus 配置表迁移
- [ ] 执行 Supabase 支付表迁移
- [ ] 在 Directus 后台配置钱包地址
- [ ] 验证数据库表和触发器
- [ ] 测试充值触发器

---

## 1️⃣ 执行 Directus 配置表迁移

### 步骤 1.1: 连接到 Directus 数据库

```bash
# 方式 1: 通过 Docker 容器连接
docker exec -it playnew_03-directus-postgres-1 psql -U directus -d directus_play

# 方式 2: 使用本地 psql 客户端
PGPASSWORD=Mygcdjmyxzg2026! psql -h localhost -p 5432 -U directus -d directus_play
```

### 步骤 1.2: 执行 SQL 脚本

```bash
# 在 psql 中执行
\i /Users/m1/PlayNew_0.3/sql/001_create_web3_config_in_directus.sql

# 或者使用命令行直接执行
docker exec -i playnew_03-directus-postgres-1 psql -U directus -d directus_play < /Users/m1/PlayNew_0.3/sql/001_create_web3_config_in_directus.sql
```

### 步骤 1.3: 验证结果

```sql
-- 检查表是否创建
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('web3_system_config', 'web3_pricing_config', 'web3_supported_tokens');

-- 检查默认数据
SELECT config_key, config_name, chain_name FROM web3_system_config;
SELECT config_key, content_type, price_usd, price_pp FROM web3_pricing_config;
SELECT token_symbol, chain_name, is_active FROM web3_supported_tokens;
```

**预期结果**:
```
✅ web3_system_config 表创建成功
✅ web3_pricing_config 表创建成功
✅ web3_supported_tokens 表创建成功
✅ 默认配置数据插入成功
✅ Phase 1 - Directus 配置表创建完成!
```

---

## 2️⃣ 执行 Supabase 支付表迁移

### 步骤 2.1: 登录 Supabase Dashboard

1. 访问: https://app.supabase.com
2. 选择你的项目: `cujpgrzjmmttysphjknu`
3. 点击左侧菜单 `SQL Editor`

### 步骤 2.2: 执行 SQL 脚本

1. 点击 `New Query`
2. 复制粘贴文件内容: `/Users/m1/PlayNew_0.3/sql/002_create_web3_payments_in_supabase.sql`
3. 点击 `Run` 执行

或者使用本地脚本:

```bash
# 将脚本上传到 Supabase
cat /Users/m1/PlayNew_0.3/sql/002_create_web3_payments_in_supabase.sql | pbcopy
# 然后粘贴到 Supabase SQL Editor 中执行
```

### 步骤 2.3: 验证结果

在 Supabase SQL Editor 中执行:

```sql
-- 检查表是否创建
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('web3_payments', 'user_content_access', 'credit_transactions');

-- 检查 user_profiles 新字段
SELECT column_name FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name IN ('credits', 'total_credits_earned', 'total_recharged_usd');

-- 检查触发器
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_auto_credit_recharge';
```

**预期结果**:
```
✅ web3_payments 表创建成功
✅ user_profiles.credits 字段已添加
✅ user_content_access 表已扩展
✅ 自动充值积分触发器已创建
✅ Phase 1 - Supabase 支付记录表创建完成!
```

---

## 3️⃣ 配置 Directus 后台

### 步骤 3.1: 登录 Directus 后台

```bash
# 访问 Directus 后台
open http://localhost:8055/admin

# 登录信息
Email: the_uk1@outlook.com
Password: Mygcdjmyxzg2026!
```

### 步骤 3.2: 配置新创建的表

Directus 会自动检测到新表,但需要手动配置显示和权限。

#### 3.2.1 配置 `web3_system_config` 表

1. 进入 `Settings` > `Data Model`
2. 找到 `web3_system_config` 表
3. 点击进入,配置字段显示:
   - `config_name`: 设置为 "配置名称", 显示模板为 `{{config_name}}`
   - `platform_wallet_address`: 设置为 "平台钱包地址", 显示为只读
   - `rpc_url`: 设置为 "RPC 节点 URL"
   - `is_active`: 设置为 "是否启用", 显示为切换开关

4. 配置表图标和显示名称:
   - Collection Name: `Web3 系统配置`
   - Icon: `settings`
   - Note: `管理 Web3 支付的钱包地址、RPC 节点等配置`

#### 3.2.2 配置 `web3_pricing_config` 表

1. 进入 `Settings` > `Data Model`
2. 找到 `web3_pricing_config` 表
3. 配置字段:
   - `config_name`: "配置名称"
   - `content_type`: "内容类型", 显示为下拉选择
   - `price_usd`: "USD 价格", 显示为货币输入
   - `price_pp`: "PP 积分价格", 显示为数字输入
   - `recharge_ratio`: "充值比例 (1 USD = N PP)"
   - `recharge_bonus_percent`: "充值赠送百分比"

4. 配置表显示:
   - Collection Name: `Web3 定价配置`
   - Icon: `attach_money`
   - Note: `管理内容定价和充值规则`

#### 3.2.3 配置 `web3_supported_tokens` 表

1. 配置字段:
   - `token_symbol`: "代币符号"
   - `token_name`: "代币名称"
   - `chain_name`: "所属链"
   - `is_active`: "是否启用"
   - `is_preferred`: "是否推荐"

2. 配置表显示:
   - Collection Name: `支持的代币`
   - Icon: `toll`
   - Note: `管理平台支持的支付代币`

### 步骤 3.3: 更新钱包地址

1. 进入 `Content` > `Web3 系统配置`
2. 找到 `ethereum_config` 记录,点击编辑
3. 更新 `platform_wallet_address` 为你的实际钱包地址
4. 重复操作更新 `polygon_config` 和 `base_config`

**示例**:
```
Ethereum 钱包: 0xYourEthereumWalletAddress
Polygon 钱包: 0xYourPolygonWalletAddress
Base 钱包: 0xYourBaseWalletAddress
```

### 步骤 3.4: 配置 RPC 节点 (可选)

如果你想使用商业 RPC 节点:

1. 编辑 `ethereum_config` 记录
2. 更新 `rpc_provider` 为 `alchemy` 或 `infura`
3. 更新 `rpc_url` 为你的 RPC URL
4. 更新 `rpc_api_key` 为你的 API Key

**示例 (Alchemy)**:
```
RPC Provider: alchemy
RPC URL: https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
RPC API Key: YOUR_API_KEY
```

### 步骤 3.5: 调整定价策略 (可选)

1. 进入 `Content` > `Web3 定价配置`
2. 编辑各个定价规则:
   - `strategy_default`: 策略默认定价 (建议 $5-$20)
   - `arbitrage_default`: 套利信号定价 (建议 $3-$10)
   - `recharge_tier_X`: 充值档位和赠送比例

3. 调整充值比例和赠送:
   ```
   小额充值 ($1-$9):   1 USD = 100 PP, 无赠送
   中额充值 ($10-$49):  1 USD = 100 PP, 赠送 10%
   大额充值 ($50-$99):  1 USD = 100 PP, 赠送 20%
   超大额 ($100+):      1 USD = 100 PP, 赠送 30%
   ```

---

## 4️⃣ 配置 Directus 权限

### 步骤 4.1: 设置管理员权限

1. 进入 `Settings` > `Access Control` > `Roles`
2. 找到 `Administrator` 角色
3. 确保有以下权限:
   - `web3_system_config`: 全部权限 (CRUD)
   - `web3_pricing_config`: 全部权限 (CRUD)
   - `web3_supported_tokens`: 全部权限 (CRUD)

### 步骤 4.2: 设置 Public 角色权限 (API 访问)

1. 找到 `Public` 角色
2. 添加只读权限:
   - `web3_system_config`: 只读 (仅 `is_active=true` 的记录)
   - `web3_pricing_config`: 只读 (仅 `is_active=true` 的记录)
   - `web3_supported_tokens`: 只读 (仅 `is_active=true` 的记录)

**权限规则示例**:
```json
{
  "is_active": {
    "_eq": true
  },
  "status": {
    "_eq": "published"
  }
}
```

---

## 5️⃣ 测试数据库功能

### 测试 5.1: 测试 Directus 配置读取

```bash
# 测试读取系统配置
curl -s 'http://localhost:8055/items/web3_system_config?filter[is_active][_eq]=true'

# 测试读取定价配置
curl -s 'http://localhost:8055/items/web3_pricing_config?filter[content_type][_eq]=strategy'

# 测试读取支持的代币
curl -s 'http://localhost:8055/items/web3_supported_tokens?filter[chain_id][_eq]=1'
```

**预期结果**: 返回 JSON 格式的配置数据

### 测试 5.2: 测试 Supabase 表结构

登录 Supabase Dashboard > Table Editor,检查:

- [ ] `web3_payments` 表存在
- [ ] `user_profiles` 表有 `credits` 字段
- [ ] `user_content_access` 表有 `payment_method` 字段
- [ ] `credit_transactions` 表存在

### 测试 5.3: 测试充值触发器

在 Supabase SQL Editor 中执行:

```sql
-- 1. 创建测试用户 (如果不存在)
-- 注意: 替换为你的实际用户 ID
DO $$
DECLARE
  v_test_user_id UUID := 'YOUR_USER_ID_HERE';
BEGIN
  -- 插入用户档案 (如果不存在)
  INSERT INTO user_profiles (id, username, credits)
  VALUES (v_test_user_id, 'test_user', 0)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. 插入测试支付记录 (pending 状态)
INSERT INTO web3_payments (
  user_id,
  user_address,
  payment_purpose,
  recharge_pp_amount,
  recharge_bonus_pp,
  recharge_total_pp,
  chain_id,
  chain_name,
  tx_hash,
  from_address,
  to_address,
  token_symbol,
  amount,
  amount_decimal,
  amount_usd,
  status
) VALUES (
  'YOUR_USER_ID_HERE',
  '0xUserWalletAddress',
  'recharge',
  1000, -- 充值 1000 PP
  100,  -- 赠送 100 PP
  1100, -- 总共 1100 PP
  1,
  'ethereum',
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  '0xUserWalletAddress',
  '0xPlatformWalletAddress',
  'USDC',
  '10000000', -- 10 USDC (6 decimals)
  10.0,
  10.0,
  'pending'
) RETURNING id;

-- 3. 更新为 confirmed 状态 (触发自动充值)
UPDATE web3_payments
SET status = 'confirmed', confirmations = 3
WHERE tx_hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

-- 4. 验证用户积分是否增加
SELECT id, username, credits, total_credits_earned, total_recharged_usd
FROM user_profiles
WHERE id = 'YOUR_USER_ID_HERE';

-- 5. 检查积分交易记录
SELECT transaction_type, credits_change, description, created_at
FROM credit_transactions
WHERE user_id = 'YOUR_USER_ID_HERE'
ORDER BY created_at DESC
LIMIT 5;

-- 6. 检查支付记录的 pp_credited 标识
SELECT pp_credited, pp_credited_at
FROM web3_payments
WHERE tx_hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
```

**预期结果**:
```
✅ 用户积分增加 1100 (1000 基础 + 100 赠送)
✅ credit_transactions 表有 2 条记录:
   - web3_recharge: +1000 PP
   - web3_bonus: +100 PP
✅ web3_payments.pp_credited = true
✅ user_profiles.total_recharged_usd = 10.00
```

---

## 6️⃣ 故障排查

### 问题 1: Directus 表未显示

**原因**: Directus 缓存未刷新

**解决方案**:
```bash
# 重启 Directus 容器
docker restart playnew_03-directus-1

# 或清除缓存
docker exec -it playnew_03-directus-1 rm -rf /directus/cache/*
```

### 问题 2: Supabase 权限错误

**原因**: RLS 策略阻止了操作

**解决方案**:
```sql
-- 临时禁用 RLS (仅用于调试)
ALTER TABLE web3_payments DISABLE ROW LEVEL SECURITY;

-- 完成后重新启用
ALTER TABLE web3_payments ENABLE ROW LEVEL SECURITY;
```

### 问题 3: 触发器未执行

**原因**: 触发器可能未正确创建

**解决方案**:
```sql
-- 检查触发器
SELECT tgname, tgenabled FROM pg_trigger
WHERE tgrelid = 'web3_payments'::regclass;

-- 如果未找到,手动创建触发器
-- 重新执行 002_create_web3_payments_in_supabase.sql 中的触发器部分
```

### 问题 4: 钱包地址未生效

**原因**: Directus 缓存或 API 未刷新

**解决方案**:
```bash
# 1. 清除 Directus 缓存
docker exec -it playnew_03-directus-1 rm -rf /directus/cache/*

# 2. 重启 Directus
docker restart playnew_03-directus-1

# 3. 验证配置
curl -s 'http://localhost:8055/items/web3_system_config/2' | jq .data.platform_wallet_address
```

---

## 7️⃣ 完成检查清单

- [ ] ✅ Directus 配置表已创建
  - [ ] web3_system_config 表
  - [ ] web3_pricing_config 表
  - [ ] web3_supported_tokens 表
- [ ] ✅ Supabase 支付表已创建
  - [ ] web3_payments 表
  - [ ] user_profiles 表扩展 (credits 字段)
  - [ ] user_content_access 表扩展
  - [ ] credit_transactions 表
- [ ] ✅ 触发器已创建并测试
  - [ ] auto_credit_recharge_pp 触发器
- [ ] ✅ Directus 后台已配置
  - [ ] 表已在 Data Model 中配置
  - [ ] 权限已设置 (Admin + Public)
  - [ ] 钱包地址已更新
- [ ] ✅ 测试通过
  - [ ] Directus API 可读取配置
  - [ ] 充值触发器正常工作
  - [ ] 积分自动发放

---

## 📊 数据库架构总结

### Directus 数据库 (配置管理)
```
web3_system_config      (系统配置: 钱包地址、RPC 节点)
web3_pricing_config     (定价配置: 内容价格、充值比例)
web3_supported_tokens   (代币配置: 支持的支付代币)
```

### Supabase 数据库 (用户数据)
```
web3_payments           (支付记录: 内容购买 + 积分充值)
user_profiles           (用户档案: 增加 credits 字段)
user_content_access     (访问记录: 增加 payment_method 字段)
credit_transactions     (积分交易: web3_recharge, web3_bonus 等)
```

### 数据流向
```
用户充值 Web3 → web3_payments (pending)
           ↓
     交易验证通过 (confirmed)
           ↓
   触发器: auto_credit_recharge_pp()
           ↓
    user_profiles.credits += PP
           ↓
credit_transactions 记录 (web3_recharge + web3_bonus)
```

---

## 🎯 下一步

Phase 1 完成后,进入 Phase 2:

1. 创建 API 路由:
   - `/api/web3/payment-info` - 获取支付信息
   - `/api/web3/verify-transaction` - 验证交易
   - `/api/web3/recharge-credits` - 充值积分

2. 扩展 Middleware:
   - 添加 HTTP 402 拦截逻辑

3. 前端组件:
   - Web3PaymentDialog (支付弹窗)
   - RechargeDialog (充值弹窗)

---

**文档版本**: v1.0
**创建时间**: 2025-11-19
**更新时间**: 2025-11-19
