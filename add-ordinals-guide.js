const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议生产环境使用环境变量
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '铭文/Ordinals 完全指南',
  slug: 'ordinals-inscriptions-complete-guide',
  summary:
    '比特币生态资产新范式：Ordinals协议原理、BRC-20/BRC-721/SRC-20标准详解、铭文铸造与交易实战、Runes符文协议、工具链与钱包选型、Gas优化与安全防护、生态项目评估。',

  // 使用 slug 作为分类标识（与前端 directus.ts 中的定义保持一致）
  category: 'inscriptions',

  // 站内一级/二级分类
  category_l1: 'nft',
  category_l2: '铭文/Ordinals',

  // ===== 元数据 =====
  difficulty_level: 3,           // 1-5
  risk_level: 4,                 // 假协议/钱包兼容/Gas波动/项目方跑路
  apy_min: 0,
  apy_max: 500,

  // 资金/时间/技术门槛
  threshold_capital: '50–5,000 USD（按网络拥堵与项目弹性参与）',
  threshold_capital_min: 50,
  time_commitment: '每周 2–6 小时（项目筛选/铸造监控/二级交易）',
  time_commitment_minutes: 240,
  threshold_tech_level: 'intermediate',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：想要参与**比特币生态资产**、理解**Ordinals协议**、把握**铭文/符文机会**的个人与团队
> **阅读时间**：≈ 18–25 分钟
> **关键词**：Ordinals / Inscriptions / BRC-20 / ORC-20 / BRC-721 / Runes / UTXO / Satoshi / PSBT / UniSat / Xverse / Magic Eden

---

## 🧭 TL;DR
- **核心概念**：*Ordinals协议*（聪编号理论）将数据**直接铭刻**在比特币聪（satoshi）上，创造出比特币原生资产（Inscriptions铭文/Runes符文）。
- **主流标准**：**BRC-20**（可互换代币）、**BRC-721**（NFT）、**ORC-20**（改进版BRC-20）、**Runes**（原生UTXO代币标准）、**SRC-20**（Stamps邮票协议）。
- **操作要点**：选择**兼容钱包**（UniSat/Xverse/OKX Wallet）、理解**UTXO模型**、监控**Gas费用**（sats/vB）、使用**官方索引器**验证、**分批小额参与**降低风险。
- **风控纪律**：**验证协议真伪**、**避免首发盲打**、**只用比特币主网正规钱包**、**小额测试后扩大**、**关注项目社区与审计**。

---

