const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议生产环境使用环境变量
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '链上数据分析与跟踪完全指南',
  slug: 'onchain-data-tracking-complete-guide',
  summary:
    '链上情报分析全攻略：鲸鱼地址追踪、资金流向监控、聪明钱跟单、链上指标解读（NVT/MVRV/SOPR）、Dune Analytics仪表盘、Nansen标签体系、MEV机器人识别、预警系统搭建、实战工具对比。',

  // 使用 slug 作为分类标识（与前端 directus.ts 中的定义保持一致）
  category: 'data-tracking',

  // 站内一级/二级分类
  category_l1: 'tools',
  category_l2: '数据跟踪',

  // ===== 元数据 =====
  difficulty_level: 3,           // 1-5
  risk_level: 2,                 // 信息滞后/虚假信号/过度依赖数据
  apy_min: 0,
  apy_max: 0,

  // 资金/时间/技术门槛
  threshold_capital: '0–5,000 USD（工具订阅费用，数据本身免费）',
  threshold_capital_min: 0,
  time_commitment: '每周 3–10 小时（建立监控体系后降至每日15分钟）',
  time_commitment_minutes: 390,
  threshold_tech_level: 'intermediate',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：希望通过**链上数据分析**发现投资机会、追踪**聪明钱**、理解**市场情绪**、验证**基本面**的投资者、研究员、项目方
> **阅读时间**：≈ 28–38 分钟
> **关键词**：On-chain Analytics / Whale Watching / Smart Money / Dune Analytics / Nansen / Arkham / Glassnode / UTXO / Transaction Flow / Label System / Dashboard / Alert

---

## 🧭 TL;DR
- **核心价值**：**透明账本**（所有交易公开可查）、**实时监控**（无延迟数据）、**去伪存真**（绕过项目方宣传看真实使用）、**先发优势**（比市场更早发现趋势）。
- **关键场景**：**鲸鱼追踪**（大户动向）、**资金流向**（交易所净流入/流出）、**聪明钱**（顶级地址操作）、**项目健康度**（活跃地址/TVL/收入）、**风险预警**（异常转账/黑客攻击）。
- **主流工具**：**免费层**（Etherscan/Dune Analytics/DefiLlama）、**专业级**（Nansen/Arkham/Glassnode，$150–$1000/月）、**开发者**（The Graph/自建节点）。
- **分析框架**：**宏观指标**（NVT/MVRV/SOPR）→ **中观数据**（协议TVL/交易量）→ **微观追踪**（具体地址/交易）→ **综合决策**（结合技术分析与基本面）。

---

