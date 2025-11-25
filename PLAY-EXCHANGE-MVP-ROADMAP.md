# 玩法交易所 MVP 渐进式开发路线图
## 从最简单开始,每阶段可验证,可决策

---

## 核心原则

### ✅ 渐进式开发三原则
1. **每个阶段都是独立可用的产品**(不是半成品)
2. **每个阶段都有明确的数据验证目标**(用数据说话)
3. **每个阶段结束都有 Go/No-Go 决策点**(及时止损或加码)

### 📊 决策依据
每个阶段结束后,根据以下指标决定下一步:
- ✅ **继续**: 指标达标,进入下一阶段
- ⚠️ **调整**: 指标不理想,优化当前阶段
- ❌ **暂停**: 指标极差,重新评估方向

---

## 阶段 0: 现状盘点与最小改动(0 周,立即完成)

### 目标
**不写新代码,先用现有系统验证"玩法交易"需求**

### 现有系统能力盘点
```
✅ 已有:
- 用户注册/登录(Supabase Auth)
- 玩法库(strategies 表)
- 积分系统(user_credits 表)
- 支付系统(Stripe)
- 后台管理(Directus)

❌ 缺少:
- PlayPass(访问凭证)
- P2P 互换
- 做市池
- 声誉系统
```

### 立即可做的验证(不写代码)
**用现有"积分购买玩法"模式测试需求**

```
1. 在现有玩法库中标记 10 个玩法为"付费内容"
   - 设置 credits_required = 50-200

2. 在 Directus 后台手动添加"绩效指标"字段
   - 胜率、回撤、收益率(手动填写)

3. 发布到小范围用户(50-100 人)
   - 观察:是否有人愿意用积分购买?
   - 观察:哪些玩法卖得好?什么价格合适?

4. 收集反馈
   - 用户访谈:为什么买/不买?
   - 痛点:最缺什么功能?
```

### 验证指标(1-2 周数据)
- 付费转化率 ≥ 3%(50-100 人中有 3-5 人购买)
- 用户反馈提到"想和别人交换玩法" ≥ 30%

### 决策点
- ✅ **转化率 ≥ 3%**: 证明需求存在,进入阶段 1
- ❌ **转化率 < 1%**: 重新思考定位,可能不需要交易所

**成本**: $0(仅时间)
**风险**: 极低

---

## 阶段 1: 最小化 PlayPass 系统(2 周)

### 目标
**让用户能"购买并永久拥有"玩法访问权**

### 核心功能(仅 3 个)
1. **PlayPass 购买**(积分扣除 → 获得访问权)
2. **PlayPass 展示**(我的已购玩法列表)
3. **内容解锁**(持有 PlayPass 可查看完整内容)

### 数据库改动(最小化)
```sql
-- 仅新增 1 张表
CREATE TABLE play_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  play_id UUID REFERENCES strategies(id) NOT NULL,

  -- 简化版,仅支持"买断制"
  pass_type VARCHAR(20) DEFAULT 'lifetime',

  purchased_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',

  UNIQUE(user_id, play_id) -- 同一玩法不能重复购买
);
```

### API 开发(仅 3 个)
```typescript
// 1. POST /api/play-pass/purchase
// 购买 PlayPass
{
  "play_id": "uuid",
  "credits": 100
}

// 2. GET /api/play-pass/my-passes
// 查询我的 PlayPass 列表

// 3. GET /api/play-pass/check-access
// 检查是否有访问权限
?play_id=uuid
```

### 前端开发(仅 2 个页面改动)
```
1. 玩法详情页:增加"购买 PlayPass"按钮
   - 已购买:显示"已拥有,查看完整内容"
   - 未购买:显示"购买 PlayPass(100 积分)"

2. 个人中心:增加"我的 PlayPass"标签
   - 展示已购买的玩法列表
   - 点击可直接跳转查看
```

### 验证指标(2 周数据)
- 购买 PlayPass 的用户 ≥ 20 人
- 复购率(购买 2 个以上玩法) ≥ 30%
- 用户反馈:"希望能转让/互换 PlayPass" ≥ 50%

