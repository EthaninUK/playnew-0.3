# 玩法交易所开发计划 v1.0
## 基于"双边市场 + 互换撮合 + 声誉/质押风控"架构

---

## 一、项目概述

### 1.1 核心定位
**Web3 玩法的"双边交易所 + 做市商"平台**
- 用户可上架玩法获得收益
- 用户之间可互换 PlayPass 访问权
- 平台做市池提供流动性保障
- 声誉+质押机制保证质量

### 1.2 核心资产抽象

#### Play(玩法资产)
```typescript
interface Play {
  // 基础元数据
  id: string;
  title: string;
  slug: string;
  category: string; // 'airdrop' | 'defi' | 'arbitrage' | 'mev' | ...
  author_id: string;

  // 版本控制
  current_version: string;
  version_history: PlayVersion[];

  // 绩效指标
  metrics: {
    win_rate: number;        // 胜率 (0-1)
    max_drawdown: number;    // 最大回撤 (%)
    roi: number;             // 收益率 (%)
    sharpe_ratio: number;    // Sharpe 比率
    sample_period: string;   // 样本期 "2024-01-01 to 2024-12-31"
    total_trades: number;    // 总交易次数
    verified: boolean;       // 是否已验证
  };

  // 参数 Schema
  params_schema: JSONSchema; // 参数定义(如钱包地址、资金量等)

  // 执行 SOP
  execution_sop: {
    steps: Step[];           // 执行步骤
    estimated_time: number;  // 预计耗时(分钟)
    difficulty: 'easy' | 'medium' | 'hard';
    prerequisites: string[]; // 前置条件
  };

  // 风险提示
  risk_level: 1 | 2 | 3 | 4 | 5;
  risk_warnings: string[];

  // 状态
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

  created_at: timestamp;
  updated_at: timestamp;
}
```

#### PlayPass(访问凭证)
```typescript
interface PlayPass {
  id: string;
  play_id: string;
  play_version: string;      // 锁定版本

  // 持有者
  owner_id: string;
  original_buyer_id: string; // 原始购买者(用于追溯)

  // 访问权限类型
  pass_type: 'subscription' | 'lifetime' | 'usage_based' | 'seat';

  // 订阅制
  subscription_start?: timestamp;
  subscription_end?: timestamp;

  // 次数制
  usage_limit?: number;
  usage_count?: number;

  // 席位制
  seat_number?: number; // 限量席位编号

  // 转让历史
  transfer_history: {
    from_user_id: string;
    to_user_id: string;
    transfer_type: 'purchase' | 'swap' | 'gift';
    price_points?: number;
    timestamp: timestamp;
  }[];

  // 水印/防泄露
  watermark: {
    user_id: string;
    timestamp: timestamp;
    hash: string; // 唯一标识,用于追溯泄露源
  };

  // 状态
  status: 'active' | 'expired' | 'revoked' | 'transferred';

  created_at: timestamp;
  expires_at?: timestamp;
}
```

#### Points(积分体系)
```typescript
interface UserPoints {
  user_id: string;

  // 积分余额
  balance: number;
  locked: number; // 质押/冻结中的积分

  // 积分来源统计
  earned_from_contribution: number; // 贡献内容
  earned_from_review: number;       // 审核/复盘
  earned_from_trading: number;      // 交易手续费分成
  purchased: number;                // 充值购买

  // 积分消耗统计
  spent_on_purchase: number;
  spent_on_stake: number;
  spent_on_fees: number;

  created_at: timestamp;
  updated_at: timestamp;
}
```

---

## 二、三种市场形态详细设计

### 2.1 一级市场(发行/上架)

#### 作者上架流程
```
1. 作者创建 Play(填写元数据、指标、SOP)
   ↓
2. 平台审核(自动检测 + 人工抽检)
   - 检测虚假指标(对比历史数据)
   - 检测重复内容(dedupe_key)
   - 检测敏感词/违规内容
   ↓
3. 质押要求(根据声誉等级)
   - 新人: 质押 500 Points
   - 认证玩家: 质押 200 Points
   - 大师级: 免质押
   ↓
4. 设置 PlayPass 发行参数
   - 定价模式: 订阅制/买断制/次数制/席位制
   - 定价: XX Points 或 XX USDC
   - 发行总量(如席位制限量 100 个)
   ↓
5. 上架成功,开始售卖
```

#### PlayPass 定价模型

| 模式 | 适用场景 | 定价建议 | 示例 |
|------|---------|---------|------|
| **订阅制** | 持续更新的策略/信号 | 50-500 Points/月 | "DeFi 收益日报" - 150 Points/月 |
| **买断制** | 一次性教程/SOP | 100-2000 Points | "LayerZero 空投完整攻略" - 500 Points |
| **次数制** | 高价值信号/工具 | 50-200 Points/次 | "套利机会推送" - 100 Points/次,10 次包 |
| **席位制** | 稀缺资源/VIP 社群 | 1000-5000 Points | "内幕情报社群" - 2000 Points,限 50 席 |

#### 收益分配
```
用户购买 PlayPass: 500 Points
  ↓
平台抽成(15%): 75 Points → 平台收入
作者收益(85%): 425 Points → 作者账户
  ↓
作者可选择:
  - 提现为 USDC(按当前 Points 汇率)
  - 留存为 Points 用于交易/质押
```

---

### 2.2 二级市场(P2P 互换/转让)

#### 互换模式

##### 模式 1: 等值互换
```
用户 A 持有 PlayPass "LayerZero 攻略"(价值 500 Points)
用户 B 持有 PlayPass "Arbitrum 挖矿"(价值 500 Points)
  ↓
A 发起互换请求
  ↓
B 同意互换
  ↓
双方 PlayPass 所有权互换
平台收取手续费: 各扣 5% (A 扣 25 Points, B 扣 25 Points)
```

