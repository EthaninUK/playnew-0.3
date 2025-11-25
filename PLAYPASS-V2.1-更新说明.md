# 🆕 PlayPass 系统 v2.1.0 更新说明

**更新日期**: 2025-11-17
**版本**: v2.0.0 → v2.1.0
**更新类型**: 功能增强 (Feature Enhancement)

---

## 📋 更新概述

本次更新响应您的需求，新增了两个核心的 **Directus 后台配置功能**，让管理员可以灵活调整系统参数，无需修改代码。

---

## ✅ 新增功能

### 🎯 功能 1: 内容定价后台配置

**问题**: 内容定价是否可以在后台修改？
**答案**: ✅ 可以！

#### 新增数据库表

**表名**: `playpass_pricing_config` (PlayPass 定价配置表)

**核心字段**:
- `config_key` - 规则唯一标识
- `config_name` - 规则中文名称
- `content_type` - 内容类型 (strategy, arbitrage, news, gossip, play_exchange)
- `pp_price` - 基础价格 (Free会员价格)
- `membership_discounts` - 会员折扣 (JSON)
- `apply_conditions` - 适用条件 (JSON) - 支持动态定价
- `priority` - 优先级 (数字越大越优先)
- `is_active` - 是否启用

#### 使用场景示例

**示例 1**: 高风险策略定价更贵
```json
{
  "config_key": "strategy_high_risk",
  "config_name": "高风险策略定价",
  "content_type": "strategy",
  "pp_price": 100,
  "apply_conditions": {"risk_level": [4, 5]},
  "priority": 10
}
```

**效果**: 所有风险等级 4-5 的策略自动定价 100 PP

---

**示例 2**: 空投策略免费
```json
{
  "config_key": "strategy_airdrop_free",
  "config_name": "空投策略免费",
  "content_type": "strategy",
  "pp_price": 0,
  "apply_conditions": {"category_l1": "airdrop"}
}
```

**效果**: 所有空投类策略对所有用户免费

---

**示例 3**: 套利信号分级定价
```json
// 低风险: 30 PP
{"config_key": "arbitrage_low_risk", "pp_price": 30, "apply_conditions": {"risk_level": [1, 2]}}

// 中风险: 50 PP
{"config_key": "arbitrage_medium_risk", "pp_price": 50, "apply_conditions": {"risk_level": [3]}}

// 高风险: 100 PP
{"config_key": "arbitrage_high_risk", "pp_price": 100, "apply_conditions": {"risk_level": [4, 5]}}
```

**效果**: 自动根据风险等级匹配不同价格

---

### 🎁 功能 2: PP 奖励后台配置

**问题**: 获取 PP 的数量是否可以在后台修改？
**答案**: ✅ 可以！

#### 新增数据库表

**表名**: `playpass_reward_config` (PlayPass 奖励规则配置表)

**核心字段**:
- `reward_key` - 奖励唯一标识
- `reward_name` - 奖励中文名称
- `action_type` - 行为类型 (daily_signin, read_strategy, comment, share_content 等)
- `pp_amount` - 基础奖励金额
- `apply_multiplier` - 是否应用会员倍率
- `limit_type` - 频率限制 (daily, weekly, monthly, total, none)
- `limit_count` - 每周期最多次数
- `reward_multiplier` - 活动倍数 (支持双倍 PP 活动)
- `cooldown_seconds` - 冷却时间 (防刷)
- `is_active` - 是否启用

#### 使用场景示例

**示例 1**: 每日签到
```json
{
  "reward_key": "daily_signin",
  "reward_name": "每日签到",
  "action_type": "daily_signin",
  "pp_amount": 10,
  "apply_multiplier": true,
  "limit_type": "daily",
  "limit_count": 1
}
```

**实际奖励**:
- Free 用户: 10 × 1.0 = **10 PP**
- Pro 用户: 10 × 1.2 = **12 PP**
- Premium 用户: 10 × 1.5 = **15 PP**
- Partner 用户: 10 × 2.0 = **20 PP**

---