### 决策点
- ✅ **指标达标**: 证明"访问权交易"模式成立,进入阶段 2
- ⚠️ **购买人数不足但反馈好**: 优化定价/内容质量,继续观察
- ❌ **用户不感兴趣**: 可能"免费+会员"模式更适合,暂停开发

**成本**: $4,000(1 个工程师 × 2 周)
**风险**: 低(即使失败,也是有用的功能)

---

## 阶段 2: P2P 转让市场(2 周)

### 目标
**让用户能"转让"自己的 PlayPass 给他人**

### 核心功能(仅 2 个)
1. **挂单出售**(我不需要这个玩法了,卖给别人)
2. **购买他人挂单**(用积分买二手 PlayPass)

### 数据库改动
```sql
-- 新增 1 张表
CREATE TABLE pass_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_user_id UUID REFERENCES auth.users(id) NOT NULL,
  pass_id UUID REFERENCES play_passes(id) NOT NULL,

  price_credits INT NOT NULL, -- 卖家定价

  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'sold' | 'cancelled'

  created_at TIMESTAMP DEFAULT NOW(),
  sold_at TIMESTAMP,
  buyer_user_id UUID REFERENCES auth.users(id)
);

-- play_passes 表增加字段
ALTER TABLE play_passes ADD COLUMN transfer_count INT DEFAULT 0;
ALTER TABLE play_passes ADD COLUMN original_buyer_id UUID REFERENCES auth.users(id);
```

### API 开发(仅 3 个)
```typescript
// 1. POST /api/marketplace/list
// 挂单出售
{
  "pass_id": "uuid",
  "price_credits": 80 // 原价 100,打折卖
}

// 2. GET /api/marketplace/listings
// 查看所有在售 PlayPass

// 3. POST /api/marketplace/buy
// 购买二手 PlayPass
{
  "listing_id": "uuid"
}
```

### 前端开发(仅 1 个新页面)
```
1. 二手市场页面 /marketplace
   - 展示所有在售 PlayPass
   - 筛选:按玩法分类、价格排序
   - 购买按钮

2. 我的 PlayPass 页面增强
   - 增加"出售"按钮
   - 显示转让历史
```

### 验证指标(2 周数据)
- 挂单数量 ≥ 10
- 成交数量 ≥ 5
- 二手价格 vs 一手价格比例:0.7-0.9(合理折价)

### 决策点
- ✅ **有成交**: 证明"二手市场"有需求,进入阶段 3
- ⚠️ **挂单多但成交少**: 价格机制有问题,优化定价引导
- ❌ **无人使用**: 可能"买断制"不适合,考虑改为"订阅制"

**成本**: $4,000(1 个工程师 × 2 周)
**风险**: 低(最多是功能闲置)

---

## 阶段 3: 简化版"以物换物"(2 周)

### 目标
**让用户能"用自己的 PlayPass 换别人的 PlayPass"**

### 核心功能(仅 1 个)
1. **1v1 互换请求**(我提议换,你同意即成交)

### 实现逻辑
```
用户 A 看到用户 B 挂单的 PlayPass X
  ↓
用户 A 发起互换请求:
  "我用我的 PlayPass Y 换你的 PlayPass X"
  ↓
用户 B 收到通知:
  - 同意:双方 PlayPass 所有权互换
  - 拒绝:互换请求取消
```

### 数据库改动
```sql
-- 新增 1 张表
CREATE TABLE swap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  requester_user_id UUID REFERENCES auth.users(id) NOT NULL,
  requester_pass_id UUID REFERENCES play_passes(id) NOT NULL,

  target_user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_pass_id UUID REFERENCES play_passes(id) NOT NULL,

  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected' | 'expired'

  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '3 days',
  responded_at TIMESTAMP
);
```