##### 模式 2: 差价互换(以分换物)
```
用户 A 持有 PlayPass "LayerZero 攻略"(价值 500 Points)
用户 B 想要这个 PlayPass,但没有等值玩法
  ↓
A 挂单: "出售 LayerZero 攻略 PlayPass,售价 450 Points(9 折)"
  ↓
B 用 450 Points 购买
  ↓
PlayPass 转移给 B
A 获得 450 Points(平台已抽成 15%)
```

##### 模式 3: 挂单交易(订单簿)
```
[挂单列表]
用户 A: 求购 "zkSync Era 攻略" PlayPass,出价 400 Points
用户 B: 出售 "Optimism 生态" PlayPass,售价 300 Points
用户 C: 互换 "Uniswap V4 教程" ↔ "Curve 稳定币策略"

[撮合逻辑]
- 系统自动匹配价格相近的买卖单
- 匹配成功后通知双方
- 双方确认后完成交易
```

#### 二级市场定价机制
```
PlayPass 二级市场价格 = 一级市场价格 × 折扣系数

折扣系数取决于:
1. 玩法热度(近 7 日交易量)
2. 剩余有效期(订阅制)
3. 作者声誉(是否持续更新)
4. 用户评分(平均 4.5 分以上溢价,低于 4.0 折价)

示例:
一级市场: 500 Points
二级市场折扣: 0.8-1.2
实际成交价: 400-600 Points
```

---

### 2.3 做市池(平台-用户互换)

#### 做市池设计(AMM/PMM 混合)

##### 做市池初始化
```
平台为热门玩法注入流动性:
  - 玩法 A: 储备 100 个 PlayPass + 50,000 Points
  - 玩法 B: 储备 50 个 PlayPass + 100,000 Points
```

##### 动态定价公式(类 AMM)
```typescript
// 基于恒定乘积公式(Uniswap v2)改进版
function getSwapPrice(
  playPassReserve: number,  // 池中 PlayPass 数量
  pointsReserve: number,    // 池中 Points 数量
  buyAmount: number,        // 想购买的 PlayPass 数量
  playMetrics: PlayMetrics  // 玩法绩效指标
): number {
  // 基础价格(恒定乘积)
  const k = playPassReserve * pointsReserve;
  const newPlayPassReserve = playPassReserve - buyAmount;
  const newPointsReserve = k / newPlayPassReserve;
  const basePrice = newPointsReserve - pointsReserve;

  // 绩效调整因子
  const performanceFactor = calculatePerformanceFactor(playMetrics);

  // 热度调整因子(近 7 日兑换量)
  const demandFactor = calculateDemandFactor(playId);

  // 最终价格
  const finalPrice = basePrice * performanceFactor * demandFactor;

  return finalPrice;
}

// 绩效调整因子
function calculatePerformanceFactor(metrics: PlayMetrics): number {
  let factor = 1.0;

  // 胜率奖励(> 70% 溢价)
  if (metrics.win_rate > 0.7) {
    factor *= 1.1;
  }

  // 回撤惩罚(> 20% 折价)
  if (metrics.max_drawdown > 0.2) {
    factor *= 0.9;
  }

  // Sharpe 比率奖励(> 2.0 溢价)
  if (metrics.sharpe_ratio > 2.0) {
    factor *= 1.15;
  }

  // 近期投诉率惩罚
  if (metrics.complaint_rate > 0.1) {
    factor *= 0.8;
  }

  return factor;
}

// 热度调整因子
function calculateDemandFactor(playId: string): number {
  const last7DaysSwaps = getSwapCountLast7Days(playId);

  if (last7DaysSwaps > 100) return 1.2;  // 超热门
  if (last7DaysSwaps > 50) return 1.1;   // 热门
  if (last7DaysSwaps < 5) return 0.9;    // 冷门

  return 1.0; // 正常
}
```

##### 做市池交易流程
```
用户想从做市池购买 PlayPass:
  ↓
1. 查询当前价格(动态公式计算)
   - 显示: "当前价格 520 Points(一级市场 500 Points,溢价 4%)"
  ↓
2. 用户确认购买
  ↓
3. 扣除用户 520 Points
  ↓
4. 从做市池转出 1 个 PlayPass 给用户
  ↓
5. 更新做市池储备:
   - PlayPass 数量 -1
   - Points 储备 +520
  ↓
6. 平台收取手续费 2%(10.4 Points)
```

##### 做市池回购机制
```
用户想卖回 PlayPass 给做市池:
  ↓
1. 查询回购价格(通常低于市场价 5-10%)
   - 显示: "回购价 450 Points(市场价 500 Points,折价 10%)"
  ↓
2. 用户确认卖出
  ↓
3. PlayPass 转入做市池
  ↓
4. 用户获得 450 Points
  ↓
5. 更新做市池储备
```

#### 做市池风控
```typescript
// 做市池参数限制
const MARKET_MAKER_CONFIG = {
  max_slippage: 0.15,        // 最大滑点 15%
  min_liquidity_ratio: 0.3,  // 最小流动性比例
  max_price_impact: 0.1,     // 单笔交易最大影响 10%
  rebalance_threshold: 0.2,  // 储备偏离 20% 时再平衡
};

// 流动性预警
if (playPassReserve / initialReserve < 0.3) {
  // 发出预警,暂停做市或补充流动性
  pauseMarketMaker(playId);
  notifyAdmin("做市池流动性不足");
}
```

---

## 三、风控与声誉体系

### 3.1 质押/惩罚机制

