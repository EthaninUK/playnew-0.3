const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议生产环境使用环境变量
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '加密货币交易机器人完全指南',
  slug: 'crypto-trading-bots-complete-guide',
  summary:
    '自动化交易全攻略：网格交易、DCA定投、跟单交易、套利机器人、做市策略、技术架构选型、回测优化、风险控制、主流平台对比（3Commas/Pionex/自建Bot）、API安全与防爆仓。',

  // 使用 slug 作为分类标识（与前端 directus.ts 中的定义保持一致）
  category: 'trading-bots',

  // 站内一级/二级分类
  category_l1: 'tools',
  category_l2: '交易机器人',

  // ===== 元数据 =====
  difficulty_level: 3,           // 1-5
  risk_level: 4,                 // API泄露/策略失效/闪电崩盘/过度杠杆
  apy_min: -50,
  apy_max: 200,

  // 资金/时间/技术门槛
  threshold_capital: '500–50,000 USD（按策略类型与杠杆倍数弹性配置）',
  threshold_capital_min: 500,
  time_commitment: '每周 3–10 小时（策略优化/参数调整/监控告警）',
  time_commitment_minutes: 390,
  threshold_tech_level: 'intermediate',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：希望通过**自动化交易**提升效率、减少情绪干扰、实现24/7无间断交易的量化交易者、技术开发者、长期投资者
> **阅读时间**：≈ 25–35 分钟
> **关键词**：Grid Trading / DCA / Arbitrage / Market Making / Backtesting / API / Risk Management / Rebalancing / Webhook / Cloud Hosting / 3Commas / Pionex / CCXT

---

## 🧭 TL;DR
- **核心价值**：**消除情绪干扰**、**24/7执行**、**精确止盈止损**、**策略回测验证**、**多市场同时监控**。
- **主流策略**：**网格交易**（震荡市场）、**DCA定投**（长期建仓）、**套利**（跨所价差/资金费率）、**跟单交易**（复制高手）、**做市商**（提供流动性）。
- **实现方式**：**现成平台**（3Commas/Pionex，零代码）、**开源框架**（Freqtrade/Jesse，需编程）、**完全自建**（Python/Node.js+CCXT，完全自定义）。
- **风控铁律**：**API权限最小化**（禁止提现）、**仓位上限**（单策略≤20%资金）、**止损熔断**（单日亏损>5%自动停机）、**回测充分**（至少6个月历史数据）、**分散交易所**（降低平台风险）。

---