### API 开发(仅 3 个)
```typescript
// 1. POST /api/swap/request
// 发起互换请求
{
  "my_pass_id": "uuid-a",
  "target_pass_id": "uuid-b"
}

// 2. POST /api/swap/respond
// 响应互换请求
{
  "request_id": "uuid",
  "action": "accept" // or "reject"
}

// 3. GET /api/swap/my-requests
// 查看我的互换请求(发起的+收到的)
```

### 前端开发(仅 1 个新功能)
```
1. 二手市场页面增强
   - 每个挂单增加"用我的 PlayPass 互换"按钮
   - 选择自己的某个 PlayPass 发起互换

2. 通知中心
   - 收到互换请求时通知
   - 可同意/拒绝
```

### 验证指标(2 周数据)
- 互换请求数量 ≥ 10
- 互换成功率 ≥ 40%(10 个请求中 4 个成交)
- 用户反馈:"互换比购买更划算" ≥ 60%

### 决策点
- ✅ **互换活跃**: 证明"以物换物"模式受欢迎,进入阶段 4
- ⚠️ **请求多但成交少**: 匹配机制有问题,需要自动匹配算法
- ❌ **无人使用**: 互换模式不适合,专注"二手市场"即可

**成本**: $4,000(1 个工程师 × 2 周)
**风险**: 低(功能独立,可随时下线)

---

## 阶段 4: 作者上架与分成(2 周)

### 目标
**让用户能上架自己的玩法,并获得收益分成**

### 核心功能(仅 3 个)
1. **用户发布玩法**(填写标题、内容、定价)
2. **平台审核**(人工审核,通过后上架)
3. **收益分成**(平台抽成 15%,作者获得 85%)

### 数据库改动
```sql
-- strategies 表增加字段
ALTER TABLE strategies ADD COLUMN author_id UUID REFERENCES auth.users(id);
ALTER TABLE strategies ADD COLUMN author_type VARCHAR(20) DEFAULT 'platform';
-- 'platform' | 'user'

ALTER TABLE strategies ADD COLUMN revenue_share DECIMAL(5,2) DEFAULT 0.85;
-- 作者分成比例(默认 85%)

-- 新增收益记录表
CREATE TABLE author_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  play_id UUID REFERENCES strategies(id) NOT NULL,

  transaction_type VARCHAR(20), -- 'purchase' | 'transfer'
  buyer_id UUID REFERENCES auth.users(id),

  total_credits INT, -- 总交易额
  platform_fee INT, -- 平台抽成
  author_earning INT, -- 作者收益

  created_at TIMESTAMP DEFAULT NOW()
);
```

### API 开发(仅 4 个)
```typescript
// 1. POST /api/author/publish-play
// 发布玩法
{
  "title": "我的空投攻略",
  "description": "...",
  "category": "airdrop",
  "credits_price": 150
}

// 2. GET /api/author/my-plays
// 查看我发布的玩法

// 3. GET /api/author/earnings
// 查看我的收益

// 4. POST /api/admin/review-play
// 管理员审核玩法(后台接口)
{
  "play_id": "uuid",
  "action": "approve" // or "reject",
  "reason": "内容优质" // or "内容重复"
}
```

### 前端开发(仅 2 个新页面)
```
1. 发布玩法页面 /author/publish
   - 表单:标题、分类、内容、定价
   - 提交审核

2. 作者中心页面 /author/dashboard
   - 我的玩法列表(待审核/已上架/已拒绝)
   - 收益统计(总收益、本月收益)
   - 销量排行
```

### 验证指标(4 周数据,需要更长观察期)
- 用户发布玩法数量 ≥ 20
- 通过审核率 ≥ 50%
- UGC 玩法销量 vs 平台自营销量:至少 1:5(UGC 占 20%)

### 决策点
- ✅ **UGC 活跃**: 证明"双边市场"成立,进入阶段 5
- ⚠️ **发布多但质量差**: 需要质押机制,进入阶段 5
- ❌ **无人发布**: 可能激励不足,提高分成比例或放弃 UGC

**成本**: $4,000(1 个工程师 × 2 周)
**风险**: 中(需要内容审核人力)

---

## 阶段 5: 质押与声誉系统(2 周)