#### 作者质押要求
```typescript
interface StakeRequirement {
  user_reputation_level: 'newbie' | 'skilled' | 'expert' | 'master';
  required_stake: number; // Points
  stake_lock_period: number; // 天数
}

const STAKE_TIERS = [
  { level: 'newbie', required_stake: 500, lock_period: 30 },
  { level: 'skilled', required_stake: 200, lock_period: 14 },
  { level: 'expert', required_stake: 100, lock_period: 7 },
  { level: 'master', required_stake: 0, lock_period: 0 },
];
```

#### 惩罚触发条件
```typescript
// 惩罚场景
enum PunishmentReason {
  FALSE_METRICS = 'false_metrics',           // 虚假绩效
  PLAGIARISM = 'plagiarism',                 // 抄袭/洗稿
  MALICIOUS_CONTENT = 'malicious_content',   // 恶意内容
  HIGH_COMPLAINT_RATE = 'high_complaint_rate', // 高投诉率
  NO_UPDATE = 'no_update',                   // 订阅制不更新
}

// 惩罚力度
const PUNISHMENT_RULES = {
  [PunishmentReason.FALSE_METRICS]: {
    stake_slash: 100,      // 扣除质押 100%
    reputation_penalty: 500, // 扣声誉 500
    ban_days: 90,          // 禁止上架 90 天
  },
  [PunishmentReason.PLAGIARISM]: {
    stake_slash: 50,
    reputation_penalty: 200,
    ban_days: 30,
  },
  [PunishmentReason.HIGH_COMPLAINT_RATE]: {
    stake_slash: 30,
    reputation_penalty: 100,
    ban_days: 7,
  },
  // ...
};
```

#### 惩罚执行流程
```
1. 用户举报 or 系统检测到违规
   ↓
2. 平台调查(收集证据)
   ↓
3. 调查结果:
   - 属实: 执行惩罚
     - 扣除质押 Points(不退还)
     - 降低声誉分
     - 禁止上架 N 天
     - 已售 PlayPass 可申请退款
   - 不属实: 举报者扣信誉分(恶意举报)
```

---

### 3.2 声誉系统

#### 声誉分计算公式
```typescript
function calculateReputationScore(user: User): number {
  let score = 0;

  // 1. 基础贡献分
  score += user.total_plays_published * 50;

  // 2. 质量分(Sharpe-like 调整)
  const avgRating = user.avg_play_rating;
  const ratingStability = 1 - user.rating_std_dev;
  score += avgRating * 100 * ratingStability;

  // 3. 绩效分
  const avgWinRate = user.avg_win_rate;
  const avgDrawdown = user.avg_max_drawdown;
  score += (avgWinRate * 200) - (avgDrawdown * 100);

  // 4. 交易量分
  score += user.total_sales * 2;

  // 5. 扣分项
  score -= user.total_complaints * 50;
  score -= user.total_refunds * 20;
  score -= user.plagiarism_count * 200;

  // 6. 稳定度分(持续更新订阅内容)
  if (user.subscription_plays > 0) {
    const updateFrequency = user.total_updates / user.subscription_plays;
    score += updateFrequency * 10;
  }

  return Math.max(score, 0); // 最低 0 分
}
```

#### 声誉等级与权益
```typescript
interface ReputationLevel {
  level: string;
  min_score: number;
  benefits: {
    stake_discount: number;      // 质押折扣(%)
    commission_rate: number;     // 平台抽成(%)
    review_priority: boolean;    // 审核优先通过
    featured_slot: boolean;      // 首页推荐位
    max_play_price: number;      // 最高定价上限
  };
}

const REPUTATION_LEVELS: ReputationLevel[] = [
  {
    level: 'newbie',
    min_score: 0,
    benefits: {
      stake_discount: 0,
      commission_rate: 0.15,  // 平台抽成 15%
      review_priority: false,
      featured_slot: false,
      max_play_price: 1000,
    },
  },
  {
    level: 'skilled',
    min_score: 500,
    benefits: {
      stake_discount: 0.5,    // 质押减半
      commission_rate: 0.12,  // 平台抽成 12%
      review_priority: true,
      featured_slot: false,
      max_play_price: 2000,
    },
  },
  {
    level: 'expert',
    min_score: 2000,
    benefits: {
      stake_discount: 0.8,
      commission_rate: 0.10,  // 平台抽成 10%
      review_priority: true,
      featured_slot: true,
      max_play_price: 5000,
    },
  },
  {
    level: 'master',
    min_score: 5000,
    benefits: {
      stake_discount: 1.0,    // 免质押
      commission_rate: 0.05,  // 平台抽成仅 5%
      review_priority: true,
      featured_slot: true,
      max_play_price: 999999, // 无上限
    },
  },
];
```

---

### 3.3 绩效核验系统

#### 数据源接入
```typescript
// 支持的绩效验证方式
enum VerificationMethod {
  EXCHANGE_API = 'exchange_api',         // 交易所 API 读单
  WALLET_ADDRESS = 'wallet_address',     // 链上钱包地址
  PAPER_TRADING = 'paper_trading',       // 纸面交易沙盒
  MANUAL_UPLOAD = 'manual_upload',       // 手动上传截图/记录
}

// 绩效核验配置
interface PerformanceVerification {
  play_id: string;
  method: VerificationMethod;

  // 交易所 API
  exchange_api?: {
    exchange: 'binance' | 'okx' | 'bybit';
    api_key_encrypted: string;  // 加密存储,仅读取权限
    start_date: string;
    end_date: string;
  };

  // 链上地址
  wallet_address?: {
    chain: 'ethereum' | 'arbitrum' | 'optimism';
    address: string;
    start_block: number;
    end_block: number;
  };

  // 纸面交易
  paper_trading?: {
    sandbox_id: string;
    duration_days: number; // 强制运行 14 天
    initial_capital: number;
  };

  // 验证状态
  status: 'pending' | 'verified' | 'failed';
  verified_at?: timestamp;
  verification_report?: {
    actual_win_rate: number;
    actual_drawdown: number;
    actual_roi: number;
    deviation_from_claimed: number; // 偏差率
  };
}
```