## 🗂 目录
1. [交易机器人基础：为什么需要Bot](#交易机器人基础为什么需要bot)
2. [主流策略详解：网格/DCA/套利/做市](#主流策略详解网格dca套利做市)
3. [实现方式对比：平台 vs 开源 vs 自建](#实现方式对比平台-vs-开源-vs-自建)
4. [网格交易深度解析](#网格交易深度解析)
5. [DCA定投机器人](#dca定投机器人)
6. [套利机器人实战](#套利机器人实战)
7. [跟单交易（Copy Trading）](#跟单交易copy-trading)
8. [做市商策略（Market Making）](#做市商策略market-making)
9. [技术架构与开发](#技术架构与开发)
10. [回测与参数优化](#回测与参数优化)
11. [API安全与权限管理](#api安全与权限管理)
12. [风险控制与应急机制](#风险控制与应急机制)
13. [主流平台深度对比](#主流平台深度对比)
14. [自建Bot实战案例](#自建bot实战案例)
15. [FAQ](#faq)
16. [一页执行清单](#一页执行清单)

---

## 🤖 交易机器人基础：为什么需要Bot

### 人工交易的痛点

❌ **情绪干扰**：
- 恐惧导致过早止损
- 贪婪导致不止盈
- FOMO追高、恐慌杀跌

❌ **时间限制**：
- 无法24/7盯盘（睡觉/工作时错过机会）
- 多市场监控精力不足（50+交易对）

❌ **执行偏差**：
- 手动下单延迟（滑点损失）
- 止盈止损设置遗忘
- 无法精确执行复杂策略

❌ **数据处理能力**：
- 无法快速分析大量历史数据
- 难以多因子综合决策

---

### 交易机器人的优势

✅ **纪律性**：严格按预设规则执行，无情绪波动
✅ **全天候**：7×24小时监控，不错过任何机会
✅ **高效性**：毫秒级响应，捕捉闪电行情
✅ **可回测**：历史数据验证策略有效性
✅ **规模化**：同时运行多策略、多交易对
✅ **精确性**：小数点后8位精度，最优化订单执行

---

### 适合使用Bot的场景

| 场景 | 推荐策略 | 收益预期 | 时间投入 |
|------|---------|---------|---------|
| **震荡市场** | 网格交易 | 月化3%–10% | 初期5h，后续1h/周 |
| **牛市建仓** | DCA定投 | 跟随市场 | 初期2h，全自动 |
| **高频套利** | 跨所套利 | 年化10%–50% | 持续监控+优化 |
| **被动收益** | 做市商 | 年化5%–30% | 中等，需风控 |
| **学习高手** | 跟单交易 | ±高手收益 | 极低，选人为主 |

---

## 📊 主流策略详解：网格/DCA/套利/做市

### 1. 网格交易（Grid Trading）

**原理**：在价格区间内设置多个买入/卖出价格档位，价格下跌时逐级买入，上涨时逐级卖出，赚取差价。

**适用市场**：**震荡市**（无明确趋势，上下波动）

**示例**：
- 交易对：BTC/USDT
- 价格区间：$25,000 - $35,000
- 网格数量：20个
- 每格间距：$500
- 投入资金：$10,000

**执行逻辑**：
\`\`\`
初始价格 $30,000
[卖] $30,500 | $30,000 | [买] $29,500
        ↓价格跌至$29,500
[买入] 0.034 BTC（投入$1,005）
        ↓价格涨回$30,000
[卖出] 0.034 BTC（获得$1,020）
净利润：$15（0.5%单网格收益）
\`\`\`

**优点**：
- 简单易懂，适合新手
- 震荡市场自动低买高卖
- 无需判断方向

**缺点**：
- 单边趋势市场亏损（牛市踏空、熊市套牢）
- 需要较大资金分散风险
- 极端行情（暴涨暴跌）失效

---

### 2. DCA定投（Dollar-Cost Averaging）

**原理**：固定时间间隔（如每周/每日）、固定金额（或动态调整）买入资产，平滑成本。

**适用市场**：**长期看涨资产**（BTC/ETH等蓝筹）

**策略类型**：

#### 固定金额DCA
- 每周一投入$100买入BTC
- 不管价格高低，持续买入
- 牛市买得少（价格高），熊市买得多（价格低）

#### 动态DCA（Martingale）
- 价格下跌时加倍投入（$100 → $200 → $400）
- 快速降低平均成本
- ⚠️ 高风险：连续下跌资金耗尽

#### 反向DCA（卖出策略）
- 价格上涨时分批止盈
- 避免"坐电梯"（涨了又跌回去）

**优点**：
- 心理压力小（不纠结买入时机）
- 长期跑赢择时（Time in market > Timing market）
- 适合工资定投

**缺点**：
- 熊市漫长（2年+），考验耐心
- 不适合短期交易者
- 无法享受择时红利

---

### 3. 套利机器人（Arbitrage Bot）

**原理**：利用不同交易所/交易对之间的价格差异，同时买入低价卖出高价，赚取无风险收益。

**类型**：

#### A. 跨所现货套利
- Binance BTC价格：$30,000
- OKX BTC价格：$30,100
- 操作：Binance买入 + OKX卖出，赚$100（扣除手续费）

**挑战**：
- 充值/提现耗时（错过机会）
- 手续费侵蚀利润（需VIP折扣）
- 链上拥堵（Gas费飙升）

#### B. 三角套利（同交易所内）
- BTC/USDT = 30,000
- ETH/USDT = 2,000
- BTC/ETH = 15.5（理论应为15.0）
- 操作：USDT→BTC→ETH→USDT，赚差价

**优势**：
- 无需跨所转账
- 速度快（秒级完成）

**挑战**：
- 机会窗口极短（毫秒级）
- 高频竞争激烈（拼网络延迟）

#### C. 资金费率套利（Funding Rate）
- 永续合约多空资金费率差异
- 当费率为正（多头付费给空头）时，开空单收取费率
- 同时现货做多对冲风险

**收益**：年化5%–30%（取决于费率波动）

---

### 4. 做市商策略（Market Making）

**原理**：在订单簿上同时挂买单和卖单，赚取买卖价差（Spread）+ 交易所返佣。

**示例**：
- 当前价格：$30,000
- 挂买单：$29,990（深度0.1 BTC）
- 挂卖单：$30,010（深度0.1 BTC）
- 价差：$20（0.067%）

**成交后**：
- 买入成本：$2,999
- 卖出收入：$3,001
- 利润：$2 + 交易所返佣（VIP级别）

**优点**：
- 震荡市场持续收益
- 交易所返佣（Maker费率为负）
- 低风险（买卖对冲）

**缺点**：
- 需大量资金（深度竞争）
- 单边行情风险（库存积压）
- 技术门槛高（低延迟系统）

---

### 5. 跟单交易（Copy Trading）

**原理**：复制优秀交易者的操作（自动跟随开仓/平仓）。

**平台**：Bitget、OKX、Bybit

**收益分成**：
- 交易者收取10%–20%利润分成
- 平台收取交易手续费

**风险**：
- 交易者可能亏损（需筛选历史业绩）
- 延迟跟单（滑点损失）
- 交易者更改策略（无预警）

---

## 🏗️ 实现方式对比：平台 vs 开源 vs 自建

### 方式1：现成平台（No-Code）

**代表产品**：3Commas、Pionex、Bitsgap、Cryptohopper

**优点**：
- ✅ 零代码，图形界面操作
- ✅ 策略模板丰富（一键启动）
- ✅ 回测+纸交易（Paper Trading）
- ✅ 云端运行（无需本地服务器）
- ✅ 多交易所支持

**缺点**：
- ❌ 月费贵（$20–$200/月）
- ❌ 策略不可深度定制
- ❌ API密钥托管风险
- ❌ 平台跑路风险

**适合人群**：非技术背景、快速验证策略、小资金测试

---

### 方式2：开源框架（Low-Code）

**代表框架**：

#### Freqtrade（Python）
- ⭐ 39k+ stars on GitHub
- 支持回测、优化、Dry-run
- 丰富的策略模板
- 活跃社区

#### Jesse（Python）
- 专注策略研发与回测
- 优雅的API设计
- 支持多时间框架

#### Gekko（Node.js）- ⚠️ 已停止维护
- 历史项目，不推荐新用户

**优点**：
- ✅ 免费开源
- ✅ 本地运行（API密钥不外泄）
- ✅ 可定制策略（Python编程）
- ✅ 大量社区策略

**缺点**：
- ❌ 需要编程基础（Python）
- ❌ 需要服务器（VPS/本地电脑）
- ❌ 配置复杂（数据库/环境）

**适合人群**：有编程基础、追求自主可控、中长期运营

---

### 方式3：完全自建（Full-Code）

**技术栈**：
- **语言**：Python、Node.js、Go
- **交易所API库**：CCXT（统一多交易所接口）
- **数据存储**：PostgreSQL、InfluxDB
- **回测引擎**：Backtrader、Zipline
- **部署**：AWS/GCP/阿里云、Docker

**优点**：
- ✅ 100%自定义（策略/风控/监控）
- ✅ 最高安全性（完全掌控）
- ✅ 性能优化（高频交易）
- ✅ 可商业化（卖策略/服务）

**缺点**：
- ❌ 开发周期长（数月）
- ❌ 需专业技能（量化+工程）
- ❌ 维护成本高

**适合人群**：专业量化团队、技术创业者、高频交易

---

## 📐 网格交易深度解析

### 参数配置

#### 1. 价格区间设置
**方法A：技术分析**
- 根据支撑位/阻力位设定
- 使用布林带（Bollinger Bands）上下轨
- ATR（平均真实波幅）确定波动范围

**方法B：历史数据**
- 过去3个月价格区间（去除极值）
- 覆盖90%价格波动

**示例**：
- BTC近3月：$25K - $35K
- 去除5%极值：$26K - $34K
- 安全区间：$27K - $33K（80%置信度）

---

#### 2. 网格数量
**公式**：
\`\`\`
单格收益率 = (上界 - 下界) / 网格数量 / 平均价格
网格数量 = (上界 - 下界) / 目标单格收益率 / 平均价格
\`\`\`

**经验值**：
- **激进**：50–100格（单格0.2%–0.5%）
- **平衡**：20–50格（单格0.5%–1%）
- **保守**：10–20格（单格1%–2%）

**权衡**：
- 格子多：成交频繁（手续费高），收益碎片化
- 格子少：成交少（机会少），单次收益高

---

#### 3. 资金分配
**等比分配**（推荐）：
- 每格投入金额相等
- 示例：$10K / 20格 = $500/格

**等差分配**：
- 底部格子资金多（抄底加仓）
- 顶部格子资金少

**动态调仓**：
- 根据持仓比例动态调整
- 避免极端价格下全仓买入/全部卖出

---

### 风险管理

#### 止损机制
**场景**：价格跌破下界（$27K）

**应对**：
- **方案A**：扩大下界（如降至$24K），追加资金
- **方案B**：全部止损，等待回归区间再启动
- **方案C**：切换为DCA模式（定投加仓）

**止盈机制**
**场景**：价格突破上界（$33K）

**应对**：
- **方案A**：扩大上界（如$36K），继续运行
- **方案B**：全部止盈卖出，锁定利润
- **方案C**：部分止盈（卖出50%），保留底仓

---

### 实战案例

**项目**：ETH网格交易（2023年Q2）

**参数**：
- 区间：$1,600 - $2,400
- 网格：40格
- 投入：$20,000
- 平台：Pionex

**运行结果（90天）**：
- 成交次数：320次
- 网格利润：$1,240（6.2%）
- 手续费：-$180
- 净利润：$1,060（5.3%）
- 月化收益：1.77%

**额外收益**：
- ETH价格上涨20%（$1,800 → $2,160）
- 持币市值增加：$2,000
- 总收益：$3,060（15.3%）

**教训**：
- 牛市网格会"踏空"（卖飞）
- 适合震荡市，趋势市需结合持币

---

## 💵 DCA定投机器人

### 策略设计

#### 基础版：固定金额 + 固定间隔
\`\`\`python
# 伪代码
每周一 00:00 UTC:
    市价买入 $100 BTC
    记录买入价格与数量
    更新平均成本
\`\`\`

**优点**：简单稳定
**缺点**：未考虑市场状态

---

#### 进阶版：动态金额（价格加权）
\`\`\`python
基础投入 = $100
当前价格 = $30,000
平均成本 = $28,000

if 当前价格 < 平均成本:
    投入金额 = 基础投入 × 1.5  # 跌破成本加仓
else:
    投入金额 = 基础投入 × 0.5  # 高于成本减仓
\`\`\`

**优点**：逢低加仓，降低成本
**缺点**：需更多资金储备

---

#### 高阶版：结合技术指标
\`\`\`python
RSI = 计算RSI(14)

if RSI < 30:  # 超卖
    投入金额 = 基础投入 × 2
elif RSI > 70:  # 超买
    投入金额 = 0  # 暂停买入
else:
    投入金额 = 基础投入
\`\`\`

**优点**：避免追高，精准抄底
**缺点**：可能错过强势上涨

---

### 止盈策略

#### 梯度止盈
\`\`\`
平均成本 = $28,000
当前价格 = $35,000（+25%）

动作：
- 卖出20%仓位，回收$7,000
- 保留80%仓位继续持有
- 止盈线上移至$40,000
\`\`\`

**目标**：落袋为安 + 保留上涨空间

---

#### 时间止盈
\`\`\`
投资周期 = 2年
当前时间 = 24个月

动作：
- 不论盈亏，全部卖出
- 避免"再等一年"的心理陷阱
\`\`\`

---

### 平台推荐

| 平台 | 费用 | 特色 | 推荐度 |
|------|------|------|--------|
| **Binance DCA** | 免费 | 官方支持，安全 | ★★★★★ |
| **OKX DCA** | 免费 | 支持多币种 | ★★★★☆ |
| **3Commas DCA** | $20/月 | 高级参数 | ★★★☆☆ |
| **自建Bot** | 服务器费 | 完全定制 | ★★★★☆ |

---

## ⚡ 套利机器人实战

### 跨所套利架构

#### 系统组件
\`\`\`
[价格监控模块] → [套利引擎] → [订单执行模块]
       ↓              ↓              ↓
  Websocket    计算利润空间    API下单
  (实时价格)    (扣除手续费)   (并发执行)
\`\`\`

---

#### 关键指标

**利润阈值**：
\`\`\`
最小利润率 = (手续费A + 手续费B + 滑点 + 提现费) × 安全系数(1.5)

示例：
- 交易所A手续费：0.1%
- 交易所B手续费：0.1%
- 滑点：0.05%
- 提现费：0.0005 BTC（约$15）
- 最小利润率：(0.1% + 0.1% + 0.05%) × 1.5 = 0.375%

结论：价差需>0.4%才值得套利
\`\`\`

---

### 三角套利实现

#### 机会扫描
\`\`\`python
# 伪代码
pairs = ['BTC/USDT', 'ETH/USDT', 'ETH/BTC']

def find_arbitrage():
    btc_usdt = get_price('BTC/USDT')  # 30,000
    eth_usdt = get_price('ETH/USDT')  # 2,000
    eth_btc = get_price('ETH/BTC')     # 0.067

    # 路径：USDT → BTC → ETH → USDT
    path1 = 1 / btc_usdt * eth_btc * eth_usdt
    # 路径：USDT → ETH → BTC → USDT
    path2 = 1 / eth_usdt / eth_btc * btc_usdt

    if path1 > 1.003:  # 0.3%利润
        return 'execute_path1'
    elif path2 > 1.003:
        return 'execute_path2'
    else:
        return 'no_opportunity'
\`\`\`

---

#### 执行优化
**并发下单**：
\`\`\`python
async def execute_arbitrage():
    async with aiohttp.ClientSession() as session:
        tasks = [
            buy_btc(session, amount),
            sell_eth_btc(session, eth_amount),
            sell_eth_usdt(session, eth_amount)
        ]
        results = await asyncio.gather(*tasks)
    return results
\`\`\`

**优势**：3笔订单同时执行（延迟<100ms）

---

### 资金费率套利

#### 策略逻辑
\`\`\`
当Funding Rate > 0.05%（年化54%）:
    1. 永续合约开空单（收取费率）
    2. 现货买入等量BTC（对冲价格风险）
    3. 每8小时收取一次资金费率
    4. 当费率转负或降至0.01%时平仓

风险对冲：
- 合约亏损 = 现货盈利
- 净收益 = 累计资金费率 - 手续费
\`\`\`

**实战收益**（2024年Q1）：
- 平均费率：0.03%/8h（年化33%）
- 实际到手：年化25%（扣除手续费+滑点）

---

## 👥 跟单交易（Copy Trading）

### 平台选择

| 平台 | 交易者数量 | 分成比例 | 最低跟单 | 特色 |
|------|-----------|---------|---------|------|
| **Bitget** | 10,000+ | 10% | $10 | 最大平台 |
| **OKX** | 5,000+ | 8%–12% | $100 | 合约专精 |
| **Bybit** | 8,000+ | 10% | $50 | 衍生品丰富 |
| **eToro** | 30,000+ | 无（平台手续费） | $200 | 传统金融+加密 |

---

### 交易者筛选标准

#### 硬指标
✅ **历史收益**：
- 近3个月ROI > 20%
- 近6个月ROI > 50%
- 近1年ROI > 100%

✅ **最大回撤（Max Drawdown）**：
- 优秀：<20%
- 可接受：20%–40%
- 警惕：>40%

✅ **交易频率**：
- 过高（>10单/天）：可能过度交易
- 过低（<1单/周）：样本不足

✅ **跟随者数量**：
- 500+ 跟随者（社区认可）

---

#### 软指标
✅ **交易风格**：
- 与你的风险偏好匹配（激进/稳健）

✅ **公开透明**：
- 分享交易逻辑（不是黑箱）
- 定期复盘总结

✅ **无明显作弊**：
- 避免"刷单"（自买自卖刷收益率）
- 检查大额订单是否真实成交

---

### 风险控制

**仓位控制**：
- 单个交易者：≤30%资金
- 分散3–5个交易者

**止损设置**：
- 单个交易者亏损>15%自动停止跟单
- 总账户亏损>20%停止所有跟单

**定期评估**：
- 每月审查交易者表现
- 淘汰末位，补充新人

---

## 🏦 做市商策略（Market Making）

### 基础做市算法

#### Naive Market Making
\`\`\`python
mid_price = (best_bid + best_ask) / 2
spread = 0.2%  # 0.1%单边

buy_order = mid_price × (1 - spread/2)
sell_order = mid_price × (1 + spread/2)

place_limit_order('buy', buy_order, amount)
place_limit_order('sell', sell_order, amount)
\`\`\`

**问题**：
- 单边行情库存失衡（全买入或全卖出）
- 无风险控制

---

#### 库存管理（Inventory Management）
\`\`\`python
target_position = 0  # 目标持仓为0（中性）
current_position = 5 BTC  # 当前持有5 BTC

# 持仓过多，降低买单价格，提高卖单价格
skew = (current_position - target_position) × 0.001

buy_price = mid_price × (1 - spread/2 - skew)
sell_price = mid_price × (1 + spread/2 + skew)
\`\`\`

**效果**：持仓过多时自动降价卖出，恢复中性

---

### Avellaneda-Stoikov模型（学术级）

**论文**：《High-frequency trading in a limit order book》

**核心思想**：基于库存、波动率、风险厌恶动态调整价差

**公式**（简化版）：
\`\`\`
δ_bid = δ - (q × γ × σ²)
δ_ask = δ + (q × γ × σ²)

δ: 基础价差
q: 当前库存
γ: 风险厌恶系数
σ: 波动率
\`\`\`

**实现**：需要量化背景，不适合新手

---

### 交易所返佣

**Maker费率**（挂单）：
- VIP 0：0.020%（收费）
- VIP 1：0.016%
- VIP 5：-0.005%（**返佣**）
- VIP 9：-0.015%

**Taker费率**（吃单）：
- VIP 0：0.050%
- VIP 9：0.025%

**策略**：
- 做市商尽量使用Maker订单（挂单）
- 达到VIP高等级享受负费率（躺赚手续费）

---

## 🛠️ 技术架构与开发

### 自建Bot技术栈

#### 1. 编程语言选择

| 语言 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **Python** | 生态丰富、易学 | 速度慢 | 中低频策略 |
| **Node.js** | 异步I/O高效 | 回调地狱 | Websocket实时 |
| **Go** | 高性能、并发 | 生态小 | 高频交易 |
| **C++** | 极致性能 | 复杂度高 | 专业量化公司 |

**推荐**：Python（Freqtrade）或 Node.js（CCXT + Express）

---

#### 2. 核心库

**CCXT**（CryptoCurrency eXchange Trading Library）
- 支持150+交易所
- 统一API接口（REST + WebSocket）
- 开源免费

\`\`\`python
import ccxt

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

ticker = exchange.fetch_ticker('BTC/USDT')
print(ticker['last'])  # 最新价格
\`\`\`

---

#### 3. 数据存储

**时序数据库**（K线/Tick数据）：
- **InfluxDB**：专为时序优化
- **TimescaleDB**：基于PostgreSQL

**关系数据库**（订单/账户）：
- **PostgreSQL**：稳定可靠
- **MySQL**：简单易用

**缓存**：
- **Redis**：实时价格缓存

---

#### 4. 部署方案

**本地开发**：
- 笔记本/台式机（测试）
- 树莓派（小规模运行）

**云服务器**：
- **AWS EC2**（全球节点）
- **阿里云**（中国优化）
- **Vultr/DigitalOcean**（性价比）

**配置建议**：
- CPU：2核+
- 内存：4GB+
- 带宽：10Mbps+
- 延迟：<50ms到交易所

**Docker化**：
\`\`\`dockerfile
FROM python:3.10
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . /app
CMD ["python", "bot.py"]
\`\`\`

---

## 📈 回测与参数优化

### 回测流程

#### 1. 数据准备
\`\`\`python
# 下载历史K线数据
exchange = ccxt.binance()
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', since=start_timestamp, limit=5000)

# 保存到CSV
df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
df.to_csv('BTC_USDT_1h.csv')
\`\`\`

**数据量建议**：
- 最少：3个月
- 推荐：1年+
- 理想：多轮牛熊（5年+）

---

#### 2. 策略实现
\`\`\`python
def grid_strategy(df, lower, upper, grids):
    """网格交易回测"""
    grid_prices = np.linspace(lower, upper, grids)
    position = 0
    cash = 10000

    for price in df['close']:
        # 检查触发哪个网格
        for grid_price in grid_prices:
            if price <= grid_price and position < max_position:
                # 买入
                cash -= grid_price × unit
                position += unit
            elif price >= grid_price and position > 0:
                # 卖出
                cash += grid_price × unit
                position -= unit

    return cash + position × df['close'].iloc[-1]
\`\`\`

---

#### 3. 执行回测
\`\`\`python
from backtrader import Cerebro

cerebro = Cerebro()
cerebro.addstrategy(GridStrategy)
cerebro.adddata(data)
cerebro.broker.setcash(10000)
cerebro.run()

print(f'Final Portfolio Value: {cerebro.broker.getvalue()}')
cerebro.plot()
\`\`\`

---

### 参数优化

#### 网格搜索（Grid Search）
\`\`\`python
best_params = None
best_return = 0

for lower in range(25000, 28000, 500):
    for upper in range(32000, 36000, 500):
        for grids in [10, 20, 30, 40]:
            result = backtest(lower, upper, grids)
            if result > best_return:
                best_return = result
                best_params = (lower, upper, grids)

print(f'Best: {best_params}, Return: {best_return}')
\`\`\`

**缺点**：计算量大（组合爆炸）

---

#### 遗传算法（Genetic Algorithm）
\`\`\`python
from scipy.optimize import differential_evolution

def objective(params):
    lower, upper, grids = params
    return -backtest(lower, upper, int(grids))  # 负号（最小化→最大化）

bounds = [(25000, 28000), (32000, 36000), (10, 50)]
result = differential_evolution(objective, bounds)
print(result.x)  # 最优参数
\`\`\`

**优势**：高效搜索复杂参数空间

---

### 过拟合风险

⚠️ **危险信号**：
- 回测收益率>100%（过于理想）
- 样本外表现骤降（训练集vs测试集）
- 参数过于精确（如网格数=37.2）

✅ **防范措施**：
- **样本外验证**：80%训练，20%测试
- **前推验证**（Walk-Forward）：滚动训练+测试
- **简化策略**：参数<5个
- **压力测试**：极端行情（黑天鹅）

---

## 🔐 API安全与权限管理

### API权限设置

**最小权限原则**：
- ✅ **读取**（Read）：查询余额、订单
- ✅ **交易**（Trade）：下单、撤单
- ❌ **提现**（Withdraw）：**禁止**（防止API泄露后被盗币）

**IP白名单**：
- 绑定服务器固定IP
- 家庭宽带需DDNS（动态域名）

**子账户隔离**：
- 主账户存储大额资产
- 子账户仅划入交易所需资金（如10%）

---

### API密钥管理

❌ **错误做法**：
\`\`\`python
API_KEY = "abc123..."  # 硬编码在代码中
\`\`\`

✅ **正确做法**：
\`\`\`bash
# .env 文件（不提交到Git）
BINANCE_API_KEY=abc123...
BINANCE_SECRET=xyz789...
\`\`\`

\`\`\`python
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('BINANCE_API_KEY')
\`\`\`

**加密存储**：
\`\`\`python
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)
encrypted_api_key = cipher.encrypt(API_KEY.encode())

# 使用时解密
decrypted = cipher.decrypt(encrypted_api_key).decode()
\`\`\`

---

### 异常监控

**告警触发条件**：
- API连接失败（5分钟无响应）
- 订单执行失败率>10%
- 账户余额骤降>20%
- 异常登录（新IP）

**告警渠道**：
- **Telegram Bot**（推荐）
- **Discord Webhook**
- **Email**（延迟高）
- **短信**（重要事件）

\`\`\`python
import requests

def send_alert(message):
    telegram_api = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {
        'chat_id': CHAT_ID,
        'text': f'🚨 Alert: {message}'
    }
    requests.post(telegram_api, data=payload)
\`\`\`

---

## 🛡️ 风险控制与应急机制

### 多层风控体系

#### Level 1：策略层
- 单笔订单上限（如$1000）
- 日交易次数限制（<100次）
- 持仓比例上限（单币种<30%）

#### Level 2：账户层
- 日亏损熔断（-5%自动停机）
- 周亏损上限（-10%人工介入）
- 保证金使用率<50%（杠杆交易）

#### Level 3：系统层
- 服务器宕机检测（心跳监控）
- 网络异常重连（指数退避算法）
- 数据库备份（每日）

---

### 应急预案

#### 场景1：闪电崩盘（Flash Crash）
**触发**：价格5分钟内暴跌>20%

**应对**：
1. 立即暂停所有策略
2. 市价平仓止损（如有杠杆）
3. 手动评估是否恢复

**代码实现**：
\`\`\`python
def check_flash_crash():
    price_5min_ago = get_price_at(now - 5min)
    current_price = get_current_price()

    if (price_5min_ago - current_price) / price_5min_ago > 0.2:
        stop_all_bots()
        send_alert("Flash Crash Detected!")
        if has_leverage_position():
            close_all_positions()
\`\`\`

---

#### 场景2：交易所API故障
**触发**：连续10次请求失败

**应对**：
1. 切换备用交易所
2. 或暂停策略，等待恢复
3. 检查是否被限流（Rate Limit）

---

#### 场景3：Bot逻辑BUG
**触发**：异常大额订单（如买入100 BTC）

**应对**：
1. **Dry-run模式**：上线前纸交易测试1周
2. **金额检查**：订单金额>阈值需二次确认
3. **人工审核**：日志记录所有订单，每日检查

---

### 资金管理

**凯利公式**（Kelly Criterion）：
\`\`\`
f = (bp - q) / b

f: 最优仓位比例
b: 赔率（盈亏比）
p: 胜率
q: 败率 (1-p)
\`\`\`

**示例**：
- 策略胜率：60%
- 平均盈亏比：1.5:1
- 最优仓位：(1.5×0.6 - 0.4) / 1.5 = **33%**

**实战调整**：
- 凯利公式过于激进，实际使用**0.5倍凯利**（16.5%）
- 新策略从**5%**起步，逐步加仓

---

## 🏆 主流平台深度对比

| 平台 | 月费 | 策略类型 | 交易所 | 回测 | API托管 | 推荐度 |
|------|------|---------|--------|------|---------|--------|
| **3Commas** | $29–$99 | 网格/DCA/跟单 | 20+ | ✅ | ☁️云端 | ★★★★☆ |
| **Pionex** | 免费（手续费0.05%） | 网格/DCA | 内置交易所 | ✅ | ☁️云端 | ★★★★★ |
| **Bitsgap** | $23–$199 | 网格/套利 | 15+ | ✅ | ☁️云端 | ★★★☆☆ |
| **Cryptohopper** | $29–$99 | 技术指标/AI | 15+ | ✅ | ☁️云端 | ★★★☆☆ |
| **Freqtrade** | 免费 | 完全自定义 | 任意（CCXT） | ✅ | 🔒本地 | ★★★★★ |
| **币安网格** | 免费 | 网格 | 币安 | ❌ | ☁️云端 | ★★★★☆ |

---

### Pionex深度评测

**优势**：
- ✅ 完全免费（仅收交易手续费0.05%）
- ✅ 内置交易所（无需API密钥）
- ✅ 策略丰富（16种Bot）
- ✅ 移动端友好

**劣势**：
- ❌ 仅支持Pionex交易所（流动性不如Binance）
- ❌ 无法跨所套利
- ❌ 提现需KYC

**适合**：新手入门、小资金（$500–$5K）

---

### 3Commas深度评测

**优势**：
- ✅ 支持20+交易所
- ✅ 高级DCA（SmartTrade）
- ✅ 跟单市场（复制高手）
- ✅ TradingView信号集成

**劣势**：
- ❌ 月费贵（$49 Pro套餐才能多Bot）
- ❌ API托管（安全风险）
- ❌ 用户界面复杂

**适合**：中级用户、多策略组合、$5K+ 资金

---

## 💻 自建Bot实战案例

### 案例：简单网格Bot（Python）

\`\`\`python
import ccxt
import time

# 配置
exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

SYMBOL = 'BTC/USDT'
LOWER = 27000
UPPER = 33000
GRIDS = 20
AMOUNT_PER_GRID = 0.001  # BTC

# 生成网格价格
grid_prices = [LOWER + (UPPER - LOWER) / GRIDS * i for i in range(GRIDS + 1)]
print(f"Grid Prices: {grid_prices}")

# 下单逻辑
def place_grid_orders():
    current_price = exchange.fetch_ticker(SYMBOL)['last']

    # 取消所有现有订单
    open_orders = exchange.fetch_open_orders(SYMBOL)
    for order in open_orders:
        exchange.cancel_order(order['id'], SYMBOL)

    # 重新挂单
    for price in grid_prices:
        if price < current_price:
            # 挂买单
            exchange.create_limit_buy_order(SYMBOL, AMOUNT_PER_GRID, price)
        elif price > current_price:
            # 挂卖单
            exchange.create_limit_sell_order(SYMBOL, AMOUNT_PER_GRID, price)

    print(f"Orders placed at {time.ctime()}")

# 主循环
while True:
    try:
        place_grid_orders()
        time.sleep(300)  # 每5分钟检查一次
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(60)
\`\`\`

**改进方向**：
- 添加止损/止盈
- 库存管理
- Telegram告警
- 日志记录

---

## ❓FAQ

**Q1：交易机器人真的能稳定盈利吗？**
> **现实**：
> - 网格交易在震荡市可以月化1%–5%（年化12%–80%）
> - DCA定投长期跑赢50%手动择时者
> - 套利年化10%–30%（但资金门槛高，竞争激烈）
>
> **风险**：
> - 趋势市场网格会亏损（踏空或套牢）
> - 代码BUG可能导致重大损失
> - 80%自建Bot在3个月内放弃（维护成本高）

**Q2：用平台的Bot安全吗（API密钥托管）？**
> **大平台（3Commas/Pionex）相对安全**：
> - 有安全审计与保险
> - 禁用提现权限即可
>
> **风险依然存在**：
> - 平台被黑客攻击（历史有先例）
> - 平台跑路（小平台风险高）
>
> **建议**：仅托管小额资金（<30%），大额自建

**Q3：新手该从哪种策略入门？**
> **推荐顺序**：
> 1. **网格交易**（Pionex免费体验）→ 理解机制
> 2. **DCA定投**（Binance/OKX内置）→ 培养耐心
> 3. **跟单交易**（Bitget）→ 学习高手
> 4. **自建简单Bot**（Freqtrade模板）→ 技术积累
>
> **避免**：直接上高频套利/复杂策略（爆仓风险高）

**Q4：需要多少启动资金？**
> - **测试**：$100–$500（纸交易/小仓位）
> - **网格交易**：$1,000–$5,000（20–50格）
> - **DCA定投**：$500起（每月$100×5个月）
> - **套利**：$10,000+（需分散多交易所）
> - **做市商**：$50,000+（深度竞争）

**Q5：Bot会被交易所封号吗？**
> **合规使用不会**：
> - 使用官方API（不是爬虫）
> - 遵守Rate Limit（请求频率限制）
> - 不刷单/不操纵市场
>
> **风险行为**：
> - 高频请求（>1200次/分钟）→ 限流/封IP
> - 异常订单（瞬间大量撤单）→ 风控审查
> - 跨所套利（被识别为刷单）→ 冻结账户

---

## ✅ 一页执行清单

### 新手入门（第1–4周）
- [ ] 学习核心概念（网格/DCA/套利/回测）
- [ ] 选择1个平台（Pionex/币安网格/3Commas）
- [ ] 用$100–$500测试网格交易（小仓位试错）
- [ ] 记录每日收益与参数调整
- [ ] 阅读3篇以上回测教程

### 进阶实战（第2–3个月）
- [ ] 增加资金至$1,000–$5,000
- [ ] 同时运行2–3个策略（网格+DCA）
- [ ] 学习回测（下载历史数据+Backtrader）
- [ ] 加入量化交易社区（Discord/Telegram）
- [ ] 尝试跟单交易（筛选3个优质交易者）

### 自建Bot（第4–6个月）
- [ ] 学习Python基础（Codecademy/菜鸟教程）
- [ ] 安装Freqtrade框架（官方文档）
- [ ] 修改策略模板（调整参数）
- [ ] 本地回测至少3个月历史数据
- [ ] 纸交易（Dry-run）2周无错误

### 专业化（第6个月+）
- [ ] 租用云服务器（AWS/阿里云）
- [ ] Docker部署Bot（自动重启）
- [ ] 配置Telegram告警（实时监控）
- [ ] 优化策略（遗传算法/网格搜索）
- [ ] 考虑多交易所套利（需$10K+资金）

### 风控与维护
- [ ] 设置API权限（禁用提现）
- [ ] 开启IP白名单
- [ ] 每日检查日志（异常订单）
- [ ] 每周复盘收益（Excel记录）
- [ ] 每月更新策略参数（适应市场）

---

## 🎓 进阶学习资源

### 开源框架
- **Freqtrade**：https://www.freqtrade.io/
- **Jesse**：https://jesse.trade/
- **CCXT**：https://github.com/ccxt/ccxt

### 量化社区
- **Freqtrade Discord**：活跃的策略讨论
- **Reddit r/algotrading**：量化交易综合
- **QuantConnect Forum**：学术级讨论
- **币乎/巴比特**：中文量化社区

### 学习课程
- **QuantStart**：Python量化入门（英文）
- **Coursera - ML for Trading**：机器学习+量化
- **优达学城 - AI量化交易**：中文课程

### 数据与工具
- **TradingView**：图表+策略回测
- **CoinGecko API**：免费历史数据
- **Kaiko/CryptoCompare**：专业级数据（付费）

---

## 🔚 结语

交易机器人是**量化交易的入门工具**，但**不是圣杯**。成功的Bot背后是：

✅ **扎实的策略逻辑**（理解市场本质）
✅ **严格的风控纪律**（保护本金第一）
✅ **持续的学习优化**（市场永远在变）
✅ **理性的心态**（接受回撤与失败）

**建议路径**：
1. **第1步**：用现成平台（Pionex）体验，理解机制（1–3个月）
2. **第2步**：学习回测，验证自己的想法（3–6个月）
3. **第3步**：自建简单Bot，完全掌控（6–12个月）
4. **第4步**：根据表现决定：继续深化 or 转向其他策略

记住：**机器人执行策略，但策略来自人脑**。技术只是工具，核心是你对市场的理解！🤖📈
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '策略学习与平台选择', description: '学习网格/DCA/套利等核心策略原理，选择合适平台（Pionex零门槛/3Commas高级功能/Freqtrade开源），用$100–$500小资金测试体验。', estimated_time: '5–10 小时' },
    { step_number: 2, title: '回测与参数优化', description: '下载历史数据（至少6个月），使用Backtrader/Freqtrade回测策略，网格搜索或遗传算法优化参数，验证样本外表现。', estimated_time: '10–20 小时' },
    { step_number: 3, title: '纸交易与风控设置', description: '使用Dry-run模式运行2周，验证逻辑无误；设置API权限（禁提现）、止损熔断（日亏损5%）、仓位上限（单策略20%）。', estimated_time: '3–5 小时' },
    { step_number: 4, title: '实盘运行与监控', description: '云服务器部署Bot（Docker化），配置Telegram告警（连接失败/异常订单/账户亏损），每日检查日志与订单执行情况。', estimated_time: '每日15–30分钟' },
    { step_number: 5, title: '持续优化与扩展', description: '每周复盘收益与回撤，调整参数适应市场；每月评估策略有效性，淘汰劣质策略；探索新策略（套利/做市）与多交易所部署。', estimated_time: '每周2–5小时' },
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

    console.log('\n✅ 加密货币交易机器人完全指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
