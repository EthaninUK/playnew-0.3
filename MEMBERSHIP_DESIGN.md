# 🎯 PlayNew 会员体系设计方案 v2.0

## 一、会员等级设计（4级体系）

---

### 1️⃣ **Free（免费用户）** 💚
**定位**: 体验用户，了解基础玩法

**定价**: $0/月

**核心权益**:
- ✅ 浏览所有玩法列表和摘要
- ✅ 查看 20% 的免费玩法完整内容
- ✅ 每日 5 条快讯阅读
- ✅ 基础搜索功能
- ✅ 收藏玩法（最多 5 个）
- ✅ 点赞功能
- ❌ 无法查看中高级玩法详情
- ❌ 无法使用高级筛选
- ❌ 无法评论和互动
- ❌ 无法下载 PDF

**内容访问**: Level 0（公开内容）

---

### 2️⃣ **Pro（专业会员）** 💙
**定位**: 认真玩家，系统学习加密货币玩法

**定价**:
- **月付**: $39/月
- **年付**: $390/年（相当于 10 个月，节省 $78）

**核心权益**（包含 Free 所有权益 +）:
- ✅ **解锁 60% 的玩法内容**（Level 0 + Level 1）
- ✅ **无限制阅读快讯**
- ✅ **高级搜索和筛选**（按风险、收益、链、协议等）
- ✅ **无限收藏**
- ✅ **玩法对比功能**（最多 3 个）
- ✅ **评论和社区互动**
- ✅ **导出玩法 PDF**
- ✅ **访问历史快讯**（最近 30 天）
- ✅ **邮件通知**（新玩法、重要快讯）
- ✅ **Pro 会员徽章**
- ❌ 无法访问高级玩法（Level 2）
- ❌ 无法使用 AI 助手
- ❌ 无法访问独家研报

**内容访问**: Level 0 + Level 1（60% 内容）

---

### 3️⃣ **Max（最强会员）** 💎
**定位**: 高级玩家，追求最新情报和高级策略

**定价**:
- **月付**: $99/月
- **年付**: $990/年（相当于 10 个月，节省 $198）

**核心权益**（包含 Pro 所有权益 +）:
- ✅ **解锁 100% 的玩法内容**（包括独家高级玩法）
- ✅ **AI 智能助手**（策略推荐、风险评估、问答）
- ✅ **独家研究报告**（每月 2-3 篇深度分析）
- ✅ **早鸟空投情报**（第一时间获取内幕消息）
- ✅ **玩法对比功能**（无限制）
- ✅ **个人数据看板**（收益追踪、ROI 计算）
- ✅ **完全无广告体验**
- ✅ **优先客服支持**（24h 响应）
- ✅ **会员专属社群**（Telegram/Discord VIP 群）
- ✅ **线上活动优先参与**（AMA、研讨会、训练营）
- ✅ **全部历史快讯访问**
- ✅ **Max 会员钻石徽章**（带动画特效）
- ✅ **专属头像框**
- ❌ 无法参与平台收益分成
- ❌ 无法发布自己的玩法

**内容访问**: Level 0 + Level 1 + Level 2（100% 内容）

---

### 4️⃣ **玩法合伙人 (Partner)** 🏆
**定位**: 深度合作者，共建生态

**定价**:
- **月付**: $200/月
- **年付**: $2,000/年（相当于 10 个月，节省 $400）

**核心权益**（包含 Max 所有权益 +）:
- ✅ **Max 会员的所有权益**
- ✅ **收益分成计划**（推荐用户充值可获得 20% 分成）
- ✅ **发布自己的玩法**（审核后上架，获得流量曝光）
- ✅ **玩法创作收益**（用户付费查看你的内容时获得 70% 收益）
- ✅ **专属推广链接**（追踪推荐效果）
- ✅ **合伙人专属标识**（金色皇冠徽章）
- ✅ **月度收益报告**（详细数据分析）
- ✅ **平台重大决策参与权**（投票、建议）
- ✅ **年度线下聚会邀请**
- ✅ **品牌联名机会**（周边、活动）
- ✅ **1v1 深度咨询**（每月 1 次，30 分钟）
- ✅ **提前测试新功能**（内测资格）

**内容访问**: Level 0 + Level 1 + Level 2 + Level 3（100% + 创作者权限）

---

## 二、内容分级策略

### 📊 玩法内容分级

| 等级 | 访问权限 | 内容类型 | 占比 |
|------|---------|---------|------|
| **Level 0** | Free | 基础玩法（测试网、Galxe任务、新手教程） | 20% |
| **Level 1** | Pro+ | 中级玩法（流动性挖矿、空投策略、积分玩法） | 40% |
| **Level 2** | Max+ | 高级玩法（套利、MEV、复杂策略、独家研报） | 30% |
| **Level 3** | Partner | UGC 内容（合伙人创作的独家玩法） | 10% |

