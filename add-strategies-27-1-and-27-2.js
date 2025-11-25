const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_27_1 = {
  title: 'AMM 自动做市基础 - Uniswap V2 流动性提供',
  slug: 'amm-liquidity-provision-v2',
  summary: '在 Uniswap V2 等 AMM 协议中提供流动性，赚取交易手续费和流动性挖矿奖励。适合长期持币者，通过被动做市获得 15-60% 年化收益。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 2,
  apy_min: 15,
  apy_max: 60,
  content: `# AMM 自动做市基础 - Uniswap V2 流动性提供

> **预计阅读时间：** 25 分钟
> **难度等级：** 中级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 AMM 做市原理

### 什么是 AMM（自动做市商）？

传统交易所使用订单簿匹配买卖单，而 AMM 使用数学公式自动定价：

**恒定乘积公式（Uniswap V2）：**
\`\`\`
x × y = k

其中：
x = Token A 的数量
y = Token B 的数量
k = 常数（流动性池总价值）
\`\`\`

**示例：**
\`\`\`
ETH-USDC 池子：
100 ETH × 300,000 USDC = 30,000,000（k 值）

当有人用 10 ETH 买入 USDC：
池子变为：110 ETH × ? USDC = 30,000,000
计算得：USDC = 272,727
用户获得：300,000 - 272,727 = 27,273 USDC

平均价格：27,273 / 10 = 2,727 USDC/ETH
\`\`\`

### 流动性提供者（LP）如何赚钱？

**收入来源 1：交易手续费**
- Uniswap V2：每笔交易收取 0.3%
- 0.25% 分配给 LP
- 0.05% 用于协议金库

**收入来源 2：流动性挖矿奖励**
- 协议代币激励（如 SushiSwap 的 SUSHI）
- 合作项目的额外奖励

---

## 🎯 策略核心逻辑

### 基础做市流程

**第一步：选择交易对**

\`\`\`
推荐标准：
✅ 24小时交易量 > $1,000,000
✅ TVL（总锁仓量）> $5,000,000
✅ 知名代币（降低归零风险）

优质示例：
- ETH/USDC（稳定，手续费低但量大）
- WBTC/ETH（两个蓝筹资产）
- USDC/DAI（稳定币对，无常损失极低）
\`\`\`

**第二步：计算投入比例**

假设你有 $10,000：
\`\`\`
ETH 价格 = $3,000

方案 1：50/50 分配
- 买入 1.67 ETH（$5,000）
- 保留 5,000 USDC
- 添加到 ETH/USDC 池

方案 2：动态调整
- 如果看好 ETH → 60% ETH + 40% USDC
- 如果看跌 ETH → 40% ETH + 60% USDC
注意：AMM 会强制平衡，偏离 50/50 会有损耗
\`\`\`

**第三步：添加流动性**

\`\`\`javascript
// 使用 Ethers.js 添加流动性到 Uniswap V2
const { ethers } = require('ethers');

async function addLiquidity() {
  const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

  // 添加 1 ETH + 3000 USDC
  const tx = await router.addLiquidityETH(
    USDC_ADDRESS,
    ethers.utils.parseUnits('3000', 6), // 3000 USDC（6位小数）
    ethers.utils.parseUnits('2850', 6), // 最少接受 2850 USDC（5%滑点）
    ethers.utils.parseEther('0.95'),    // 最少接受 0.95 ETH
    YOUR_WALLET_ADDRESS,
    Math.floor(Date.now() / 1000) + 600, // 10分钟过期
    { value: ethers.utils.parseEther('1') }
  );

  console.log('添加流动性成功，TX:', tx.hash);

  // 你会收到 LP Token，代表你在池子中的份额
  const lpBalance = await lpToken.balanceOf(YOUR_WALLET_ADDRESS);
  console.log('LP Token 余额:', ethers.utils.formatEther(lpBalance));
}
\`\`\`

**第四步：监控收益**

\`\`\`javascript
// 实时计算做市收益
async function calculateLPReturns() {
  const pool = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);

  // 获取池子储备量
  const reserves = await pool.getReserves();
  const reserve0 = reserves[0];
  const reserve1 = reserves[1];

  // 获取总 LP Token 供应量
  const totalSupply = await pool.totalSupply();

  // 计算你的份额
  const yourLPBalance = await pool.balanceOf(YOUR_WALLET_ADDRESS);
  const yourShare = yourLPBalance / totalSupply;

  // 计算你的资产价值
  const yourToken0 = reserve0 * yourShare;
  const yourToken1 = reserve1 * yourShare;

  console.log(\`你的资产: \${ethers.utils.formatEther(yourToken0)} ETH\`);
  console.log(\`你的资产: \${ethers.utils.formatUnits(yourToken1, 6)} USDC\`);

  // 计算累计手续费（需要对比初始投入）
  const initialValue = 10000; // 你的初始投入 $10,000
  const currentValue = (yourToken0 * ethPrice) + yourToken1;
  const returns = ((currentValue - initialValue) / initialValue) * 100;

  console.log(\`总收益率: \${returns.toFixed(2)}%\`);
}
\`\`\`

---

## 📊 收益与风险分析

### 收益构成

**1. 交易手续费收益（主要）**

\`\`\`
假设 ETH/USDC 池子：
- TVL: $100,000,000
- 日交易量: $50,000,000
- 你的份额: 0.01%（投入 $10,000）

日手续费收入 = $50,000,000 × 0.25% = $125,000
你的收入 = $125,000 × 0.01% = $12.50/天
年化收益 = ($12.50 × 365) / $10,000 = 45.6%
\`\`\`

**2. 流动性挖矿奖励（额外）**

\`\`\`
SushiSwap ETH/USDC 池：
- SUSHI 奖励：APR 15%
- 其他激励：APR 5%
- 合计额外收益：20%

总年化 = 45.6% + 20% = 65.6%
\`\`\`

### 无常损失（Impermanent Loss）

**什么是无常损失？**

当你提供流动性后，如果价格变动，你的资产会被自动重新平衡，导致相比单纯持币的损失。

**计算示例：**

\`\`\`
初始投入（ETH = $3,000）:
1 ETH + 3,000 USDC = $6,000

情况 1：ETH 涨到 $6,000（2倍）
持币策略: 1 ETH ($6,000) + 3,000 USDC = $9,000

AMM 做市:
由于 x × y = k，池子自动平衡
新余额: 0.707 ETH ($4,242) + 4,242 USDC = $8,484
无常损失 = $9,000 - $8,484 = $516（5.7%）

情况 2：ETH 跌到 $1,500（0.5倍）
持币策略: 1 ETH ($1,500) + 3,000 USDC = $4,500

AMM 做市:
新余额: 1.414 ETH ($2,121) + 2,121 USDC = $4,242
无常损失 = $4,500 - $4,242 = $258（5.7%）
\`\`\`

**价格变动与无常损失对照表：**

| 价格变动 | 无常损失 | 需要手续费补偿 |
|----------|----------|---------------|
| 1.05x | 0.06% | 2 天 |
| 1.25x | 0.6% | 5 天 |
| 1.5x | 2.0% | 16 天 |
| 2x | 5.7% | 46 天 |
| 3x | 13.4% | 109 天 |
| 5x | 25.5% | 207 天 |

**结论：** 只要手续费收入能覆盖无常损失，做市仍然盈利。

---

## ⚠️ 风险管理

### 风险 1：无常损失

**应对策略：**
\`\`\`
✅ 选择稳定币对（如 USDC/DAI）→ 无常损失接近 0
✅ 选择相关性高的资产（如 ETH/WBTC）→ 减少价格分化
✅ 选择高交易量池子 → 手续费收入快速覆盖损失
❌ 避免山寨币/稳定币对（如 SHIB/USDC）→ 单边暴涨暴跌
\`\`\`

### 风险 2：智能合约风险

**防范措施：**
- 只使用经过审计的协议（Uniswap、SushiSwap、Curve）
- 分散资金到多个池子
- 关注协议安全报告

### 风险 3：代币归零风险

**筛选标准：**
\`\`\`javascript
// 自动筛选安全的流动性池
async function filterSafePools() {
  const pools = await getAllPools();

  for (const pool of pools) {
    // 检查 1：TVL 是否足够大
    if (pool.tvl < 5000000) continue; // 低于 500 万跳过

    // 检查 2：24h 交易量 / TVL 比率
    const volumeRatio = pool.volume24h / pool.tvl;
    if (volumeRatio < 0.1) continue; // 低于 10% 跳过（流动性差）

    // 检查 3：代币是否在白名单
    const whitelistTokens = ['WETH', 'WBTC', 'USDC', 'USDT', 'DAI'];
    if (!whitelistTokens.includes(pool.token0) ||
        !whitelistTokens.includes(pool.token1)) continue;

    // 通过筛选
    console.log(\`✅ 安全池子: \${pool.name}\`);
    console.log(\`   TVL: $\${(pool.tvl / 1e6).toFixed(2)}M\`);
    console.log(\`   APR: \${pool.apr.toFixed(2)}%\n\`);
  }
}
\`\`\`

---

## 💡 高级技巧

### 技巧 1：多池分散策略

\`\`\`
$10,000 投资分配：
- 60% ETH/USDC（稳定，APR 30-50%）
- 20% WBTC/ETH（蓝筹，APR 20-40%）
- 20% USDC/DAI（保守，APR 10-20%）

预期综合 APR：30-45%
无常损失风险：中低
\`\`\`

### 技巧 2：定期再平衡

\`\`\`
每 30 天操作：
1. 移除流动性
2. 计算累计收益
3. 提取利润部分
4. 重新添加流动性
\`\`\`

### 技巧 3：对冲无常损失

\`\`\`javascript
// 使用永续合约对冲
// 如果你在 ETH/USDC 池提供 $10,000 流动性（5,000 USDC + 1.67 ETH）

// 开立 Delta 中性对冲：
// 在 dYdX 或 GMX 做空 0.835 ETH（你持仓的 50%）

// 结果：
// ETH 涨 → 池子损失 + 合约盈利 ≈ 平衡
// ETH 跌 → 池子损失 + 合约盈利 ≈ 平衡
// 你只赚手续费，无常损失被对冲
\`\`\`

---

## 📈 收益预期

| 池子类型 | 手续费 APR | 挖矿奖励 | 无常损失风险 | 综合 APR |
|---------|-----------|---------|-------------|---------|
| 稳定币对（USDC/DAI） | 5-15% | 5-10% | 极低 | 10-25% |
| 主流币对（ETH/USDC） | 20-40% | 10-20% | 中 | 30-60% |
| 蓝筹对（ETH/WBTC） | 15-30% | 5-15% | 低 | 20-45% |
| 山寨币对（高风险） | 50-200% | 20-100% | 极高 | 不建议 |

**保守估计年化：15-60%**

> ⚠️ **重要提示：** AMM 做市适合"HODL"心态的投资者。短期价格波动会产生无常损失，但长期手续费收入通常能够覆盖。建议持有至少 3-6 个月以充分收取手续费。`,
  status: 'published'
};