**示例 2**: 阅读策略
```json
{
  "reward_key": "read_strategy",
  "reward_name": "阅读策略",
  "action_type": "read_strategy",
  "pp_amount": 5,
  "apply_multiplier": true,
  "limit_type": "daily",
  "limit_count": 10,
  "cooldown_seconds": 60
}
```

**效果**:
- 每阅读一篇策略奖励 5 PP (应用会员倍率)
- 每天最多 10 次
- 冷却 60 秒 (防止刷新页面刷 PP)

---

**示例 3**: 双倍 PP 活动
```json
{
  "reward_key": "weekend_double_pp",
  "reward_name": "周末双倍 PP",
  "action_type": "read_strategy",
  "pp_amount": 5,
  "apply_multiplier": true,
  "reward_multiplier": 2.0,
  "valid_from": "2025-12-21T00:00:00Z",
  "valid_until": "2025-12-22T23:59:59Z"
}
```

**效果**: 周末阅读策略获得双倍 PP (5 × 2.0 × 会员倍率)

---

## 🎛️ Directus 后台操作

### 修改内容定价

1. 登录 Directus 后台
2. 进入 **PlayPass Pricing Config** 集合
3. 找到要修改的规则 (如 `strategy_high_risk`)
4. 修改 `pp_price` 字段 (如 `100` → `80`)
5. 点击 **Save**
6. ✅ 前端实时生效，无需重启

### 修改 PP 奖励

1. 登录 Directus 后台
2. 进入 **PlayPass Reward Config** 集合
3. 找到要修改的规则 (如 `daily_signin`)
4. 修改 `pp_amount` 字段 (如 `10` → `15`)
5. 点击 **Save**
6. ✅ 实时生效

### 举办双倍 PP 活动

1. 进入 **PlayPass Reward Config**
2. 找到 `read_strategy` 规则
3. 修改 `reward_multiplier`: `1.0` → `2.0`
4. 设置 `valid_from`: `2025-12-21 00:00:00`
5. 设置 `valid_until`: `2025-12-22 23:59:59`
6. Save
7. ✅ 活动自动生效和结束

---

## 📊 新增 API 端点

### API 1: 获取内容价格

```typescript
POST /api/playpass/get-price

// 请求
{
  "content_id": "uuid",
  "content_type": "strategy",
  "user_membership_level": 0
}

// 响应
{
  "success": true,
  "data": {
    "content_id": "uuid",
    "content_type": "strategy",
    "base_price": 100,
    "final_price": 100,
    "membership_level": 0
  }
}
```

### API 2: 获取奖励金额

```typescript
POST /api/playpass/get-reward

// 请求
{
  "action_type": "daily_signin",
  "user_id": "uuid",
  "user_membership_level": 2
}

// 响应
{
  "success": true,
  "data": {
    "action_type": "daily_signin",
    "base_amount": 10,
    "final_amount": 15,
    "reward_multiplier": 1.0,
    "apply_multiplier": true
  }
}
```

---

## 🗂️ 数据库变更

### 新增表

#### 1. playpass_pricing_config
- 用途: 内容定价配置
- 字段数: 15 个
- 支持: 动态定价、会员折扣、条件匹配、优先级排序

#### 2. playpass_reward_config
- 用途: PP 奖励规则配置
- 字段数: 18 个
- 支持: 频率限制、冷却时间、活动倍数、时间范围

### 示例数据已提供

文档中包含了完整的示例数据 SQL 脚本，可以直接导入使用。

---

## 📚 新增文档

### 1. PLAYPASS-SYSTEM-DESIGN.md (已更新)
- **版本**: v2.0.0 → v2.1.0
- **新增章节**: 11. Directus 后台配置指南
- **新增内容**:
  - 表 6: playpass_pricing_config
  - 表 7: playpass_reward_config
  - 完整的配置示例
  - API 实现代码
  - 后台操作流程

### 2. DIRECTUS-后台配置说明.md (新建) 🆕
- **用途**: 快速参考指南
- **内容**:
  - 两个配置功能的详细说明
  - 实际应用示例
  - 后台操作步骤
  - 常见场景解决方案
  - 最佳实践建议

---

## 🎯 核心优势