### 📰 快讯访问控制

| 会员等级 | 每日快讯 | 历史快讯 | 推送通知 |
|---------|---------|---------|---------|
| Free | 5条/天 | 无 | ❌ |
| Pro | 无限制 | 最近30天 | ✅ 邮件 |
| Max | 无限制 | 全部历史 | ✅ 邮件+Telegram |
| Partner | 无限制 | 全部历史 | ✅ 全渠道 |

---

## 三、定价策略详解

### 💰 收费标准（美元计价）

```
📅 月付方案：
┌─────────────┬──────────┬──────────┐
│   Free      │   $0/月  │   基础   │
│   Pro       │  $39/月  │   专业   │
│   Max       │  $99/月  │   最强   │
│   Partner   │ $200/月  │   合伙   │
└─────────────┴──────────┴──────────┘

📆 年付方案（优惠 17%，相当于 10 个月）：
┌─────────────┬───────────┬──────────┐
│   Free      │    $0/年  │   基础   │
│   Pro       │  $390/年  │  省 $78  │
│   Max       │  $990/年  │  省$198  │
│   Partner   │$2,000/年  │  省$400  │
└─────────────┴───────────┴──────────┘
```

### 🎯 价格锚定逻辑

- **$39/月**: 相当于一顿简餐，适合日常学习
- **$99/月**: 相当于一次健身月卡，投资自己
- **$200/月**: 创造收益的工具，合伙人可以通过分成回本

### 💡 升级路径设计

```
Free (免费体验)
  ↓ 想系统学习 → Pro ($39/月)
  ↓ 追求高级策略 → Max ($99/月)
  ↓ 想赚钱分成 → Partner ($200/月)
```

---

## 四、支付方式

### 💳 支持的支付方式（仅2种）

#### 1. **Stripe** (信用卡/借记卡)
**支持的卡种**:
- Visa
- Mastercard
- American Express
- 其他国际主流卡

**优势**:
- 全球通用
- 支持订阅管理
- 自动续费
- 退款管理

#### 2. **Crypto 支付** (加密货币)
**支持的币种**:
- USDT (TRC20/ERC20)
- USDC (ERC20/Polygon)
- ETH (Ethereum)
- BTC (Bitcoin)

**优势**:
- 符合平台定位
- 手续费低
- 匿名性强
- 国际化

**实现方案**:
- 使用 **Coinbase Commerce** 或 **NOWPayments**
- 自动生成支付地址
- 区块链确认后自动开通会员

---

## 五、功能对比表

| 功能 | Free | Pro | Max | Partner |
|------|:----:|:---:|:---:|:-------:|
| **内容访问** |
| 玩法内容访问 | 20% | 60% | 100% | 100% + UGC |
| 快讯阅读 | 5条/天 | 无限 | 无限 | 无限 |
| 历史快讯 | ❌ | 30天 | 全部 | 全部 |
| 独家研报 | ❌ | ❌ | ✅ | ✅ |
| **功能权限** |
| 高级搜索筛选 | ❌ | ✅ | ✅ | ✅ |
| AI 智能助手 | ❌ | ❌ | ✅ | ✅ |
| 玩法对比 | ❌ | 3个 | 无限 | 无限 |
| 数据看板 | ❌ | ❌ | ✅ | ✅ |
| 导出 PDF | ❌ | ✅ | ✅ | ✅ |
| **社区权益** |
| 评论互动 | ❌ | ✅ | ✅ | ✅ |
| 收藏数量 | 5个 | 无限 | 无限 | 无限 |
| 专属社群 | ❌ | ❌ | ✅ | ✅ |
| 线上活动 | ❌ | ❌ | ✅ | ✅ 优先 |
| **创作者权益** |
| 发布玩法 | ❌ | ❌ | ❌ | ✅ |
| 内容收益 | ❌ | ❌ | ❌ | ✅ 70% |
| 推荐分成 | ❌ | ❌ | ❌ | ✅ 20% |
| 月度收益报告 | ❌ | ❌ | ❌ | ✅ |
| **专属特权** |
| 会员徽章 | ❌ | 💙 蓝色 | 💎 钻石 | 🏆 金冠 |
| 头像框 | ❌ | ❌ | ✅ | ✅ 专属 |
| 客服支持 | 普通 | 优先 | 24h | 1v1 |
| 无广告 | ❌ | 部分 | ✅ | ✅ |

---

## 六、数据库设计