const STRATEGY_27_2 = {
  title: 'Uniswap V3 集中流动性做市 - 高资金效率策略',
  slug: 'uniswap-v3-concentrated-liquidity',
  summary: '通过 Uniswap V3 的价格区间功能，将流动性集中在特定价格范围，提升资金利用率 100-1000 倍。适合主动管理的专业做市，年化收益 50-300%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 3,
  apy_min: 50,
  apy_max: 300,
  content: `# Uniswap V3 集中流动性做市 - 高资金效率策略

> **预计阅读时间：** 30 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中高（3/5）

---

## 📖 Uniswap V3 革命性改进

### V2 vs V3 对比

**Uniswap V2：**
\`\`\`
流动性分布：0 → ∞（全价格范围）
资金效率：低
无常损失：中等
管理难度：低（被动）
\`\`\`

**Uniswap V3：**
\`\`\`
流动性分布：自定义价格区间
资金效率：高 100-1000 倍
无常损失：高（价格出界全部损失）
管理难度：高（需主动调整）
\`\`\`

### 集中流动性原理

**示例：ETH/USDC 池**

\`\`\`
V2 做法：
投入 $10,000（5,000 USDC + 1.67 ETH）
流动性分布：$0 - $∞

V3 做法：
投入 $10,000
选择价格区间：$2,800 - $3,200（当前价格 $3,000）
流动性集中度：10 倍

结果：
你的 $10,000 在这个价格区间内，相当于 V2 的 $100,000 流动性
手续费收入 = V2 的 10 倍
\`\`\`

**可视化对比：**

\`\`\`
Uniswap V2（平铺流动性）：
价格      0   500  1000  1500  2000  2500  3000  3500  4000  ∞
流动性    |════════════════════════════════════════════════════|
          ←─────────────── 10,000 USDC 均匀分布 ──────────────→

Uniswap V3（集中流动性）：
价格      0   500  1000  1500  2000  2500  3000  3500  4000  ∞
流动性    |                          |██████████|              |
                                     2800      3200
                            ←── 10,000 全部集中 ──→
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：紧密区间（激进）

**适用场景：** 稳定币对或盘整市场

**案例：USDC/USDT 做市**

\`\`\`
当前价格：1.0000
设置区间：0.9990 - 1.0010（±0.1%）

投入：$10,000
集中倍数：约 100 倍
等效 V2 流动性：$1,000,000

日交易量：$500,000,000
手续费率：0.01%（稳定币对低费率）
日手续费：$500,000

你的份额（假设池子 TVL $50M）：
$1,000,000（等效）/ $50,000,000 = 2%
日收入 = $500,000 × 2% = $10,000
年化 APR = ($10,000 × 365) / $10,000 = 36,500%（理论值）

实际 APR（考虑竞争）：150-300%
\`\`\`

**执行代码：**

\`\`\`javascript
const { ethers } = require('ethers');
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk');

async function createTightRangePosition() {
  const NONFUNGIBLE_POSITION_MANAGER = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
  const positionManager = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER,
    POSITION_MANAGER_ABI,
    signer
  );

  // USDC/USDT 池子参数
  const token0 = USDC_ADDRESS;
  const token1 = USDT_ADDRESS;
  const fee = 100; // 0.01%
  const tickSpacing = 1;

  // 当前价格：1.0000
  // 设置区间：0.9990 - 1.0010
  const tickLower = nearestUsableTick(-10, tickSpacing); // 0.9990
  const tickUpper = nearestUsableTick(10, tickSpacing);  // 1.0010

  const params = {
    token0: token0,
    token1: token1,
    fee: fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: ethers.utils.parseUnits('5000', 6), // 5000 USDC
    amount1Desired: ethers.utils.parseUnits('5000', 6), // 5000 USDT
    amount0Min: ethers.utils.parseUnits('4750', 6),
    amount1Min: ethers.utils.parseUnits('4750', 6),
    recipient: YOUR_WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 600
  };

  const tx = await positionManager.mint(params);
  const receipt = await tx.wait();

  // 获取 NFT Token ID（代表你的 LP 头寸）
  const tokenId = receipt.events[0].args.tokenId;
  console.log('V3 头寸创建成功，NFT ID:', tokenId.toString());
}
\`\`\`

### 策略 2：宽松区间（保守）

**适用场景：** 波动币对，不想频繁调整

**案例：ETH/USDC 做市**

\`\`\`
当前价格：$3,000
设置区间：$2,400 - $3,600（±20%）

投入：$10,000
集中倍数：约 5 倍
等效 V2 流动性：$50,000

优势：
✅ 价格出界风险低（需要 ±20% 才出界）
✅ 管理频率低（每月调整 1-2 次）
✅ 仍比 V2 高 5 倍收益

年化 APR：50-100%
\`\`\`

### 策略 3：阶梯式多仓位

**高级玩法：** 创建多个不同区间的仓位

\`\`\`
$10,000 资金分配：

仓位 1（核心）：$4,000
区间：$2,900 - $3,100（±3.3%）
集中倍数：30 倍

仓位 2（缓冲）：$3,000
区间：$2,700 - $3,300（±10%）
集中倍数：10 倍

仓位 3（兜底）：$3,000
区间：$2,400 - $3,600（±20%）
集中倍数：5 倍

收益特性：
- 价格在 $2,900-$3,100：三个仓位全赚（超高收益）
- 价格在 $2,700-$2,900：仓位 2+3 赚
- 价格在 $2,400-$2,700：仅仓位 3 赚（保底）

预期综合 APR：100-200%
\`\`\`

---

## 📊 动态再平衡策略

### 自动化监控脚本

\`\`\`javascript
const { Pool } = require('@uniswap/v3-sdk');
const { Token } = require('@uniswap/sdk-core');

// 监控头寸是否需要调整
async function monitorPosition(positionId) {
  const positionManager = new ethers.Contract(
    POSITION_MANAGER_ADDRESS,
    POSITION_MANAGER_ABI,
    provider
  );

  // 获取头寸详情
  const position = await positionManager.positions(positionId);
  const tickLower = position.tickLower;
  const tickUpper = position.tickUpper;

  // 获取当前 tick
  const pool = new ethers.Contract(POOL_ADDRESS, POOL_ABI, provider);
  const slot0 = await pool.slot0();
  const currentTick = slot0.tick;

  // 计算价格距离边界的百分比
  const tickRange = tickUpper - tickLower;
  const distanceToLower = currentTick - tickLower;
  const distanceToUpper = tickUpper - currentTick;

  const percentFromLower = (distanceToLower / tickRange) * 100;
  const percentFromUpper = (distanceToUpper / tickRange) * 100;

  console.log(\`
  ╔═══════════════════════════════════════╗
  ║   Uniswap V3 头寸监控                 ║
  ╚═══════════════════════════════════════╝

  NFT ID: \${positionId}
  当前 Tick: \${currentTick}
  区间: [\${tickLower}, \${tickUpper}]

  距离下界: \${percentFromLower.toFixed(1)}%
  距离上界: \${percentFromUpper.toFixed(1)}%
  \`);

  // 警报条件：距离任一边界 < 10%
  if (percentFromLower < 10) {
    console.log('⚠️  警告：价格接近下界，建议调整头寸！');
    return 'REBALANCE_NEEDED';
  }

  if (percentFromUpper < 10) {
    console.log('⚠️  警告：价格接近上界，建议调整头寸！');
    return 'REBALANCE_NEEDED';
  }

  console.log('✅ 头寸健康，继续监控');
  return 'OK';
}

// 自动再平衡
async function autoRebalance(positionId) {
  console.log('开始自动再平衡...');

  // 1. 移除旧头寸
  await removePosition(positionId);

  // 2. 获取当前价格
  const currentPrice = await getCurrentPrice();
  console.log(\`当前价格: $\${currentPrice}\`);

  // 3. 计算新的价格区间（±5%）
  const newLowerPrice = currentPrice * 0.95;
  const newUpperPrice = currentPrice * 1.05;

  // 4. 创建新头寸
  await createNewPosition(newLowerPrice, newUpperPrice);

  console.log(\`✅ 再平衡完成！新区间: $\${newLowerPrice.toFixed(2)} - $\${newUpperPrice.toFixed(2)}\`);
}

// 定时运行（每小时检查）
setInterval(async () => {
  const status = await monitorPosition(YOUR_POSITION_ID);
  if (status === 'REBALANCE_NEEDED') {
    await autoRebalance(YOUR_POSITION_ID);
  }
}, 3600000); // 1 小时
\`\`\`

---

## ⚠️ 风险与应对

### 风险 1：价格出界（Out of Range）

**后果：**
\`\`\`
当价格超出你的区间：
- 停止赚取手续费
- 全部变为单一代币
- 100% 无常损失

示例：
区间：$2,900 - $3,100
ETH 涨到 $3,200 → 你的仓位全部变成 USDC
ETH 跌到 $2,800 → 你的仓位全部变成 ETH
\`\`\`

**应对策略：**
\`\`\`javascript
// 策略 1：宽松区间（降低出界概率）
const safeRange = currentPrice * 0.15; // ±15%

// 策略 2：快速再平衡（出界后立即调整）
if (priceOutOfRange) {
  await autoRebalance();
}

// 策略 3：设置止损（防止归零）
const stopLossPrice = currentPrice * 0.70; // 跌破 -30% 自动平仓
if (currentPrice < stopLossPrice) {
  await emergencyExit();
}
\`\`\`

### 风险 2：无常损失加剧

**V3 无常损失特性：**
- 紧密区间 = 无常损失放大
- 价格波动 1% 在 ±5% 区间，损失是 V2 的 5 倍

**对冲方案：**
\`\`\`javascript
// 使用永续合约 Delta 中性对冲
const hedgeRatio = 0.5; // 对冲 50% 敞口

async function hedgePosition() {
  const ethAmount = await getETHInPosition();
  const hedgeSize = ethAmount * hedgeRatio;

  // 在 GMX 开空单
  await gmxContract.createShortPosition(
    'ETH',
    ethers.utils.parseEther(hedgeSize.toString()),
    leverage: 1
  );

  console.log(\`✅ 已对冲 \${hedgeSize} ETH\`);
}
\`\`\`

---

## 💡 高级技巧

### 技巧 1：费率套利

Uniswap V3 有三种费率池：0.01%、0.05%、0.30%

\`\`\`
选择策略：
- 稳定币对 → 0.01%（高交易量，低滑点）
- 主流币对 → 0.05%（平衡）
- 山寨币对 → 0.30%（高滑点补偿）

同时在多个费率池做市：
- 60% 资金 → 0.05% 池（主力）
- 30% 资金 → 0.30% 池（高收益）
- 10% 资金 → 0.01% 池（稳定）
\`\`\`

### 技巧 2：波动率自适应

\`\`\`javascript
// 根据历史波动率动态调整区间宽度
async function calculateOptimalRange() {
  // 获取过去 7 天的价格数据
  const prices = await getHistoricalPrices(7);

  // 计算标准差（波动率）
  const volatility = calculateStandardDeviation(prices);

  // 波动率越高，区间越宽
  let rangeWidth;
  if (volatility < 0.02) {
    rangeWidth = 0.05; // ±5%（低波动）
  } else if (volatility < 0.05) {
    rangeWidth = 0.10; // ±10%（中波动）
  } else {
    rangeWidth = 0.20; // ±20%（高波动）
  }

  const lowerBound = currentPrice * (1 - rangeWidth);
  const upperBound = currentPrice * (1 + rangeWidth);

  console.log(\`根据波动率 \${(volatility*100).toFixed(2)}%，建议区间: $\${lowerBound.toFixed(2)} - $\${upperBound.toFixed(2)}\`);

  return { lowerBound, upperBound };
}
\`\`\`

### 技巧 3：Liquidity Mining 叠加

很多协议在 V3 池子上有额外奖励：

\`\`\`
Arrakis Finance（自动管理 V3 头寸）：
- 帮你自动再平衡
- 额外 ARB 代币奖励
- APR 叠加：基础 APR 80% + ARB 奖励 30% = 110%

Gamma Strategies：
- 主动管理的 V3 Vault
- 策略自动化
- 额外协议奖励
\`\`\`

---

## 📈 收益预期

| 策略类型 | 价格区间 | 集中倍数 | 基础 APR | 再平衡频率 | 综合 APR |
|---------|---------|---------|----------|-----------|----------|
| 稳定币紧密 | ±0.1% | 100x | 200-500% | 每周 | 150-300% |
| 稳定币宽松 | ±0.5% | 20x | 50-150% | 每月 | 40-120% |
| ETH 紧密 | ±5% | 20x | 100-200% | 每天 | 80-150% |
| ETH 宽松 | ±20% | 5x | 30-80% | 每月 | 25-60% |
| 多仓位阶梯 | 混合 | 10-30x | 80-150% | 每周 | 70-120% |

**保守估计年化：50-300%**

> ⚠️ **重要提示：** Uniswap V3 需要主动管理，建议使用自动化脚本监控。紧密区间虽然收益高，但需要频繁调整，适合有编程能力和时间的高级用户。新手建议从宽松区间（±15-20%）开始，逐步熟悉后再缩小区间。`,
  status: 'published'
};

async function main() {
  try {
    console.log('认证中...');

    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    const token = authResponse.data.data.access_token;
    console.log('认证成功！\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const strategies = [STRATEGY_27_1, STRATEGY_27_2];

    for (const strategy of strategies) {
      const existingResponse = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${strategy.slug}`,
        config
      );

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        console.log(`⏭️  策略 "${strategy.title}" 已存在，跳过`);
        continue;
      }

      await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        config
      );

      console.log(`✅ 策略创建成功: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}`);
      console.log(`   APY: ${strategy.apy_min}-${strategy.apy_max}%\n`);
    }

    const countResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=0&meta=total_count`,
      config
    );

    console.log('========================================');
    console.log(`📊 数据库中策略总数: ${countResponse.data.meta.total_count}`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