### 目标
**通过质押和声誉机制,确保 UGC 内容质量**

### 核心功能(仅 3 个)
1. **发布玩法需质押积分**(新人质押 500 Points)
2. **声誉分计算**(销量、评分、投诉率)
3. **低质内容扣除质押**(投诉率 > 20% 扣质押)

### 数据库改动
```sql
-- user_credits 表增加字段
ALTER TABLE user_credits ADD COLUMN staked_credits INT DEFAULT 0;
-- 质押中的积分

-- 新增用户声誉表
CREATE TABLE user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  reputation_score INT DEFAULT 0,
  reputation_level VARCHAR(20) DEFAULT 'newbie',
  -- 'newbie' | 'skilled' | 'expert'

  total_plays INT DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_sales INT DEFAULT 0,
  complaint_count INT DEFAULT 0,

  updated_at TIMESTAMP DEFAULT NOW()
);

-- strategies 表增加字段
ALTER TABLE strategies ADD COLUMN stake_required INT DEFAULT 500;
ALTER TABLE strategies ADD COLUMN stake_locked INT DEFAULT 0;
```

### 质押规则
```typescript
// 发布玩法时自动扣除质押
const STAKE_RULES = {
  newbie: 500,   // 新人质押 500 Points
  skilled: 200,  // 熟练玩家质押 200 Points
  expert: 0,     // 专家免质押
};

// 惩罚规则
const PENALTY_RULES = {
  complaint_rate_20: 100,  // 投诉率 > 20%,扣 100 Points
  complaint_rate_50: 500,  // 投诉率 > 50%,扣全部质押
};
```

### API 开发(仅 3 个)
```typescript
// 1. GET /api/reputation/score
// 查询我的声誉分

// 2. POST /api/reputation/complaint
// 举报低质内容
{
  "play_id": "uuid",
  "reason": "内容与描述不符",
  "evidence": "截图 URL"
}

// 3. POST /api/admin/resolve-complaint
// 管理员处理举报(后台接口)
{
  "complaint_id": "uuid",
  "action": "punish" // or "dismiss",
  "penalty_credits": 100
}
```

### 前端开发(仅 1 个新功能)
```
1. 玩法详情页增加"举报"按钮
   - 填写举报原因
   - 上传证据截图

2. 作者中心显示声誉等级
   - 新人/熟练/专家
   - 质押要求
```

### 验证指标(4 周数据)
- 被举报玩法比例 ≤ 10%
- 举报有效率 ≥ 60%(真实低质内容)
- 质押机制劝退低质作者:拒绝率上升至 70%

### 决策点
- ✅ **内容质量提升**: 进入阶段 6(可选高级功能)
- ⚠️ **质押门槛过高**: 降低质押要求,观察
- ❌ **举报泛滥**: 机制有问题,暂停

**成本**: $4,000(1 个工程师 × 2 周)
**风险**: 中(需要人工仲裁)

---

## 阶段 6(可选): 绩效核验(3 周)

### 目标
**让作者能验证玩法的真实绩效数据**

### 核心功能(仅 1 个,简化版)
1. **手动上传交易记录**(截图/CSV)
2. **人工审核验证**(平台人工检查)

### 实现方式(最简化)
```
作者上传:
  - 交易所截图(显示胜率、收益率)
  - 或导出 CSV 文件
  ↓
平台人工审核:
  - 检查截图真实性
  - 计算实际指标
  ↓
验证通过:
  - 玩法标记"已验证"徽章
  - 提升信任度
```

### 数据库改动
```sql
-- strategies 表增加字段
ALTER TABLE strategies ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE strategies ADD COLUMN verification_evidence JSONB;
-- 存储验证证据(截图 URL、CSV 数据)

ALTER TABLE strategies ADD COLUMN verified_metrics JSONB;
-- 验证后的真实指标
```