### 📝 需要新增的表结构

#### 1. `memberships` (会员等级定义)
```sql
{
  id: UUID
  name: string (Free/Pro/Max/Partner)
  slug: string (free/pro/max/partner)
  level: integer (0/1/2/3)
  price_monthly_usd: decimal (0/39/99/200)
  price_yearly_usd: decimal (0/390/990/2000)
  features: json (权益列表)
  content_access_level: integer (0/1/2/3)
  max_bookmarks: integer (5/null/null/null)
  daily_news_limit: integer (5/null/null/null)
  badge_icon: string (emoji 或 图标路径)
  badge_color: string (#color)
  created_at: timestamp
  updated_at: timestamp
}
```

#### 2. `user_subscriptions` (用户订阅记录)
```sql
{
  id: UUID
  user_id: UUID (关联 directus_users)
  membership_id: UUID (关联 memberships)
  status: enum (active/cancelled/expired/pending)
  billing_cycle: enum (monthly/yearly)
  amount_paid: decimal
  currency: enum (usd/crypto)
  payment_method: enum (stripe/crypto)
  start_date: timestamp
  end_date: timestamp
  auto_renew: boolean
  stripe_subscription_id: string (nullable)
  crypto_payment_address: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

#### 3. `payments` (支付记录)
```sql
{
  id: UUID
  user_id: UUID
  subscription_id: UUID (关联 user_subscriptions)
  amount: decimal
  currency: enum (usd/usdt/usdc/eth/btc)
  payment_method: enum (stripe/crypto)
  payment_status: enum (pending/completed/failed/refunded)
  stripe_payment_intent_id: string (nullable)
  crypto_transaction_hash: string (nullable)
  crypto_payment_address: string (nullable)
  metadata: json (额外信息)
  created_at: timestamp
  updated_at: timestamp
}
```

#### 4. `partner_earnings` (合伙人收益记录)
```sql
{
  id: UUID
  partner_id: UUID (关联 directus_users)
  earning_type: enum (referral/content)
  source_user_id: UUID (推荐的用户 或 查看内容的用户)
  content_id: UUID (nullable, 关联 strategies)
  amount: decimal
  currency: string (usd)
  status: enum (pending/completed/withdrawn)
  created_at: timestamp
  updated_at: timestamp
}
```

#### 5. `referral_links` (推广链接)
```sql
{
  id: UUID
  partner_id: UUID
  code: string (唯一推广码)
  clicks: integer
  conversions: integer (成功注册数)
  revenue: decimal (总收益)
  created_at: timestamp
}
```

---

## 七、Directus 权限配置

### 🔐 角色层级

```
Admin (管理员) - 所有权限
  ↓
Partner (玩法合伙人) - Level 3
  ↓
Max Member (最强会员) - Level 2
  ↓
Pro Member (专业会员) - Level 1
  ↓
Free User (免费用户) - Level 0
  ↓
