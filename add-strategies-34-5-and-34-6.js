// 策略 34.6: 衍生品策略 (Derivatives Strategies) - 马丁格尔网格 (Martingale Grid)

const axios = require('axios');

/**
 * 34.6 马丁格尔网格
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: grid-trading
 * category_l2: grid-trading
 */

const STRATEGY_34_6 = {
  title: '马丁格尔网格 - 越跌越买的加仓网格变体',
  slug: 'martingale-grid-trading',
  summary:
    '马丁格尔网格是在普通网格的基础上，引入“越跌越买、逐级放大仓位”的加仓逻辑：价格每下跌一层网格，单格买入数量随之加大，试图在深度回调后的反弹中，用更大的仓位快速摊低成本并放大利润。它本质是一种用加倍（或逐级加重）仓位换取高胜率和更快回本节奏的思路，因此风险极高，只适合在极其保守的参数、极小的资金配比下做实验性使用。',
  category: 'grid-trading',
  category_l1: 'derivatives',
  category_l2: 'grid-trading',
  risk_level: 5,
  apy_min: 10,
  apy_max: 200,
  min_investment: 300,
  time_commitment:
    '需要在大周期上保持耐心（可能长时间套牢），同时在极端行情时能盯盘并果断风控，不适合完全放养挂机',
  status: 'published',
  content: `# 34.6 马丁格尔网格 - 越跌越买的加仓网格变体

> ⚠️ 再次强调：马丁格尔思路天生带有“用加倍仓位换取高胜率”的基因，  
> 一定要用**极其保守的版本**来结合网格，否则非常容易陷入深渊。  

---

## 💰 策略概览

| 维度              | 内容说明 |
|-------------------|----------|
| **所属模块**      | 衍生品策略 (Derivatives Strategies) / grid-trading |
| **策略名称**      | 马丁格尔网格（Martingale Grid） |
| **核心逻辑**      | 在普通网格基础上，引入“越跌越多买”的加仓权重函数 |
| **收益来源**      | 深跌过程中持续加仓 + 反弹阶段更大仓位的差价收益 |
| **关键前提**      | 标的具备中长期价值，不是纯空气/高归零风险资产 |
| **主要风险**      | 长周期单边下跌、基本面破坏、资金耗尽、心态崩溃 |
| **适用人群**      | 已熟悉现货网格 / 合约基础，对马丁格尔有清醒认知的进阶玩家 |

---

## 📖 场景故事：你不满足“每格等额买入”，想要更狠一点

假设你已经很熟悉普通网格：

- 每跌一格，买入相同数量的 BTC（例如每格 0.01 BTC）；  
- 每涨一格，卖出同等数量；  
- 整体仓位随价格变化，涨跌都相对平滑。

但是，你开始产生一种冲动：

> “如果 BTC 跌得越多，我越想在下面多买一点，  
>  反弹的时候仓位更重，岂不是赚得更多？”

于是你接触到“马丁格尔网格”：

- 在普通网格的下半部分，  
  - 第一个下行格子买 1 份，  
  - 第二个下行格子买 1.2 份，  
  - 第三个买 1.4 份，  
  - 越往下，买得越多。  
- 一旦行情从深水区反弹，  
  - 更大仓位参与上行，  
  - 总体成本被快速摊低，  
  - 盈利看起来更“暴力”。

这在某些行情中确实很好看，  
但代价也很直白：

> 如果价格不按你期望的方式反弹，  
> 而是一路跌、跌、再跌，  
> 那你的资金会以越来越快的速度被“吃光”。

---

## 🧠 马丁格尔网格的结构拆解

### 1️⃣ 普通网格回顾

普通现货网格（以 BTC/USDT 为例）：

- 区间：25,000 ~ 35,000 USDT；  
- 网格数：20；  
- 每格买卖数量：固定（例如 0.01 BTC）；  

在下跌过程中：

- 每降一层，就用同样的资金/数量接一次；  
- 仓位曲线随价格下跌线性增长；  
- 风险相对可控，但反弹时收益也相对“均匀”。

### 2️⃣ 马丁格尔网格的核心差异：加权买入

马丁格尔网格引入一个“权重函数”：

- 越往下，权重越高；  
- 例如下行第 i 层网格的权重 = growthFactor^i；  
- growthFactor 大于 1 时，每下一层权重放大。

直观上：

- 上半部分网格：  
  - 买得少、卖得勤，更多是“打前哨”；  
- 下半部分网格：  
  - 真正的“重仓区”，  
  - 你在这里豪赌未来某个时刻的反弹。

> ✅ 好处：  
> - 若价格在下半部分止跌反弹，整体成本被迅速摊低，  
> - 收益比普通网格更“爆炸”。  
>
> ❌ 代价：  
> - 若下半部分继续跌破甚至长时间盘整，  
> - 你会在“仓位已经极重”的情况下边扛边煎熬。

---

## 🧩 一个简化的马丁权重模型

下面是一个极简的“马丁权重函数”示例，  
用于说明“越跌买得越多”的逻辑。

\\\`\\\`\\\`javascript
/**
 * 简化版马丁格尔权重函数：
 * - index 越大，代表越靠下的网格
 * - growthFactor 用来控制加仓强度（例如 1.1~1.3）
 */
function martingaleWeight(index, growthFactor) {
  // index 从 0 开始：0 表示上方第一个格子，数值越大越底部
  return Math.pow(growthFactor, index);
}

// 示例：输出 0~5 层的权重
for (let i = 0; i <= 5; i++) {
  const w = martingaleWeight(i, 1.2);
  console.log('Grid', i, 'weight =', w.toFixed(4));
}
\\\`\\\`\\\`
  
你可以基于这些权重，  
对每一个网格分配不同的买入额度：

- 下跌越深的网格，买入金额越大；  
- 总体资金则按照所有权重归一化之后分配。

---

## 🛠️ 马丁格尔网格资金分配示例（教学版）

下面是一个将总资金分配到各个下行网格的简化模型：

\\\`\\\`\\\`javascript
/**
 * 根据马丁格尔权重，将总资金分配到每个下行买入网格
 * totalInvestment: 总资金
 * gridCount: 下行网格数量
 * growthFactor: 加仓倍率
 */
function allocateMartingaleGridFunds(totalInvestment, gridCount, growthFactor) {
  const weights = [];
  for (let i = 0; i < gridCount; i++) {
    const w = Math.pow(growthFactor, i);
    weights.push(w);
  }

  const sum = weights.reduce((a, b) => a + b, 0);
  const perGrid = weights.map((w) => (w / sum) * totalInvestment);
  return perGrid;
}

// 使用示例
const total = 5000;       // 总资金 5000 USDT
const grids = 10;         // 10 个下行网格
const factor = 1.2;       // 每下一格权重乘以 1.2

const allocation = allocateMartingaleGridFunds(total, grids, factor);
console.log('分配结果:');
allocation.forEach((amt, idx) => {
  console.log('Grid', idx, '资金 =', amt.toFixed(2), 'USDT');
});
\\\`\\\`\\\`

真实策略中，你会将：

- 区间 [lowerPrice, upperPrice] 划成若干档；  
- 选定下半部分作为“马丁加仓区域”；  
- 按上述方式给每一个下行网格分配资金或买入数量。

---

## 🧱 策略配置结构示例（概念参数）

\\\`\\\`\\\`javascript
const MARTINGALE_GRID_CONFIG_TEMPLATE = {
  symbol: 'BTCUSDT',              // 标的
  mode: 'spot',                   // 建议从现货开始，不要一上来就用合约
  lowerPrice: 25000,              // 区间下边界
  upperPrice: 35000,              // 区间上边界
  gridCount: 20,                  // 总网格数
  totalInvestment: 5000,          // 总资金（示意）

  // 马丁相关参数
  martingaleEnabled: true,        // 是否开启马丁模式
  martingaleGrowthFactor: 1.2,    // 每下一格的权重倍数（建议 1.1~1.2 起步）
  martingaleDepth: 10,            // 实际应用马丁加重的下行格子数量
  hardStopLossPrice: 22000,       // 跌破此价不再加仓，进入“止损/观望”模式

  // 风控与退出
  allowPartialTakeProfit: true,   // 反弹过程中是否可分批止盈
  maxDrawdownRatio: 0.3           // 策略整体回撤超过 30% 时强制停用
};
\\\`\\\`\\\`

---

## 📊 风控维度：马丁格尔网格的“保险栓”

\\\`\\\`\\\`javascript
const MARTINGALE_GRID_RISK_CONFIG = {
  MAX_STRATEGY_CAPITAL_RATIO: 0.1,    // 马丁格尔网格占总资产上限（例如 10%）
  MAX_PER_SYMBOL_RATIO: 0.05,        // 单一币种马丁网格不超过总资产 5%
  MAX_GROWTH_FACTOR: 1.3,            // 加仓倍率建议不超过 1.3（太高极易爆炸）
  USE_SPOT_ONLY_FOR_BEGINNERS: true, // 初学者仅用现货马丁，不碰合约马丁
  REQUIRE_HARD_STOP_LOSS: true,      // 必须有硬性止损规则（价格或亏损幅度）
  DISABLE_ON_FUNDAMENTAL_CRACK: true // 标的基本面严重恶化时必须关策略
};
\\\`\\\`\\\`

这些参数背后的核心思想：

1. **资金隔离**  
   - 给马丁策略一个明确的“资金上限”，  
   - 即便最坏情况发生，损失也在“可承受范围内”。

2. **倍率克制**  
   - 不要幻想“2 倍、3 倍、4 倍”的暴力马丁；  
   - 温和版 1.1~1.2 已经足够让仓位在底部明显变重。

3. **止损铁律**  
   - 不要给自己留借口：  
     - “再等等吧”、“再跌也差不多了”  
   - 需要在策略启动前就写清：  
     - 跌破哪一条价格线，  
     - 或者亏损超过多少百分比，  
     - 就一定要停下来复盘，而不是继续加码。

---

## 🎯 实战 Checklist（马丁格尔网格 34.6）

### 1️⃣ 心态与认知自检

- [ ] 你明白马丁格尔的本质是“以仓位暴涨换胜率”，而不是免费午餐；  
- [ ] 你能接受：这笔钱在最坏情况下会深度套牢甚至长期浮亏；  
- [ ] 你不会用生活必需资金、刚需流动性资金来玩这个策略。

### 2️⃣ 标的选择

- [ ] 标的最好是主流币（BTC/ETH 等）或基本面相对扎实的资产；  
- [ ] 尽量避免在“高归零风险山寨币”上使用重度马丁；  
- [ ] 对标的要有中长期认知：  
  - 若你真不相信它未来还能回来，  
  - 那现在的所有加仓其实都是“赌徒行为”。

### 3️⃣ 区间与网格设计

- [ ] 根据历史波动、高低点、宏观环境，设置合理价格区间；  
- [ ] 网格数量适中：20~50 之间较为常见；  
- [ ] 明确划分：  
  - 上半部分：普通/轻微加权网格；  
  - 下半部分：温和马丁加仓区。

### 4️⃣ 马丁参数设置

- [ ] 将 martingaleGrowthFactor 控制在 1.1~1.2；  
- [ ] 只在下行较深的少数格子使用明显加仓权重（例如 5~10 个）；  
- [ ] 设置 hardStopLossPrice，价格跌破该位置即停止加仓。

### 5️⃣ 运行与监控

- [ ] 网格启动后，定期检查：  
  - 总仓位、浮亏比例是否超出预设上限；  
  - 标的基本面是否发生重大变化（监管、黑天鹅、协议漏洞等）；  
- [ ] 当价格跌到接近你 hardStopLossPrice 时：  
  - 冷静评估：  
    - 是系统性恐慌，还是标的自身死亡；  
  - 严格执行事前约定的止损/减仓方案。

### 6️⃣ 退出与复盘

- [ ] 反弹盈利后，不要贪图“无限加仓无限赚”，要有明确离场计划：  
  - 分批止盈  
  - 或价格站回某条关键均线/区间上轨时整体平网格；  
- [ ] 每一轮马丁网格结束后（无论盈亏），写下复盘：  
  - 当初预设是否合理；  
  - 是否在错误的行情结构里玩马丁（例如熊市中途）；  
  - 哪些参数过激，应该下调。

---

## 🧮 一个简单的“温和马丁网格生成器”示意

以下是一个将区间均分 + 马丁加权的简单生成器思路：

\\\`\\\`\\\`javascript
function buildMartingaleGrid({
  lowerPrice,
  upperPrice,
  levels,
  totalInvestment,
  martingaleGrowthFactor
}) {
  const step = (upperPrice - lowerPrice) / (levels - 1);
  const prices = [];
  for (let i = 0; i < levels; i++) {
    prices.push(lowerPrice + step * i);
  }

  // 假设越靠近 lowerPrice 的格子，index 越大，权重越高
  const weights = [];
  for (let i = 0; i < levels; i++) {
    const reverseIndex = levels - 1 - i;
    const w = Math.pow(martingaleGrowthFactor, reverseIndex);
    weights.push(w);
  }

  const sum = weights.reduce((a, b) => a + b, 0);
  const perGridFunds = weights.map((w) => (w / sum) * totalInvestment);

  const grid = prices.map((price, i) => ({
    price,
    budget: perGridFunds[i]
  }));

  return grid;
}

// 使用示例：
const grid = buildMartingaleGrid({
  lowerPrice: 25000,
  upperPrice: 35000,
  levels: 10,
  totalInvestment: 5000,
  martingaleGrowthFactor: 1.15
});

console.log(grid);
\\\`\\\`\\\`

> 真实生产环境中：  
> - 你需要把这些“预算”换算成具体买入数量（数量 = 预算 ÷ 价格）；  
> - 对接交易所 API/网格机器人配置；  
> - 并在策略层面增加更多风控条件。

---

## ✅ 小结：马丁格尔网格在你的玩法库里的定位

在整个「衍生品策略 (Derivatives Strategies) / grid-trading」模块里：

- 34.1：BTC 现货网格 → 标准入门版，强调区间震荡与低买高卖；  
- 34.2：币安网格机器人 → 执行层工具版，让普通玩家能一键部署网格；  
- 34.3：无限网格策略 → 在趋势中动态迁移网格中心，叠加趋势与震荡；  
- 34.4：合约网格交易 → 用杠杆放大网格收益与风险；  
- 34.5：山寨币高波动网格 → 在高波动标的上用密集网格做短期差价；  
- 34.6：马丁格尔网格 → 在下跌中逐级放大仓位的极高风险变体。

你可以在玩法卡片中给出非常明确的标签：

> 「实验性高风险策略，不推荐新手尝试，只适合小额、充分知情的玩家。」  

真正成熟的玩家，  
不是敢无脑加仓的人，  
而是敢在**逻辑失效时及时收手的人**。  

---
`
};

/**
 * 上传 34.6 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 34.6 (马丁格尔网格)...\n');

  try {
    // 获取新的管理员令牌
    const { execSync } = require('child_process');
    const tokenOutput = execSync('./get-new-directus-token.sh').toString();
    const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);

    if (!tokenMatch) {
      throw new Error('Failed to get admin token');
    }

    const ADMIN_TOKEN = tokenMatch[1].trim();

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // 上传策略 34.6
    console.log('上传策略 34.6: 马丁格尔网格...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_34_6, {
      headers
    });
    console.log('✅ 策略 34.6 上传成功\n');

    // 验证总数
    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=1&meta=total_count`,
      { headers }
    );
    console.log(
      `✅ 数据库中现有策略总数: ${response.data.meta.total_count}`
    );
  } catch (error) {
    console.error('❌ 上传失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

// 若需要直接在 Node 中运行本文件写入策略，可以解除下面一行注释：
uploadStrategies();