### API 开发(仅 2 个)
```typescript
// 1. POST /api/verification/submit
// 提交验证材料
{
  "play_id": "uuid",
  "evidence_type": "screenshot", // or "csv"
  "evidence_url": "https://..."
}

// 2. POST /api/admin/verify-play
// 管理员审核验证(后台接口)
{
  "play_id": "uuid",
  "action": "approve",
  "verified_metrics": {
    "win_rate": 0.72,
    "roi": 0.35
  }
}
```

### 前端开发(仅 1 个新功能)
```
1. 作者中心增加"申请验证"按钮
   - 上传截图/CSV
   - 等待审核

2. 玩法详情页显示"已验证"徽章
```

### 验证指标(4 周数据)
- 申请验证的玩法 ≥ 10 个
- 验证通过率 ≥ 60%
- 已验证玩法的销量 vs 未验证玩法:至少 2 倍

### 决策点
- ✅ **验证有效提升信任**: 继续优化(自动化验证)
- ❌ **无人申请验证**: 用户不在乎,功能下线

**成本**: $6,000(1 个工程师 × 3 周)
**风险**: 低(可选功能)

---

## 阶段 7(暂缓): 做市池(复杂,暂不做)

### 为什么暂不做?
1. **实现复杂**: 需要 AMM 算法、价格预言机、流动性管理
2. **资金风险**: 平台需注入流动性($20,000),有损失风险
3. **可能不需要**: P2P 市场可能已经足够,做市池是锦上添花

### 何时考虑做?
- 阶段 3(P2P 互换)后,如果发现:
  - 冷门玩法无人挂单(流动性不足)
  - 用户抱怨"想买但没人卖"

→ 此时再考虑做市池

---

## 完整时间线总览(14-20 周)

```
阶段 0: 现状验证(1-2 周,无开发)
  ↓ 决策点:转化率 ≥ 3%?
  ↓
阶段 1: PlayPass 购买(2 周)
  ↓ 决策点:购买人数 ≥ 20?
  ↓
阶段 2: P2P 转让(2 周)
  ↓ 决策点:有成交?
  ↓
阶段 3: 以物换物(2 周)
  ↓ 决策点:互换活跃?
  ↓
阶段 4: 作者上架(2 周)
  ↓ 决策点:UGC 占比 ≥ 20%?
  ↓
阶段 5: 质押声誉(2 周)
  ↓ 决策点:内容质量提升?
  ↓
阶段 6: 绩效核验(3 周,可选)
  ↓
[暂缓] 阶段 7: 做市池(根据需求决定)

总计:14-20 周(3.5-5 个月)
```

---

## 成本与预算(渐进式)

| 阶段 | 开发时间 | 成本 | 累计成本 |
|------|---------|------|---------|
| 阶段 0 | 0 周 | $0 | $0 |
| 阶段 1 | 2 周 | $4,000 | $4,000 |
| 阶段 2 | 2 周 | $4,000 | $8,000 |
| 阶段 3 | 2 周 | $4,000 | $12,000 |
| 阶段 4 | 2 周 | $4,000 | $16,000 |
| 阶段 5 | 2 周 | $4,000 | $20,000 |
| 阶段 6 | 3 周 | $6,000 | $26,000 |

**优势**:
- 每个阶段都可以独立上线
- 如果阶段 2 数据不好,只损失 $8,000(而非 $93,000)
- 可以根据数据动态调整方向

---

## 进度追踪工具(解决"不知道做到哪里"的问题)

### 方案 1: 项目看板(推荐)
使用 Notion/Trello/Linear 建立看板:

```
┌─────────────────────────────────────────┐
│ 玩法交易所开发看板                       │
├─────────────────────────────────────────┤
│ [阶段 0] 现状验证                 ✅完成  │
│   - 指标:转化率 5%(✅ 达标)              │
│   - 决策:进入阶段 1                      │
│                                         │
│ [阶段 1] PlayPass 购买            🔄进行中│
│   - 数据库设计                   ✅     │
│   - API 开发                     ⏳     │
│   - 前端开发                     ⏳     │
│   - 测试验证                     ⏸️     │
│                                         │
│ [阶段 2] P2P 转让                ⏸️待开始│
│                                         │
└─────────────────────────────────────────┘
```