Public (未登录) - 只读公开内容
```

### 📋 权限规则示例

#### Strategies (玩法) 访问规则:
```json
{
  "public": {
    "read": {
      "filter": { "access_level": { "_eq": 0 } }
    }
  },
  "free_user": {
    "read": {
      "filter": { "access_level": { "_eq": 0 } }
    }
  },
  "pro_member": {
    "read": {
      "filter": { "access_level": { "_lte": 1 } }
    }
  },
  "max_member": {
    "read": {
      "filter": { "access_level": { "_lte": 2 } }
    }
  },
  "partner": {
    "read": { "_and": [] },
    "create": {},
    "update": { "user_created": { "_eq": "$CURRENT_USER" } }
  }
}
```

#### News (快讯) 访问规则:
```json
{
  "free_user": {
    "read": {
      "limit": 5,
      "filter": { "published_at": { "_gte": "$NOW(-1 day)" } }
    }
  },
  "pro_member": {
    "read": {
      "filter": { "published_at": { "_gte": "$NOW(-30 days)" } }
    }
  },
  "max_member": {
    "read": {}
  }
}
```

---

## 八、前端页面设计

### 📄 需要开发的页面

#### 1. `/pricing` - 会员定价页
**内容**:
- Hero 区域（吸引注册）
- 4个会员卡片（Free/Pro/Max/Partner）
- 月付/年付切换按钮
- 功能对比表
- FAQ 常见问题
- CTA 按钮（立即升级）

#### 2. `/membership` - 会员中心
**内容**:
- 当前会员状态卡片
- 到期时间/续费提醒
- 升级/降级选项
- 订阅管理（取消/恢复）
- 发票下载
- 订阅历史记录

#### 3. `/checkout` - 结账页面
**内容**:
- 套餐选择确认
- 月付/年付选择
- 支付方式选择（Stripe/Crypto）
- 订单摘要
- 优惠码输入
- 服务条款同意

#### 4. `/payment/success` - 支付成功页
**内容**:
- 成功动画
- 会员激活确认
- 权益介绍
- 下一步指引
- 加入社群链接

#### 5. `/dashboard/partner` - 合伙人仪表板
**内容**（仅 Partner 可见）:
- 收益概览（本月/总计）
- 推广数据（点击/转化）
- 内容收益统计
- 提现申请
- 推广链接管理
- 我的创作内容

---

## 九、会员视觉设计

### 🎨 徽章系统

#### Free (无徽章)
```
无特殊标识
```

#### Pro 💙
```
徽章样式: 蓝色圆角矩形
图标: 💙 或 星星图标
文字: Pro
颜色: #3B82F6 (蓝色)
```

#### Max 💎
```
徽章样式: 渐变钻石形状
图标: 💎 钻石（带闪烁动画）
文字: Max
颜色: 渐变 (#8B5CF6 → #EC4899)
特效: 微光闪烁动画
```

#### Partner 🏆
```
徽章样式: 金色皇冠
图标: 🏆 或皇冠图标
文字: Partner
颜色: 金色渐变 (#F59E0B → #EAB308)
特效: 旋转光晕动画
边框: 金色发光边框
```

### 🖼️ 头像框设计

- **Free/Pro**: 无头像框
- **Max**: 紫色渐变发光边框
- **Partner**: 金色双层边框 + 皇冠装饰

---

## 十、实施时间表

### Phase 1: 数据库和权限 (3天)
- [ ] 创建 memberships 表并填充数据
- [ ] 创建 user_subscriptions 表
- [ ] 创建 payments 表
- [ ] 创建 partner_earnings 和 referral_links 表
- [ ] 配置 Directus 角色和权限
- [ ] 为现有内容设置 access_level

### Phase 2: 支付集成 (4天)
- [ ] 集成 Stripe 订阅系统
- [ ] 配置 Stripe Webhook
- [ ] 集成 Crypto 支付（Coinbase Commerce）
- [ ] 开发支付回调处理逻辑
- [ ] 测试支付流程

### Phase 3: 前端开发 (5天)
- [ ] 开发会员定价页 (`/pricing`)
- [ ] 开发结账页面 (`/checkout`)
- [ ] 开发会员中心 (`/membership`)
- [ ] 开发支付成功页 (`/payment/success`)
- [ ] 开发合伙人仪表板 (`/dashboard/partner`)
- [ ] 实现会员徽章组件
- [ ] 实现内容解锁 UI

### Phase 4: 权限控制 (2天)
- [ ] 实现前端权限检查
- [ ] 玩法内容访问控制
- [ ] 快讯访问限制
- [ ] 功能权限控制（AI、对比等）
- [ ] 升级引导弹窗

### Phase 5: 测试和优化 (3天)
- [ ] 测试完整支付流程
- [ ] 测试权限控制
- [ ] 测试合伙人功能
- [ ] 性能优化
- [ ] Bug 修复

**总计**: 约 17 天（2.5 周）

---

## 十一、关键指标 (KPIs)

### 📊 需要追踪的数据

**转化漏斗**:
```
访客 → 注册 Free → 升级 Pro → 升级 Max → 成为 Partner
```

**关键指标**:
- Free → Pro 转化率（目标 >15%）
- Pro → Max 转化率（目标 >10%）
- 月流失率（目标 <5%）
- 平均会员生命周期价值 (LTV)
- 合伙人推荐转化率

---

## 十二、FAQ 预案

### ❓ 常见问题

**Q: 可以降级吗？**
A: 可以，降级将在当前订阅周期结束后生效。

**Q: 支持退款吗？**
A: 订阅后7天内可申请全额退款，7天后按比例退款。

**Q: Crypto 支付后多久生效？**
A: 区块链确认后（通常3-10分钟）自动激活。

**Q: 合伙人如何提现？**
A: 每月15号统一结算，可提现到 Stripe 账户或 Crypto 地址。

**Q: 可以开发票吗？**
A: 可以，在会员中心下载电子发票。

---

这个新版设计怎么样？我根据你的要求做了以下调整：

✅ 4个等级：Free → Pro ($39) → Max ($99) → Partner ($200)
✅ 支持月付和年付（年付10个月优惠）
✅ 仅支持 Stripe 和 Crypto 支付
✅ 重新设计了权益分配
✅ 增加了合伙人创作和分成机制

需要我开始实施吗？我们可以从哪个部分开始？🚀