#### 纸面交易沙盒
```
作者提交策略参数后:
  ↓
1. 在沙盒环境运行 1-2 周
   - 模拟真实市场数据
   - 自动记录每笔交易
   - 计算实际收益/回撤
  ↓
2. 生成验证报告
   - 宣称胜率: 75%
   - 实际胜率: 72%
   - 偏差: 4% (可接受)
  ↓
3. 验证通过后:
   - 标记为"已验证"
   - 允许开放实盘标记
   - 提升信任度
```

#### 持续监控
```typescript
// 定期重新验证(每月)
async function revalidatePlayPerformance(playId: string) {
  const play = await getPlay(playId);

  // 获取最新数据
  const latestMetrics = await fetchLatestMetrics(play.verification);

  // 对比宣称指标
  const deviation = calculateDeviation(
    play.metrics,
    latestMetrics
  );

  // 偏差过大(> 20%)触发警告
  if (deviation > 0.2) {
    await flagPlay(playId, 'performance_deviation');
    await notifyAuthor(play.author_id, '绩效偏差过大,请更新数据');
  }

  // 更新指标
  await updatePlayMetrics(playId, latestMetrics);
}
```

---

### 3.4 反女巫/反重复

#### 多信号验证
```typescript
interface UserVerification {
  user_id: string;

  // 基础验证
  email_verified: boolean;
  phone_verified: boolean;

  // Web3 身份
  gitcoin_passport_score?: number; // Gitcoin Passport
  wallet_age_days?: number;        // 钱包账龄
  on_chain_tx_count?: number;      // 链上交易数

  // 社交验证
  twitter_verified?: boolean;
  twitter_followers?: number;
  discord_verified?: boolean;

  // 综合信任分
  trust_score: number; // 0-100

  // 风险标记
  is_sybil_suspected: boolean;
  sybil_cluster_id?: string; // 女巫集群 ID
}

// 信任分计算
function calculateTrustScore(verification: UserVerification): number {
  let score = 0;

  if (verification.email_verified) score += 10;
  if (verification.phone_verified) score += 15;

  if (verification.gitcoin_passport_score) {
    score += Math.min(verification.gitcoin_passport_score * 2, 30);
  }

  if (verification.wallet_age_days > 365) score += 20;
  if (verification.on_chain_tx_count > 100) score += 15;

  if (verification.twitter_verified && verification.twitter_followers > 1000) {
    score += 10;
  }

  return Math.min(score, 100);
}
```

#### 内容去重(Dedupe Key)
```typescript
// 生成内容指纹
function generateDedupeKey(play: Play): string {
  // 提取核心文本(去除格式、标点)
  const coreText = extractCoreText(play.description + play.execution_sop);

  // SimHash 算法生成指纹
  const fingerprint = simhash(coreText);

  return fingerprint;
}

// 检测重复内容
async function detectDuplicateContent(newPlay: Play): Promise<boolean> {
  const newFingerprint = generateDedupeKey(newPlay);

  // 查询数据库中相似内容
  const existingPlays = await db.query(`
    SELECT id, title, author_id, dedupe_key
    FROM plays
    WHERE category = $1
      AND status = 'approved'
      AND hamming_distance(dedupe_key, $2) < 10
  `, [newPlay.category, newFingerprint]);

  if (existingPlays.length > 0) {
    // 发现相似内容
    await flagPlay(newPlay.id, 'duplicate_content');
    await notifyAuthor(newPlay.author_id, `检测到与已有内容重复`);
    return true;
  }

  return false;
}
```

---

## 四、交付与防泄露

### 4.1 延迟可见 + 到期解密

```typescript
// 信号交付配置
interface SignalDelivery {
  play_id: string;
  signal_type: 'realtime' | 'delayed' | 'encrypted';

  // 延迟可见(适合实时信号)
  delay_config?: {
    delay_minutes: number; // 延迟 15 分钟可见
    preview_allowed: boolean; // 是否允许预览部分内容
  };

  // 到期解密(适合时效性内容)
  encryption_config?: {
    encrypted_content: string;
    decryption_key: string; // 仅订阅者可见
    expires_at: timestamp;  // 到期后自动解密(失去价值)
  };

  // 参数遮罩(适合策略参数)
  param_mask_config?: {
    masked_params: string[]; // 需要订阅才能看到的参数
    preview_params: string[]; // 可预览的参数
  };
}

// 内容交付示例
async function deliverContent(
  userId: string,
  playId: string,
  passId: string
): Promise<ContentDelivery> {
  const play = await getPlay(playId);
  const pass = await getPlayPass(passId);

  // 检查访问权限
  if (pass.owner_id !== userId) {
    throw new Error('无访问权限');
  }

  if (pass.status === 'expired') {
    throw new Error('PlayPass 已过期');
  }

  // 根据配置交付内容
  const delivery = play.signal_delivery;

  if (delivery.signal_type === 'delayed') {
    // 延迟交付
    const now = Date.now();
    const publishTime = play.latest_signal_time;
    const delayMs = delivery.delay_config.delay_minutes * 60 * 1000;

    if (now < publishTime + delayMs) {
      return {
        status: 'delayed',
        available_at: new Date(publishTime + delayMs),
        preview: delivery.delay_config.preview_allowed
          ? play.signal_preview
          : null,
      };
    }
  }

  if (delivery.signal_type === 'encrypted') {
    // 解密内容
    const decryptedContent = decrypt(
      delivery.encryption_config.encrypted_content,
      delivery.encryption_config.decryption_key
    );

    return {
      status: 'delivered',
      content: decryptedContent,
      watermark: generateWatermark(userId, passId),
    };
  }

  // 参数遮罩
  if (delivery.param_mask_config) {
    const content = { ...play.content };

    // 仅显示订阅者可见的参数
    content.params = {
      ...content.params.preview,
      ...content.params.masked, // 订阅者可见完整参数
    };

    return {
      status: 'delivered',
      content: content,
      watermark: generateWatermark(userId, passId),
    };
  }

  // 普通交付
  return {
    status: 'delivered',
    content: play.content,
    watermark: generateWatermark(userId, passId),
  };
}
```