### ✅ 1. 灵活配置
- 无需修改代码
- 后台实时调整
- 配置立即生效

### ✅ 2. 动态定价
- 支持条件匹配
- 自动分级定价
- 会员差异化折扣

### ✅ 3. 活动支持
- 双倍 PP 活动
- 限时免费
- 临时调整奖励

### ✅ 4. 数据统计
- 实时查看解锁次数
- PP 流水统计
- 规则效果分析

### ✅ 5. 防刷机制
- 频率限制
- 冷却时间
- 额外条件判断

---

## 📈 应用场景

### 运营活动
- ✅ 周末双倍 PP 活动
- ✅ 节日限时免费
- ✅ 新人注册福利

### 定价策略
- ✅ 高风险策略定价更高
- ✅ 新手友好内容免费
- ✅ 会员享受折扣优惠

### 用户增长
- ✅ 鼓励内容创作 (高奖励)
- ✅ 激励社交分享
- ✅ 提高用户活跃度

### 数据分析
- ✅ 查看最受欢迎内容
- ✅ 分析奖励有效性
- ✅ 优化定价策略

---

## 🔧 技术实现

### 定价匹配逻辑
```typescript
// 按优先级匹配第一个符合条件的规则
function getPriceForContent(content, user_level) {
  const rules = await getPricingRules(content.type);

  for (const rule of rules) {
    if (matchesConditions(content, rule.apply_conditions)) {
      const discount = rule.membership_discounts[user_level];
      return rule.pp_price * discount;
    }
  }

  return 0; // 默认免费
}
```

### 奖励计算逻辑
```typescript
// 应用活动倍数和会员倍率
function calculateReward(action_type, user_level) {
  const rule = await getRewardRule(action_type);

  let amount = rule.pp_amount;
  amount *= rule.reward_multiplier; // 活动倍数

  if (rule.apply_multiplier) {
    amount *= MEMBERSHIP_MULTIPLIERS[user_level];
  }

  return Math.round(amount);
}
```

---

## 📝 迁移指南

### 步骤 1: 创建新表

```bash
# 运行 SQL 迁移脚本
psql -h localhost -U directus -d directus_play -f create_playpass_config_tables.sql
```

### 步骤 2: 导入示例数据

```bash
# 导入定价配置
psql -h localhost -U directus -d directus_play -f insert_pricing_config.sql

# 导入奖励规则
psql -h localhost -U directus -d directus_play -f insert_reward_config.sql
```

### 步骤 3: 配置 Directus 集合

在 Directus 后台配置两个新集合的显示设置：
- playpass_pricing_config
- playpass_reward_config

### 步骤 4: 测试配置

1. 后台创建一条测试定价规则
2. 前端查询内容价格
3. 验证价格是否正确

---

## 🎉 总结

### 新增内容

✅ **2 个新数据库表**
✅ **2 个新 API 端点**
✅ **完整的 Directus 后台配置界面**
✅ **1 个新文档** (DIRECTUS-后台配置说明.md)
✅ **更新主设计文档** (PLAYPASS-SYSTEM-DESIGN.md v2.1.0)

### 回答您的问题

**Q1: 内容定价是否可以在后台修改？**
**A1**: ✅ **可以**！通过 `playpass_pricing_config` 表，在 Directus 后台随时修改

**Q2: 获取 PP 的数量是否可以在后台修改？**
**A2**: ✅ **可以**！通过 `playpass_reward_config` 表，在 Directus 后台随时修改

### 核心价值

💡 **灵活性**: 无需修改代码，运营人员可自主配置
💡 **实时性**: 配置立即生效，快速响应市场变化
💡 **可扩展**: 支持复杂的定价策略和活动规则
💡 **数据驱动**: 实时统计帮助优化决策

---

**文档版本**: v1.0.0
**更新日期**: 2025-11-17
**作者**: Claude Code (Anthropic)

**相关文档**:
- [PLAYPASS-SYSTEM-DESIGN.md](PLAYPASS-SYSTEM-DESIGN.md) - 完整系统设计
- [DIRECTUS-后台配置说明.md](DIRECTUS-后台配置说明.md) - 后台配置快速指南
