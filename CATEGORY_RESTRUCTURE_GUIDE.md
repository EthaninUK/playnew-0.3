# 玩法库分类系统重构指南

## 📋 新分类结构总览

共 **36 个二级分类**，分为 **9 大类别**：

### A. 空投 / 积分 / 上线前机会 (5个)
- **A1** 🎁 空投任务 (airdrop-tasks) - Galxe/Zealy/链上交互
- **A2** ⭐ 积分赛季 (points-season) - Points/Megadrop/激励任务
- **A3** 🔬 测试网&早鸟 (testnet) - Testnet/Devnet/Faucet
- **A4** 🚀 启动板&配售 (launchpad) - Launchpool/Launchpad/IEO
- **A5** 📝 白名单/预售 (whitelist) - Allowlist/Whitelist

### B. 稳健收益 / 存借 / 质押 (5个)
- **B1** 💰 稳定币理财 (stablecoin-yield) - CeFi/DeFi
- **B2** 🏦 借贷挖息 (lending) - Lending 循环
- **B3** 🔐 LST 质押 (lst-staking) - stETH、wbETH 等
- **B4** ♻️ 再质押/LRT (restaking) - EigenLayer 等
- **B5** 🏛️ RWA/链上国债 (rwa) - RWA/链上国债与票据

### C. 做市 / 流动性 (4个)
- **C1** 🔄 AMM 做市 (amm) - V2/V3 集中流动性/Range Order
- **C2** 📊 订单簿做市 (orderbook) - CeFi/链上 Orderbook
- **C3** 🏰 聚合器/金库 (vault) - Vault/Auto-compound
- **C4** ⛏️ 流动性引导 (liquidity-mining) - Incentive/Liquidity Mining

### D. 套利 / 对冲 / 中性策略 (5个)
- **D1** 💹 资金费套利 (funding-arbitrage) - Perp Funding
- **D2** 📈 期现基差 (basis-trading) - Cash & Carry
- **D3** 🔀 跨所搬砖 (cex-arbitrage) - 价差/手续费返佣
- **D4** ⚖️ 稳定币脱锚 (depeg-arbitrage) - 折价回归
- **D5** 🔺 三角/跨链套利 (triangle-arbitrage) - 同链价差&跨链价差

### E. 衍生品策略 (4个)
- **E1** 📉 期权卖方 (options-selling) - Covered Call/Put
- **E2** 🌊 波动率交易 (volatility) - 日历/蝶式/Gamma
- **E3** 📐 网格/趋势 (grid-trading) - 量化规则
- **E4** ⚡ 事件驱动 (event-driven) - 上线/解锁/宏观数据

### F. 新链 / 新生态雷达 (4个)
- **F1** ⛓️ 新公链&L2 (new-chains) - 任务/桥接
- **F2** 🆕 新池/新协议 (new-protocols) - 早期 LP/挖矿
- **F3** 🎯 生态任务 (ecosystem-tasks) - 官方任务中心
- **F4** 📡 链上活跃度 (onchain-activity) - TVL 追踪

### G. NFT / 铭文 / GameFi / SocialFi (4个)
- **G1** 🎨 NFT 铸造 (nft-minting) - 白名单/盲盒
- **G2** 💎 NFT 金融 (nft-fi) - 借贷/碎片化/指数
- **G3** 📜 铭文/Ordinals (inscriptions) - Ordinals/Runes
- **G4** 🎮 GameFi&SocialFi (gamefi) - 任务/赛季

### H. 工具与自动化 (4个)
- **H1** 🤖 交易机器人 (trading-bots) - 网格/跟单/CEX&DEX
- **H2** 📊 数据跟踪 (data-tracking) - 资金流、鲸鱼地址
- **H3** 🛡️ 风险与合规 (risk-compliance) - 监控、税务报表
- **H4** 🌉 跨链&资产管理 (cross-chain) - 桥、聚合钱包

### I. 节点 / 验证者 (3个)
- **I1** 🖥️ 节点运行 (node-running) - PoS/轻节点
- **I2** 🔮 RPC/预言机 (rpc-oracle) - 中继生态激励
- **I3** ⚙️ MEV/Intent (mev) - 捆绑拍卖参与

---

## 🔧 在 Directus 后台创建分类

### 步骤1: 登录 Directus
1. 访问：http://localhost:8055
2. 使用管理员账号登录

### 步骤2: 删除旧分类（已完成）
✅ 旧分类已通过脚本删除

### 步骤3: 批量创建新分类

**方式一：使用 CSV 导入（推荐）**

1. 我已经为你生成了 CSV 文件：`/Users/m1/PlayNew_0.3/new-categories.csv`
2. 在 Directus 中：
   - 进入 `Settings` → `Data Model` → `categories`
   - 点击右上角的 `Import from File`
   - 上传 CSV 文件
   - 映射字段
   - 导入

**方式二：手动创建**

在 Directus 的 `categories` 表中，点击 `+` 按钮，逐个添加分类。

每个分类需要填写的字段：
- `name`: 分类名称（中文）
- `slug`: URL slug（英文，小写，用连字符）
- `description`: 描述
- `icon`: Emoji 图标
- `type`: 分类类型（如果有这个字段）
- `order_index`: 排序序号（1, 2, 3...）
- `status`: published

---

## 📄 CSV 文件内容

已生成文件：`/Users/m1/PlayNew_0.3/new-categories.csv`

CSV 包含所有 36 个分类的完整信息。

---

## 🎨 前端界面重新设计

### 新的分类筛选界面设计

采用**分组 + Tab 切换**的方式：

```
┌─────────────────────────────────────────────────────────┐
│  玩法库                                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [全部]  [空投机会]  [稳健收益]  [做市流动性]  [套利对冲]│
│  [衍生品]  [新链生态]  [NFT/GameFi]  [工具]  [节点验证] │
│                                                          │
│  ┌──────────────────────────────────────────┐          │
│  │  空投机会 (5)                              │          │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │          │
│  │  │ A1  │ │ A2  │ │ A3  │ │ A4  │ │ A5  │ │          │
│  │  │🎁   │ │⭐   │ │🔬   │ │🚀   │ │📝   │ │          │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │          │
│  └──────────────────────────────────────────┘          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 组件结构

1. **一级分类 Tabs**（9个大类）
2. **二级分类卡片**（每个大类下的子分类）
3. **策略列表**（选中分类后显示）

---

## 📝 下一步操作

### 选项1: 你在 Directus 手动创建分类
1. 登录 Directus: http://localhost:8055
2. 进入 categories 表
3. 根据上面的列表手动创建 36 个分类
4. 我会为你重新设计前端界面

### 选项2: 我创建 SQL 脚本直接导入
1. 我生成 SQL 脚本
2. 你在数据库中执行
3. 快速完成分类创建

### 选项3: 我创建 CSV 文件
1. 我生成 CSV 文件
2. 你在 Directus 中导入
3. 快速批量创建

---

**你希望用哪种方式创建分类？**