---

### 4.2 水印/追溯系统

```typescript
// 生成唯一水印
function generateWatermark(
  userId: string,
  passId: string
): Watermark {
  const timestamp = Date.now();

  // 组合信息生成哈希
  const rawData = `${userId}:${passId}:${timestamp}`;
  const hash = sha256(rawData);

  return {
    user_id: userId,
    pass_id: passId,
    timestamp: timestamp,
    hash: hash.substring(0, 16), // 取前 16 位作为水印
    display_text: `UID:${userId.substring(0, 8)} ${new Date(timestamp).toISOString()}`,
  };
}

// 嵌入水印到内容
function embedWatermark(
  content: string,
  watermark: Watermark
): string {
  // 方法 1: 文本水印(显式)
  const textWatermark = `\n\n---\n📌 此内容仅供 ${watermark.display_text} 使用\n严禁转发/截图分享,违者将被追责\n---\n`;

  // 方法 2: 隐形水印(Unicode 零宽字符)
  const invisibleWatermark = encodeToZeroWidth(watermark.hash);

  // 方法 3: 图片水印(如果内容包含图片)
  // ...

  return content + textWatermark + invisibleWatermark;
}

// 检测泄露源
async function detectLeakSource(leakedContent: string): Promise<string | null> {
  // 提取隐形水印
  const extractedHash = decodeFromZeroWidth(leakedContent);

  if (!extractedHash) {
    return null; // 无法追溯
  }

  // 查询数据库
  const delivery = await db.query(`
    SELECT user_id, pass_id, delivered_at
    FROM content_deliveries
    WHERE watermark_hash = $1
  `, [extractedHash]);

  if (delivery) {
    // 找到泄露源
    await handleLeakIncident(delivery.user_id, delivery.pass_id);
    return delivery.user_id;
  }

  return null;
}

// 处理泄露事件
async function handleLeakIncident(userId: string, passId: string) {
  // 1. 吊销 PlayPass
  await revokePlayPass(passId);

  // 2. 降低用户声誉
  await penalizeUser(userId, {
    reputation_penalty: 500,
    ban_days: 365,
    reason: 'content_leak',
  });

  // 3. 通知作者
  const pass = await getPlayPass(passId);
  await notifyAuthor(pass.play_author_id, `用户 ${userId} 泄露内容,已处理`);

  // 4. 记录事件
  await logSecurityIncident({
    type: 'content_leak',
    user_id: userId,
    pass_id: passId,
    timestamp: Date.now(),
  });
}
```

---

## 五、合规与法律

### 5.1 免责声明模板

```markdown
# 用户协议与免责声明

## 1. 服务性质
本平台提供的所有内容(包括但不限于策略、信号、教程、SOP)仅供**教育和信息参考**,不构成任何形式的投资建议、财务咨询或推荐。

## 2. 风险提示
- 加密货币投资具有极高风险,您可能损失全部本金
- 过往业绩不代表未来表现
- 任何策略都可能因市场变化而失效
- 请根据自身风险承受能力谨慎决策

## 3. 内容来源
- 平台自营内容由 AI 和编辑团队生产,已尽力保证准确性,但不保证完全正确
- 用户贡献内容(UGC)由第三方提供,平台已进行基础审核,但不对其真实性、有效性负责
- 所有绩效指标均为历史数据,可能存在偏差

## 4. 收益分配说明
- 用户购买 PlayPass 所支付的 Points 或 USDC,视为**内容许可费**,而非投资收益分成
- 作者获得的收益为**知识产权许可费**,而非投资顾问费
- 平台抽成为**技术服务费和撮合手续费**

## 5. 禁止行为
- 禁止传播虚假信息、操纵市场
- 禁止洗钱、诈骗、传销
- 禁止侵犯知识产权(抄袭、盗版)
- 禁止泄露、转售平台内容

## 6. 争议解决
- 如对交易结果不满,可在 7 天内申请仲裁
- 平台将根据证据进行裁决,决定是否退款/惩罚
- 最终解释权归平台所有

## 7. 管辖法律
本协议受 [您所在法域] 法律管辖。如有争议,提交 [仲裁机构] 仲裁。

---

**重要提示**:点击"我同意"即表示您已充分理解并接受上述条款。
```

---

### 5.2 合规检查清单

#### 针对不同法域的合规要点

| 法域 | 关键合规要求 | 应对措施 |
|------|------------|---------|
| **中国大陆** | • 禁止投资咨询<br>• 禁止代客理财<br>• 禁止虚拟货币交易 | • 强调"教育用途"<br>• 禁用"保证收益"等宣传<br>• 积分不可兑换法币 |
| **美国** | • SEC 监管(证券法)<br>• FINRA 投资顾问牌照 | • 免责声明清晰<br>• 不提供个性化投资建议<br>• 内容许可费模式 |
| **欧盟** | • GDPR 数据保护<br>• MiFID II 金融工具 | • 隐私政策合规<br>• 用户数据可导出/删除 |
| **新加坡/香港** | • MAS/SFC 监管<br>• 反洗钱(AML) | • KYC 验证<br>• 大额交易监控 |

