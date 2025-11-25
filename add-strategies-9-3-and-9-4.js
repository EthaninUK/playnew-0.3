const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// Strategy 9.3: Puffer Finance Native Restaking
const STRATEGY_9_3 = {
  title: 'Puffer Finance 原生再质押 - 抗 MEV 的去中心化再质押方案',
  slug: 'puffer-finance-native-restaking',
  summary: '通过 Puffer Finance 进行以太坊原生质押和 EigenLayer 再质押，利用其独特的抗 MEV 技术和去中心化验证节点网络，在获得质押收益的同时保护验证者免受 MEV 攻击和 Slashing 风险。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 3,
  risk_level: 2,
  apy_min: 6,
  apy_max: 20,
  threshold_capital: '1 ETH 起（验证节点需 2 ETH）',
  threshold_capital_min: 3000,
  time_commitment: '初次设置 1-2 小时，每月维护 30 分钟',
  time_commitment_minutes: 90,
  threshold_tech_level: 'intermediate',
  content: `
## 什么是 Puffer Finance

Puffer Finance 是一个创新的流动性再质押协议，专注于提高以太坊验证者的安全性和资本效率。它通过降低验证节点的准入门槛（从 32 ETH 降到 2 ETH）和提供抗 MEV 保护，让更多人能够参与原生质押和再质押。

### 核心创新

**1. 降低验证者门槛（2 ETH 验证节点）**

传统以太坊验证需要 32 ETH，Puffer 通过"保险池"机制降低到 2 ETH：
- 验证者只需提供 2 ETH
- 其余 30 ETH 来自 Puffer 的流动性池
- 如果验证者被 Slashing，优先从其 2 ETH 扣除
- 保护了流动性提供者的资金安全

**2. 抗 MEV（Secure-Signer）**

MEV（最大可提取价值）对验证者的风险：
- 验证者可能被诱导作恶以获取 MEV
- 作恶后被 Slashing，损失 32 ETH
- Puffer 的 Secure-Signer 技术自动拒绝可能导致 Slashing 的交易

工作原理：
- 在验证者和信标链之间增加一层安全签名模块
- 实时分析每个区块提案
- 自动拒绝可能导致 Slashing 的签名请求
- 验证者无法绕过这层保护

**3. 原生再质押集成**

Puffer 同时是 EigenLayer 的原生再质押协议：
- 所有 Puffer 验证节点自动参与 EigenLayer
- 用户获得 ETH 质押 + EigenLayer AVS 双重收益
- 无需额外操作，一键完成

**4. pufETH（流动性代币）**

类似于 Lido 的 stETH，Puffer 提供 pufETH：
- 1:1 锚定 ETH（会随着奖励累积而增值）
- 可以在 DeFi 中自由使用
- 代表你在 Puffer 中的质押份额

### 与其他 LRT 协议对比

| 协议 | 最低门槛 | 验证节点 | 抗 MEV | Slashing 保护 | 协议费用 | TVL |
|-----|---------|---------|--------|--------------|---------|-----|
| Puffer | 1 ETH (LP)<br>2 ETH (节点) | 去中心化<br>（任何人） | ✅ Secure-Signer | ✅ 保险池 | 5% | $150M |
| Renzo | 0.01 ETH | 中心化 Operator | ❌ | ⚠️ 依赖 Operator | 10% | $1.2B |
| Ether.fi | 0.01 ETH | 去中心化 | ❌ | ⚠️ 标准 | 5% | $800M |
| Lido | 0.01 ETH | 白名单节点 | ❌ | ⚠️ 标准 | 10% | $32B |

Puffer 的独特优势：
- ✅ 最强的 Slashing 保护（历史 0 事故）
- ✅ 真正的去中心化（任何人可以运行节点）
- ✅ 抗 MEV 保护（Secure-Signer）
- ✅ 较低的费用（5%）
- ❌ TVL 相对较小（流动性稍差）
- ❌ DeFi 整合较少（正在改善）

### 收益来源

**1. 基础 ETH 质押收益（3.5-4.5% APR）**
- 来自信标链的验证奖励
- 区块提案奖励
- MEV 奖励（通过 Secure-Signer 安全提取）

**2. EigenLayer 再质押奖励（3-12% APR）**
- Puffer 验证节点自动参与 EigenLayer
- 参与的 AVS 包括：EigenDA、Espresso、Omni 等
- Puffer 团队专业管理 AVS 组合

**3. EigenLayer 积分（未来价值）**
- 所有 pufETH 持有者累积 EigenLayer Points
- 积分权重：1.0x（与原生质押相同）
- 可能未来兑换为 $EIGEN 代币

**4. Puffer Points（PUFFER 积分）**
- 每持有 1 pufETH 每天累积积分
- 积分可能兑换为 $PUFFER 代币（未发行）
- 早期用户加成：2024 Q1 用户享受 1.5x 积分权重

**5. 节点运营者额外收益（仅限运行节点）**
- 如果你运行 2 ETH 验证节点，额外获得：
  - 节点运营者费用：总收益的 10%
  - 优先获得 MEV 奖励
  - 更高的积分权重（2.0x）

**总收益潜力**
- 仅持有 pufETH：6-15% APR
- 运行验证节点：10-20% APR
- 配合 DeFi 策略：12-25% APR

## 两种参与方式

### 方式 1：流动性提供者（最简单）

适合人群：
- 拥有 1 ETH 以上
- 不想运行验证节点
- 希望保持流动性

操作：
1. 访问 Puffer 官网
2. 存入 ETH（或 stETH、wstETH）
3. 获得 pufETH
4. 在 DeFi 中使用 pufETH 或持有

收益：
- ETH 质押：3.5% APR
- EigenLayer AVS：3-10% APR
- 总计：6.5-13.5% APR
- 扣除 5% 协议费后：6-13% APR

风险：
- 智能合约风险（已审计 5 次）
- pufETH 脱锚风险（通常<1%）
- 提款需要 7-14 天

### 方式 2：验证节点运营者（高级）

适合人群：
- 拥有 2 ETH 以上
- 有技术能力运行节点
- 追求更高收益

操作：
1. 准备 2 ETH + 运行节点的硬件
2. 在 Puffer 注册并质押 2 ETH
3. 下载并运行 Puffer 节点客户端
4. 节点自动同步并开始验证

收益：
- ETH 质押：3.5% APR
- EigenLayer AVS：3-10% APR
- 节点运营者费用：额外 10%
- 总计：10-20% APR（显著高于流动性提供者）

风险：
- 需要维护节点（停机会影响收益）
- 硬件成本（$50-100/月）
- 技术门槛较高

## 实操步骤（流动性提供者）

### Step 1: 准备钱包和资产

**需要准备**
- MetaMask 或硬件钱包（推荐 Ledger）
- 至少 1 ETH（或等量的 stETH、wstETH）
- 额外 0.02 ETH 用于 Gas 费用

**支持的存款资产**
- ETH（原生以太坊）
- stETH（Lido）
- wstETH（Wrapped stETH）
- 未来可能支持更多 LST

**安全检查**
- [ ] 钱包助记词已安全备份
- [ ] 了解 Puffer 的基本原理和风险
- [ ] 确认钱包地址正确且有足够余额

### Step 2: 在 Puffer 存入资产

1. **访问 Puffer App**
   - 打开 https://app.puffer.fi
   - 确认 URL 正确（防止钓鱼网站）
   - 连接钱包

2. **选择存款类型**
   - 点击 "Liquid Staking" 标签
   - 选择要存入的资产类型（ETH、stETH 或 wstETH）
   - 查看当前的 APR 预估

3. **输入金额**
   - 输入要质押的数量（建议首次 0.5-1 ETH 测试）
   - 查看兑换比例：
     - 1 ETH = ? pufETH（通常 1:0.98-1.00）
     - 兑换率可能略低于 1:1（因为 pufETH 已累积部分奖励）
   - 查看预期收益：
     - 基础 APR：X%
     - 协议费用：5%
     - 净 APR：Y%

4. **授权和存款**
   - 如果存入 stETH 或 wstETH，先点击 "Approve"
     - 授权 Puffer 合约访问你的代币
     - Gas 费约 $3-8
   - 点击 "Deposit"
     - 确认交易详情
     - Gas 费约 $8-20（取决于网络拥堵）
   - 等待交易确认（约 30-90 秒）

5. **确认成功**
   - 在钱包中查看 pufETH 余额
     - pufETH 合约地址：0xD9A442856C234a39a81a089C06451EBAa4306a72
     - 如果未自动显示，手动添加代币
   - 在 Puffer Dashboard 查看：
     - 你的 pufETH 余额
     - 累积的 Puffer Points
     - 累积的 EigenLayer Points
     - 当前 APR

### Step 3: 监控收益和积分

**Puffer Dashboard**

访问 https://app.puffer.fi/dashboard，你可以看到：

1. **余额概览**
   - Total pufETH：你的总持仓
   - Underlying Value：当前价值（ETH）
   - Rewards Earned：累积的奖励

2. **积分追踪**
   - Puffer Points：每天自动累积
   - EigenLayer Points：每小时累积
   - 积分排名：查看你在所有用户中的排名

3. **APR 历史**
   - 图表显示过去 30/90/365 天的 APR 变化
   - 平均 APR
   - 最高/最低 APR

4. **节点状态**（如果你运行节点）
   - 正常运行时间
   - 提案的区块数
   - 获得的 MEV 奖励
   - 是否有任何警告或错误

**每周检查清单**
- [ ] pufETH 价值是否正常增长（每周约 +0.1-0.2%）
- [ ] 积分是否正常累积
- [ ] pufETH/ETH 汇率是否在正常范围（0.98-1.02）
- [ ] 查看 Puffer 官方公告（Twitter、Discord）

**每月检查清单**
- [ ] 计算实际 APR 并与预期对比
- [ ] 评估是否需要增加投入
- [ ] 查看 DeFi 中 pufETH 的新机会
- [ ] 考虑是否部分赎回或调整策略

### Step 4: 使用 pufETH 在 DeFi 中获取额外收益

虽然 Puffer 的 DeFi 整合还在早期，但已经有一些机会：

**1. Curve Finance 流动性挖矿**

- 池子：pufETH/wstETH
- TVL：约 $5M
- APR：
  - 交易手续费：1-3%
  - CRV 奖励：3-8%
  - Puffer 激励：5-10%（额外的 Puffer Points 加成）
  - 总计：9-21% APR

操作：
1. 准备 50% pufETH + 50% wstETH
2. 访问 Curve 上的 pufETH/wstETH 池
3. 添加流动性
4. 质押 LP 代币（在 Curve 或 Convex）

风险：
- 无常损失（如果 pufETH 相对 wstETH 价格变化）
- 池子流动性较小（滑点可能较大）

**2. Pendle 收益交易**

- 市场：PT-pufETH
- 到期日：2024-12-31
- 固定 APY：8-12%（通过购买 PT）

操作：
1. 访问 Pendle，搜索 pufETH
2. 购买 PT-pufETH 锁定固定收益
3. 或购买 YT-pufETH 放大收益敞口

**3. Aave V3（计划中）**

Puffer 团队正在与 Aave 合作，将 pufETH 作为抵押品：
- 预计 2024 Q3 上线
- LTV：70-75%
- 可以抵押 pufETH 借出稳定币或 ETH

### Step 5: 赎回 pufETH（如果需要）

**赎回流程**

1. **发起赎回**
   - 访问 Puffer App
   - 点击 "Withdraw" 标签
   - 输入要赎回的 pufETH 数量
   - 查看预计收到的 ETH 数量
   - 确认交易（Gas 约 $5-10）

2. **等待解锁期**
   - 正常情况：7 天
   - 繁忙时期：7-14 天
   - 极端情况：最长 21 天（历史未发生）

3. **Claim 赎回的 ETH**
   - 7 天后，回到 Puffer App
   - 点击 "Claim" 按钮
   - 确认交易（Gas 约 $3-8）
   - ETH 会到达你的钱包

**快速退出选项**

如果不想等待 7 天：

1. **在 DEX 上卖出 pufETH**
   - Curve pufETH/wstETH 池
   - Uniswap V3 pufETH/ETH 池
   - 可能有 0.5-2% 的折价
   - 即时到账

2. **通过聚合器**
   - 使用 1inch 或 CoW Swap
   - 自动找到最优价格路径
   - 可能获得比单个 DEX 更好的价格

## 实操步骤（验证节点运营者）

### 前提条件

- 至少 2 ETH
- 技术能力：熟悉命令行、Docker、Linux
- 硬件要求：
  - CPU：4 核（推荐 8 核）
  - RAM：16 GB（推荐 32 GB）
  - 存储：2 TB SSD（NVMe 推荐）
  - 网络：100 Mbps 上下行，固定 IP
  - 电力：稳定供电（推荐 UPS）

### Step 1: 准备硬件和环境

**选择硬件方案**

方案 A：本地硬件
- 成本：$1,500-2,500（一次性）
- 优点：完全掌控，无月费
- 缺点：需要维护，电费，网络稳定性

推荐配置：
- Intel NUC 或 AMD Ryzen Mini PC
- 32 GB RAM
- 2 TB NVMe SSD
- Ubuntu 22.04 LTS

方案 B：云服务器（VPS）
- 成本：$50-150/月
- 优点：高可用，无需维护硬件
- 缺点：月费，依赖第三方

推荐服务商：
- **Contabo**：€35/月，16 GB RAM，1 TB SSD
- **Hetzner**：€45/月，32 GB RAM，1 TB NVMe
- **OVH**：$80/月，32 GB RAM，2 TB NVMe

### Step 2: 安装必要软件

1. **安装 Docker**
bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER


2. **安装以太坊客户端**

Puffer 支持多种客户端组合，推荐：
- 执行层（EL）：Geth 或 Nethermind
- 共识层（CL）：Lighthouse 或 Prysm

使用 Docker Compose：
bash
# 下载 Puffer 官方配置
git clone https://github.com/PufferFinance/validator-setup
cd validator-setup

# 编辑配置文件
nano .env
# 设置你的以太坊钱包地址、MEV Relay 等

# 启动节点
docker-compose up -d


3. **等待同步**
   - 执行层同步：6-24 小时（取决于硬件和网络）
   - 共识层同步：2-8 小时
   - 查看同步进度：
     bash
     docker-compose logs -f execution
     docker-compose logs -f consensus
     

### Step 3: 在 Puffer 注册验证节点

1. **访问 Puffer Operator Portal**
   - 打开 https://app.puffer.fi/operators
   - 连接钱包（使用有 2 ETH 的钱包）

2. **注册成为 Operator**
   - 点击 "Register as Operator"
   - 填写信息：
     - Operator 名称
     - 网站（可选）
     - 联系方式（可选）
   - 确认交易（Gas 约 $10-20）

3. **质押 2 ETH**
   - 点击 "Deposit Validator Stake"
   - 输入 2 ETH
   - 确认交易（Gas 约 $15-30）

4. **生成验证器密钥**
   - 使用 Puffer 提供的工具生成密钥
   bash
   docker run -it pufferfi/validator-keygen \
     --withdrawal-address YOUR_ADDRESS \
     --output-dir ./validator_keys
   
   - 安全保存密钥文件（keystore-*.json）

5. **上传验证器密钥**
   - 在 Puffer App 中上传 deposit_data-*.json
   - Puffer 会自动匹配剩余 30 ETH 并激活验证器
   - 等待激活（约 12-24 小时）

### Step 4: 运行 Puffer 节点客户端

1. **下载 Puffer Secure-Signer**
   - Puffer 的核心创新，提供抗 MEV 和 Slashing 保护
   bash
   docker pull pufferfi/secure-signer:latest
   

2. **配置 Secure-Signer**
   - 编辑配置文件
   bash
   nano puffer-config.yaml
   
   - 关键配置：
     - 验证器密钥路径
     - 信标链 RPC 端点
     - MEV Relay 端点（Puffer 推荐的）
     - Slashing 保护数据库路径

3. **启动 Secure-Signer**
   bash
   docker run -d \
     --name puffer-secure-signer \
     -v ./validator_keys:/keys \
     -v ./puffer-config.yaml:/config.yaml \
     -p 5051:5051 \
     pufferfi/secure-signer:latest \
     --config /config.yaml
   

4. **连接到共识层客户端**
   - 配置 Lighthouse/Prysm 使用 Puffer Secure-Signer 而不是直接签名
   bash
   # 在 docker-compose.yml 中修改
   consensus:
     command:
       - --suggested-fee-recipient=YOUR_ADDRESS
       - --validators-external-signer-url=http://puffer-secure-signer:5051
   

5. **重启共识层客户端**
   bash
   docker-compose restart consensus
   

### Step 5: 监控和维护节点

**日常监控**

1. **检查节点状态**
   bash
   # 执行层
   docker-compose logs -f execution | grep "Imported new block"
   
   # 共识层
   docker-compose logs -f consensus | grep "Successfully published block"
   
   # Secure-Signer
   docker logs -f puffer-secure-signer
   

2. **使用 Puffer Dashboard**
   - 访问 https://app.puffer.fi/operators/YOUR_ADDRESS
   - 查看：
     - 验证器状态（Active/Inactive）
     - 正常运行时间（应该 >99%）
     - 提案的区块数
     - 获得的奖励（ETH）
     - Slashing 事件（应该为 0）
     - MEV 奖励

3. **设置监控警报**

使用 Beaconcha.in：
   - 访问 https://beaconcha.in
   - 输入你的验证器公钥
   - 点击 "Subscribe to notifications"
   - 设置警报：
     - 验证器离线
     - 错过的证明（Attestations）
     - Slashing 事件
     - 余额减少

**每周维护**

- [ ] 检查系统资源（CPU、RAM、磁盘）
- [ ] 更新 Docker 镜像（如果有新版本）
- [ ] 查看日志文件是否有错误
- [ ] 检查网络连接和延迟
- [ ] 备份验证器密钥和 Slashing 保护数据库

**每月维护**

- [ ] 评估收益是否符合预期
- [ ] 查看 Puffer 社区是否有重要更新
- [ ] 考虑是否需要优化配置（如更换 MEV Relay）
- [ ] 更新系统和依赖包
- [ ] 测试灾难恢复流程（模拟节点故障）

## 收益计算实例

### 案例 1：流动性提供者（10 ETH）

**初始投入**
- 10 ETH（约 $30,000）
- 策略：仅持有 pufETH，不参与 DeFi

**年化收益**

1. **ETH 质押收益**
   - APR：3.8%
   - 年收益：10 × 3.8% = 0.38 ETH（$1,140）

2. **EigenLayer AVS 奖励**
   - Puffer 参与的 AVS 平均 APR：6%
   - 年收益：10 × 6% = 0.6 ETH（$1,800）

3. **协议费用**
   - Puffer 收取 5%
   - 扣除：(0.38 + 0.6) × 5% = 0.049 ETH（$147）

4. **净收益**
   - 0.38 + 0.6 - 0.049 = 0.931 ETH（$2,793）
   - **APR：9.31%**

5. **积分价值（假设）**
   - Puffer Points：每天 10 点 × 365 = 3,650 点
   - EigenLayer Points：每小时 10 点 × 8,760 = 87,600 点
   - 假设未来 Puffer 空投：3,650 点 × $0.50 = $1,825
   - 假设未来 EigenLayer 空投：87,600 点 × $0.10 = $8,760
   - 潜在空投价值：$10,585（一次性）

**总收益**
- 确定收益：$2,793（9.31% APR）
- 潜在空投：$10,585（35.3% 一次性）
- **总计：$13,378（44.6% 包含空投）**

**成本**
- Gas 费用（存入）：$20
- Gas 费用（监控和管理）：$50/年
- 年总成本：$70

**净收益**
- 保守（不含空投）：$2,793 - $70 = $2,723（9.1% APR）
- 乐观（含空投）：$13,378 - $70 = $13,308（44.4%）

### 案例 2：验证节点运营者（2 ETH 质押 + 流动性）

**初始投入**
- 2 ETH（验证节点质押）
- 8 ETH（流动性池，获得 pufETH）
- 总计：10 ETH（$30,000）

**年化收益**

1. **验证节点收益（2 ETH 份额）**
   - 基础质押：2 × 3.8% = 0.076 ETH
   - EigenLayer AVS：2 × 6% = 0.12 ETH
   - 节点运营者费用：(0.076 + 0.12) × 10% = 0.0196 ETH
   - 小计：0.2156 ETH（$647）

2. **流动性池收益（8 ETH 份额）**
   - 基础质押：8 × 3.8% = 0.304 ETH
   - EigenLayer AVS：8 × 6% = 0.48 ETH
   - 扣除协议费 5%：(0.304 + 0.48) × 0.95 = 0.745 ETH
   - 小计：0.745 ETH（$2,235）

3. **总收益**
   - 0.2156 + 0.745 = 0.9606 ETH（$2,882）
   - **APR：9.6%**（略高于纯流动性提供者）

4. **积分加成（节点运营者）**
   - Puffer Points：2x 权重
   - 每天：(2 × 2 + 8 × 1) = 12 点（vs 流动性提供者的 10 点）
   - 年累积：12 × 365 = 4,380 点
   - 假设空投价值：$2,190（vs $1,825）

**成本**
- VPS 服务器：$60/月 × 12 = $720
- Gas 费用：$100/年
- 年总成本：$820

**净收益**
- 确定收益：$2,882 - $820 = $2,062（6.9% APR）
- 含空投（假设）：$2,062 + $2,190 + $8,760 = $13,012（43.4%）

**对比分析**
- 运行节点的额外收益：$2,062 - $2,723 = -$661（短期看亏损）
- 但是：更高的积分权重和未来空投可能抵消成本
- 适合：长期参与者、技术爱好者、追求去中心化的用户

## 风险管理

### Puffer 特有风险

**1. Secure-Signer 故障风险（严重性：中）**

风险描述：
- Secure-Signer 是 Puffer 的核心组件
- 如果出现 Bug，可能导致验证节点无法正常提案区块
- 影响收益（错过提案）

历史：
- Secure-Signer 已运行 >1 年
- 无重大故障记录
- 经过多次审计（Runtime Verification、Quantstamp）

缓解措施：
- ✅ Puffer 团队提供 24/7 监控和支持
- ✅ 设置备用节点配置（传统签名方式）
- ✅ 定期测试 Secure-Signer 更新（先在测试网）
- ✅ 加入 Puffer Discord，获取实时故障通知

**2. 2 ETH 验证节点的 Slashing 风险（严重性：低）**

风险描述：
- 如果你运行 2 ETH 节点并被 Slashing
- 你的 2 ETH 会被罚没
- 但是：Secure-Signer 大幅降低了这个风险

Slashing 条件：
- 双重签名（同时签名两个冲突的区块）
- 包围投票（违反证明规则）
- 这些都由 Secure-Signer 自动预防

历史数据：
- Puffer 验证节点 Slashing 事件：0
- 传统验证节点 Slashing 率：约 0.01%/年

缓解措施：
- ✅ 使用 Puffer 的 Secure-Signer（强制性）
- ✅ 不要同时在多个地方运行相同的验证器密钥
- ✅ 定期备份 Slashing 保护数据库
- ✅ 遵循 Puffer 的最佳实践指南

**3. pufETH 流动性风险（严重性：中低）**

风险描述：
- pufETH 的 TVL 和流动性小于 Lido、Renzo
- 在 DEX 上交易可能有较大滑点（特别是大额）
- 极端情况下可能折价

现状：
- pufETH TVL：$150M
- Curve pufETH/wstETH 池：$5M
- 大额交易（>10 ETH）滑点：1-3%

缓解措施：
- ✅ 大额交易分批进行
- ✅ 使用聚合器（1inch、CoW Swap）寻找最优路径
- ✅ 在流动性高的时段交易（UTC 12:00-20:00）
- ✅ 如果不着急，使用官网赎回（7 天，无滑点）

**4. 节点硬件/网络故障风险（仅限节点运营者，严重性：中）**

风险描述：
- 硬件故障、网络中断导致验证节点离线
- 错过证明和提案，损失收益
- 长期离线可能导致轻微罚款（Inactivity Leak）

影响：
- 离线 1 天：损失约 0.001 ETH（可忽略）
- 离线 1 周：损失约 0.01 ETH + 轻微 Inactivity Leak
- 离线 >1 个月：可能损失 5-10% 的质押

缓解措施：
- ✅ 使用可靠的硬件和网络
- ✅ 配置 UPS（不间断电源）
- ✅ 监控节点状态（Beaconcha.in 警报）
- ✅ 准备备用节点或迁移计划
- ✅ 购买商业级网络（SLA 保证）

### 监控清单

**每日（节点运营者）**
- [ ] 验证器状态：Active
- [ ] 正常运行时间：>99%
- [ ] 最近的证明和提案：成功
- [ ] 系统资源：CPU <80%，RAM <80%，磁盘 >20%
- [ ] 网络延迟：<100ms 到信标链节点

**每日（流动性提供者）**
- [ ] pufETH/ETH 汇率：0.98-1.02
- [ ] pufETH 余额增长：正常
- [ ] Puffer 官方无安全警告

**每周（所有用户）**
- [ ] 积分累积：Puffer Points 和 EigenLayer Points 正常增长
- [ ] APR 是否符合预期
- [ ] 查看 Puffer Discord/Twitter 的重要更新

**每月（所有用户）**
- [ ] 计算实际收益并对比预期
- [ ] 评估是否需要调整策略
- [ ] 查看 pufETH 在 DeFi 中的新机会
- [ ] 更新风险评估

## 常见问题

**Q1：Puffer 的 Secure-Signer 真的能防止 Slashing 吗？**
A：是的。Secure-Signer 在签名层面拦截所有可能导致 Slashing 的操作（双重签名、包围投票）。截至 2024 年 Q2，Puffer 验证节点 Slashing 事件为 0。即使验证者主观上想作恶，Secure-Signer 也会自动拒绝。

**Q2：2 ETH 验证节点和 32 ETH 验证节点有什么区别？**
A：
- **收益分配**：2 ETH 节点获得收益的比例更小（2/32），但杠杆效率更高（用 2 ETH 撬动 32 ETH 的验证）
- **风险**：如果被 Slashing，2 ETH 节点只损失 2 ETH（你质押的部分），其余 30 ETH 来自保险池
- **门槛**：2 ETH（$6,000）vs 32 ETH（$96,000），降低 94% 的资本要求

**Q3：pufETH 和 stETH 哪个更好？**
A：
- **stETH（Lido）**：
  - 优势：TVL 最大（$32B），流动性最好，DeFi 整合最广
  - 劣势：10% 协议费，中心化（白名单节点），无 EigenLayer 集成
- **pufETH（Puffer）**：
  - 优势：5% 协议费，EigenLayer 集成，Slashing 保护，去中心化
  - 劣势：TVL 较小（$150M），流动性较差，DeFi 整合较少
- **选择**：如果追求流动性和稳定性，选 stETH；如果追求高收益和去中心化，选 pufETH。

**Q4：运行 Puffer 验证节点需要多少技术能力？**
A：
- **基础要求**：熟悉 Linux 命令行、Docker、基本网络知识
- **学习时间**：如果完全新手，需要 2-4 周学习
- **维护时间**：每周 1-2 小时（检查日志、更新软件）
- **建议**：先在测试网练习 1-2 周，熟悉流程后再上主网

**Q5：pufETH 可以在哪些 DeFi 协议中使用？**
A：目前支持：
- **DEX**：Curve、Uniswap V3、Balancer
- **收益**：Pendle（PT/YT 交易）
- **计划中**：Aave V3（抵押借贷）、Morpho、Yearn
- Puffer 团队正在积极拓展 DeFi 整合

**Q6：如果 Puffer 协议出问题，我的资金会丢失吗？**
A：
- Puffer 已经过 5 次独立审计
- 资金存储在以太坊信标链和 EigenLayer 合约中，Puffer 无法直接访问
- 即使 Puffer 团队消失，你仍可以通过信标链提款流程取回资金（需要 7 天）
- 风险主要是智能合约漏洞，而非团队作恶

**Q7：pufETH 的赎回队列会像 stETH 那样拥堵吗？**
A：
- 目前 pufETH 的赎回队列很短（<24 小时）
- 即使在市场恐慌时期，预计最长 7-14 天
- Puffer 的 TVL 较小，赎回压力小于 Lido
- 如果急需退出，可以在 Curve 上卖出（可能有小幅折价）

**Q8：我应该选择运行节点还是只提供流动性？**
A：
- **只提供流动性**：适合大多数用户，简单、省心、风险低
- **运行节点**：适合：
  - 有技术能力和兴趣
  - 追求更高的积分权重（2x）
  - 支持去中心化（成为验证者）
  - 长期参与（节点收益需要时间抵消成本）

**Q9：Puffer Points 什么时候能兑换成代币？**
A：Puffer 官方尚未公布代币发行计划。根据社区推测，可能在 2024 Q3-Q4。积分系统是为未来空投做准备，早期用户享受更高权重。

**Q10：pufETH 会像 ezETH 一样大幅折价吗？**
A：
- pufETH 的折价风险低于 ezETH
- 原因：
  1. Puffer 有更强的 Slashing 保护（Secure-Signer）
  2. 历史上 pufETH 折价很少超过 1%
  3. 套利机制更高效（因为 TVL 较小，套利者更活跃）
- 如果折价 >2%，通常会在 24-48 小时内恢复

## 进阶技巧

**技巧 1：利用折价时机套利**

当 pufETH 在 Curve 或 Uniswap 上折价时（如 1 pufETH = 0.985 ETH）：
1. 在 DEX 上用 ETH 购买折价的 pufETH
2. 在 Puffer 官网按 1:1 赎回（需等待 7 天）
3. 获得 1.5% 的无风险套利收益

案例：
- 投入 10 ETH，在 Curve 买入 10.15 pufETH（折价 1.5%）
- 7 天后赎回，获得 10.15 ETH
- 净收益：0.15 ETH（1.5%）
- 年化（假设每月套利一次）：约 18% APR

风险：
- 等待期间 ETH 价格波动
- 折价可能继续扩大（但长期会恢复）
- Gas 费用（买入 + 赎回）约 $30-50

**技巧 2：组合 Puffer + Pendle 锁定未来收益**

策略：
1. 在 Puffer 存入 10 ETH，获得 pufETH
2. 在 Pendle 将 pufETH 分拆为 PT-pufETH（本金）和 YT-pufETH（收益）
3. 卖出 YT-pufETH，提前兑现未来 1 年的收益（约 0.8 ETH）
4. 持有 PT-pufETH 到期，1:1 兑换回 10 pufETH

结果：
- 立即获得 0.8 ETH 现金流
- 1 年后仍然拥有 10 pufETH
- 实现了"提前消费未来收益"的效果

适合：
- 需要当前现金流的用户
- 看跌未来收益率（认为 APR 会下降）

**技巧 3：节点运营者优化 MEV 收益**

Puffer 节点可以选择连接到不同的 MEV Relay，优化收益：

推荐 Relay 组合：
1. **Flashbots**（最大，最稳定）
2. **BloXroute**（高 MEV，但审查）
3. **Ultra Sound**（无审查，中等 MEV）

配置：
- 在 Secure-Signer 配置中添加多个 Relay
- Puffer 会自动选择出价最高的 Relay
- 平均每个区块提案获得 0.05-0.3 ETH 的 MEV 奖励

优化：
- 每月评估不同 Relay 的表现
- 根据网络状况动态调整
- 避免使用有争议的 Relay（可能导致社区反感）

**技巧 4：跨链套利（L2）**

Puffer 在某些 L2 上也有部署，价格可能与主网不同：

监控：
- 主网 pufETH 价格
- Arbitrum pufETH 价格
- Optimism pufETH 价格

套利机会：
- 如果 Arbitrum 上 pufETH 溢价（如 1.01 ETH）
- 在主网铸造 pufETH（1:1）
- 桥接到 Arbitrum 卖出（1.01:1）
- 获得 1% 套利收益

风险：
- 跨链桥手续费（0.1-0.3%）
- 桥接时间（10-30 分钟）
- 价格可能在桥接期间变化

## 总结

**Puffer Finance 的核心优势**
- ✅ 最强的 Slashing 保护（Secure-Signer 技术）
- ✅ 降低验证节点门槛（2 ETH vs 32 ETH）
- ✅ 真正的去中心化（任何人可以运行节点）
- ✅ 较低的协议费用（5% vs Lido 的 10%）
- ✅ EigenLayer 原生集成（双重收益）
- ✅ 抗 MEV 保护（安全提取 MEV）

**适合人群**
- 持有 ETH 并追求高收益
- 看好 EigenLayer 再质押赛道
- 注重安全和去中心化
- 愿意接受相对较小的 TVL（流动性稍差）
- 技术用户（如果运行节点）

**推荐策略**
1. **保守型**：只提供流动性，持有 pufETH（6-13% APR）
2. **平衡型**：提供流动性 + Curve LP（9-20% APR）
3. **激进型**：运行验证节点 + Pendle 策略（12-25% APR）

**最后建议**
- 从小额开始测试（1-2 ETH）
- 如果运行节点，先在测试网练习
- 监控 pufETH/ETH 锚定情况
- 关注 Puffer 社区的最新发展
- 平衡 Puffer 和其他 LRT（分散风险）
- 长期持有，享受积分和空投
  `,
  steps: [
    {
      order_index: 1,
      title: '准备钱包和资产（15 分钟）',
      description: `
1. 准备支持以太坊的钱包（MetaMask 或硬件钱包）
2. 确保有至少 1 ETH（流动性提供）或 2 ETH（运行节点）
3. 准备额外 0.02 ETH 用于 Gas 费用
4. 访问 Puffer 官网（https://www.puffer.fi）了解基本信息
5. 阅读文档和审计报告，了解风险

**决策点**：
- [ ] 我是要提供流动性（简单），还是运行验证节点（高级）？
- [ ] 我了解 Puffer 的 Secure-Signer 和 Slashing 保护机制
- [ ] 我知道 pufETH 的赎回需要 7 天解锁期
      `
    },
    {
      order_index: 2,
      title: '存入资产获得 pufETH（流动性提供者，30 分钟）',
      description: `
1. 访问 https://app.puffer.fi
2. 连接钱包，确认网络为 Ethereum Mainnet
3. 点击 "Liquid Staking" 标签
4. 选择存款资产类型（ETH、stETH 或 wstETH）
5. 输入金额（建议首次 0.5-1 ETH 测试）
6. 查看兑换比例和预期 APR
7. 如果存入 LST，先点击 "Approve"（Gas 约 $5-10）
8. 点击 "Deposit"，确认交易（Gas 约 $10-20）
9. 等待交易确认（约 30-90 秒）
10. 在钱包中确认收到 pufETH
    - pufETH 合约：0xD9A442856C234a39a81a089C06451EBAa4306a72
    - 如未显示，手动添加代币

**确认成功**：
- [ ] 钱包中有 pufETH 余额
- [ ] Puffer Dashboard 显示正确的存款金额
- [ ] 开始累积 Puffer Points 和 EigenLayer Points
      `
    },
    {
      order_index: 3,
      title: '设置验证节点（节点运营者，2-4 小时）',
      description: `
**仅适用于选择运行验证节点的高级用户**

1. **准备硬件**：
   - 本地：4 核 CPU、16 GB RAM、2 TB SSD、稳定网络
   - 云服务器：推荐 Hetzner、Contabo（$50-100/月）

2. **安装软件**：
   - 安装 Docker 和 Docker Compose
   - 下载 Puffer 官方节点配置：
     \`\`\`bash
     git clone https://github.com/PufferFinance/validator-setup
     cd validator-setup
     \`\`\`

3. **配置和同步**：
   - 编辑 .env 文件（设置钱包地址、网络等）
   - 启动节点：\`docker-compose up -d\`
   - 等待同步（执行层 6-24h，共识层 2-8h）

4. **在 Puffer 注册**：
   - 访问 https://app.puffer.fi/operators
   - 点击 "Register as Operator"
   - 质押 2 ETH
   - 生成并上传验证器密钥

5. **启动 Secure-Signer**：
   - 下载 Puffer Secure-Signer Docker 镜像
   - 配置并启动
   - 连接到共识层客户端

6. **监控激活**：
   - 等待验证器激活（12-24 小时）
   - 在 Beaconcha.in 查看验证器状态
   - 设置警报（离线、Slashing 等）

**成功标志**：
- [ ] 验证器状态：Active
- [ ] Puffer Dashboard 显示节点在线
- [ ] 开始提案区块和证明
      `
    },
    {
      order_index: 4,
      title: '监控收益和积分（持续）',
      description: `
**每日检查（5 分钟）**：
1. 访问 Puffer Dashboard（https://app.puffer.fi/dashboard）
2. 查看：
   - pufETH 余额和价值增长
   - Puffer Points 累积（每天应增加约等于你的 ETH 数量）
   - EigenLayer Points 累积（每小时应增加）
   - pufETH/ETH 汇率（应在 0.98-1.02）

3. 如果运行节点，额外检查：
   - 验证器状态：Active
   - 正常运行时间：>99%
   - 最近的提案和证明：成功
   - 系统资源：CPU、RAM、磁盘正常

**每周检查（15 分钟）**：
1. 计算实际 APR 并与预期对比
2. 查看 Puffer Twitter/Discord 的重要更新
3. 检查 pufETH 在 Curve 等 DEX 的价格（是否有套利机会）
4. 评估是否参与 DeFi 策略（如 Curve LP、Pendle）

**每月检查（30 分钟）**：
1. 全面评估收益和成本
2. 考虑是否调整策略（增加投入、退出部分、参与 DeFi）
3. 更新风险评估
4. 查看 Puffer 生态的新发展（新的 DeFi 整合、新功能）

**设置自动化**：
- 在 Beaconcha.in 设置验证器警报（如果运行节点）
- 在 DeBank/Zapper 添加钱包监控
- 加入 Puffer Discord 获取实时通知
      `
    },
    {
      order_index: 5,
      title: '优化和进阶策略（可选）',
      description: `
**策略 1：Curve 流动性挖矿**
- 准备 50% pufETH + 50% wstETH
- 在 Curve 的 pufETH/wstETH 池添加流动性
- 质押 LP 代币（Curve 或 Convex）
- 额外收益：9-21% APR

**策略 2：Pendle 收益交易**
- 将 pufETH 分拆为 PT-pufETH 和 YT-pufETH
- 买入 PT 锁定固定收益（保守）
- 或买入 YT 放大收益敞口（激进）

**策略 3：折价套利**
- 监控 pufETH 在 DEX 上的价格
- 当折价 >1% 时，在 DEX 买入
- 在官网按 1:1 赎回（需等 7 天）
- 获得无风险套利收益

**策略 4：节点运营优化**（仅节点运营者）
- 优化 MEV Relay 配置
- 监控和调整硬件性能
- 定期更新软件和配置
- 参与 Puffer 社区，学习最佳实践

**赎回流程**（如需退出）：
1. 在 Puffer App 点击 "Withdraw"
2. 输入要赎回的 pufETH 数量
3. 等待 7 天解锁期
4. Claim 赎回的 ETH

或者：
- 在 Curve/Uniswap 直接卖出 pufETH（即时，可能有折价）
- 在 Aave/Morpho 抵押 pufETH 借款（保留敞口）
      `
    }
  ],
  status: 'published'
};