## 🗂 目录
1. [Ordinals协议基础：聪编号与铭文](#ordinals协议基础聪编号与铭文)
2. [主流标准对比：BRC-20/ORC-20/Runes/SRC-20](#主流标准对比brc-20orc-20runessrc-20)
3. [工具链与钱包选型](#工具链与钱包选型)
4. [铭文铸造（Mint）实战流程](#铭文铸造mint实战流程)
5. [铭文交易与转账机制](#铭文交易与转账机制)
6. [Runes符文协议详解](#runes符文协议详解)
7. [Gas费用优化策略](#gas费用优化策略)
8. [生态项目评估框架](#生态项目评估框架)
9. [风险与防骗指南](#风险与防骗指南)
10. [主流市场与流动性](#主流市场与流动性)
11. [FAQ](#faq)
12. [一页执行清单](#一页执行清单)

---

## 📖 Ordinals协议基础：聪编号与铭文

### 聪编号理论（Ordinal Theory）
**核心思想**：将比特币最小单位"聪"（1 BTC = 100,000,000 satoshis）按挖出顺序编号（0, 1, 2...），赋予每个聪**唯一身份**与**可追踪性**。

**编号规则**：
- 按照UTXO的输入顺序（先到先得）为每个聪分配序号
- 序号永久绑定该聪，可通过交易追踪
- 特殊聪：区块第一个聪（"史诗"）、减半第一个聪（"传奇"）等稀有度分级

### 铭文（Inscriptions）机制
**原理**：利用比特币SegWit升级后的**Witness**（见证数据）空间，将任意数据（文本/图片/音频/视频）**直接写入**比特币交易的脚本中，永久存储在链上。

**技术实现**：
- 使用Taproot（2021年激活）的脚本空间
- 数据以\`OP_PUSH\`操作码形式嵌入
- 不依赖外部存储（IPFS/Arweave），**完全链上**
- 每个铭文对应一个特定的聪序号

**与传统NFT的区别**：
| 特性 | Ordinals铭文 | 以太坊NFT |
|------|-------------|-----------|
| **存储** | 完全链上（比特币区块） | 链上合约+链下存储（IPFS等） |
| **可变性** | 完全不可变 | 元数据可能被修改 |
| **安全性** | 比特币网络安全 | 智能合约风险+依赖性风险 |
| **成本** | Gas费用高（BTC主网） | Gas费用波动（ETH Layer 2降低） |
| **标准化** | 无官方标准（社区共识） | ERC-721/1155等成熟标准 |

---

## 🏷️ 主流标准对比：BRC-20/ORC-20/Runes/SRC-20

### BRC-20（Bitcoin Request for Comment 20）
**定位**：比特币上的可互换代币标准（类似以太坊ERC-20）

**机制**：
- 在铭文中写入JSON格式的操作指令（Deploy/Mint/Transfer）
- 依赖链下索引器（Indexer）解析与维护余额状态
- 每次转账需要两步：\`Inscribe Transfer\` + \`Send Inscription\`

**操作示例**：
\`\`\`json
// Deploy（部署代币）
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "ordi",
  "max": "21000000",
  "lim": "1000"
}

// Mint（铸造）
{
  "p": "brc-20",
  "op": "mint",
  "tick": "ordi",
  "amt": "1000"
}

// Transfer（转账）
{
  "p": "brc-20",
  "op": "transfer",
  "tick": "ordi",
  "amt": "500"
}
\`\`\`

**优点**：
- 简单易懂，快速启动
- 社区采用度高，生态成熟（ORDI/SATS等）

**缺点**：
- 依赖链下索引器（不同索引器可能不一致）
- 转账效率低（两步操作）
- Gas成本高（每步都需独立交易）

---

### ORC-20（Ordinals Request for Comment 20）
**定位**：BRC-20的改进版，向后兼容

**改进点**：
- **防双花机制**：使用UTXO模型追踪余额
- **取消失败保护**：Mint失败不会丢失Gas
- **更灵活的命名**：支持更长的ticker与更复杂的操作

**状态**：社区采用度低于BRC-20，生态较小

---

### Runes（符文协议）
**定位**：Casey Rodarmor（Ordinals创始人）推出的**原生UTXO代币标准**

**核心优势**：
- **完全链上**：不依赖JSON/索引器，使用OP_RETURN存储状态
- **UTXO原生**：每个Rune余额直接对应比特币UTXO
- **高效转账**：单笔交易可转账多种Runes
- **低成本**：比BRC-20节省约60%–80% Gas

**发行机制**：
- **Etching（蚀刻）**：部署新Rune（类似ERC-20 Deploy）
- **Mint方式**：开放铸造（Open Mint）或预分配（Premine）
- **转账**：直接通过比特币交易的\`OP_RETURN\`字段携带Runes数据

**示例项目**：UNCOMMON•GOODS、RSIC、DOG•GO•TO•THE•MOON

**采用趋势**：2024年4月减半后正式启用，快速成为主流标准

---

### SRC-20（Stamps / Bitcoin Stamps）
**定位**：另类铭文协议，使用\`OP_RETURN\`+多签地址存储数据

**机制**：
- 将图片/数据编码为Base64，嵌入比特币交易输出
- 数据存储在UTXO中（不是Witness），**更难被修剪**
- 兼容比特币全节点的UTXO集

**优缺点**：
- ✅ 更去中心化（完全在UTXO中）
- ✅ 更抗审查（节点必须保留）
- ❌ 成本更高（每字节占用UTXO空间）
- ❌ 生态较小

---

### 标准对比总结

| 标准 | 技术架构 | Gas成本 | 转账效率 | 生态成熟度 | 推荐场景 |
|------|---------|---------|---------|-----------|---------|
| **BRC-20** | JSON+Witness | 高 | 低（两步） | ★★★★★ | 成熟项目、高流动性 |
| **ORC-20** | 改进JSON | 高 | 低 | ★★☆☆☆ | 实验性项目 |
| **Runes** | OP_RETURN+UTXO | 中低 | 高（单步） | ★★★★☆ | 新项目、高频交易 |
| **SRC-20** | Base64+UTXO | 极高 | 中 | ★★☆☆☆ | 收藏品、抗审查需求 |

---

## 🛠️ 工具链与钱包选型

### 推荐钱包

#### UniSat Wallet（最流行）
- **支持标准**：BRC-20、ORC-20、Runes、BRC-721
- **功能**：铭文铸造、转账、交易市场、批量操作
- **优点**：生态最完整、索引器稳定、浏览器插件+移动端
- **官网**：https://unisat.io

#### Xverse Wallet（机构级）
- **支持标准**：BRC-20、Runes、Stacks生态
- **功能**：多签支持、硬件钱包集成
- **优点**：安全性高、支持Layer 2（Stacks）
- **官网**：https://xverse.app

#### OKX Wallet（交易所背景）
- **支持标准**：BRC-20、Runes、主流链
- **功能**：多链聚合、内置DEX、法币出入金
- **优点**：流动性好、交易所互通
- **注意**：中心化风险

#### Leather Wallet（原Hiro Wallet）
- **支持标准**：BRC-20、Stacks（比特币Layer 2）
- **功能**：开源、去中心化、支持智能合约
- **优点**：隐私性强、开发者友好

---

### 索引器与浏览器

| 工具 | 功能 | URL |
|------|------|-----|
| **Ordinals.com** | 官方铭文浏览器 | https://ordinals.com |
| **UniSat Indexer** | BRC-20余额查询 | https://unisat.io/market |
| **OrdinalHub** | 铭文稀有度查询 | https://ordinalhub.com |
| **Ordiscan** | 交易追踪 | https://ordiscan.com |
| **Mempool.space** | 比特币网络状态+Gas | https://mempool.space |

---

## ⚙️ 铭文铸造（Mint）实战流程

### 前置准备
1. **安装钱包**：下载UniSat/Xverse并创建比特币主网地址
2. **充值BTC**：转入至少0.001 BTC（覆盖Gas+测试）
3. **查找项目**：Twitter/Discord/UniSat Market/Magic Eden
4. **验证协议**：确认Deploy交易哈希、Tick名称、Limit等参数

---

### BRC-20铸造步骤

#### 步骤1：找到项目信息
在UniSat Market或Twitter搜索项目名称（如"ORDI"），获取：
- **Tick名称**：如\`ordi\`（4字符）
- **每次Mint额度**：如1000枚
- **总供应量**：如21,000,000枚
- **Deploy交易哈希**：验证真实性

#### 步骤2：打开铸造界面
- 访问UniSat钱包的"Inscribe"功能
- 选择"BRC-20" > "Mint"
- 输入Tick名称

#### 步骤3：设置参数
- **数量**：按项目规定（通常不可超过Limit）
- **Gas费率**：根据mempool.space实时费率选择（低/中/高/自定义）
- **重复次数**：批量铸造（如一次铸10个铭文）

#### 步骤4：确认与等待
- 检查总费用（Mint × 重复次数 × Gas费率）
- 签名交易
- 等待1–6个确认（约10–60分钟）
- 在"Pending"查看状态

#### 步骤5：验证与查看
- 在UniSat "Assets" > "BRC-20"查看余额
- 使用索引器验证交易（ordinals.com/inscription/[id]）

---

### Runes铸造步骤
**更简单**：Runes无需JSON，直接在钱包界面操作

1. 打开UniSat/Xverse的"Runes"功能
2. 搜索符文名称（如DOG•GO•TO•THE•MOON）
3. 点击"Mint"，输入数量
4. 设置Gas，单笔交易完成
5. 实时同步到钱包余额（无需等待索引器）

---

## 💸 铭文交易与转账机制

### BRC-20转账（两步流程）

#### 第1步：Inscribe Transfer
- 创建一个Transfer铭文（写入转账指令）
- 消耗Gas费用（约5–50 USD，视网络状况）
- 生成一个UTXO（包含该铭文）

#### 第2步：Send Inscription
- 将该UTXO发送给接收地址
- 再次消耗Gas费用
- 接收方索引器更新余额

**总成本**：两笔交易Gas + 索引器延迟（5–30分钟）

---

### Runes转账（单步流程）
- 直接在钱包选择"Send Rune"
- 输入接收地址与数量
- 单笔交易完成，Gas费用减少60%+
- 即时到账（无需等待索引器）

---

### 市场挂单与交易
**主流平台**：
- **UniSat Market**：最大流动性，支持BRC-20/Runes/BRC-721
- **Magic Eden**：跨链NFT市场，支持Ordinals
- **OKX NFT Market**：交易所背景，法币出入
- **Ordinals Wallet Market**：去中心化P2P

**交易方式**：
1. **挂单卖出**：设置价格，锁定铭文到PSBT（部分签名比特币交易）
2. **直接购买**：完成PSBT签名，自动转账
3. **竞价拍卖**：限时竞价（较少使用）

---

## 🔮 Runes符文协议详解

### 发行（Etching）机制
**操作步骤**：
1. 使用Runes工具（如Luminex/RunesTerminal）创建
2. 设置参数：
   - **符文名称**：如UNCOMMON•GOODS（必须包含•分隔符）
   - **符号**：如⧉、🐶（Unicode字符）
   - **小数位**：0–18位
   - **总供应量**：固定或无上限
   - **Mint方式**：开放/时间限制/数量限制
3. 广播交易，支付发行费用（约0.001–0.01 BTC）

---

### Premine与公平发射
**Premine（预挖）**：
- 创建者保留部分供应量（如10%–50%）
- 适合团队运营、流动性引导
- 透明度要求：提前公布分配方案

**Fair Launch（公平发射）**：
- 100%供应量由社区铸造
- 无预留、无私募
- 更去中心化，但项目方激励不足

---

### 稀有度与编号
- **特殊区块**：减半区块/史诗区块的符文更稀有
- **编号规则**：按创建时间顺序（Rune #1、#2...）
- **交易溢价**：早期编号+特殊名称可能价格更高

---

## ⛽ Gas费用优化策略

### 费率监控与选择
**实时查询**：
- **Mempool.space**：查看当前未确认交易量与费率建议
- **费率单位**：sats/vB（每虚拟字节多少聪）
- **分级**：低优先级（1–5 sats/vB）、中（10–30）、高（50+）

**策略**：
- **非紧急铸造**：设置低费率（5–10 sats/vB），等待数小时/数天
- **抢热门项目**：设置高费率（100+ sats/vB），优先确认
- **批量操作**：一次铸造多个铭文分摊固定成本

---

### 批量铸造节省成本
**UniSat批量功能**：
- 单次交易可铸造最多100个铭文
- 固定成本（交易头部）分摊
- 节省约30%–50% Gas

**计算示例**：
- 单个铭文：0.0005 BTC（Gas） + 铭文费
- 批量10个：0.0008 BTC总Gas（平均每个0.00008 BTC）

---

### UTXO管理
**问题**：铭文操作会产生大量小额UTXO（碎片化）

**解决方案**：
- **定期合并UTXO**：在Gas费低谷期（周末/凌晨）使用UniSat"Merge UTXO"功能
- **预留Gas UTXO**：单独保留一个大额UTXO专门支付Gas
- **避免粉尘攻击**：不接收来历不明的小额转账

---

## 📊 生态项目评估框架

### 基本面评估
✅ **Deploy验证**：
- 在Ordinals.com查询部署交易
- 确认参数（Max/Limit/Decimals）
- 验证时间戳（避免后发假币）

✅ **社区活跃度**：
- Twitter粉丝数与互动率
- Discord成员数与日活
- GitHub开源代码（如有）

✅ **团队背景**：
- 匿名 vs 实名（风险不同）
- 过往项目经历
- 审计报告（虽然BRC-20无智能合约）

✅ **用例与叙事**：
- Meme币（纯社区驱动，高波动）
- 实用代币（游戏/平台/治理）
- 技术创新（新协议/跨链）

---

### 市场指标
📈 **流动性深度**：
- UniSat Market挂单深度（买单/卖单量）
- 24h交易量 vs 市值比例（>5%为健康）

📈 **持有者分布**：
- Top 10持有者占比（<30%为去中心化）
- 地址数量增长趋势

📈 **价格走势**：
- 市值排名（UniSat/CoinGecko）
- 历史波动率（高风险高回报）

---

### 风险信号（红旗）
🚩 **无法验证Deploy交易**
🚩 **社区突然沉默/删除频道**
🚩 **团队承诺不切实际回报**
🚩 **流动性骤降（拉盘出货迹象）**
🚩 **大量机器人账号（虚假互动）**

---

## 🛡️ 风险与防骗指南

### 常见骗局

#### 1. 假协议/山寨币
**手法**：创建名称相似的Tick（如ORDI vs 0RDI）

**防范**：
- 仅通过官方公告/Deploy哈希验证
- 在Ordinals.com查询部署时间（先到先得）
- 使用索引器白名单（UniSat已验证项目）

#### 2. 钓鱼网站/假钱包
**手法**：仿冒UniSat/Xverse界面，窃取助记词

**防范**：
- 仅从官网/Chrome商店下载
- 验证HTTPS证书与域名拼写
- 永远不在网页输入助记词

#### 3. 假空投/诈骗铸造
**手法**：声称"免费空投"，实则诱导授权/转账

**防范**：
- 无需"授权"操作（比特币无智能合约）
- 官方空投会在Discord/Twitter公告
- 小额测试任何新项目

#### 4. 索引器不一致
**手法**：不同索引器余额差异，导致损失

**防范**：
- 优先使用UniSat/Ordinals.com主流索引器
- 交易前在多个索引器验证余额
- 避免使用未知第三方工具

---

### 安全最佳实践
✅ **冷钱包存储**：大额资产使用硬件钱包（Ledger/Trezor集成Xverse）
✅ **分散风险**：不同项目用不同地址
✅ **定期备份**：助记词+私钥物理备份（防火防水）
✅ **网络隔离**：重要操作使用独立设备/VPN
✅ **小额试验**：首次铸造/转账先用最小金额测试

---

## 🏪 主流市场与流动性

### 交易平台对比

| 平台 | 支持标准 | 流动性 | 手续费 | 特色功能 |
|------|---------|--------|--------|---------|
| **UniSat Market** | BRC-20/Runes/721 | ★★★★★ | 0.5%–1% | 批量铸造、索引器稳定 |
| **Magic Eden** | BRC-20/Ordinals NFT | ★★★★☆ | 1.5% | 跨链集成、推荐算法 |
| **OKX NFT** | BRC-20/Runes | ★★★★☆ | 0.5%–2% | 法币出入、交易所背景 |
| **Ordinals Wallet** | BRC-20 | ★★★☆☆ | 0% | 去中心化P2P |
| **Gamma.io** | BRC-721/艺术品 | ★★★☆☆ | 2% | 高端收藏品 |

---

### 出入金方式
1. **CEX充提**：
   - Binance/OKX/Bybit支持BTC主网
   - 充值到交易所 → 出售为USDT → 法币提现
   - 费用：交易所手续费 + 网络费

2. **OTC场外**：
   - LocalBitcoins/P2P平台
   - 更隐私，溢价±5%

3. **直接出售铭文**：
   - 在UniSat Market挂单
   - 买家用BTC支付
   - 转为BTC后提现

---

## ❓FAQ

**Q1：Ordinals会影响比特币网络吗？**
> 会增加区块空间需求，导致Gas费上涨。但使用的是SegWit的Witness空间（折扣区域），对基础交易影响有限。核心开发者对此存在争议。

**Q2：BRC-20和Runes哪个更有前景？**
> **Runes更高效**（UTXO原生、单步转账），是Casey官方推出的标准，长期更符合比特币哲学。但**BRC-20生态更成熟**（ORDI/SATS已上主流交易所），短期流动性更好。建议两者都关注。

**Q3：铸造失败会损失Gas吗？**
> **BRC-20**：会损失Gas（交易已上链但索引器不认可）
> **Runes**：更容错，失败概率低
> 建议：**小额测试** + 使用成熟工具（UniSat）

**Q4：如何判断铭文稀有度？**
> 关注：
> - **编号**：如#1、#100000（整数关口）
> - **区块特殊性**：减半区块、史诗区块
> - **内容独特性**：首个某类型内容（图片/音频）
> - **历史意义**：知名事件相关
> 查询工具：OrdinalHub、Rare Sat Hunter

**Q5：铭文可以销毁吗？**
> 技术上可以通过发送到销毁地址（如OP_RETURN）实现"实际销毁"，但聪本身永远存在。部分项目使用销毁机制减少供应量（如ORDI社区提案）。

---

## ✅ 一页执行清单

### 入门阶段
- [ ] 安装UniSat/Xverse钱包，创建比特币主网地址
- [ ] 充值0.005–0.01 BTC（覆盖测试与Gas）
- [ ] 在Mempool.space了解当前Gas费率
- [ ] 访问Ordinals.com浏览铭文示例

### 项目筛选
- [ ] 在Twitter/Discord搜索项目，查看社区活跃度
- [ ] 验证Deploy交易哈希（Ordinals.com）
- [ ] 检查UniSat Market流动性（挂单深度/24h成交量）
- [ ] 确认项目类型（Meme/实用/技术创新）
- [ ] 评估风险（团队背景/持有者分布/红旗信号）

### 铸造实战
- [ ] 选择低Gas时段（周末/凌晨，<20 sats/vB）
- [ ] **小额测试**：先铸造1个铭文验证流程
- [ ] 使用批量功能节省成本（10–50个/批次）
- [ ] 保存交易哈希与铭文ID
- [ ] 在索引器验证余额（UniSat/Ordinals.com）

### 转账与交易
- [ ] BRC-20转账：先Inscribe Transfer → 再Send Inscription
- [ ] Runes转账：直接Send（单步）
- [ ] 挂单出售：在UniSat Market设置价格与数量
- [ ] 定期合并UTXO（避免碎片化）
- [ ] 记录成本与收益（税务申报）

### 风控与安全
- [ ] 永远不分享助记词/私钥
- [ ] 大额资产转移到硬件钱包（Ledger+Xverse）
- [ ] 只使用官方工具与索引器
- [ ] 分散持仓（不同项目用不同地址）
- [ ] 设置止损线（如价格跌50%清仓）

### 持续学习
- [ ] 关注Casey Rodarmor Twitter（@rodarmor）
- [ ] 加入Ordinals Discord/Telegram
- [ ] 订阅Ordinals Newsletter
- [ ] 使用Dune Analytics追踪链上数据
- [ ] 参与社区治理/提案（如有）

---

## 🎓 进阶学习资源

### 技术文档
- **Ordinals Theory官方文档**：https://docs.ordinals.com
- **Runes协议规范**：https://docs.ordinals.com/runes.html
- **BRC-20标准文档**：https://domo-2.gitbook.io/brc-20-experiment/

### 数据追踪
- **Ordinals.com**：官方铭文浏览器
- **Dune Analytics Ordinals Dashboard**：链上数据分析
- **GeniiData**：BRC-20市场数据
- **Ord.io**：铭文稀有度查询

### 社区与媒体
- **Ordinals Discord**：https://discord.gg/ordinals
- **Bitcoin Magazine Ordinals专栏**
- **Decrypt/CoinDesk Ordinals报道**
- **Twitter List**：@rodarmor、@unisat_wallet、@TO、@LeonidasNFT

### 开发工具
- **Ord命令行工具**：https://github.com/ordinals/ord（节点运营）
- **Ordinals API**：Hiro/QuickNode提供索引器API
- **PSBT工具**：Bitcoin Core、Sparrow Wallet

---

## 🔚 结语

铭文/Ordinals生态是比特币自诞生以来**最大的协议创新**之一，将比特币从"数字黄金"扩展为**可编程资产平台**。无论是BRC-20的Meme热潮，还是Runes的技术革新，都展示了社区自发创新的力量。

**参与建议**：
1. **从学习开始**：理解UTXO模型与铭文原理
2. **小额试验**：先投入50–200 USD熟悉流程
3. **分散风险**：不超过投资组合的10%–20%
4. **长期视角**：关注技术迭代（如Layer 2集成/跨链桥）
5. **保持警惕**：新生态=高风险，避免FOMO盲打

愿你在比特币铭文世界中，既能把握机会，又能守住本金！🚀🔶
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '钱包设置与准备', description: '安装UniSat/Xverse钱包，创建比特币主网地址，充值0.005–0.01 BTC，熟悉钱包界面与Gas费率查询。', estimated_time: '30–60 分钟' },
    { step_number: 2, title: '项目研究与验证', description: '在Twitter/Discord筛选项目，验证Deploy交易哈希，评估社区活跃度与流动性，确认协议标准（BRC-20/Runes）。', estimated_time: '1–3 小时' },
    { step_number: 3, title: '小额测试铸造', description: '选择低Gas时段，先铸造1个铭文验证流程，检查索引器余额，记录交易哈希与成本。', estimated_time: '20–40 分钟' },
    { step_number: 4, title: '批量铸造与交易', description: '使用批量功能铸造（10–50个/批），在市场挂单出售或持有，管理UTXO碎片化，记录盈亏。', estimated_time: '1–2 小时/批次' },
    { step_number: 5, title: '风控与持续跟踪', description: '定期检查项目动态与价格，设置止损线，分散持仓，学习新协议（Runes更新/Layer 2集成），参与社区治理。', estimated_time: '2–5 小时/周' },
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

    console.log('\n✅ 铭文/Ordinals 完全指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