#### 建议
1. **咨询当地律师**,确定平台定位(教育 vs 投资咨询)
2. **禁止使用**"保证收益""稳赚""代客操作"等词汇
3. **明确定义**积分为"虚拟权益",非货币,非证券
4. **设置提现限额**,避免被认定为支付/金融业务

---

## 六、技术架构总览

### 6.1 技术栈

```yaml
前端:
  - Framework: Next.js 14 (App Router)
  - UI: Tailwind CSS + shadcn/ui
  - State: Zustand / Jotai
  - Charts: Recharts / TradingView Lightweight Charts

后端:
  - CMS: Directus (管理 Play、用户、订单)
  - Database: PostgreSQL (主库)
  - Cache: Redis (价格缓存、会话)
  - Queue: BullMQ (异步任务)
  - Search: Meilisearch (已部署)

AI/自动化:
  - n8n (工作流编排)
  - OpenAI GPT-4 (内容审核、去重检测)
  - Python (绩效计算、AMM 定价引擎)

区块链(可选):
  - Wallet: Wagmi + RainbowKit
  - Chain: Arbitrum / Base (低 Gas)
  - Smart Contract: PlayPass NFT (ERC-1155)

支付:
  - Fiat: Stripe (信用卡)
  - Crypto: USDC/USDT (Coinbase Commerce)

监控:
  - Logging: Sentry
  - Analytics: PostHog / Mixpanel
  - Metrics: Prometheus + Grafana
```

---

### 6.2 核心数据库表设计