### 方案 2: 数据仪表盘
建立实时数据监控面板(用 Grafana/Metabase):

```
┌─────────────────────────────────────────┐
│ 核心指标仪表盘                           │
├─────────────────────────────────────────┤
│ 当前阶段:阶段 1 - PlayPass 购买          │
│ 目标:购买人数 ≥ 20                       │
│ 实际:15 人(75% 达标) 📈                  │
│                                         │
│ 付费转化率:3.2%(✅ 目标 3%)              │
│ 复购率:25%(⚠️ 目标 30%)                 │
│                                         │
│ 下次决策点:2025-02-01(7 天后)           │
└─────────────────────────────────────────┘
```

### 方案 3: 周报制度
每周五发送进度周报(给自己/团队):

```markdown
# 玩法交易所进度周报 - 第 3 周

## 当前阶段
阶段 1: PlayPass 购买(进度 60%)

## 本周完成
- ✅ 数据库设计完成
- ✅ API 开发完成
- ✅ 前端购买按钮完成

## 下周计划
- ⏳ 前端我的 PlayPass 页面
- ⏳ 测试验证
- ⏳ 数据收集

## 关键指标(截至今日)
- 购买人数: 15(目标 20,缺口 5)
- 付费转化率: 3.2%(✅ 达标)

## 风险提示
- ⚠️ 复购率不足,需优化内容质量

## 下次决策点
2025-02-01 - 决定是否进入阶段 2
```

---

## 关键成功要素

### 1. 坚持数据驱动
- 不要凭感觉决策
- 每个阶段都看硬指标
- 指标不达标,勇敢暂停

### 2. 快速迭代
- 每个阶段 2 周上线
- 不追求完美,先上线验证
- 根据反馈快速调整

### 3. 及时止损
- 如果阶段 1 数据极差(转化率 < 1%),立即暂停
- 损失 $4,000 比损失 $26,000 好

### 4. 保持专注
- 每个阶段只做 1-3 个核心功能
- 不要被"好主意"分散注意力
- 阶段内不增加新需求

---

## 立即行动计划(本周)

### Day 1-2: 阶段 0 验证准备
- [ ] 在 Directus 后台挑选 10 个优质玩法
- [ ] 为这 10 个玩法添加"绩效指标"字段(手动填写)
- [ ] 设置 credits_required(50-200 不等)
- [ ] 准备用户通知文案

### Day 3-4: 小范围发布
- [ ] 邀请 50-100 个种子用户(TG/Discord)
- [ ] 发布公告:"付费玩法试点"
- [ ] 设置数据收集表单

### Day 5-7: 数据收集
- [ ] 监控购买数据
- [ ] 用户访谈(5-10 人)
- [ ] 整理反馈

### 下周一: 决策会议
- [ ] 回顾数据
- [ ] 决定是否进入阶段 1

---

## 我的建议

### ✅ 立即开始阶段 0(本周)
- 成本:$0
- 风险:极低
- 收益:验证核心假设

### ✅ 如果阶段 0 验证通过,启动阶段 1-3(6 周)
- 成本:$12,000
- 这 3 个阶段是核心价值(购买+转让+互换)
- 如果成功,已经是一个完整可用的产品

### ⏸️ 阶段 4-5 根据数据决定
- 如果 UGC 需求不强,可以暂缓
- 专注平台自营也可以

### ❌ 暂时不做阶段 7(做市池)
- 太复杂,性价比低
- 等 P2P 市场跑起来再说

---

## 总结

通过这个渐进式路线图,你将:

1. ✅ **每个阶段都有明确目标**:不会迷失方向
2. ✅ **每个阶段都可独立验证**:用数据说话
3. ✅ **每个阶段都有决策点**:及时止损或加码
4. ✅ **总成本可控**:最多 $26,000(而非 $93,000)
5. ✅ **风险最小化**:失败了也只是小损失

**下一步**:
- 我帮你启动阶段 0 的数据验证?
- 还是直接开始阶段 1 的数据库设计?

你觉得怎么样?🚀