## 🗂 目录
1. [链上数据基础：为什么需要On-chain Analytics](#链上数据基础为什么需要on-chain-analytics)
2. [核心概念：地址/交易/标签/图谱](#核心概念地址交易标签图谱)
3. [鲸鱼地址追踪实战](#鲸鱼地址追踪实战)
4. [聪明钱（Smart Money）识别与跟单](#聪明钱smart-money识别与跟单)
5. [资金流向监控：交易所流入流出](#资金流向监控交易所流入流出)
6. [链上指标深度解读：NVT/MVRV/SOPR](#链上指标深度解读nvtmvrvsopr)
7. [协议数据分析：TVL/收入/用户](#协议数据分析tvl收入用户)
8. [Dune Analytics从入门到精通](#dune-analytics从入门到精通)
9. [Nansen标签体系与使用技巧](#nansen标签体系与使用技巧)
10. [MEV机器人与三明治攻击识别](#mev机器人与三明治攻击识别)
11. [预警系统搭建：Webhook + Telegram](#预警系统搭建webhook--telegram)
12. [主流工具深度对比](#主流工具深度对比)
13. [实战案例分析](#实战案例分析)
14. [隐私保护与反追踪](#隐私保护与反追踪)
15. [FAQ](#faq)
16. [一页执行清单](#一页执行清单)

---

## 📊 链上数据基础：为什么需要On-chain Analytics

### 传统金融 vs 链上数据

| 维度 | 传统金融 | 链上数据 |
|------|---------|---------|
| **透明度** | 财报季度披露（可能造假） | 实时公开（无法篡改） |
| **时效性** | 延迟数日至数月 | 实时（秒级更新） |
| **颗粒度** | 汇总数据 | 单笔交易可追踪 |
| **门槛** | Bloomberg终端$2K/月 | 基础工具免费 |
| **隐私性** | 账户匿名 | 地址公开（可关联身份） |

---

### 链上数据的核心价值

#### 1. 验证项目真实性
**场景**：项目宣称"10万日活用户"

**链上验证**：
- 查询合约交互地址数（实际可能仅2000）
- 分析女巫攻击（Sybil）：80%地址来自同一资金来源
- 检查交易深度：大部分为$1小额测试交易

**结论**：数据注水，远离该项目

---

#### 2. 发现早期机会
**场景**：某DeFi协议突然TVL暴增

**链上分析**：
- 追踪资金来源：来自Binance热钱包（散户？）还是知名VC地址（机构布局？）
- 检查存款时长：短期套利还是长期锁仓
- 查看收益率变化：是否可持续

**决策**：若为机构长期布局+合理收益，提前参与

---

#### 3. 风险预警
**场景**：项目方地址异常转账

**链上监控**：
- 项目方钱包转出大量代币到CEX
- 多签钱包签名者突然更换
- 合约所有权转移至新地址

**应对**：立即退出流动性，避免Rug Pull

---

#### 4. 市场情绪判断
**场景**：BTC价格震荡

**链上指标**：
- 交易所净流入增加（抛压）→ 看跌
- 长期持有者（LTH）累积（不卖）→ 看涨
- 实现盈利（SOPR）持续>1（获利了结）→ 短期调整

---

## 🧩 核心概念：地址/交易/标签/图谱

### 地址（Address）

#### 类型分类
- **EOA（外部账户）**：用户控制的钱包地址（如MetaMask）
- **合约地址**：智能合约部署地址（Uniswap Router等）
- **交易所热钱包/冷钱包**：CEX充值/提现地址
- **桥合约**：跨链桥锁定/释放资产地址

#### 标识方法
**通过交互行为识别**：
- 高频交互合约 → 可能是机器人/套利者
- 仅接收从不发送 → 冷钱包/囤币地址
- 定期小额转出 → DCA卖出/工资发放

---

### 交易（Transaction）

#### 关键字段
\`\`\`json
{
  "hash": "0xabc123...",
  "from": "0x发送地址",
  "to": "0x接收地址",
  "value": "1.5 ETH",
  "input": "0x合约调用数据",
  "gasPrice": "50 gwei",
  "blockNumber": 18000000,
  "timestamp": 1704067200
}
\`\`\`

#### 深度解析
**Input数据解码**：
\`\`\`
原始：0xa9059cbb00000000...
解码：transfer(to=0x123, amount=1000 USDT)
\`\`\`

**关联分析**：
- 同一笔交易的内部转账（Internal Transactions）
- Token转账事件（ERC-20 Transfer Event）
- 合约事件日志（Event Logs）

---

### 标签（Label）

#### Nansen标签体系
**顶级分类**：
- **Smart Money**：聪明钱（顶级交易者）
- **Fund**：基金（a16z/Paradigm等）
- **Exchange**：交易所
- **Token Contract**：代币合约
- **DeFi Protocol**：DeFi协议

**细分标签**：
- **Smart DEX Trader**：DEX高手（胜率>70%）
- **Smart NFT Trader**：NFT高手
- **Smart LP**：流动性提供高手
- **Fresh Wallet**：新钱包（可能是老钱包转移资产）

---

### 资金图谱（Money Flow Graph）

#### 可视化工具
**Arkham Intelligence**：
- 拖拽式交互图谱
- 自动聚类关联地址
- 标注实体身份（交易所/项目方/个人）

**示例分析**：
\`\`\`
Binance Hot Wallet
    ↓ 10,000 ETH
Unknown Wallet A
    ↓ 9,500 ETH
Uniswap Router (Swap ETH → USDC)
    ↓ 9.5M USDC
Unknown Wallet B
    ↓ 9M USDC
Tornado Cash (混币)
\`\`\`

**结论**：疑似大户套现后洗钱

---

## 🐋 鲸鱼地址追踪实战

### 鲸鱼定义

**比特币**：
- 持有 >1,000 BTC（约$30M）

**以太坊**：
- 持有 >10,000 ETH（约$20M）

**山寨币**：
- 持有总供应量 >1%

---

### 鲸鱼监控工具

#### 1. Whale Alert（免费）
**功能**：
- 实时推送大额转账（>$1M）
- Twitter自动发布：https://twitter.com/whale_alert
- Telegram频道：t.me/whale_alert

**示例推送**：
\`\`\`
🚨 100,000,000 USDT (100,000,000 USD) transferred from Binance to unknown wallet
\`\`\`

**解读**：
- Binance → 未知钱包：可能是大户提现到冷钱包（看涨）
- 未知钱包 → Binance：可能准备卖出（看跌）

---

#### 2. Etherscan Whale Watching
**步骤**：
1. 访问 Etherscan.io
2. 搜索代币（如UNI）
3. 点击"Holders"标签
4. 查看Top 100持有者
5. 点击地址查看历史交易

**关键观察**：
- **累积行为**：连续买入，均价降低 → 看好
- **分散行为**：转移到多个地址 → 准备卖出或OTC交易
- **质押行为**：转入Staking合约 → 长期持有

---

#### 3. Nansen Smart Money（付费）
**功能**：
- 预设"Smart Money"标签地址
- 实时监控其交易行为
- 统计其盈利率与持仓

**Smart Money追踪策略**：
\`\`\`
当Smart Money地址买入某代币：
    1. 检查买入金额（>$100K值得关注）
    2. 查看历史胜率（>70%跟单）
    3. 设置价格告警（跟随买入或观望）

当Smart Money卖出：
    1. 检查卖出比例（全部清仓 vs 部分止盈）
    2. 对比自己成本（若已盈利考虑跟随）
\`\`\`

---

### 鲸鱼行为模式分析

#### 模式1：分批建仓
\`\`\`
日期        动作                金额
Day 1      买入 1000 ETH      $2,000,000
Day 3      买入 1500 ETH      $2,900,000
Day 7      买入 2000 ETH      $3,800,000
\`\`\`

**解读**：DCA策略，看好中长期，不追高

---

#### 模式2：闪电吸筹
\`\`\`
时间        动作                金额
10:00      买入 5000 ETH      $10,000,000
10:15      买入 3000 ETH      $6,100,000
\`\`\`

**解读**：紧急建仓，可能获得内幕消息（利好公告前）

---

#### 模式3：分散转移
\`\`\`
主钱包 A
  ↓ 1000 ETH → 钱包 B
  ↓ 1000 ETH → 钱包 C
  ↓ 1000 ETH → 钱包 D
\`\`\`

**解读**：准备分批卖出或OTC交易（避免单笔大额冲击市场）

---

## 🧠 聪明钱（Smart Money）识别与跟单

### 聪明钱的特征

✅ **高胜率**：
- 近90天交易胜率 >70%
- 实现盈利 >$500K

✅ **早期发现能力**：
- 在项目Token上线首周买入
- 在NFT地板价<0.1 ETH时买入（后涨至10 ETH）

✅ **快速止损**：
- 亏损超过10%立即退出
- 不死扛亏损仓位

✅ **分散投资**：
- 同时持有20+不同资产
- 单一资产仓位<10%

---

### Nansen Smart Money Dashboard

#### 核心指标

**Smart Money Net Flow**：
\`\`\`
计算公式：买入金额 - 卖出金额（过去24h）

示例：
- Uniswap UNI代币：+$5M（聪明钱净买入）→ 看涨信号
- Aave AAVE代币：-$3M（聪明钱净卖出）→ 看跌信号
\`\`\`

---

**Token God Mode**：
- 某代币的聪明钱持有者列表
- 每个地址的买入成本与当前盈亏
- 最近交易时间与方向

**使用策略**：
\`\`\`python
if 聪明钱持有者 > 50 个 and 平均盈利 > 100%:
    该代币可能处于后期（获利了结压力）
    → 谨慎追高

if 聪明钱最近24h净买入 > $1M and 代币价格回调20%:
    聪明钱抄底
    → 考虑跟随
\`\`\`

---

### 跟单实战案例

**案例：某Smart Money地址（0xabc...123）**

**历史表现**：
- 90天胜率：78%
- 总盈利：$2.3M
- 主要赛道：DeFi新币

**实时监控**：
\`\`\`
[2024-01-15 10:30]
地址 0xabc...123 买入 $500K PENDLE
当前价格：$2.5
\`\`\`

**跟单决策**：
1. 查看PENDLE基本面（收益代币化协议，TVL$500M）
2. 检查该地址历史在DeFi新币的胜率（85%）
3. 设置跟单金额（$5K，1%仓位试探）
4. 设置止损（-15%）与止盈（+50%）

**结果**（30天后）：
- PENDLE价格涨至$4.2（+68%）
- 该地址在$3.8卖出（+52%）
- 跟单盈利：$3,400（68%）

---

## 💰 资金流向监控：交易所流入流出

### 核心指标

#### 1. Exchange Net Flow
\`\`\`
净流入 = 流入交易所金额 - 流出交易所金额（24h）

正值（净流入）：
  → 抛售压力增加 → 看跌

负值（净流出）：
  → 提现到钱包长期持有 → 看涨
\`\`\`

**数据来源**：
- CryptoQuant（专业级）
- Glassnode（学术级）
- DefiLlama（免费）

---

#### 2. Exchange Reserve
\`\`\`
交易所储备 = 所有交易所持有的某币种总量

储备下降：
  → 供应从CEX转移到钱包（看涨）

储备上升：
  → 抛售压力累积（看跌）
\`\`\`

**历史规律**：
- 2020年3月COVID崩盘：BTC交易所储备骤增（恐慌抛售）
- 2021年牛市：BTC交易所储备持续下降（机构提现到冷钱包）

---

### 实战工具：CryptoQuant

#### 免费功能
- BTC/ETH交易所流入流出
- 交易所储备变化图表
- 矿工流向（挖矿产出转入交易所=抛售）

#### 付费功能（$99/月）
- 所有币种监控
- 单个交易所细分（Binance vs Coinbase）
- 自定义告警

---

### 案例分析

**场景**：2023年8月BTC价格$29K横盘

**链上数据**：
- Glassnode显示：BTC交易所储备连续30天下降
- 净流出：累计-50,000 BTC（约$1.45B）
- 长期持有者供应（LTH Supply）持续上升

**解读**：
- 尽管价格横盘，但供应从交易所流出到冷钱包
- 长期持有者在累积，不卖出
- 供应减少 + 需求稳定 = 看涨

**结果**：
- 2个月后BTC涨至$35K（+20%）

---

## 📈 链上指标深度解读：NVT/MVRV/SOPR

### 1. NVT Ratio（网络价值与交易比率）

**公式**：
\`\`\`
NVT = 市值（Market Cap）/ 每日链上交易量（Daily Transaction Volume）
\`\`\`

**类比**：类似股票的市盈率（P/E）

**解读**：
- **NVT > 100**：估值过高，价格可能回调
- **NVT < 50**：估值合理或低估
- **NVT < 30**：严重低估，买入机会

**历史数据**：
- 2017年12月牛市顶部：BTC NVT = 160
- 2018年12月熊市底部：BTC NVT = 35

**局限性**：
- 不适用于Staking链（交易量低但价值高）
- 混币器/交易所内部转账会扭曲数据

---

### 2. MVRV Ratio（市值与实现市值比率）

**公式**：
\`\`\`
MVRV = 市值（Market Cap）/ 实现市值（Realized Cap）

实现市值 = Σ(每个UTXO × 其最后移动时的价格)
\`\`\`

**解读**：
- **MVRV > 3.5**：市场极度贪婪，接近顶部
- **MVRV 2.0–3.5**：牛市中后期
- **MVRV 1.0–2.0**：合理估值
- **MVRV < 1.0**：市场极度恐惧，接近底部

**实战应用**：
\`\`\`
2021年4月：BTC MVRV = 3.7 → 顶部信号（实际顶部$64K）
2022年11月：BTC MVRV = 0.85 → 底部信号（实际底部$15.5K）
\`\`\`

**Z-Score变体**（更精确）：
\`\`\`
MVRV Z-Score = (市值 - 实现市值) / 市值标准差

> 7：极度高估，卖出
< 0：极度低估，买入
\`\`\`

---

### 3. SOPR（花费产出利润率）

**公式**：
\`\`\`
SOPR = 卖出价格 / 买入价格（所有已花费UTXO的平均值）

示例：
- 用户以$20K买入1 BTC，以$30K卖出
- 该笔交易SOPR = 30K / 20K = 1.5
\`\`\`

**解读**：
- **SOPR > 1**：平均卖出者获利 → 获利了结压力
- **SOPR = 1**：盈亏平衡
- **SOPR < 1**：平均卖出者亏损 → 恐慌抛售或投降

**趋势判断**：
- **SOPR持续>1.05**：牛市中期，获利回吐增加 → 短期回调
- **SOPR跌破1后反弹**：恐慌抛售结束，市场企稳
- **SOPR在1附近震荡**：横盘整理

---

### 组合使用策略

**买入信号（三重确认）**：
\`\`\`
✅ MVRV < 1.0（低估）
✅ NVT < 40（交易量支撑）
✅ SOPR < 1且开始回升（恐慌结束）
→ 强烈买入信号
\`\`\`

**卖出信号**：
\`\`\`
⚠️ MVRV > 3.5（高估）
⚠️ NVT > 120（泡沫）
⚠️ SOPR > 1.1（获利了结）
→ 分批止盈
\`\`\`

---

## 🏦 协议数据分析：TVL/收入/用户

### TVL（Total Value Locked）分析

#### 数据来源
- **DefiLlama**（最全面，免费）
- **DeFi Pulse**（老牌，数据较少）
- **Dune Analytics**（自定义查询）

#### 关键指标

**1. 绝对TVL**
\`\`\`
Aave TVL = $10B
→ DeFi借贷龙头
\`\`\`

**2. TVL变化率**
\`\`\`
过去7天 TVL +20%
→ 资金快速流入（检查原因：新激励/收益率上升/市场热点）
\`\`\`

**3. TVL/市值比**
\`\`\`
TVL / 市值 = $10B / $8B = 1.25

比值 > 1：协议低估（真实价值支撑强）
比值 < 0.5：协议高估（炒作成分高）
\`\`\`

**4. 多链分布**
\`\`\`
Uniswap TVL:
- Ethereum：$3B（60%）
- Arbitrum：$1B（20%）
- Polygon：$500M（10%）
- 其他：$500M（10%）

→ 以太坊主导，多链扩张中
\`\`\`

---

### 协议收入（Revenue）分析

#### 收入类型
- **交易手续费**：Uniswap 0.3%交易费
- **借贷利息**：Aave借款利息
- **清算罚金**：MakerDAO清算费用
- **铸造/销毁费**：Synthetix债务池费用

#### 关键指标

**P/F Ratio（市值/费用比）**
\`\`\`
类似股票市盈率

P/F = 市值 / 年化协议收入

示例：
- GMX市值：$500M
- 年化收入：$50M
- P/F = 10

对比传统金融：
- Nasdaq P/E = 25
- DeFi P/F < 15通常视为低估
\`\`\`

**P/S Ratio（市值/销售额比）**
\`\`\`
P/S = 市值 / 年化总交易量

适用于交易所/DEX
\`\`\`

---

### 用户数据分析

#### Dune Analytics查询

**活跃地址**：
\`\`\`sql
SELECT
    DATE_TRUNC('day', block_time) AS date,
    COUNT(DISTINCT "from") AS active_users
FROM ethereum.transactions
WHERE "to" = '0xUniswapRouterAddress'
    AND block_time > NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1
\`\`\`

**新用户 vs 老用户**：
\`\`\`sql
-- 首次交互视为新用户
WITH first_tx AS (
    SELECT "from", MIN(block_time) AS first_time
    FROM ethereum.transactions
    WHERE "to" = '0xProtocolAddress'
    GROUP BY 1
)
SELECT
    DATE_TRUNC('day', t.block_time) AS date,
    COUNT(DISTINCT CASE WHEN f.first_time::date = t.block_time::date THEN t."from" END) AS new_users,
    COUNT(DISTINCT CASE WHEN f.first_time::date < t.block_time::date THEN t."from" END) AS returning_users
FROM ethereum.transactions t
JOIN first_tx f ON t."from" = f."from"
WHERE t."to" = '0xProtocolAddress'
GROUP BY 1
\`\`\`

**留存率分析**：
\`\`\`
Day 1留存：新用户第2天回来的比例
Day 7留存：新用户第7天回来的比例
Day 30留存：30天后仍活跃的比例

健康项目：
- D1 > 40%
- D7 > 20%
- D30 > 10%
\`\`\`

---

## 🎨 Dune Analytics从入门到精通

### 快速入门

#### 1. 浏览热门Dashboard
**推荐Dashboard**：
- **DeFi Overview**：https://dune.com/rchen8/defi-users-over-time
- **NFT Market**：https://dune.com/sealaunch/NFT
- **Ethereum Gas Tracker**：https://dune.com/kroeger0x/gas-prices

**学习方式**：
- 点击"View Query"查看SQL代码
- Fork到自己账户修改参数
- 理解数据表结构

---

#### 2. 核心数据表

**Ethereum表**：
- **ethereum.transactions**：所有交易
- **ethereum.traces**：内部调用（合约间交互）
- **erc20\_ethereum.evt\_Transfer**：ERC-20转账事件
- **prices.usd**：代币美元价格

**查询示例**：
\`\`\`sql
-- 查询Uniswap过去24小时交易量
SELECT
    SUM(amount_usd) AS volume_24h
FROM dex.trades
WHERE project = 'uniswap'
    AND block_time > NOW() - INTERVAL '24 hours'
\`\`\`

---

#### 3. 高级技巧

**递归CTE（追踪资金流）**：
\`\`\`sql
WITH RECURSIVE money_flow AS (
    -- 起始地址
    SELECT "to" AS address, value, 1 AS depth
    FROM ethereum.transactions
    WHERE hash = '0xStartTxHash'

    UNION ALL

    -- 递归追踪
    SELECT t."to", t.value, mf.depth + 1
    FROM ethereum.transactions t
    JOIN money_flow mf ON t."from" = mf.address
    WHERE mf.depth < 5  -- 限制深度
)
SELECT * FROM money_flow
\`\`\`

**Window函数（计算移动平均）**：
\`\`\`sql
SELECT
    date,
    daily_volume,
    AVG(daily_volume) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma_7d
FROM (
    SELECT DATE_TRUNC('day', block_time) AS date, SUM(amount_usd) AS daily_volume
    FROM dex.trades
    WHERE project = 'uniswap'
    GROUP BY 1
) sub
\`\`\`

---

### 实战项目：构建自己的Dashboard

**目标**：监控自己的DeFi投资组合

**步骤**：
1. 创建Query：查询自己地址在各协议的仓位
2. 添加价格数据：JOIN prices.usd表
3. 计算总价值：SUM(amount × price)
4. 可视化：Line Chart（时间序列）
5. 设置自动刷新：每小时更新
6. 分享Dashboard：设置Public访问

**SQL模板**：
\`\`\`sql
WITH my_positions AS (
    -- Aave存款
    SELECT
        'Aave' AS protocol,
        SUM(amount) AS amount,
        'USDC' AS token
    FROM aave_v3_ethereum.evt_Supply
    WHERE user = '0xYourAddress'

    UNION ALL

    -- Uniswap LP
    SELECT
        'Uniswap' AS protocol,
        SUM(liquidity) AS amount,
        'UNI-V2' AS token
    FROM uniswap_v2_ethereum.evt_Mint
    WHERE to = '0xYourAddress'
)
SELECT
    protocol,
    SUM(amount × p.price) AS value_usd
FROM my_positions mp
JOIN prices.usd p ON mp.token = p.symbol
WHERE p.minute = (SELECT MAX(minute) FROM prices.usd)
GROUP BY 1
\`\`\`

---

## 🏷️ Nansen标签体系与使用技巧

### 标签类型

#### 1. 交易所标签
- **Binance 1–30**：币安热钱包/冷钱包集群
- **Coinbase Pro**：Coinbase托管地址
- **Kraken**：Kraken交易所

**用途**：
- 监控大户转入交易所（潜在卖压）
- 追踪交易所间转移（套利/OTC）

---

#### 2. 基金标签
- **a16z**：Andreessen Horowitz投资基金
- **Paradigm**：Paradigm Capital
- **Jump Trading**：Jump Crypto

**用途**：
- 跟踪机构建仓/减仓
- 发现机构关注的新项目

---

#### 3. Smart Money标签
- **Smart DEX Trader**：DEX交易高手
- **Smart NFT Minter**：NFT早期发现者
- **Smart LP**：流动性提供高手

**筛选条件**：
- 胜率>70%
- 盈利>$100K
- 交易频率稳定

---

### Token God Mode使用

**功能**：
- 查看某代币的所有标签地址持仓
- 实时监控买入/卖出行为
- 统计聪明钱净流向

**实战策略**：
\`\`\`
步骤1：选择代币（如PENDLE）
步骤2：查看"Smart Money"持有者数量
    - >100个：机构/高手广泛认可
    - <10个：小众或早期

步骤3：查看24h净流向
    - 净买入>$1M：积极信号
    - 净卖出>$1M：获利了结

步骤4：查看平均持有成本
    - 当前价格远低于平均成本：可能抄底机会
    - 当前价格远高于平均成本：获利盘多

步骤5：设置告警
    - 当聪明钱净买入>$500K时通知
\`\`\`

---

### Wallet Profiler（钱包画像）

**输入**：任意地址

**输出**：
- **交易风格**：高频交易/长期持有/套利者
- **盈利能力**：实现盈利$XXX，胜率XX%
- **持仓分布**：DeFi 40%、NFT 30%、稳定币30%
- **交互协议**：Top 10常用协议
- **关联地址**：可能的关联钱包（资金往来密切）

**应用**：
- 评估交易对手实力（链上尽调）
- 发现隐藏的大户（分散到多地址）

---

## ⚙️ MEV机器人与三明治攻击识别

### MEV（Maximal Extractable Value）基础

**定义**：矿工/验证者通过重排序交易从中提取的最大价值。

**常见MEV类型**：
1. **三明治攻击**（Sandwich Attack）
2. **抢跑**（Front-running）
3. **套利**（Arbitrage）
4. **清算**（Liquidation）

---

### 三明治攻击识别

**攻击流程**：
\`\`\`
用户A提交交易：用100 ETH买入UNI（Slippage 1%）

MEV Bot检测到这笔交易：
1. 先于用户交易执行：买入UNI（推高价格）
2. 用户交易执行：以更高价格买入UNI
3. MEV Bot紧接着卖出：获利（价格回落）

结果：
- 用户A多支付了1–3%（超过设置的Slippage）
- MEV Bot获利$500–$5000
\`\`\`

---

### Etherscan识别方法

**特征**：
1. 三笔交易在同一区块
2. 交易顺序：Bot Buy → Victim Swap → Bot Sell
3. Bot地址通常标注为"MEV Bot"

**示例查询**：
\`\`\`
搜索区块：18000000
筛选：涉及Uniswap Router的交易
排序：按交易顺序

发现：
Tx 1: 0xBotAddress buy UNI (Gas: 500 gwei)
Tx 2: 0xVictim swap ETH → UNI (Gas: 100 gwei)
Tx 3: 0xBotAddress sell UNI (Gas: 500 gwei)

确认：三明治攻击
\`\`\`

---

### 防护措施

**用户侧**：
- ✅ 使用MEV保护RPC（如Flashbots Protect）
- ✅ 设置合理Slippage（<0.5%）
- ✅ 分批小额交易
- ✅ 使用私密交易池（Private Mempool）

**开发者侧**：
- ✅ 集成CowSwap（订单匹配，无MEV）
- ✅ 使用1inch等聚合器（自动防MEV路由）

---

### MEV监控工具

**Eigenphi**（https://eigenphi.io）：
- 实时MEV利润排行榜
- 三明治攻击可视化
- Bot地址标注

**MEV-Explore**（Flashbots）：
- 历史MEV提取数据
- 各类MEV占比统计

---

## 🔔 预警系统搭建：Webhook + Telegram

### 架构设计

\`\`\`
[链上事件] → [监听服务] → [规则引擎] → [Telegram Bot]
    ↓              ↓              ↓              ↓
  Tx/Event    Webhook/WS    if/else       推送消息
\`\`\`

---

### 方式1：使用第三方服务（零代码）

#### Nansen Alerts
**功能**：
- 设置地址监控（如a16z钱包）
- 触发条件：转账>$1M / 买入某代币
- 推送渠道：Email / Telegram

**配置步骤**：
1. Nansen网站 → Alerts
2. Create Alert → Wallet Activity
3. 输入地址：0xa16z...
4. 条件：Transaction Value > $1,000,000
5. 通知：Telegram Bot

---

#### Hal.xyz（免费）
**功能**：
- 监控NFT地板价
- DeFi仓位健康度（清算预警）
- 代币价格告警

**示例**：
\`\`\`
Alert Name: BAYC Floor Price Drop
Condition: BAYC floor < 30 ETH
Action: Send Telegram message
\`\`\`

---

### 方式2：自建监控系统（编程）

#### 技术栈
- **语言**：Python / Node.js
- **Web3库**：web3.py / ethers.js
- **消息推送**：Telegram Bot API
- **数据库**：PostgreSQL（记录历史）

---

#### Python示例代码

**监控Uniswap大额交易**：
\`\`\`python
from web3 import Web3
import requests

# 连接以太坊节点
w3 = Web3(Web3.HTTPProvider('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'))

# Uniswap Router地址
UNISWAP_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

# Telegram配置
TELEGRAM_TOKEN = 'YOUR_BOT_TOKEN'
CHAT_ID = 'YOUR_CHAT_ID'

def send_telegram(message):
    url = f'https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage'
    requests.post(url, data={'chat_id': CHAT_ID, 'text': message})

# 监听新区块
def handle_event(event):
    tx_hash = event['transactionHash'].hex()
    tx = w3.eth.get_transaction(tx_hash)

    # 检查是否为Uniswap交易
    if tx['to'] == UNISWAP_ROUTER:
        value_eth = w3.from_wei(tx['value'], 'ether')

        # 大额交易预警（>100 ETH）
        if value_eth > 100:
            message = f'🚨 大额Uniswap交易\\n金额: {value_eth} ETH\\nTx: {tx_hash}'
            send_telegram(message)

# 订阅pending transactions
event_filter = w3.eth.filter('pending')

while True:
    for event in event_filter.get_new_entries():
        handle_event(event)
\`\`\`

---

#### 高级优化

**使用WebSocket（低延迟）**：
\`\`\`python
from web3 import Web3

w3 = Web3(Web3.WebsocketProvider('wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'))

# 订阅新区块头
def handle_new_block(block_header):
    block = w3.eth.get_block(block_header['number'], full_transactions=True)
    for tx in block['transactions']:
        # 处理交易
        analyze_transaction(tx)

block_filter = w3.eth.filter('latest')
w3.eth.filter('latest', handle_new_block)
\`\`\`

---

### 预警规则示例

**规则1：鲸鱼转账**
\`\`\`python
if tx['value'] > 1000 ETH and tx['to'] in EXCHANGE_ADDRESSES:
    alert('鲸鱼转入交易所，可能准备卖出')
\`\`\`

**规则2：项目方异常**
\`\`\`python
if tx['from'] == PROJECT_TREASURY and tx['to'] in TORNADO_CASH:
    alert('⚠️ 项目方资金转入混币器，高风险！')
\`\`\`

**规则3：聪明钱动向**
\`\`\`python
if tx['from'] in SMART_MONEY_LIST:
    token = decode_swap_data(tx['input'])
    alert(f'聪明钱买入 {token}')
\`\`\`

---

## 🏆 主流工具深度对比

| 工具 | 定位 | 免费功能 | 付费价格 | 核心优势 | 推荐度 |
|------|------|---------|---------|---------|--------|
| **Etherscan** | 区块浏览器 | 全部 | 免费 | 基础工具，必备 | ★★★★★ |
| **Dune Analytics** | SQL查询平台 | 公开Dashboard | $399/月（私有） | 自定义分析强 | ★★★★★ |
| **DefiLlama** | TVL聚合器 | 全部 | 免费 | 数据最全 | ★★★★★ |
| **Nansen** | 链上情报 | 基础版 | $150–$2K/月 | 标签体系强 | ★★★★☆ |
| **Arkham** | 地址追踪 | 限量查询 | $100/月 | 图谱可视化 | ★★★★☆ |
| **Glassnode** | 链上指标 | 延迟数据 | $29–$799/月 | 学术级指标 | ★★★★☆ |
| **CryptoQuant** | 交易所流向 | 基础图表 | $99–$299/月 | 专注BTC/ETH | ★★★☆☆ |
| **Messari** | 研究报告 | 部分免费 | $500/月 | 报告质量高 | ★★★☆☆ |
| **Token Terminal** | 协议收入 | 全部 | 免费 | P/F比分析 | ★★★★☆ |
| **Eigenphi** | MEV监控 | 全部 | 免费 | MEV专业 | ★★★☆☆ |

---

### 新手推荐组合（免费）
1. **Etherscan**：查地址/交易
2. **DefiLlama**：看TVL
3. **Dune Analytics**：学SQL查询
4. **Whale Alert Twitter**：关注大额转账

---

### 进阶组合（$150/月）
1. **Nansen Basic**：Smart Money追踪
2. **Dune Premium**：私有Dashboard
3. **Telegram预警**：自建或Hal.xyz

---

### 专业组合（$500+/月）
1. **Nansen Pro**：完整功能
2. **Glassnode Professional**：全指标
3. **Messari Pro**：深度研报
4. **自建节点**：Alchemy/Infura

---

## 📚 实战案例分析

### 案例1：提前发现SocialFi热潮（friend.tech）

**时间线**：2023年8月

**链上信号**：
1. **Dune查询**：Base链日活地址突然从5K涨至50K
2. **Nansen监控**：多个Smart Money地址桥接ETH到Base
3. **DefiLlama**：friend.tech TVL 7天内0→$20M

**操作**：
- 提前参与（买入早期KOL的Keys）
- 成本：$500
- 1个月后卖出：$3,500（7倍）

**复盘**：
- 链上活跃度是最早信号（早于媒体报道2周）
- Smart Money布局是确认信号

---

### 案例2：规避Terra/LUNA崩盘

**时间线**：2022年5月

**链上预警**：
1. **CryptoQuant**：LUNA交易所储备激增（抛售压力）
2. **Etherscan**：LFG（Luna Foundation Guard）紧急卖出BTC储备
3. **Nansen**：Smart Money地址清空UST仓位

**关键时刻**：
- 5月7日：链上监控发现LFG卖出$1.5B BTC
- 主流媒体报道滞后2天
- 提前退出UST，避免归零

---

### 案例3：捕捉Blur空投机会

**时间线**：2023年2月

**链上追踪**：
1. **Dune Dashboard**：Blur交易量超越OpenSea
2. **Nansen**：大量NFT Trader从OpenSea迁移到Blur
3. **Twitter情报**：Paradigm投资Blur（链接到Paradigm标签地址）

**策略**：
- 积极在Blur交易刷交易量（空投积分）
- 成本：Gas费$500
- 空投收益：$12,000 BLUR（2月14日空投）

---

## 🔒 隐私保护与反追踪

### 为什么需要隐私

**风险**：
- 地址与真实身份关联（KYC泄露/链上行为分析）
- 被定向攻击（钓鱼/勒索）
- 交易策略暴露（被抢跑/模仿）

---

### 隐私保护工具

#### 1. 混币器（Mixer）
**Tornado Cash**（已被制裁，风险高）：
- 存入ETH → 生成零知识证明 → 新地址提取
- 切断资金链关联

**替代方案**：
- **Railgun**：隐私DeFi协议
- **Aztec Network**：ZK-Rollup隐私Layer 2

---

#### 2. 隐私币
- **Monero (XMR)**：环签名+隐身地址
- **Zcash (ZEC)**：zk-SNARKs零知识证明

**用法**：
\`\`\`
ETH → 交易所 → 买入XMR → 转到新地址 → 卖出XMR → ETH
（切断链上追踪）
\`\`\`

---

#### 3. 新钱包策略
- **分散资产**：大额资金拆分到10+地址
- **不同用途隔离**：DeFi交互/NFT收藏/长期持有 分开钱包
- **避免关联**：不同钱包不互相转账

---

### 反追踪检测

**Arkham Deanonymization**：
- 输入地址查询是否被标注身份
- 检查关联地址集群

**应对**：
- 定期更换钱包
- 使用非KYC交易所
- 避免社交媒体公开地址

---

## ❓FAQ

**Q1：链上数据分析能稳定盈利吗？**
> **现实**：
> - 数据分析是**辅助工具**，不是圣杯
> - 需结合技术分析、基本面、宏观环境
> - 信号有滞后性（Smart Money先知先觉，散户看到时已晚）
>
> **成功率**：
> - 配合其他工具使用，胜率可提升10%–20%
> - 主要价值在于**风险预警**（避免归零/黑客攻击）

**Q2：免费工具够用吗，还是必须付费？**
> **新手（0–6个月）**：
> - 免费工具完全够用（Etherscan + DefiLlama + Dune）
>
> **进阶（6个月–2年）**：
> - Nansen Basic（$150/月）性价比高
> - 主要用于Smart Money追踪
>
> **专业（2年+）**：
> - 全套工具（Nansen Pro + Glassnode + 自建系统）
> - 年成本$5K–$20K，但信息差价值更高

**Q3：SQL零基础能用Dune Analytics吗？**
> **可以**：
> - Dune官方教程：https://dune.com/docs
> - 大量模板Dashboard可Fork修改
> - SQL基础1周可学会（W3Schools/菜鸟教程）
>
> **学习路径**：
> 1. 先Fork别人的Dashboard修改参数（1天）
> 2. 学习基础SELECT/WHERE/JOIN（3天）
> 3. 理解以太坊数据表结构（3天）
> 4. 独立编写简单查询（1周后）

**Q4：如何判断Smart Money标签的真实性？**
> **验证方法**：
> - 查看历史交易记录（胜率/盈利金额）
> - 检查是否为"刷"出来的（短期暴涨后归零）
> - 对比多个平台标签（Nansen vs Arkham）
> - 跟踪至少1个月观察稳定性
>
> **警惕**：
> - 新地址短期暴利（可能是运气）
> - 仅单一币种胜率高（可能是内幕交易后被封）

**Q5：链上数据会被操纵吗（刷量/假交易）？**
> **会**，常见手法：
> - **刷TVL**：左手右手互转（Flash Loan循环）
> - **刷交易量**：机器人对敲
> - **虚假活跃地址**：女巫攻击（Sybil）
>
> **识别方法**：
> - 检查地址多样性（是否大量新地址集中创建）
> - 分析交易金额分布（正常项目符合幂律分布）
> - 查看Gas消耗（真实用户不会为$1交易支付$50 Gas）

---

## ✅ 一页执行清单

### 新手入门（第1–2周）
- [ ] 注册Etherscan账号，学习查询地址/交易
- [ ] 关注Whale Alert Twitter（t.me/whale_alert）
- [ ] 浏览DefiLlama，理解TVL概念
- [ ] Fork一个Dune Analytics Dashboard，修改参数
- [ ] 订阅3–5个链上数据相关Twitter账号

### 进阶学习（第1–2个月）
- [ ] 学习SQL基础（W3Schools，5小时课程）
- [ ] 在Dune编写第一个查询（某协议日活用户）
- [ ] 使用Nansen免费版追踪3个Smart Money地址
- [ ] 理解NVT/MVRV/SOPR三个指标
- [ ] 阅读Glassnode周报（每周1篇）

### 工具配置（第2–3个月）
- [ ] 决定是否订阅Nansen Basic（$150/月）
- [ ] 搭建Telegram告警（Hal.xyz或自建）
- [ ] 创建自己的投资组合监控Dashboard（Dune）
- [ ] 设置3–5个鲸鱼地址监控
- [ ] 加入1–2个链上数据社区（Discord/Telegram）

### 深度应用（第3个月+）
- [ ] 开发自己的链上监控脚本（Python + Web3.py）
- [ ] 建立个人数据库（记录历史Smart Money操作）
- [ ] 参与开源项目（贡献Dune查询/开发工具）
- [ ] 撰写分析报告（Medium/Twitter分享）
- [ ] 考虑自建节点（Alchemy/Infura）

### 持续优化
- [ ] 每周复盘链上信号准确性
- [ ] 每月评估付费工具ROI
- [ ] 优化预警规则（减少噪音）
- [ ] 扩展监控范围（新链/新协议）
- [ ] 建立个人数据分析框架（标准化流程）

---

## 🎓 进阶学习资源

### 官方文档
- **Dune Analytics Docs**：https://dune.com/docs
- **Etherscan API**：https://docs.etherscan.io
- **Nansen Academy**：https://pro.nansen.ai/academy
- **Glassnode Insights**：https://insights.glassnode.com

### 数据Dashboard精选
- **DeFi 360**：https://dune.com/rchen8
- **NFT God Mode**：https://dune.com/sealaunch
- **MEV Explore**：https://explore.flashbots.net

### 社区与课程
- **Dune Discord**：活跃的SQL互助社区
- **Nansen Telegram**：官方支持群
- **Bankless DAO**：链上分析小组
- **CryptoQuant Academy**：指标解读课程

### Twitter必关注
- **@nansen_ai**：Nansen官方
- **@duneanalytics**：Dune官方
- **@glassnode**：Glassnode周报
- **@whale_alert**：大额转账实时
- **@bertcmiller**：MEV专家

---

## 🔚 结语

链上数据分析是加密世界的**"X光透视"**，让你看穿市场表象，发现：
- ✅ **早期机会**（Smart Money布局、新协议崛起）
- ✅ **风险信号**（项目方跑路、黑客攻击前兆）
- ✅ **市场情绪**（贪婪/恐惧的量化指标）
- ✅ **真实数据**（绕过PR宣传，看实际使用）

**但请记住**：
1. **数据≠真相**：需结合多维度信息（技术面/基本面/宏观）
2. **滞后性**：链上信号通常晚于"最聪明的钱"数天至数周
3. **工具≠能力**：Nansen订阅不能替代独立思考
4. **持续学习**：新协议/新骗局/新指标层出不穷

**建议路径**：
- **第1个月**：免费工具打基础（Etherscan + Dune + DefiLlama）
- **第2–3个月**：学SQL，做自己的Dashboard
- **第4–6个月**：订阅Nansen，跟踪Smart Money
- **第6个月+**：自建系统，形成个人方法论

愿你在数据的海洋中，找到属于自己的**Alpha**！📊🔍
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '基础工具熟悉', description: '注册并学习使用Etherscan（地址/交易查询）、DefiLlama（TVL监控）、Whale Alert（大额转账），理解区块浏览器基本功能与数据字段含义。', estimated_time: '3–5 小时' },
    { step_number: 2, title: 'SQL与Dune Analytics', description: '学习SQL基础语法（SELECT/WHERE/JOIN），在Dune Analytics平台Fork热门Dashboard并修改参数，理解以太坊数据表结构（transactions/traces/events）。', estimated_time: '10–20 小时' },
    { step_number: 3, title: '链上指标与Smart Money', description: '深入理解NVT/MVRV/SOPR等宏观指标，使用Nansen追踪3–5个Smart Money地址，记录其交易行为并分析盈利模式，设置关键地址监控。', estimated_time: '5–10 小时' },
    { step_number: 4, title: '预警系统搭建', description: '使用Hal.xyz或自建Python脚本，配置Telegram Bot推送告警（鲸鱼转账/Smart Money动向/协议TVL异常），测试并优化预警规则减少噪音。', estimated_time: '8–15 小时' },
    { step_number: 5, title: '综合分析与决策', description: '建立个人分析框架，结合链上数据+技术分析+基本面做投资决策，每周复盘信号准确性，持续优化监控指标与Dashboard，加入社区交流学习。', estimated_time: '每周3–5小时' },
  ],
};

// ===== 自动执行：与既有模板一致 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addGuide() {
  try {
    const token = await getAuthToken();

    const strategy = {
      ...GUIDE_CONFIG,
      status: 'published',
      is_featured: true,
      view_count: 0,
      bookmark_count: 0,
      published_at: new Date().toISOString(),
    };

    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      strategy,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('\n✅ 链上数据分析与跟踪完全指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