```sql
-- 1. 玩法表(扩展现有 strategies)
ALTER TABLE strategies ADD COLUMN play_version VARCHAR(20) DEFAULT '1.0.0';
ALTER TABLE strategies ADD COLUMN metrics JSONB; -- 绩效指标
ALTER TABLE strategies ADD COLUMN params_schema JSONB;
ALTER TABLE strategies ADD COLUMN execution_sop JSONB;
ALTER TABLE strategies ADD COLUMN verification_method VARCHAR(50);
ALTER TABLE strategies ADD COLUMN verification_status VARCHAR(20);
ALTER TABLE strategies ADD COLUMN verification_report JSONB;
ALTER TABLE strategies ADD COLUMN dedupe_key VARCHAR(64); -- SimHash 指纹
ALTER TABLE strategies ADD COLUMN stake_locked INT DEFAULT 0;

-- 2. PlayPass 表
CREATE TABLE play_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID REFERENCES strategies(id) NOT NULL,
  play_version VARCHAR(20) NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  original_buyer_id UUID REFERENCES auth.users(id),

  pass_type VARCHAR(20) NOT NULL, -- 'subscription' | 'lifetime' | 'usage_based' | 'seat'

  -- 订阅制
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,

  -- 次数制
  usage_limit INT,
  usage_count INT DEFAULT 0,

  -- 席位制
  seat_number INT,

  -- 转让历史
  transfer_history JSONB DEFAULT '[]',

  -- 水印
  watermark_hash VARCHAR(64) UNIQUE,

  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,

  INDEX(play_id),
  INDEX(owner_id),
  INDEX(watermark_hash)
);

-- 3. 互换订单表
CREATE TABLE swap_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type VARCHAR(20) NOT NULL, -- 'pass_for_pass' | 'pass_for_points' | 'points_for_pass'

  -- 挂单方
  maker_user_id UUID REFERENCES auth.users(id) NOT NULL,
  maker_pass_id UUID REFERENCES play_passes(id),
  maker_points INT,

  -- 接单方
  taker_user_id UUID REFERENCES auth.users(id),
  taker_pass_id UUID REFERENCES play_passes(id),
  taker_points INT,

  -- 价格
  price_points INT,

  -- 状态
  status VARCHAR(20) DEFAULT 'open', -- 'open' | 'filled' | 'cancelled' | 'expired'

  created_at TIMESTAMP DEFAULT NOW(),
  filled_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days',

  INDEX(maker_user_id),
  INDEX(taker_user_id),
  INDEX(status)
);

-- 4. 做市池表
CREATE TABLE market_maker_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID REFERENCES strategies(id) NOT NULL UNIQUE,

  -- 储备
  pass_reserve INT NOT NULL, -- PlayPass 数量
  points_reserve BIGINT NOT NULL, -- Points 储备

  -- AMM 参数
  k_constant BIGINT, -- 恒定乘积 k = pass_reserve * points_reserve

  -- 调整因子
  performance_factor DECIMAL(5,2) DEFAULT 1.0,
  demand_factor DECIMAL(5,2) DEFAULT 1.0,

  -- 统计
  total_swaps INT DEFAULT 0,
  total_volume_points BIGINT DEFAULT 0,

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  last_rebalance_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 做市交易记录
CREATE TABLE market_maker_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES market_maker_pools(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  swap_type VARCHAR(20) NOT NULL, -- 'buy_pass' | 'sell_pass'

  -- 交易前
  pass_reserve_before INT,
  points_reserve_before BIGINT,

  -- 交易
  pass_amount INT,
  points_amount BIGINT,

  -- 交易后
  pass_reserve_after INT,
  points_reserve_after BIGINT,

  -- 价格
  price_per_pass BIGINT,
  slippage DECIMAL(5,2),

  -- 手续费
  fee_points BIGINT,

  created_at TIMESTAMP DEFAULT NOW(),

  INDEX(pool_id),
  INDEX(user_id),
  INDEX(created_at)
);

-- 6. 用户声誉表
CREATE TABLE user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  -- 声誉分
  reputation_score INT DEFAULT 0,
  reputation_level VARCHAR(20) DEFAULT 'newbie',

  -- 统计
  total_plays_published INT DEFAULT 0,
  avg_play_rating DECIMAL(3,2) DEFAULT 0,
  rating_std_dev DECIMAL(3,2) DEFAULT 0,
  avg_win_rate DECIMAL(5,2) DEFAULT 0,
  avg_max_drawdown DECIMAL(5,2) DEFAULT 0,
  total_sales INT DEFAULT 0,
  total_revenue_points BIGINT DEFAULT 0,

  -- 负面
  total_complaints INT DEFAULT 0,
  total_refunds INT DEFAULT 0,
  plagiarism_count INT DEFAULT 0,

  -- 订阅内容统计
  subscription_plays INT DEFAULT 0,
  total_updates INT DEFAULT 0,

  -- 质押
  staked_points INT DEFAULT 0,

  -- 惩罚
  ban_until TIMESTAMP,

  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. 绩效验证表
CREATE TABLE performance_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID REFERENCES strategies(id) NOT NULL,

  method VARCHAR(50) NOT NULL,

  -- 交易所 API
  exchange_api_config JSONB,

  -- 链上地址
  wallet_address_config JSONB,

  -- 纸面交易
  paper_trading_config JSONB,

  -- 验证结果
  status VARCHAR(20) DEFAULT 'pending',
  verified_at TIMESTAMP,
  verification_report JSONB,

  -- 偏差
  claimed_win_rate DECIMAL(5,2),
  actual_win_rate DECIMAL(5,2),
  deviation DECIMAL(5,2),

  created_at TIMESTAMP DEFAULT NOW(),

  INDEX(play_id),
  INDEX(status)
);

-- 8. 内容交付记录(用于追溯泄露)
CREATE TABLE content_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  play_id UUID REFERENCES strategies(id) NOT NULL,
  pass_id UUID REFERENCES play_passes(id) NOT NULL,

  watermark_hash VARCHAR(64) UNIQUE NOT NULL,
  watermark_display TEXT,

  delivered_at TIMESTAMP DEFAULT NOW(),

  INDEX(user_id),
  INDEX(pass_id),
  INDEX(watermark_hash)
);

-- 9. 安全事件表
CREATE TABLE security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type VARCHAR(50) NOT NULL, -- 'content_leak' | 'fraud' | 'sybil'

  user_id UUID REFERENCES auth.users(id),
  play_id UUID REFERENCES strategies(id),
  pass_id UUID REFERENCES play_passes(id),

  description TEXT,
  evidence JSONB,

  status VARCHAR(20) DEFAULT 'investigating',
  resolution TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,

  INDEX(incident_type),
  INDEX(user_id),
  INDEX(status)
);

-- 10. 用户身份验证表
CREATE TABLE user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  -- 基础验证
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,

  -- Web3 身份
  gitcoin_passport_score DECIMAL(5,2),
  wallet_address VARCHAR(42),
  wallet_age_days INT,
  on_chain_tx_count INT,

  -- 社交验证
  twitter_verified BOOLEAN DEFAULT FALSE,
  twitter_username VARCHAR(100),
  twitter_followers INT,
  discord_verified BOOLEAN DEFAULT FALSE,

  -- 信任分
  trust_score INT DEFAULT 0,

  -- 女巫检测
  is_sybil_suspected BOOLEAN DEFAULT FALSE,
  sybil_cluster_id UUID,

  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 七、分阶段开发计划

### Phase 1: 核心数据模型与基础设施(2 周)

#### Week 1: 数据库设计
- [ ] 设计并创建所有核心表(10 张表)
- [ ] 编写数据库迁移脚本
- [ ] 在 Directus 中配置集合和关系
- [ ] 编写种子数据(测试用)

#### Week 2: 基础 API 开发
- [ ] 实现 Play CRUD API
- [ ] 实现 PlayPass CRUD API
- [ ] 实现 Points 管理 API
- [ ] 实现用户声誉查询 API
- [ ] 编写 API 单元测试

**交付物**:
- 完整数据库 Schema
- RESTful API 文档
- Postman 测试集合

---

### Phase 2: 一级市场与 PlayPass 系统(2 周)

#### Week 1: Play 发行流程
- [ ] 作者上架 Play 界面(前端)
- [ ] Play 审核流程(自动检测 + 人工)
- [ ] 质押机制(锁定 Points)
- [ ] PlayPass 发行配置(订阅/买断/次数/席位)

#### Week 2: PlayPass 购买流程
- [ ] PlayPass 购买界面
- [ ] 支付集成(Points 扣除)
- [ ] PlayPass 所有权转移
- [ ] 内容交付(带水印)

**交付物**:
- Play 上架页面
- PlayPass 购买流程
- 水印生成系统

---

### Phase 3: P2P 互换撮合引擎(2 周)

#### Week 1: 订单簿系统
- [ ] 挂单/撤单 API
- [ ] 订单簿数据结构
- [ ] 订单匹配算法(价格优先、时间优先)
- [ ] 订单状态管理

#### Week 2: 互换界面
- [ ] 挂单界面(出售/求购/互换)
- [ ] 订单列表展示
- [ ] 一键互换功能
- [ ] 互换历史记录

**交付物**:
- 订单簿引擎
- P2P 互换界面
- 匹配算法文档

---

### Phase 4: 做市池与动态定价(2 周)

#### Week 1: AMM 引擎
- [ ] 做市池初始化(注入流动性)
- [ ] 动态定价公式实现
- [ ] 绩效因子计算
- [ ] 热度因子计算

#### Week 2: 做市池交易
- [ ] 做市池购买界面
- [ ] 做市池卖出界面
- [ ] 滑点计算与展示
- [ ] 做市池储备监控

**交付物**:
- AMM 定价引擎
- 做市池交易界面
- 流动性监控面板

---

### Phase 5: 风控与声誉系统(2 周)

#### Week 1: 声誉系统
- [ ] 声誉分计算逻辑
- [ ] 声誉等级判定
- [ ] 声誉权益配置
- [ ] 声誉展示界面

#### Week 2: 风控机制
- [ ] 质押/惩罚执行
- [ ] 举报系统
- [ ] 仲裁流程
- [ ] 黑名单管理

**交付物**:
- 声誉计算引擎
- 风控仲裁系统
- 用户信任面板

---

### Phase 6: 绩效核验与防泄露(1 周)

#### 绩效核验
- [ ] 交易所 API 对接(Binance/OKX)
- [ ] 链上数据读取(Etherscan API)
- [ ] 纸面交易沙盒(简化版)
- [ ] 绩效报告生成

#### 防泄露
- [ ] 水印生成与嵌入
- [ ] 泄露检测算法
- [ ] 泄露处理流程

**交付物**:
- 绩效验证系统
- 水印追溯系统

---

### Phase 7: 前端界面与用户体验(2 周)

#### Week 1: 核心页面
- [ ] 交易所首页(三个市场 Tab)
- [ ] Play 详情页(展示指标、SOP)
- [ ] PlayPass 管理页
- [ ] 我的订单/互换/订阅

#### Week 2: 高级功能
- [ ] 实时价格图表(TradingView)
- [ ] 绩效可视化(Sharpe、回撤曲线)
- [ ] 通知系统(订单成交、内容更新)
- [ ] 移动端适配

**交付物**:
- 完整前端界面
- 响应式设计
- 用户手册

---

### Phase 8: 测试与上线(1 周)

#### 测试
- [ ] 单元测试(90% 覆盖率)
- [ ] 集成测试(核心流程)
- [ ] 压力测试(1000 并发)
- [ ] 安全测试(SQL 注入、XSS)

#### 上线
- [ ] 生产环境部署
- [ ] 数据迁移
- [ ] 监控告警配置
- [ ] 用户公告

**交付物**:
- 测试报告
- 上线 Checklist
- 回滚预案

---

## 八、资源与预算估算

### 8.1 人力需求

| 角色 | 人数 | 职责 | 周投入 |
|------|------|------|--------|
| **全栈工程师** | 2 人 | 前后端开发、API、数据库 | 40h/周 |
| **智能合约工程师** | 1 人 | PlayPass NFT(如需上链) | 20h/周 |
| **UI/UX 设计师** | 1 人 | 界面设计、交互优化 | 20h/周 |
| **产品经理** | 1 人 | 需求管理、测试验收 | 10h/周 |
| **QA 测试** | 1 人 | 功能测试、安全测试 | 20h/周 |

**总人力**: 6 人 × 12 周 = 72 人周

---

### 8.2 成本预算(12 周)

| 成本项 | 金额(USD) | 说明 |
|--------|----------|------|
| **人力成本** | $72,000 | 6 人 × 12 周 × $1000/人周 |
| **基础设施** | $3,000 | 服务器、数据库、CDN |
| **第三方服务** | $2,000 | OpenAI API、Stripe、Gitcoin Passport |
| **测试环境** | $1,000 | 沙盒、测试数据 |
| **合规咨询** | $5,000 | 律师咨询、协议审查 |
| **应急预算** | $10,000 | 不可预见成本 |
| **合计** | **$93,000** | - |

---

### 8.3 收益预测(上线后 6 个月)

**假设**:
- 月活用户: 5,000
- 人均月消费: 200 Points (≈ $8)
- 平台抽成: 15%

**收入**:
- 月交易额: 5,000 × 200 Points × $0.04/Point = $40,000
- 平台抽成: $40,000 × 15% = $6,000/月
- 6 个月收入: $36,000

**ROI**: $36,000 / $93,000 = 38.7%(6 个月 ROI,偏保守)

---

## 九、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| **开发延期** | 高 | 中 | 预留 20% 时间缓冲,采用敏捷迭代 |
| **绩效造假** | 中 | 高 | 强制纸面交易验证,定期抽查 |
| **做市池流动性枯竭** | 中 | 高 | 设置最低储备警戒线,及时补充 |
| **用户女巫攻击** | 中 | 中 | 多信号验证,信任分门槛 |
| **内容泄露** | 低 | 高 | 水印追溯,严惩泄露者 |
| **法律合规问题** | 低 | 高 | 提前咨询律师,清晰免责声明 |
| **用户增长缓慢** | 中 | 中 | 加大营销投入,KOL 合作 |

---

## 十、下一步行动

### 立即可做(本周)
1. ✅ 审阅本开发计划,确认技术方案
2. [ ] 组建开发团队(招聘 or 外包)
3. [ ] 搭建开发环境(Git 仓库、CI/CD)
4. [ ] 设计数据库 Schema(详细 ER 图)

### 短期规划(1 个月)
1. [ ] 完成 Phase 1(数据模型 + 基础 API)
2. [ ] 完成 Phase 2(一级市场 + PlayPass)
3. [ ] 开发简单前端原型(可演示)

### 需要你决策的问题
1. **是否需要上链**(PlayPass NFT 化)?
   - 优势: 去中心化、可在 OpenSea 交易
   - 劣势: 开发复杂、Gas 成本、用户门槛高

2. **Points 与 USDC 汇率**如何设定?
   - 建议: 1 Point = $0.04(可调整)
   - 或: 让市场决定(浮动汇率)

3. **做市池初始流动性**从哪里来?
   - 平台自有资金注入
   - 向 VC 融资
   - 社区众筹

4. **合规法域**选择?
   - 建议: 新加坡/香港(监管相对友好)
   - 或: 完全去中心化(DAO 治理)

---

**准备好开始了吗?我们可以先从 Phase 1 的数据库设计开始! 🚀**
