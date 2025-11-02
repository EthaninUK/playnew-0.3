#!/usr/bin/env node

/**
 * Add 10 real crypto strategies to Directus
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const strategies = [
  {
    title: 'Uniswap V3 集中流动性挖矿',
    slug: 'uniswap-v3-concentrated-liquidity',
    summary: '通过在 Uniswap V3 提供集中流动性，赚取交易手续费和额外奖励。适合有一定 DeFi 经验的用户。',
    content: `
## 策略概述

Uniswap V3 的集中流动性功能允许 LP 将资金集中在特定价格区间，提高资金效率，获得更高的手续费收益。

## 操作步骤

1. **准备资金**
   - 准备等值的两种代币（如 ETH + USDC）
   - 建议至少 $1000 以上以覆盖 gas 成本

2. **选择交易对和价格区间**
   - 访问 Uniswap V3
   - 选择流动性好的交易对（如 ETH/USDC, WBTC/ETH）
   - 根据当前价格设置价格区间（建议 ±10-20%）

3. **添加流动性**
   - 输入代币数量
   - 确认交易并支付 gas 费

4. **监控和调整**
   - 定期检查价格是否在区间内
   - 如果价格偏离，需要重新设置区间

## 收益分析

- **手续费收益**: 0.05% - 1% 的交易手续费
- **年化收益**: 根据交易量，通常 10-50% APY
- **无常损失**: 存在，需要注意

## 风险提示

⚠️ **高风险因素**:
- 价格波动导致的无常损失
- Gas 费用较高
- 需要主动管理流动性位置
- 智能合约风险

## 所需资金

- **最低**: $500
- **推荐**: $2,000+
- **最佳**: $10,000+
`,
    category_l1: 'defi',
    category_l2: 'liquidity-mining',
    category: 'defi',
    risk_level: 4,
    threshold_capital: '$500-$10000+',
    threshold_capital_min: 500,
    threshold_tech_level: 'medium',
    apy_min: 10,
    apy_max: 50,
    apy_type: 'variable',
    time_commitment: 'medium',
    time_commitment_minutes: 120,
    tags: ['DeFi', 'Uniswap', '流动性挖矿', '中等风险', '需要管理'],
    chains: ['Ethereum', 'Polygon', 'Arbitrum'],
    protocols: ['Uniswap'],
    status: 'published',
    source_name: '官方文档',
    source_url: 'https://docs.uniswap.org',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'Lido 质押 ETH 赚取收益',
    slug: 'lido-eth-staking',
    summary: '通过 Lido 质押 ETH，无需运行节点，即可获得稳定的质押收益。适合长期持有 ETH 的用户。',
    content: `
## 策略概述

Lido 是最大的流动性质押协议，允许用户质押任意数量的 ETH，获得 stETH 作为凭证，同时赚取质押收益。

## 操作步骤

1. **访问 Lido**
   - 打开 https://lido.fi
   - 连接钱包（MetaMask/WalletConnect）

2. **质押 ETH**
   - 输入要质押的 ETH 数量（最低 0.01 ETH）
   - 点击 "Submit" 并确认交易
   - 收到等量的 stETH

3. **获取收益**
   - stETH 余额每天自动增长（rebase）
   - 年化收益约 3-5%
   - 随时可以通过 DEX 兑换回 ETH

## 收益分析

- **年化收益**: 3-5% APY
- **收益来源**: ETH 2.0 质押奖励
- **复利**: 自动复投

## 优势

✅ **低风险**:
- 无需最低 32 ETH
- 无需运行验证节点
- 流动性质押，随时可交易
- 头部协议，安全性高

## 风险提示

⚠️ **需要注意**:
- stETH 可能与 ETH 价格脱锚
- 智能合约风险
- ETH 价格波动风险

## 所需资金

- **最低**: 0.01 ETH (~$30)
- **推荐**: 1 ETH+
`,
    category_l1: 'defi',
    category_l2: 'staking',
    category: 'defi',
    risk_level: 2,
    threshold_capital: '$30+',
    threshold_capital_min: 30,
    threshold_tech_level: 'beginner',
    apy_min: 3,
    apy_max: 5,
    apy_type: 'fixed',
    time_commitment: 'low',
    time_commitment_minutes: 10,
    tags: ['Staking', 'ETH', 'Lido', '低风险', '新手友好'],
    chains: ['Ethereum'],
    protocols: ['Lido'],
    status: 'published',
    source_name: 'Lido 官网',
    source_url: 'https://lido.fi',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'Arbitrum 生态空投挖掘',
    slug: 'arbitrum-airdrop-farming',
    summary: '通过在 Arbitrum 上使用各种 DeFi 协议，增加获得项目空投的机会。低成本，高潜力收益。',
    content: `
## 策略概述

Arbitrum 是以太坊 Layer 2，交易费用低，许多新项目会向早期用户发放空投。通过与多个协议交互，提高空投概率。

## 操作步骤

1. **准备资金**
   - 桥接 $100-500 到 Arbitrum
   - 使用 Arbitrum Bridge 或 Orbiter

2. **交互协议**
   - **DEX**: 在 Uniswap, Camelot 进行 swap
   - **借贷**: 使用 Aave, Radiant 存款借款
   - **NFT**: 在 TofuNFT 交易
   - **社交**: 使用 Lens Protocol
   - **游戏**: 尝试链上游戏

3. **保持活跃**
   - 每周至少交互 2-3 次
   - 使用不同的协议
   - 保持小额资金在协议中

4. **追踪空投**
   - 关注 Twitter 空投消息
   - 使用 DeBank 查看资格

## 收益分析

- **成本**: $50-200 (gas + 交互)
- **潜在收益**: $500-5,000+ (取决于空投)
- **时间周期**: 3-12 个月

## 历史案例

- **Arbitrum 空投**: 符合条件用户获得 625-10,250 ARB (~$1,000-16,000)
- **Optimism 空投**: 早期用户获得数千 OP 代币

## 风险提示

⚠️ **注意事项**:
- 不保证一定有空投
- 需要持续投入时间和精力
- 小额交互可能回本慢
- 警惕钓鱼网站

## 推荐协议列表

✅ 值得交互的项目:
- GMX, Vertex (衍生品)
- Radiant Capital (借贷)
- Camelot DEX (DEX)
- TreasureDAO (NFT/游戏)
`,
    category_l1: 'airdrop',
    category_l2: 'protocol-interaction',
    category: 'airdrop',
    risk_level: 3,
    threshold_capital: '$100-$500',
    threshold_capital_min: 100,
    threshold_tech_level: 'medium',
    apy_min: 0,
    apy_max: 500,
    apy_type: 'one-time',
    time_commitment: 'high',
    time_commitment_minutes: 300,
    tags: ['空投', 'Arbitrum', 'Layer 2', '中等风险', '高潜力'],
    chains: ['Arbitrum'],
    protocols: ['Uniswap', 'Aave'],
    status: 'published',
    source_name: '社区经验',
    source_url: '',
    source_credibility: 4,
    published_at: new Date().toISOString()
  },
  {
    title: 'Curve 稳定币流动性挖矿',
    slug: 'curve-stablecoin-farming',
    summary: '在 Curve 上提供稳定币流动性，赚取低风险的稳定收益。适合保守型投资者。',
    content: `
## 策略概述

Curve 是专注于稳定币交易的 DEX，提供稳定币流动性几乎没有无常损失，可以获得稳定的手续费和代币奖励。

## 操作步骤

1. **准备稳定币**
   - USDC, USDT, DAI 等主流稳定币
   - 建议 $1,000+ 以获得可观收益

2. **选择资金池**
   - **3pool** (USDC/USDT/DAI) - 最稳定
   - **crvUSD** pools - 更高收益
   - **Frax** pools - 中等收益

3. **存入流动性**
   - 访问 curve.fi
   - 选择池子，点击 "Deposit"
   - 输入金额，确认交易
   - 获得 LP token

4. **质押获取额外奖励**
   - 将 LP token 质押到 Gauge
   - 赚取 CRV 代币奖励
   - 可以锁定 CRV 获得 veCRV，提升收益

## 收益分析

- **基础 APY**: 2-5% (交易手续费)
- **CRV 奖励**: 5-15% APY
- **总 APY**: 7-20%

## 优势

✅ **极低风险**:
- 稳定币之间几乎无无常损失
- 成熟的协议，安全性高
- 流动性好，随时退出

## 风险提示

⚠️ **注意事项**:
- 稳定币脱锚风险（UST 前车之鉴）
- CRV 代币价格波动
- 智能合约风险
- Gas 费可能较高

## 所需资金

- **最低**: $500
- **推荐**: $2,000+
- **最佳**: $10,000+
`,
    category_l1: 'defi',
    category_l2: 'stablecoin-farming',
    category: 'defi',
    risk_level: 2,
    threshold_capital: '$500-$10000+',
    threshold_capital_min: 500,
    threshold_tech_level: 'beginner',
    apy_min: 7,
    apy_max: 20,
    apy_type: 'variable',
    time_commitment: 'low',
    time_commitment_minutes: 30,
    tags: ['DeFi', 'Curve', '稳定币', '低风险', '流动性挖矿'],
    chains: ['Ethereum', 'Arbitrum', 'Polygon'],
    protocols: ['Curve'],
    status: 'published',
    source_name: 'Curve Finance',
    source_url: 'https://curve.fi',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'zkSync Era 测试网交互',
    slug: 'zksync-era-testnet',
    summary: '在 zkSync Era 测试网上交互，为主网空投做准备。完全免费，零成本参与。',
    content: `
## 策略概述

zkSync Era 是以太坊 ZK-Rollup Layer 2，在测试网交互可以为未来空投做准备。完全免费，只需时间投入。

## 操作步骤

1. **获取测试币**
   - 访问 zkSync 测试网水龙头
   - 连接钱包获取测试 ETH
   - 网址: https://portal.zksync.io/faucet

2. **桥接资产**
   - 从 Goerli 测试网桥接到 zkSync
   - 测试桥接功能

3. **交互协议**
   - **Swap**: SyncSwap, Mute.io
   - **借贷**: zkLend (如果可用)
   - **NFT**: Mint 测试 NFT
   - **转账**: 多次转账测试

4. **保持活跃**
   - 每周至少交互 2-3 次
   - 尝试所有功能
   - 记录钱包地址

## 成本分析

- **实际成本**: $0 (测试网免费)
- **时间成本**: 每周 1-2 小时
- **潜在收益**: $500-2,000+ (如果有空投)

## 参考案例

Arbitrum 和 Optimism 都向测试网用户发放了空投。

## 操作建议

✅ **最佳实践**:
- 使用真实钱包，不要用临时钱包
- 多种类型的交互
- 保持长期活跃
- 加入社区，完成任务

## 风险提示

⚠️ **注意**:
- 不保证一定有空投
- 需要持续时间投入
- 注意钓鱼网站
- 测试网资产无价值

## 推荐任务清单

- [ ] 桥接资产到 zkSync
- [ ] 在 SyncSwap 进行 3 次 swap
- [ ] Mint NFT
- [ ] 进行 5 次转账
- [ ] 添加流动性
- [ ] 使用所有主要 dApp
`,
    category_l1: 'airdrop',
    category_l2: 'testnet',
    category: 'airdrop',
    risk_level: 1,
    threshold_capital: '$0',
    threshold_capital_min: 0,
    threshold_tech_level: 'beginner',
    apy_min: 0,
    apy_max: 0,
    apy_type: 'one-time',
    time_commitment: 'medium',
    time_commitment_minutes: 120,
    tags: ['空投', 'zkSync', '测试网', '零成本', '新手友好'],
    chains: ['zkSync'],
    protocols: [],
    status: 'published',
    source_name: 'zkSync 官方',
    source_url: 'https://zksync.io',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'Aave V3 循环借贷套利',
    slug: 'aave-v3-recursive-lending',
    summary: '在 Aave V3 上通过循环借贷，放大收益。适合对 DeFi 有深入了解的高级用户。',
    content: `
## 策略概述

通过在 Aave 上反复存入抵押品并借出资产，再将借出的资产存入获得更多借款额度，循环操作以放大收益。

## 操作步骤

1. **准备资金**
   - 准备 stETH 或 WETH 作为抵押品
   - 建议 $5,000+ 以获得明显收益

2. **第一轮操作**
   - 存入 1 ETH 到 Aave
   - 借出 0.7 ETH (70% LTV)
   - 将借出的 0.7 ETH 换成 stETH

3. **循环操作**
   - 存入 0.7 stETH
   - 再借出 0.49 ETH (0.7 * 0.7)
   - 重复 3-5 次

4. **收益来源**
   - 存款利息
   - stETH 质押收益
   - 可能的代币激励

5. **监控和管理**
   - 密切关注 Health Factor (保持 > 1.5)
   - ETH 价格波动时及时调整
   - 必要时部分还款

## 收益分析

- **放大倍数**: 2-3x
- **年化收益**: 10-30% APY
- **需要时间**: 持续监控

## 风险提示

⚠️ **高风险策略**:
- **清算风险**: 价格波动可能导致清算
- **利率风险**: 借款利率上涨会降低收益
- **操作风险**: 需要频繁监控和调整
- **Gas 费**: 操作成本较高

## 所需技能

需要理解:
- LTV (Loan-to-Value)
- Health Factor
- 清算机制
- 利率模型

## 所需资金

- **最低**: $2,000
- **推荐**: $10,000+
- **风险承受**: 能承受 20-30% 波动
`,
    category_l1: 'defi',
    category_l2: 'lending',
    category: 'defi',
    risk_level: 5,
    threshold_capital: '$2000-$10000+',
    threshold_capital_min: 2000,
    threshold_tech_level: 'advanced',
    apy_min: 10,
    apy_max: 30,
    apy_type: 'variable',
    time_commitment: 'high',
    time_commitment_minutes: 300,
    tags: ['DeFi', 'Aave', '循环借贷', '高风险', '高级'],
    chains: ['Ethereum', 'Polygon', 'Arbitrum'],
    protocols: ['Aave', 'Lido'],
    status: 'published',
    source_name: 'DeFi 社区',
    source_url: '',
    source_credibility: 4,
    published_at: new Date().toISOString()
  },
  {
    title: 'Galxe 任务空投挖掘',
    slug: 'galxe-quest-farming',
    summary: '通过完成 Galxe 平台上的各种任务，获得项目 NFT 和空投资格。简单易上手，适合新手。',
    content: `
## 策略概述

Galxe (原 Project Galaxy) 是 Web3 任务平台，许多项目在上面发布任务，完成后可获得 NFT 和空投资格。

## 操作步骤

1. **注册账号**
   - 访问 galxe.com
   - 连接钱包
   - 绑定 Twitter, Discord 等社交账号

2. **选择任务**
   - 浏览热门任务
   - 优先选择:
     * 知名项目
     * 奖励明确
     * 难度适中

3. **完成任务**
   - 关注社交媒体
   - 加入 Discord
   - 与协议交互
   - 答题或转发

4. **领取 NFT**
   - 完成后 Claim NFT
   - 注意 gas 费

5. **持有等待空投**
   - 部分项目会向 NFT 持有者空投
   - 关注项目后续消息

## 成本分析

- **任务费用**: $0-50 (部分需要链上交互)
- **NFT Mint 费用**: $1-10
- **时间成本**: 每个任务 15-30 分钟

## 历史收益案例

- **Arbitrum**: Galxe NFT 持有者获得额外空投
- **Optimism**: 完成任务获得空投资格
- **各种小项目**: $50-500 空投

## 优势

✅ **新手友好**:
- 操作简单
- 成本低
- 任务清晰
- 批量参与

## 风险提示

⚠️ **注意事项**:
- 不是所有项目都会空投
- 有些项目可能是骗局
- 需要识别优质项目
- 避免泄露私钥

## 推荐策略

1. **筛选项目**
   - 查看项目背景
   - 社区活跃度
   - 融资情况

2. **批量参与**
   - 每周完成 5-10 个任务
   - 分散投资，不要all in

3. **长期持有**
   - NFT 不要急于出售
   - 关注项目进展
`,
    category_l1: 'airdrop',
    category_l2: 'quest',
    category: 'airdrop',
    risk_level: 2,
    threshold_capital: '$0-$100',
    threshold_capital_min: 0,
    threshold_tech_level: 'beginner',
    apy_min: 0,
    apy_max: 0,
    apy_type: 'one-time',
    time_commitment: 'medium',
    time_commitment_minutes: 60,
    tags: ['空投', 'Galxe', '任务', '低风险', '新手友好'],
    chains: ['Ethereum', 'BNB Chain', 'Polygon'],
    protocols: [],
    status: 'published',
    source_name: 'Galxe 官方',
    source_url: 'https://galxe.com',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'GMX 永续合约做市',
    slug: 'gmx-liquidity-provision',
    summary: '为 GMX 提供流动性赚取交易手续费和 esGMX 奖励。适合看好去中心化衍生品的用户。',
    content: `
## 策略概述

GMX 是去中心化永续合约交易所，流动性提供者可以通过提供 GLP (GMX Liquidity Provider) 赚取平台 70% 的交易手续费。

## 操作步骤

1. **准备资产**
   - 准备稳定币 (USDC/USDT) 或 ETH/BTC
   - 建议 $1,000+ 以获得可观收益

2. **购买 GLP**
   - 访问 gmx.io
   - 选择 "Buy GLP"
   - 输入资产数量
   - 确认交易

3. **自动赚取收益**
   - GLP 价值每秒增长
   - 收益来自:
     * 交易手续费 (70%)
     * 开平仓费用
     * 清算费用
     * esGMX 奖励

4. **提取收益**
   - ETH/AVAX 奖励实时到账
   - esGMX 需要质押或vest

## 收益分析

- **APR**: 20-40% (根据交易量)
- **收益构成**:
  * ETH 手续费: 15-25%
  * esGMX 奖励: 5-15%

## GLP 组成

- ETH: 30%
- BTC: 25%
- 稳定币: 45%

## 风险提示

⚠️ **需要注意**:
- **交易对手风险**: GLP 持有者是交易者的对手方
- **价格波动**: GLP 包含 ETH/BTC，会随市场波动
- **无常损失**: 类似于做 LP，存在价格风险
- **提款费用**: 15 分钟内提款收取费用

## 优势

✅ **收益稳定**:
- 手续费收入稳定
- 头部去中心化衍生品交易所
- 流动性好

## 所需资金

- **最低**: $100
- **推荐**: $1,000+
- **最佳**: $10,000+
`,
    category_l1: 'defi',
    category_l2: 'derivatives',
    category: 'defi',
    risk_level: 4,
    threshold_capital: '$100-$10000+',
    threshold_capital_min: 100,
    threshold_tech_level: 'medium',
    apy_min: 20,
    apy_max: 40,
    apy_type: 'variable',
    time_commitment: 'low',
    time_commitment_minutes: 30,
    tags: ['DeFi', 'GMX', 'GLP', '中等风险', '衍生品'],
    chains: ['Arbitrum', 'Avalanche'],
    protocols: [],
    status: 'published',
    source_name: 'GMX 官方',
    source_url: 'https://gmx.io',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'Base 链生态早期交互',
    slug: 'base-chain-early-interaction',
    summary: '在 Coinbase 推出的 Base 链上进行早期交互，为潜在空投做准备。低成本，高潜力。',
    content: `
## 策略概述

Base 是 Coinbase 推出的 Layer 2，作为交易所背景的公链，未来可能有代币和空投。早期交互可以获得潜在收益。

## 操作步骤

1. **桥接资产**
   - 使用 Base 官方桥
   - 从 Ethereum 桥接 ETH
   - 建议 $100-300

2. **交互主要协议**

   **DEX 类**:
   - Uniswap (Base)
   - BaseSwap
   - Aerodrome

   **借贷类**:
   - Aave (Base)
   - Compound (Base)

   **NFT 类**:
   - Base NFT 市场
   - 知名项目的 Base 版本

3. **保持活跃**
   - 每周至少 2-3 次交互
   - 尝试不同类型的 dApp
   - 参与生态项目

4. **关注官方活动**
   - Coinbase 的 Base 任务
   - 生态激励计划
   - 合作项目活动

## 成本分析

- **初始投入**: $100-500
- **Gas 费**: 非常低 (相比 Ethereum)
- **交互成本**: $20-50
- **时间周期**: 3-12 个月

## 投资逻辑

✅ **高潜力因素**:
- Coinbase 官方支持
- 大量用户基础
- 可能发行代币
- 参考 Optimism/Arbitrum

## 推荐交互清单

- [ ] 桥接 ETH 到 Base
- [ ] 在 Uniswap 进行 5 次 swap
- [ ] 使用 Aave 存款借款
- [ ] Mint Base NFT
- [ ] 添加流动性
- [ ] 使用 10 个以上不同 dApp
- [ ] 完成官方任务

## 风险提示

⚠️ **注意事项**:
- Base 明确表示"没有计划发行代币"
- 但情况可能变化（参考 Uniswap）
- 不保证一定有空投
- 需要长期投入

## 所需技能

- 基础的 DeFi 操作
- 跨链桥使用
- 风险管理
`,
    category_l1: 'airdrop',
    category_l2: 'ecosystem',
    category: 'airdrop',
    risk_level: 3,
    threshold_capital: '$100-$500',
    threshold_capital_min: 100,
    threshold_tech_level: 'medium',
    apy_min: 0,
    apy_max: 0,
    apy_type: 'one-time',
    time_commitment: 'medium',
    time_commitment_minutes: 180,
    tags: ['空投', 'Base', 'Coinbase', 'Layer 2', '高潜力'],
    chains: ['Base'],
    protocols: ['Uniswap', 'Aave'],
    status: 'published',
    source_name: 'Base 官方',
    source_url: 'https://base.org',
    source_credibility: 5,
    published_at: new Date().toISOString()
  },
  {
    title: 'Pendle 固定收益交易',
    slug: 'pendle-fixed-yield-trading',
    summary: '通过 Pendle 协议锁定 DeFi 收益率或进行收益率套利。适合追求确定性收益的用户。',
    content: `
## 策略概述

Pendle 允许将收益代币（如 stETH, GLP）分离为本金代币（PT）和收益代币（YT），实现固定收益或收益率交易。

## 操作步骤

### 策略 A: 锁定固定收益

1. **准备资产**
   - 购买 stETH 或其他收益资产
   - 建议 $1,000+

2. **在 Pendle 操作**
   - 存入 stETH
   - 购买 PT-stETH
   - 锁定未来的固定收益率

3. **到期赎回**
   - 到期日用 PT 1:1 赎回本金
   - 获得预期的固定收益

### 策略 B: 投机收益率

1. **购买 YT 代币**
   - 如果认为未来收益率会上升
   - 购买 YT (收益代币)
   - 放大收益

2. **监控和退出**
   - 收益率上涨时获利
   - 及时止损

## 收益分析

### 固定收益策略
- **APY**: 5-8% (锁定)
- **风险**: 低
- **适合**: 保守型投资者

### 收益率交易策略
- **潜在收益**: 20-100%+
- **风险**: 高
- **适合**: 激进型投资者

## 使用场景

✅ **固定收益**:
- 熊市锁定收益
- 规避波动风险
- 确定性收入

✅ **收益率投机**:
- 预期收益率上升
- 短期套利机会
- 放大收益

## 风险提示

⚠️ **需要注意**:
- **理解成本**: 需要理解 PT/YT 机制
- **流动性**: 部分池子流动性较低
- **价格风险**: YT 价格波动大
- **智能合约风险**: 相对较新的协议

## 推荐资产

- stETH (Lido)
- GLP (GMX)
- sDAI (Spark)
- wstETH

## 所需资金

- **最低**: $500
- **推荐**: $2,000+
`,
    category_l1: 'defi',
    category_l2: 'yield-trading',
    category: 'defi',
    risk_level: 3,
    threshold_capital: '$500-$2000+',
    threshold_capital_min: 500,
    threshold_tech_level: 'advanced',
    apy_min: 5,
    apy_max: 100,
    apy_type: 'fixed',
    time_commitment: 'medium',
    time_commitment_minutes: 90,
    tags: ['DeFi', 'Pendle', '固定收益', '中等风险', '高级'],
    chains: ['Ethereum', 'Arbitrum'],
    protocols: [],
    status: 'published',
    source_name: 'Pendle 官方',
    source_url: 'https://pendle.finance',
    source_credibility: 5,
    published_at: new Date().toISOString()
  }
];

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function createStrategy(token, strategy) {
  const strategyWithId = {
    id: generateUUID(),
    ...strategy
  };

  const response = await fetch(`${DIRECTUS_URL}/items/strategies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(strategyWithId),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  ❌ Failed: ${error.substring(0, 150)}`);
    return false;
  }

  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Adding 10 Crypto Strategies');
    console.log('================================================');
    console.log('');

    console.log('🔐 Logging in...\n');
    const token = await login();

    let created = 0;
    for (const strategy of strategies) {
      console.log(`📝 Creating: ${strategy.title}`);
      const success = await createStrategy(token, strategy);

      if (success) {
        console.log(`  ✅ Created`);
        created++;
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Created: ${created}/${strategies.length} strategies`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Done!');
    console.log('');
    console.log('View strategies:');
    console.log('  http://localhost:8055/admin/content/strategies');
    console.log('');
    console.log('Test API:');
    console.log('  curl http://localhost:8055/items/strategies?limit=3');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