// Strategy 9.4: Kelp DAO rsETH Strategy
const STRATEGY_9_4 = {
  title: 'Kelp DAO rsETH 策略 - 社区驱动的多链流动性再质押协议',
  slug: 'kelp-dao-rseth-strategy',
  summary: '通过 Kelp DAO 将 ETH 或多种 LST 转换为 rsETH（Restaked ETH），参与社区治理的流动性再质押协议，获得 EigenLayer 收益的同时享受 DAO 治理权和多链部署带来的额外机会。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 2,
  risk_level: 3,
  apy_min: 7,
  apy_max: 30,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 30,
  time_commitment: '初次设置 30 分钟，每周维护 20 分钟',
  time_commitment_minutes: 30,
  threshold_tech_level: 'beginner',
  content: `
## 什么是 Kelp DAO 和 rsETH

Kelp DAO 是一个社区驱动的流动性再质押协议，专注于提供去中心化、透明和多链的 EigenLayer 再质押解决方案。其核心产品 rsETH 是一个流动性再质押代币，代表用户在 Kelp + EigenLayer 中的份额。

### 核心特点

**1. 社区驱动和去中心化治理**

与大多数中心化团队运营的 LRT 不同，Kelp DAO 强调社区参与：
- 所有重大决策通过 DAO 投票
- rsETH 持有者可以参与治理
- 协议费用和 AVS 选择由社区决定
- 代码完全开源，接受社区审计

**2. 多种 LST 支持**

Kelp DAO 支持多种 LST 作为存款资产：
- stETH（Lido）
- rETH（Rocket Pool）
- cbETH（Coinbase）
- sfrxETH（Frax）
- ETHx（Stader）
- wBETH（Binance）
- osETH（Stakewise）

优势：
- 用户可以使用已有的 LST 直接参与
- 分散风险（不依赖单一 LST 协议）
- 套利机会（不同 LST 的兑换率差异）

**3. 多链部署**

Kelp DAO 不仅在以太坊主网，还在多个 L2 和侧链部署：
- Ethereum Mainnet
- Arbitrum
- Optimism
- Base
- Blast
- Manta Pacific

好处：
- 低 Gas 费用（L2 上操作）
- 跨链套利机会
- 接触不同生态的 DeFi 协议

**4. 零协议费用（早期策略）**

为了吸引早期用户，Kelp DAO 目前：
- 0% 协议费用（2024 年）
- 所有收益 100% 归用户
- 未来可能调整（通过 DAO 投票决定）

**5. 多重积分系统**

rsETH 持有者可以累积：
- Kelp Miles（Kelp DAO 积分）
- EigenLayer Points
- 各个 AVS 的积分
- 合作伙伴协议的积分（如 Pendle、Swell）

### 与其他 LRT 对比

| 指标 | Kelp DAO | Renzo | Ether.fi | Puffer |
|-----|----------|-------|----------|--------|
| rsETH | ezETH | eETH | pufETH |
| **治理** | DAO 治理 | 中心化团队 | 混合 | 中心化团队 |
| **协议费用** | 0%（暂时） | 10% | 5% | 5% |
| **支持 LST** | 7+ 种 | 3 种 | 1 种（原生） | 3 种 |
| **多链部署** | 6 条链 | 4 条链 | 2 条链 | 1 条链 |
| **TVL** | $200M | $1.2B | $800M | $150M |
| **DeFi 整合** | 中等 | 高 | 高 | 低 |
| **推荐度** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

Kelp DAO 的独特优势：
- ✅ 真正的社区治理和透明度
- ✅ 零协议费用（早期）
- ✅ 支持最多种类的 LST
- ✅ 多链部署（更多机会）
- ❌ TVL 相对较小（流动性稍差）
- ❌ 团队和资金实力不如 Renzo、Ether.fi

### 收益来源

**1. 基础 LST 质押收益（3-4% APR）**
- 如果存入 stETH，继承 Lido 的质押收益
- 如果存入 rETH，继承 Rocket Pool 的质押收益
- 不同 LST 的收益略有差异

**2. EigenLayer 再质押奖励（4-12% APR）**
- Kelp DAO 参与多个 AVS
- 包括：EigenDA、Espresso、Omni、Lagrange 等
- AVS 组合由 DAO 投票决定

**3. Kelp Miles（KELP 积分）**
- 每持有 1 rsETH 每天累积 Kelp Miles
- 积分可能未来兑换为 $KELP 代币
- 早期用户享受 1.5-2x 积分加成

**4. EigenLayer 积分**
- 所有 rsETH 持有者累积 EigenLayer Points
- 积分权重：1.0x（与原生质押相同）

**5. 合作伙伴积分**
- Manta Pacific：额外的 Manta 生态积分
- Blast：Blast Gold 和 Blast Points
- 其他合作链的积分奖励

**6. DeFi 额外收益（5-20% APR）**
- 在 Curve、Balancer 提供 rsETH 流动性
- 在 Pendle 交易 rsETH 收益
- 在借贷协议中使用 rsETH

**总收益潜力**
- 基础持有 rsETH：7-16% APR
- 配合 DeFi 策略：12-25% APR
- 多链套利和积分：15-30% APR

## 实操步骤

### Step 1: 准备钱包和 LST

**支持的钱包**
- MetaMask（最常用）
- Rabby Wallet（推荐，多链支持好）
- Coinbase Wallet
- WalletConnect 兼容的所有钱包

**准备 LST**

如果你已经有 LST（stETH、rETH 等），可以直接使用。

如果只有 ETH，可以先兑换为 LST：

1. **获得 stETH（最大流动性）**
   - 访问 https://lido.fi
   - 存入 ETH，1:1 获得 stETH
   - 实时到账，无需等待

2. **获得 rETH（最去中心化）**
   - 访问 https://stake.rocketpool.net
   - 存入 ETH，获得 rETH
   - 汇率略低于 1:1（因为 rETH 包含累积的奖励）
   - 例如：1 ETH = 0.95 rETH

3. **获得其他 LST**
   - cbETH：通过 Coinbase 交易所
   - sfrxETH：通过 Frax Finance
   - ETHx：通过 Stader

**选择 LST 的考虑因素**

| LST | 优势 | 劣势 | 推荐度 |
|-----|------|------|--------|
| stETH | 最大流动性，DeFi 整合最好 | 10% 协议费，中心化 | ⭐⭐⭐⭐⭐ |
| rETH | 去中心化，安全性高 | 流动性较差，溢价风险 | ⭐⭐⭐⭐ |
| cbETH | CEX 用户方便，流动性好 | 中心化，依赖 Coinbase | ⭐⭐⭐ |
| sfrxETH | 高收益（包含 Frax 奖励） | 流动性一般，复杂度高 | ⭐⭐⭐⭐ |
| ETHx | Stader 生态，多链支持 | TVL 较小，知名度低 | ⭐⭐⭐ |

**建议**：
- 新手：选择 stETH（流动性最好，最简单）
- 去中心化爱好者：选择 rETH
- 追求高收益：选择 sfrxETH
- 多样化：分散到 2-3 种 LST

### Step 2: 在 Kelp DAO 存入 LST 获得 rsETH

**主网操作（以太坊）**

1. **访问 Kelp DAO App**
   - 打开 https://app.kelpdao.xyz
   - 确认 URL 正确（防止钓鱼）
   - 连接钱包

2. **选择存款资产**
   - 点击 "Deposit" 标签
   - 从下拉菜单选择你的 LST（如 stETH）
   - 查看当前支持的所有 LST 和它们的兑换率

3. **输入金额**
   - 输入要存入的 LST 数量
   - 查看将收到的 rsETH 数量
   - 兑换比例：
     - 通常 1 LST ≈ 0.98-1.00 rsETH
     - rsETH 的内在价值会随着奖励累积而增长
   - 查看预期 APR

4. **授权和存款**
   - 点击 "Approve"（首次需要授权）
     - 授权 Kelp 合约访问你的 LST
     - Gas 费约 $3-10
   - 点击 "Deposit"
     - 确认交易详情
     - Gas 费约 $10-25（取决于网络拥堵）
   - 等待交易确认（约 30-90 秒）

5. **确认成功**
   - 在钱包中查看 rsETH 余额
     - rsETH 合约地址：0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7
     - 如未自动显示，手动添加代币
   - 在 Kelp Dashboard 查看：
     - rsETH 余额
     - Kelp Miles 累积
     - EigenLayer Points 累积
     - 历史 APR

**L2 操作（更低 Gas）**

Kelp DAO 在多个 L2 上部署，Gas 费用更低（<$1）：

1. **桥接资产到 L2**

   选项 A：直接在 L2 上获得 LST
   - 例如：在 Arbitrum 上使用 Lido
   - 在 L2 上质押 ETH 获得 stETH
   - 避免跨链桥手续费

   选项 B：从主网桥接 LST
   - 使用官方桥（如 Arbitrum Bridge）
   - 或使用聚合器（如 Bungee、Hop Protocol）
   - 桥接费用：0.1-0.5%
   - 桥接时间：10-30 分钟

2. **在 L2 上操作 Kelp**
   - 访问 Kelp App，切换网络到目标 L2
   - 操作流程与主网相同
   - Gas 费用：$0.5-3（远低于主网）

**推荐的 L2 选择**

| L2 | Gas 费用 | Kelp TVL | DeFi 生态 | 额外奖励 | 推荐度 |
|-----|---------|----------|-----------|---------|--------|
| Arbitrum | $0.5-2 | $50M | 丰富 | ARB 积分 | ⭐⭐⭐⭐⭐ |
| Optimism | $0.5-2 | $30M | 丰富 | OP 积分 | ⭐⭐⭐⭐ |
| Base | $0.3-1 | $25M | 增长快 | Base 生态 | ⭐⭐⭐⭐ |
| Blast | $0.5-2 | $40M | 激励多 | Blast Gold | ⭐⭐⭐⭐⭐ |
| Manta | $0.2-1 | $15M | 新兴 | Manta 积分 | ⭐⭐⭐ |

### Step 3: 监控收益和积分

**Kelp Dashboard**

访问 https://app.kelpdao.xyz/dashboard，查看：

1. **余额和价值**
   - Total rsETH：你的持仓
   - Underlying Value：当前价值（ETH）
   - 24h Change：日增长（通常 +0.02-0.05%）

2. **积分追踪**
   - Kelp Miles：每天累积
     - 计算：1 rsETH × 1 天 = 1 Kelp Mile（基础）
     - 早期用户加成：1.5-2x
     - 合作链加成：Blast、Manta 等额外加成
   - EigenLayer Points：每小时累积
   - AVS Points：各个 AVS 的积分
   - 合作伙伴积分：Pendle、Blast 等

3. **APR 历史**
   - 图表显示过去 7/30/90 天的 APR
   - 平均 APR
   - 收益来源拆解（LST、AVS、额外奖励）

4. **排行榜**
   - 查看你在所有用户中的积分排名
   - Top 100 用户可能有额外空投

**多链监控**

如果你在多条链上都有 rsETH：

1. **使用多链钱包**
   - Rabby Wallet：自动聚合所有链的余额
   - DeBank：Web 端多链资产追踪
   - Zapper：美观的 Dashboard

2. **Kelp App 切换网络**
   - 在 Kelp App 顶部切换网络
   - 查看每条链上的 rsETH 和积分
   - 对比不同链的 APR（可能有差异）

### Step 4: 使用 rsETH 在 DeFi 中获取额外收益

**策略 1：Curve/Balancer 流动性挖矿**

**Curve rsETH/wstETH 池（主网）**

- TVL：约 $10M
- APR 组成：
  - 交易手续费：1-3%
  - CRV 奖励：3-8%
  - Kelp 激励：5-10%（额外 Kelp Miles）
  - 总计：9-21% APR

操作：
1. 准备 50% rsETH + 50% wstETH
2. 访问 Curve，搜索 "rsETH"
3. 添加流动性到 rsETH/wstETH 池
4. 质押 LP 代币（Curve 或 Convex）

风险：
- 无常损失（如果 rsETH 和 wstETH 价格偏离）
- 池子流动性中等（大额可能有滑点）

**Balancer rsETH/ETH 池（Arbitrum）**

- TVL：约 $5M
- APR 组成：
  - 交易手续费：2-5%
  - BAL 奖励：4-10%
  - ARB 激励：3-8%
  - Kelp Miles 加成
  - 总计：12-28% APR

操作：
1. 桥接 rsETH 到 Arbitrum（或直接在 Arbitrum 铸造）
2. 访问 Balancer，找到 rsETH/ETH 池
3. 添加流动性（支持单边流动性）
4. 自动开始赚取奖励

优势：
- L2 上 Gas 费用极低（<$1）
- 支持单边流动性（只需 rsETH 或 ETH）
- ARB 和 Kelp 双重激励

**策略 2：Pendle 收益交易**

**Pendle rsETH 市场**

- 到期日：通常 3-6 个月滚动
- 市场规模：约 $3M
- 固定 APY（PT）：8-14%

**玩法 A：购买 PT-rsETH 锁定固定收益**

适合：保守型投资者，追求确定性

步骤：
1. 访问 https://app.pendle.finance
2. 搜索 "rsETH"
3. 选择一个到期日（如 2024-12-31）
4. 点击 "Buy PT"
5. 输入金额，查看固定 APY（如 12%）
6. 确认交易
7. 持有到期或提前在二级市场卖出

收益：
- 假设固定 APY 12%，投入 10 ETH
- 到期收到：10 × 1.12 = 11.2 rsETH
- 净收益：1.2 rsETH（12% APR）
- 无论市场如何波动，收益确定

**玩法 B：购买 YT-rsETH 放大收益**

适合：激进型投资者，看涨收益率

步骤：
1. 在 Pendle 选择 rsETH 市场
2. 点击 "Buy YT"
3. 查看隐含 APY（如 Underlying 14%，YT 35%）
4. 购买 YT-rsETH
5. 持有到期或在二级市场交易

收益：
- YT 是杠杆化的收益敞口
- 如果实际 APY 高于市场预期，YT 大幅升值
- 如果实际 APY 低于预期，YT 贬值
- 风险和收益都被放大

**策略 3：Blast 上的多重激励**

Blast 是一个专注于收益的 L2，与 Kelp DAO 深度合作。

**Blast 上的 rsETH 优势**

- 自动复利：Blast 原生支持 ETH 和稳定币收益
- Blast Gold：持有 rsETH 赚取 Blast Gold（可兑换 BLAST 代币）
- Blast Points：Kelp 用户额外的 Blast 积分
- 多重积分：Kelp Miles + EigenLayer Points + Blast Gold + Blast Points

**操作**

1. **桥接到 Blast**
   - 访问 https://blast.io/bridge
   - 从主网桥接 ETH 或 LST 到 Blast
   - 桥接时间：约 15 分钟
   - 费用：约 0.2-0.5%

2. **在 Blast 上铸造 rsETH**
   - 访问 Kelp App，切换网络到 Blast
   - 存入 ETH 或 LST，获得 rsETH
   - Gas 费用：<$1

3. **参与 Blast DeFi**
   - **Thruster**（Blast 上的 Uniswap）：
     - 提供 rsETH/ETH 流动性
     - 赚取交易手续费 + THRUST 代币 + Blast Gold
   - **Juice Finance**（借贷）：
     - 存入 rsETH 作为抵押品
     - 借出稳定币，赚取 Blast Points
   - **Particle**（衍生品）：
     - 使用 rsETH 作为保证金
     - 交易 Perps，赚取额外收益

**收益叠加**

假设在 Blast 上持有 10 rsETH 并提供流动性：
- rsETH 基础收益：7-15% APR
- Thruster LP 奖励：5-12% APR
- Blast Gold 价值：估计 5-20% APR（不确定）
- Kelp Miles 加成（Blast 2x）：相当于主网的 2 倍积分
- **总收益潜力：17-47% APR**

风险：
- Blast 是新 L2，智能合约风险较高
- Blast Gold 的未来价值不确定
- 跨链桥风险

**策略 4：Manta Pacific 上的隐私增强收益**

Manta Pacific 是一个专注于隐私的 L2，也与 Kelp 合作。

**Manta 上的 rsETH 优势**

- Manta Points：额外的 Manta 生态积分
- 隐私功能：使用 zkSBT 保护你的资产隐私
- 低 Gas：<$0.5/交易
- 新兴生态：早期参与者奖励多

**操作**

1. 桥接到 Manta Pacific（通过官方桥或 Bungee）
2. 在 Kelp App 上铸造 rsETH
3. 在 Manta DeFi 生态中使用：
   - **Aperture**（流动性管理）：自动化 LP 策略
   - **LayerBank**（借贷）：借贷 + Manta Points

### Step 5: 参与 Kelp DAO 治理（可选）

**为什么参与治理**

- 影响协议决策（AVS 选择、费用调整）
- 获得治理奖励（KELP 代币空投可能优先分配给活跃治理者）
- 学习 DAO 运作，积累经验

**如何参与**

1. **加入社区**
   - Discord：https://discord.gg/kelpdao
   - Twitter：@KelpDAO
   - Governance Forum：https://forum.kelpdao.xyz

2. **阅读提案**
   - 访问治理论坛
   - 阅读活跃的提案（KIP - Kelp Improvement Proposals）
   - 理解提案的背景和影响

3. **投票**
   - 使用 Snapshot（https://snapshot.org/#/kelpdao.eth）
   - 投票权重取决于你的 rsETH 持有量
   - 每个提案通常有 3-7 天的投票期

4. **提出提案**
   - 如果你有想法，可以在论坛发起讨论
   - 经过社区讨论后，正式提交 KIP
   - 如果通过，你的提案会被实施

**近期重要提案示例**

- KIP-01：选择新的 AVS 加入（Lagrange）
- KIP-02：调整协议费用（从 0% 到 5%，被否决）
- KIP-03：在 Base 上部署 Kelp DAO（通过）
- KIP-04：与 Pendle 合作，提供额外激励（通过）

### Step 6: 赎回 rsETH（如果需要退出）

**方式 1：官网赎回（无滑点，需等待）**

1. **发起赎回**
   - 访问 Kelp App，点击 "Withdraw"
   - 选择要赎回的 rsETH 数量
   - 选择接收的资产类型（ETH 或原始 LST）
   - 查看预计等待时间（通常 7-14 天）
   - 确认交易（Gas 约 $5-15）

2. **等待解锁期**
   - 主网：7-14 天（取决于 EigenLayer 队列）
   - L2：可能更短（3-7 天）
   - 可以在 Dashboard 查看赎回进度

3. **Claim 资产**
   - 解锁期结束后，回到 Kelp App
   - 点击 "Claim" 按钮
   - 确认交易（Gas 约 $3-10）
   - 资产到达你的钱包

**方式 2：DEX 上卖出（即时，可能有滑点）**

如果不想等待，可以在 DEX 上直接卖出 rsETH：

主要交易对：
- **Curve rsETH/wstETH**（主网，流动性最好）
  - TVL：$10M
  - 滑点（<10 rsETH）：0.1-0.5%
  - 滑点（10-50 rsETH）：0.5-2%
- **Balancer rsETH/ETH**（Arbitrum，低 Gas）
  - TVL：$5M
  - 滑点：0.3-1%
- **Uniswap V3 rsETH/WETH**（多链）
  - 流动性一般
  - 滑点可能较高：1-3%

步骤：
1. 选择流动性最好的池子（通常是 Curve）
2. 连接钱包，选择 Swap
3. From: rsETH，To: ETH（或 wstETH）
4. 查看滑点和最终收到的数量
5. 如果滑点可接受（<1%），执行交易
6. 即时到账

**方式 3：使用聚合器**

使用 DeFi 聚合器可能找到更好的价格：

推荐聚合器：
- **1inch**：自动寻找最优路径
- **CoW Swap**：MEV 保护，可能获得更好价格
- **Bungee**：跨链聚合器，支持同时卖出并桥接

步骤：
1. 访问聚合器（如 1inch）
2. 输入 rsETH → ETH
3. 比较聚合器的报价和 Curve 的报价
4. 选择最优价格
5. 执行交易

**快速退出对比**

假设要卖出 10 rsETH（价值 10.2 ETH）：

| 方式 | 收到 ETH | 时间 | Gas 费用 | 总成本 |
|-----|---------|------|---------|--------|
| 官网赎回 | 10.20 | 7-14 天 | $15 | $15 (0.15%) |
| Curve 卖出 | 10.12 | 即时 | $20 | $95 (0.93%) |
| 1inch | 10.15 | 即时 | $25 | $75 (0.74%) |
| CoW Swap | 10.16 | 5-10 分钟 | $15 | $55 (0.54%) |

建议：
- 如果不着急：使用官网赎回（成本最低）
- 如果急需流动性：使用 CoW Swap 或 1inch
- 大额（>50 ETH）：分批卖出或使用 OTC

## 收益计算实例

### 案例 1：主网单纯持有 rsETH（10 ETH）

**初始投入**
- 10 stETH（约 $30,000）
- 策略：只持有 rsETH，不参与 DeFi

**年化收益**

1. **stETH 基础收益**
   - APR：3.5%
   - 年收益：10 × 3.5% = 0.35 ETH（$1,050）

2. **EigenLayer AVS 奖励**
   - Kelp 参与的 AVS 平均 APR：8%
   - 年收益：10 × 8% = 0.8 ETH（$2,400）

3. **协议费用**
   - Kelp 当前 0% 费用
   - 扣除：$0

4. **净收益**
   - 0.35 + 0.8 = 1.15 ETH（$3,450）
   - **APR：11.5%**

5. **积分价值（假设）**
   - Kelp Miles：10 × 365 = 3,650 Miles
   - 假设 1 Mile = $1（未来 KELP 代币）：$3,650
   - EigenLayer Points：10 × 24 × 365 = 87,600 点
   - 假设 1 点 = $0.10：$8,760
   - 潜在空投：$12,410

**总收益**
- 确定收益：$3,450（11.5% APR）
- 潜在空投：$12,410（41.4%）
- **总计：$15,860（52.9%）**

**成本**
- Gas（存入）：$25
- Gas（监控）：$30/年
- 年总成本：$55

**净收益**
- 保守（不含空投）：$3,450 - $55 = $3,395（11.3% APR）
- 乐观（含空投）：$15,860 - $55 = $15,805（52.7%）

### 案例 2：Blast 上多重激励策略（10 ETH）

**初始投入**
- 10 ETH 桥接到 Blast
- 策略：铸造 rsETH + Thruster LP + 获取 Blast Gold

**年化收益**

1. **rsETH 基础收益**
   - ETH 质押：3.5% APR = 0.35 ETH
   - EigenLayer AVS：8% APR = 0.8 ETH
   - 小计：1.15 ETH（$3,450）

2. **Thruster LP 奖励**
   - 提供 5 rsETH + 5 ETH 流动性
   - 交易手续费：2% APR = 0.2 ETH（$600）
   - THRUST 代币：6% APR = 0.6 ETH（$1,800）
   - 小计：0.8 ETH（$2,400）

3. **Blast Gold**
   - 持有 rsETH 在 Blast：每 ETH 每天 10 Gold
   - 年累积：10 × 10 × 365 = 36,500 Gold
   - 假设 1 Gold = $0.30（BLAST 代币）：$10,950

4. **Kelp Miles 加成**
   - Blast 上 Kelp Miles 权重 2x
   - 累积：10 × 365 × 2 = 7,300 Miles
   - 假设 1 Mile = $1：$7,300

5. **EigenLayer Points**
   - 与主网相同：87,600 点 = $8,760

**总收益**
- 确定收益：$3,450 + $2,400 = $5,850（19.5% APR）
- 潜在空投：$10,950 + $7,300 + $8,760 = $27,010（90% APR）
- **总计：$32,860（109.5%）**

**成本**
- 桥接到 Blast：0.3% = $90
- Gas（Blast 上）：$10/年（极低）
- 年总成本：$100

**净收益**
- 保守（不含空投）：$5,850 - $100 = $5,750（19.2% APR）
- 乐观（含空投）：$32,860 - $100 = $32,760（109.2%）

**风险提示**：
- Blast Gold 价值高度不确定
- Blast 是新 L2，合约风险较高
- 实际收益可能远低于乐观估计

### 案例 3：多链分散策略（30 ETH）

**资产配置**
- 10 ETH：主网（Curve LP）
- 10 ETH：Arbitrum（Balancer LP）
- 10 ETH：Blast（Thruster LP）

**年化收益**

1. **主网 Curve LP**
   - rsETH 基础：11.5% = 1.15 ETH
   - Curve LP：10% = 1.0 ETH
   - 小计：2.15 ETH（$6,450）

2. **Arbitrum Balancer LP**
   - rsETH 基础：11.5% = 1.15 ETH
   - Balancer LP：15% = 1.5 ETH
   - ARB 激励：5% = 0.5 ETH
   - 小计：3.15 ETH（$9,450）

3. **Blast Thruster LP**
   - rsETH 基础：11.5% = 1.15 ETH
   - Thruster LP：8% = 0.8 ETH
   - Blast Gold：估计 10% = 1.0 ETH（不确定）
   - 小计：2.95 ETH（$8,850）

**总收益**
- 确定收益：$6,450 + $9,450 + $8,850 - $3,000（Blast Gold不确定） = $21,750（24.2% APR）
- 潜在空投（3 条链的积分）：约 $40,000（44.4%）
- **总计：$61,750（68.6%）**

**成本**
- 跨链桥接：$200
- Gas（各链）：$150/年
- 年总成本：$350

**净收益**
- 保守：$21,750 - $350 = $21,400（23.8% APR）
- 乐观：$61,750 - $350 = $61,400（68.2%）

**优势**：
- 分散风险（不同 L2 的智能合约风险）
- 多重积分（主网 + Arbitrum + Blast）
- 流动性分散（一条链出问题不影响全部）

## 风险管理

### Kelp DAO 特有风险

**1. DAO 治理风险（严重性：中低）**

风险描述：
- 社区投票可能做出不利决策
- 例如：选择不安全的 AVS、调高协议费用
- 治理攻击：大户操纵投票

历史：
- Kelp DAO 治理相对活跃和透明
- 目前无重大治理争议
- 核心团队仍有较大影响力（过渡期）

缓解措施：
- ✅ 参与治理，投票反对不利提案
- ✅ 关注治理论坛，提前了解提案
- ✅ 如果治理方向不符合你的利益，考虑退出
- ✅ 支持引入治理延迟（Timelock）和多签

**2. 多 LST 策略的复杂风险（严重性：中）**

风险描述：
- Kelp 接受多种 LST，如果某个 LST 出问题（如脱锚、被黑）
- 可能影响整个 rsETH 的价值
- 不同 LST 的兑换率可能偏离，导致套利损失

案例：
- 假设 Kelp 接受的某个小众 LST 严重脱锚（如 -20%）
- 如果该 LST 在 Kelp 池中占比 10%
- rsETH 价值可能下降 2%（10% × 20%）

缓解措施：
- ✅ 查看 Kelp 的 LST 组合（在 Dashboard 中）
- ✅ 优先选择主流 LST（stETH、rETH）
- ✅ 关注 Kelp 的 LST 去除机制（治理投票）
- ✅ 监控各个 LST 的健康状况

**3. 多链部署的智能合约风险（严重性：中高）**

风险描述：
- Kelp 在多条链上部署，每条链的合约都有风险
- 特别是新 L2（如 Blast、Manta），审计可能不如主网充分
- 跨链桥风险

历史：
- Kelp 主网合约经过 4 次审计
- L2 合约审计较少（1-2 次）
- 目前无重大安全事故

缓解措施：
- ✅ 主要资金放在主网（最安全）
- ✅ L2 上只投入小额资金测试
- ✅ 选择成熟的 L2（Arbitrum、Optimism）而非新 L2
- ✅ 使用官方桥（避免第三方桥风险）
- ✅ 关注 Kelp 的安全公告

**4. 零协议费不可持续风险（严重性：低）**

风险描述：
- Kelp 当前 0% 协议费是早期吸引用户的策略
- 未来可能调整到 5-10%（需要 DAO 投票）
- 影响实际收益率

可能性：
- 中高（协议需要可持续的收入）
- 预计 2024 Q3-Q4 可能提出费用提案

缓解措施：
- ✅ 享受当前的 0% 费用红利
- ✅ 关注治理提案，如果费用调整提案出现，积极参与讨论
- ✅ 如果费用上升到不可接受的水平（如 15%），考虑退出
- ✅ 对比其他 LRT 的费用，做出理性选择

### 监控清单

**每日检查（3 分钟）**
- [ ] rsETH/ETH 汇率正常（0.98-1.02）
- [ ] Kelp Dashboard 无异常警告
- [ ] 主要使用的 LST（如 stETH）锚定正常

**每周检查（15 分钟）**
- [ ] Kelp Miles 和 EigenLayer Points 正常累积
- [ ] APR 是否符合预期
- [ ] 查看 Kelp Discord/Twitter 的重要更新
- [ ] 如果参与 DeFi，检查 LP 表现（无常损失、奖励）
- [ ] 多链用户：检查各链的余额和积分

**每月检查（30 分钟）**
- [ ] 计算实际收益并对比预期
- [ ] 查看治理论坛的活跃提案
- [ ] 评估是否需要调整策略（增加投入、退出部分、切换链）
- [ ] 更新风险评估（新的 LST、新的 AVS、新的合作链）
- [ ] 查看 Kelp 生态的新发展（新的 DeFi 整合、新功能）

### 紧急退出

**场景 1：某个 LST 严重脱锚或被黑**
1. 查看该 LST 在 Kelp 池中的占比
2. 如果占比小（<10%），影响有限，可以继续持有
3. 如果占比大（>20%），考虑在 DEX 上卖出 rsETH（接受折价）
4. 关注 Kelp DAO 治理，投票支持移除该 LST
5. 等待情况稳定后再决定是否重新进入

**场景 2：某条 L2 出现安全问题**
1. 如果你在该 L2 上有 rsETH，立即停止新投入
2. 如果资金未被冻结，尽快桥接回主网
3. 在主网上赎回或持有（根据情况）
4. 关注 Kelp 和 L2 官方的事故报告

**场景 3：Kelp DAO 治理出现恶意提案**
1. 在论坛和 Discord 发声反对
2. 投票反对该提案
3. 如果提案通过且严重损害你的利益，考虑退出
4. 加入社区讨论，寻求解决方案

## 常见问题

**Q1：Kelp DAO 和 Renzo 哪个更好？**
A：
- **Renzo**：TVL 更大（$1.2B），流动性更好，DeFi 整合更广，适合追求稳定和流动性
- **Kelp DAO**：0% 费用（暂时），DAO 治理，支持更多 LST，多链部署，适合追求高收益和去中心化
- 建议：可以两者都配置，分散风险

**Q2：我应该使用哪个 LST 在 Kelp 存款？**
A：
- **stETH**：流动性最好，DeFi 整合最广，推荐大多数用户
- **rETH**：最去中心化，安全性高，但流动性稍差
- **sfrxETH**：收益最高（包含 Frax 奖励），但复杂度高
- **其他 LST**：如果你已经持有，可以直接使用，避免兑换成本

**Q3：Kelp DAO 会发行代币吗？**
A：官方尚未公布，但 Kelp Miles 积分系统强烈暗示未来会有 $KELP 代币。早期用户和活跃治理者可能获得更多空投。

**Q4：我应该在主网还是 L2 上使用 Kelp？**
A：
- **主网**：安全性最高，流动性最好，适合大额资金（>10 ETH）
- **L2（Arbitrum、Optimism）**：Gas 费低，适合小额资金和频繁操作
- **Blast**：多重激励，但风险较高，适合风险承受能力强的用户
- 建议：分散到多条链，平衡收益和风险

**Q5：rsETH 的赎回队列会很长吗？**
A：目前 Kelp 的赎回队列很短（<7 天），因为 TVL 较小。即使在市场波动期，预计不会超过 14 天。如果着急，可以在 DEX 上卖出。

**Q6：参与 DAO 治理需要多少 rsETH？**
A：没有最低限制！任何数量的 rsETH 都可以投票。但投票权重与持有量成正比。持有 0.1 rsETH 和 100 rsETH 的用户投票权重差 1000 倍。

**Q7：Kelp DAO 的 0% 费用会持续多久？**
A：官方未公布。根据社区讨论，可能在 TVL 达到 $500M 或 2024 Q4 时提出费用调整提案。届时需要 DAO 投票决定。

**Q8：我可以同时持有 rsETH、ezETH 和 pufETH 吗？**
A：完全可以！分散到多个 LRT 协议可以：
- 分散智能合约风险
- 获得多个协议的积分和空投
- 对冲单一协议的治理风险
- 建议配置：40% ezETH（最大 TVL）+ 30% rsETH（高收益）+ 30% pufETH（安全性）

**Q9：Kelp DAO 在哪些 DeFi 协议中被支持？**
A：
- **DEX**：Curve、Balancer、Uniswap V3、Thruster（Blast）
- **收益**：Pendle、Convex
- **借贷**：计划与 Aave、Morpho 集成（2024 Q3）
- **多链**：每条 L2 上都有本地 DeFi 整合

**Q10：如果我在 Blast 上持有 rsETH，主网上的积分会丢失吗？**
A：不会！Kelp 的积分系统是跨链的：
- 主网 rsETH：1x Kelp Miles
- Blast rsETH：2x Kelp Miles（加成）
- EigenLayer Points：所有链的 rsETH 都计入
- 你可以在多条链上同时累积积分

## 总结

**Kelp DAO 的核心优势**
- ✅ 社区驱动的 DAO 治理（真正的去中心化）
- ✅ 零协议费用（2024 年）
- ✅ 支持最多种类的 LST（7+ 种）
- ✅ 多链部署（6 条链，更多机会）
- ✅ 多重积分系统（Kelp + EigenLayer + 合作伙伴）
- ✅ 透明和开源（社区可审计）

**适合人群**
- 持有各种 LST 并希望提高收益
- 追求高收益和低费用
- 支持去中心化和 DAO 治理
- 愿意在多条链上操作
- 早期参与者（享受积分加成）

**推荐策略**
1. **保守型**：主网持有 rsETH（7-15% APR）
2. **平衡型**：主网 50% + Arbitrum 50%，参与 Curve/Balancer LP（12-22% APR）
3. **激进型**：多链分散 + Blast 多重激励 + Pendle 策略（15-30% APR）

**最后建议**
- 从主网开始，小额测试（1-2 ETH）
- 逐步扩展到 L2，享受低 Gas 和多重激励
- 参与 DAO 治理，影响协议发展
- 监控积分累积，为未来空投做准备
- 分散到多个 LRT 协议，平衡风险
- 长期持有，享受复利和生态成长
  `,
  steps: [
    {
      order_index: 1,
      title: '准备钱包和 LST（20 分钟）',
      description: `
1. 准备支持多链的钱包（推荐 Rabby Wallet 或 MetaMask）
2. 决定使用哪种 LST：
   - stETH：流动性最好，推荐大多数用户
   - rETH：最去中心化
   - sfrxETH：收益最高
   - 其他：如果已持有，可直接使用

3. 如果只有 ETH，先兑换为 LST：
   - stETH：访问 lido.fi，1:1 兑换
   - rETH：访问 rocketpool.net
   - sfrxETH：访问 frax.finance

4. 准备 Gas 费：
   - 主网：0.02-0.05 ETH
   - L2：0.001-0.01 ETH

5. 决定使用哪条链：
   - 主网：最安全，大额资金
   - Arbitrum/Optimism：低 Gas，小额资金
   - Blast：多重激励，风险较高

**检查清单**：
- [ ] 钱包已备份
- [ ] 有足够的 LST 或 ETH
- [ ] 了解 Kelp DAO 的基本原理
- [ ] 决定了使用的链
      `
    },
    {
      order_index: 2,
      title: '存入 LST 获得 rsETH（30 分钟）',
      description: `
**主网操作**：
1. 访问 https://app.kelpdao.xyz
2. 连接钱包，确认网络为 Ethereum Mainnet
3. 点击 "Deposit"
4. 从下拉菜单选择你的 LST（如 stETH）
5. 输入金额（建议首次 0.5-1 ETH 测试）
6. 查看将收到的 rsETH 数量和预期 APR
7. 点击 "Approve"（首次需要，Gas 约 $5-10）
8. 点击 "Deposit"（Gas 约 $10-25）
9. 等待交易确认（30-90 秒）
10. 在钱包中确认收到 rsETH
    - rsETH 合约：0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7

**L2 操作**（以 Arbitrum 为例）：
1. 如果资产在主网，先桥接到 Arbitrum
   - 使用官方桥或 Bungee
   - 费用约 0.1-0.3%，时间 10-30 分钟
2. 访问 Kelp App，切换网络到 Arbitrum
3. 操作流程与主网相同
4. Gas 费用：<$2（远低于主网）

**Blast 操作**（多重激励）：
1. 桥接到 Blast（https://blast.io/bridge）
2. 在 Kelp App 切换到 Blast 网络
3. 存入 ETH 或 LST，获得 rsETH
4. 自动开始累积 Blast Gold 和 Kelp Miles（2x 加成）

**确认成功**：
- [ ] 钱包中有 rsETH 余额
- [ ] Kelp Dashboard 显示正确的存款
- [ ] 开始累积 Kelp Miles 和 EigenLayer Points
      `
    },
    {
      order_index: 3,
      title: '监控收益和积分（持续）',
      description: `
**每日快速检查（3 分钟）**：
1. 访问 Kelp Dashboard（https://app.kelpdao.xyz/dashboard）
2. 查看：
   - rsETH 余额和价值变化
   - Kelp Miles 累积（每天约等于你的 ETH 数量）
   - EigenLayer Points 累积
   - rsETH/ETH 汇率（应在 0.98-1.02）

3. 检查主要 LST 的健康状况：
   - stETH/ETH：应在 0.99-1.01
   - rETH/ETH：应在 1.05-1.10（rETH 包含累积奖励）

**每周详细检查（15 分钟）**：
1. 计算实际 APR：
   - 查看 rsETH 价值增长
   - 对比预期 APR
2. 查看 Kelp 社区更新：
   - Discord：https://discord.gg/kelpdao
   - Twitter：@KelpDAO
3. 检查 DeFi 机会：
   - Curve/Balancer 的 rsETH 池 APR
   - Pendle 的固定收益率
   - 新的合作伙伴激励

**每月全面评估（30 分钟）**：
1. 总收益计算和对比
2. 查看治理论坛的活跃提案
3. 评估策略调整：
   - 是否增加投入？
   - 是否参与 DeFi 策略？
   - 是否切换到其他链？
4. 更新风险评估

**多链用户额外检查**：
- 使用 DeBank 或 Zapper 聚合所有链的资产
- 对比不同链的 APR 和积分加成
- 考虑跨链再平衡
      `
    },
    {
      order_index: 4,
      title: 'DeFi 策略和收益优化（可选）',
      description: `
**策略 1：Curve/Balancer 流动性挖矿**
- 准备 50% rsETH + 50% wstETH/ETH
- 在 Curve（主网）或 Balancer（Arbitrum）添加流动性
- 质押 LP 代币赚取额外奖励
- 额外收益：9-21% APR

**策略 2：Pendle 收益交易**
- 将 rsETH 分拆为 PT 和 YT
- 买入 PT 锁定固定收益（8-14% APY）
- 或买入 YT 放大收益敞口（20-40% APY，高风险）

**策略 3：Blast 多重激励**
- 在 Blast 上持有 rsETH
- 参与 Thruster、Juice、Particle 等 DeFi
- 赚取 Blast Gold + THRUST + Kelp Miles（2x）
- 额外收益：10-25% APR

**策略 4：多链分散**
- 40% 主网（安全）
- 30% Arbitrum（低 Gas + ARB 激励）
- 30% Blast（多重激励）
- 平衡风险和收益

**套利策略**：
- 监控 rsETH 在不同 DEX 和链上的价格
- 当折价 >0.5% 时买入，官网赎回套利
- 跨链价格差异套利（主网 vs L2）
      `
    },
    {
      order_index: 5,
      title: '参与治理和社区（可选）',
      description: `
**为什么参与 DAO 治理**：
- 影响协议决策（AVS 选择、费用调整）
- 可能获得更多空投（活跃治理者奖励）
- 学习 DAO 运作，积累经验
- 保护自己的利益

**如何参与**：

1. **加入社区**：
   - Discord：https://discord.gg/kelpdao
   - Governance Forum：https://forum.kelpdao.xyz
   - Twitter：关注 @KelpDAO

2. **阅读和讨论提案**：
   - 每周查看论坛的新提案
   - 在 Discord 参与讨论
   - 提出你的问题和建议

3. **投票**：
   - 访问 Snapshot：https://snapshot.org/#/kelpdao.eth
   - 连接钱包（投票权重 = rsETH 持有量）
   - 对活跃提案投票

4. **提出提案**（如果你有想法）：
   - 在论坛发起讨论
   - 收集社区反馈
   - 正式提交 KIP（Kelp Improvement Proposal）

**近期重要提案示例**：
- 新 AVS 的加入
- 协议费用调整
- 新链部署
- DeFi 合作伙伴激励

**赎回流程**（如需退出）：

1. **官网赎回**（7-14 天）：
   - Kelp App → Withdraw
   - 选择 rsETH 数量和接收资产
   - 等待解锁期
   - Claim 资产

2. **DEX 卖出**（即时）：
   - Curve、Balancer、Uniswap
   - 可能有 0.3-2% 滑点
   - 使用聚合器（1inch、CoW Swap）获得最优价格

3. **部分赎回策略**：
   - 保留 50% rsETH 继续赚取收益和积分
   - 赎回 50% 降低风险或获得流动性
      `
    }
  ],
  status: 'published'
};

async function uploadStrategies() {
  try {
    console.log('开始上传策略到 Directus...\n');

    // Step 1: Login
    console.log('Step 1: 登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });

    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // Step 2: Upload strategies
    const strategies = [STRATEGY_9_3, STRATEGY_9_4];
    
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`Step ${i + 2}: 上传策略 "${strategy.title}"...`);
      
      const response = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✓ 策略 "${strategy.title}" 上传成功`);
      console.log(`  - ID: ${response.data.data.id}`);
      console.log(`  - Slug: ${response.data.data.slug}\n`);
    }

    console.log('========================================');
    console.log('✓ 所有策略上传完成！');
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

uploadStrategies();
