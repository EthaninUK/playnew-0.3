const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Ethereum质押完全指南：独立验证者vs流动性质押',
  slug: 'ethereum-staking-complete-guide',
  summary:
    'ETH质押全攻略：独立验证者搭建（Geth+Lighthouse，32 ETH门槛）、Rocket Pool（16 ETH半质押）、Lido流动性质押（任意金额）、收益对比（3-5% APR+MEV）、Slashing防范、硬件配置（$2K自建vs云服务器）、提款机制、监控工具，选择最适合你的质押方案。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 3,
  risk_level: 3,
  apy_min: 3,
  apy_max: 5,

  threshold_capital: '100-51,200 USD（Lido最低0.01 ETH，独立验证者32 ETH）',
  threshold_capital_min: 100,
  time_commitment: '独立验证者初始20-30小时+每周2小时维护，流动性质押5分钟一键完成',
  time_commitment_minutes: 120,
  threshold_tech_level: 'beginner',

  content: `> **适用人群**：持有ETH希望获得**被动质押收益**，从**小白一键质押**到**技术玩家独立验证者**的全覆盖指南
> **阅读时间**：≈ 20-25 分钟
> **关键词**：Ethereum Staking / Validator / Rocket Pool / Lido / stETH / Liquid Staking / Solo Staking / 32 ETH / Slashing / Withdrawal

---

## 🧭 快速决策

**我有多少ETH？**
- **<1 ETH** → Lido/Rocket Pool流动性质押（5分钟，获得stETH/rETH继续DeFi）
- **1-16 ETH** → Lido流动性质押 或 等待积累到16 ETH
- **16-31 ETH** → Rocket Pool（技术门槛中等，额外RPL奖励）
- **32+ ETH** → 独立验证者（最去中心化，技术门槛高）或 Lido托管质押

**我有技术能力吗？**
- **完全小白** → Lido（Coinbase/Binance界面点击即可）
- **会用MetaMask** → Rocket Pool网页质押
- **懂Linux/服务器** → 独立验证者（最大化收益+支持去中心化）

---

## 📊 三种质押方案对比

| 方案 | 最低金额 | 年化收益 | 流动性 | 技术门槛 | 去中心化 | 推荐度 |
|------|---------|---------|--------|---------|---------|--------|
| **独立验证者** | 32 ETH | 3.5-5%（含MEV） | ❌锁定 | ★★★★★ | ★★★★★ | ★★★★☆ |
| **Rocket Pool** | 16 ETH | 4-6%（含RPL奖励） | ✅rETH可交易 | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| **Lido** | 0.01 ETH | 3-4% | ✅stETH可交易 | ★☆☆☆☆ | ★★☆☆☆ | ★★★★☆ |
| **CEX质押** | 0.01 ETH | 2.5-3.5%（扣佣金） | ✅随时赎回 | ★☆☆☆☆ | ⭐无 | ★★★☆☆ |

---

## 🗂 目录
1. [Ethereum质押基础](#ethereum质押基础)
2. [方案1：Lido流动性质押（最简单）](#方案1lido流动性质押最简单)
3. [方案2：Rocket Pool半质押（16 ETH）](#方案2rocket-pool半质押16-eth)
4. [方案3：独立验证者（32 ETH）](#方案3独立验证者32-eth)
5. [收益计算与成本分析](#收益计算与成本分析)
6. [Slashing风险与防范](#slashing风险与防范)
7. [提款机制详解](#提款机制详解)
8. [常见问题FAQ](#常见问题faq)

---

## 💎 Ethereum质押基础

### 什么是ETH质押

**Ethereum于2022年9月完成The Merge**，从PoW（挖矿）转为PoS（质押）共识机制。

**核心原理**：
- 质押32 ETH成为验证者，参与验证区块
- 每个epoch（约6.4分钟）验证者需要证明（attest）区块
- 正确验证获得奖励，离线/错误验证被惩罚

**收益来源**：
1. **共识层奖励**：验证区块获得ETH增发奖励（约3% APR）
2. **执行层奖励**：交易手续费分成（约0.3-0.5% APR）
3. **MEV收益**（可选）：通过Flashbots捕获MEV（+0.5-2% APR）
4. **总收益**：3-5% APR（视网络状态和MEV而定）

---

### 质押的三种形式

#### Solo Staking（独立验证者）
- 自己运行节点，质押32 ETH
- 完全掌控，收益最高
- 技术门槛高，需要24/7在线

#### Pooled Staking（池质押）
- 多人凑够32 ETH组成验证者
- 降低门槛（Rocket Pool 16 ETH，Lido任意金额）
- 收取10-15%佣金，但提供流动性代币

#### Centralized Staking（中心化质押）
- 通过交易所（Coinbase/Binance/Kraken）质押
- 最简单，佣金15-25%
- 中心化风险，不推荐大额

---

## 🌊 方案1：Lido流动性质押（最简单）

### 什么是Lido

**Lido**是最大的流动性质押协议（TVL $20B+），用户质押ETH后获得stETH代币。

**核心优势**：
✅ **无最低限制**：0.01 ETH起（约$16）
✅ **流动性**：stETH可在Curve/Uniswap交易，或用于DeFi
✅ **自动复利**：stETH余额自动增长（无需手动领取奖励）
✅ **零技术门槛**：网页点击3次即可

**劣势**：
❌ **中心化**：Lido控制30%+ Ethereum质押（中心化风险）
❌ **智能合约风险**：虽经审计但非零风险
❌ **脱锚风险**：stETH价格可能偏离ETH（2022年曾脱锚至0.93 ETH）

---

### Lido质押教程（5分钟）

#### 步骤1：访问Lido官网
- 打开 https://lido.fi
- 点击"Stake Now"

#### 步骤2：连接钱包
- 点击"Connect Wallet"
- 选择MetaMask（或WalletConnect连接硬件钱包）
- 授权连接

#### 步骤3：质押ETH
- 输入质押金额（如1 ETH）
- 点击"Stake"
- MetaMask弹窗：Gas费预估约$5-$15（根据网络拥堵）
- 确认交易

#### 步骤4：接收stETH
- 交易确认后（1-2分钟），钱包自动收到stETH
- stETH数量：1 ETH → 1 stETH
- 每日stETH余额自动增长（约+0.01%/天）

#### 步骤5：使用stETH（可选）
- **持有不动**：余额自动增长（最简单）
- **Curve流动性池**：存入stETH-ETH池，赚取交易费+CRV奖励（+5-10% APR）
- **Aave借贷**：抵押stETH借出稳定币，循环杠杆（风险高）
- **卖出**：在Curve/1inch换回ETH（注意滑点）

---

### Lido收益优化技巧

#### 技巧1：Curve stETH-ETH池
- APR：5-10%（基础3.5% stETH收益 + 2-5% Curve交易费 + CRV奖励）
- 风险：无常损失（stETH价格波动时）

**操作**：
1. 访问 https://curve.fi/steth
2. 存入等量stETH和ETH（如0.5 stETH + 0.5 ETH）
3. 获得Curve LP代币
4. Stake LP代币到Convex Finance（额外+2% APR）

#### 技巧2：Aave循环借贷
- 原理：抵押stETH借出ETH → 再次质押 → 重复
- 收益：3.5%基础 × 2倍杠杆 = 7% APR
- 风险：清算风险（stETH脱锚时）

**示例**：
1. 质押10 ETH → 获得10 stETH
2. Aave抵押10 stETH，借出7 ETH（70% LTV）
3. 质押7 ETH → 获得7 stETH
4. 总敞口：17 stETH，本金10 ETH，杠杆1.7x

---

## 🚀 方案2：Rocket Pool半质押（16 ETH）

### 什么是Rocket Pool

**Rocket Pool**是去中心化质押池，允许用户用16 ETH运行"minipool"验证者。

**核心优势**：
✅ **降低门槛**：16 ETH（vs 32 ETH独立验证者）
✅ **额外收益**：赚取RPL代币奖励（+1-3% APR）
✅ **去中心化**：无中心化实体控制
✅ **流动性**：小额质押获得rETH（可交易）

**运营模式**：
- 节点运营者（Node Operator）：质押16 ETH + 1.6 ETH等值RPL
- 资金池提供者：质押任意ETH获得rETH
- 节点运营者赚取15%佣金 + RPL奖励

---

### Rocket Pool节点运营教程

#### 前置要求
- **资金**：16 ETH + 至少1.6 ETH等值RPL代币（约10% ETH抵押）
- **硬件**：同独立验证者（4核/16GB/2TB SSD）
- **技术**：Linux基础、会用命令行

#### 步骤1：安装Rocket Pool Smartnode

**使用Docker（推荐）**：
curl -L https://github.com/rocket-pool/smartnode-install/releases/latest/download/setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh

**选择配置**：
- 网络：Mainnet
- 执行客户端：Geth（或Nethermind）
- 共识客户端：Lighthouse（或Prysm）
- MEV-Boost：Yes（额外收益）

#### 步骤2：创建钱包
rocketpool wallet init

- 设置密码（妥善保管）
- **备份助记词**（手写，分散存储）

充值Gas费：
- 向钱包地址转入0.1 ETH（用于注册、存款等交易）

#### 步骤3：注册节点
rocketpool node register

- 设置时区（Timezone）
- 确认交易（Gas费约$10-$20）

#### 步骤4：质押RPL
购买RPL代币：
- 在Uniswap买入至少1.6 ETH等值RPL
- 转账到Rocket Pool节点钱包

质押RPL：
rocketpool node stake-rpl

- 输入RPL数量（建议10-20% ETH价值，最低10%）
- 确认交易

#### 步骤5：存款16 ETH
rocketpool node deposit

- 选择金额：16 ETH
- 确认交易（Gas费$20-$50）
- 等待24小时激活

#### 步骤6：监控与维护
查看节点状态：
rocketpool service status

查看收益：
rocketpool node rewards

领取奖励：
rocketpool claim-rewards

---

### Rocket Pool收益构成

**收益1：ETH质押奖励**
- 16 ETH质押，获得验证者全部奖励
- 匹配的16 ETH来自资金池，支付15%佣金
- 净收益：约85%独立验证者收益 ≈ 3% APR

**收益2：佣金**
- 从匹配的16 ETH收益中抽15%
- 年收益：16 ETH × 3.5% × 15% ≈ 0.08 ETH ≈ $130

**收益3：RPL奖励**
- 每28天分发一次
- 年化：+1-3% APR（视RPL质押率而定）

**总收益**：约4-6% APR（比独立验证者高，因为有RPL奖励）

---

## 🏆 方案3：独立验证者（32 ETH）

### 为什么选择独立验证者

**优势**：
✅ **收益最高**：无佣金，100%收益归自己
✅ **完全掌控**：密钥自己管理，无需信任第三方
✅ **支持去中心化**：运行独立节点是Ethereum安全的基石
✅ **MEV收益**：可选择MEV-Boost获得额外收益

**劣势**：
❌ **门槛高**：需32 ETH（约$50,000）+ 技术能力
❌ **运维成本**：硬件$2,000 + 电费$30/月
❌ **Slashing风险**：操作失误可能被罚没

---

### 独立验证者硬件配置

**推荐配置**：
- **CPU**：4核（Intel i5/AMD Ryzen 5）
- **RAM**：16GB（推荐32GB）
- **存储**：2TB NVMe SSD（必须SSD）
- **网络**：100Mbps光纤
- **UPS**：1000VA不间断电源（防断电Slashing）

**成本**：
- 自建：$1,500-$2,500（硬件）
- 云服务器：$40-$120/月（Hetzner/AWS）

---

### 独立验证者搭建（简化版）

#### 步骤1：服务器准备
安装Ubuntu 22.04，配置防火墙：
sudo ufw allow 22/tcp
sudo ufw allow 30303/tcp
sudo ufw allow 9000/tcp
sudo ufw enable

#### 步骤2：安装执行层（Geth）
sudo apt install geth -y
生成JWT secret：
openssl rand -hex 32 | sudo tee /var/lib/jwtsecret

启动Geth：
创建systemd服务，启动同步（需1-3天）

#### 步骤3：安装共识层（Lighthouse）
下载二进制文件，创建Beacon Node服务
使用checkpoint sync快速同步（10分钟）

#### 步骤4：生成验证者密钥
下载Staking Deposit CLI：
./deposit new-mnemonic --num_validators 1 --chain mainnet

**备份助记词**（手写，分散存储）

#### 步骤5：存款32 ETH
访问 https://launchpad.ethereum.org
上传deposit_data.json，连接MetaMask存款

#### 步骤6：导入密钥并启动
lighthouse account validator import --directory validator_keys
启动Validator Client，等待激活（8-24小时）

---

### 监控与告警

**必备工具**：
1. **Beaconcha.in**：注册并添加验证者，设置离线告警
2. **Prometheus + Grafana**：本地监控Dashboard
3. **UPS**：防断电Slashing

**关键指标**：
- 在线率：>99%
- 错过证明：<5次/天
- 余额增长：每天约+0.01 ETH

---

## 💰 收益计算与成本分析

### 独立验证者（32 ETH）

**投入**：
- 质押：32 ETH @ $1,600 = $51,200
- 硬件（自建）：$2,000
- 年运营成本：$360（电费）+ $600（网络）= $960

**收益**（年）：
- 基础质押：32 ETH × 3% = 0.96 ETH ≈ $1,536
- 执行层奖励：+0.3% ≈ 0.096 ETH ≈ $154
- MEV（可选）：+1% ≈ 0.32 ETH ≈ $512
- **总计**：约1.38 ETH ≈ $2,200/年

**年化收益率**：4.3%（基于ETH价格$1,600）

**回本期**：硬件成本$2,000 / ($2,200年收益 - $960运营成本) ≈ 1.6年

---

### Lido质押（任意金额）

**投入**：10 ETH = $16,000

**收益**（年）：
- stETH奖励：10 ETH × 3.5% = 0.35 ETH ≈ $560
- 佣金：10%（Lido收取）
- **净收益**：$560 × 90% = $504

**年化收益率**：3.15%

**优势**：零运维成本，流动性

---

### Rocket Pool（16 ETH + RPL）

**投入**：
- 16 ETH = $25,600
- 2.4 ETH等值RPL = $3,840
- 硬件/云服务器：$500/年

**收益**（年）：
- ETH质押：16 ETH × 3% × 85% = 0.41 ETH ≈ $656
- 佣金：16 ETH × 3.5% × 15% = 0.08 ETH ≈ $130
- RPL奖励：+2% ≈ 0.32 ETH ≈ $512
- **总计**：0.81 ETH ≈ $1,300

**年化收益率**：5.1%（包含RPL）

**优势**：比独立验证者门槛低，收益更高（RPL奖励）

---

## ⚠️ Slashing风险与防范

### 什么会触发Slashing

**离线惩罚**（Inactivity Leak）：
- 离线1小时：罚约0.0001 ETH（$0.16）
- 离线1天：罚约0.002 ETH（$3）
- 长期离线：罚款指数增长

**可罚没违规**（Slashable Offenses）：
- **双重证明**：用相同密钥运行两个验证者 → 罚1+ ETH
- **包围投票**：证明逻辑矛盾 → 罚1+ ETH
- **后果**：被强制退出，可能损失10%+质押

---

### 防范清单

**技术措施**：
- [ ] 使用UPS不间断电源
- [ ] 设置监控告警（Beaconcha.in App）
- [ ] 绝不同时运行相同密钥的验证者
- [ ] 切换节点前等待15分钟
- [ ] 使用Slashing保护数据库（客户端内置）

**保险**（可选）：
- Unslashed Finance：支付1% APR保费，覆盖Slashing损失

---

## 🔄 提款机制详解

### 提款类型

**部分提款**（Partial Withdrawal）：
- 自动：余额>32 ETH的部分自动提款（每4-5天）
- 无需操作
- 收益自动到你的提款地址

**全额提款**（Full Withdrawal）：
- 主动：触发退出验证者
- 流程：发起退出 → 等待27小时 → 进入提款队列 → 数天后到账
- 退出后无法再激活（需重新存款）

---

### 提款队列

**队列机制**：
- 每个epoch最多6个验证者退出
- 牛市高峰：可能等待数周
- 熊市低谷：几天即可

**查询工具**：
- https://www.validatorqueue.com
- 实时显示激活/退出队列长度

---

## ❓ 常见问题FAQ

**Q1：Lido的stETH安全吗？会脱锚吗？**
> stETH在2022年6月曾因市场恐慌（Terra崩盘+Celsius危机）脱锚至0.93 ETH，但2023年Shapella升级后可提款，脱锚风险大幅降低。长期持有（>1年）风险可控，短期套利需注意流动性。

**Q2：Rocket Pool的RPL代币值得质押吗？**
> RPL质押是强制要求（最低10%），奖励约+2% APR。但RPL价格波动大（2021年$50 → 2023年$20），需评估代币风险。保守策略：仅质押最低10%要求。

**Q3：独立验证者离线1天会损失多少？**
> 离线1天罚约0.002 ETH（$3），相当于1天收益。但长期离线（>1周）在Inactivity Leak模式下罚款指数增长。关键：保持>99%在线率。

**Q4：可以随时提款吗？**
> Lido/Rocket Pool：可随时卖出stETH/rETH换回ETH（注意滑点）
> 独立验证者：需发起退出 → 等待27小时 → 提款队列（数天-数周）
> CEX质押：通常即时赎回（部分交易所有锁定期）

**Q5：MEV-Boost值得开启吗？**
> 值得！MEV-Boost通过Flashbots等中继提供额外收益（+0.5-2% APR），无Slashing风险。唯一缺点：理论上中继可审查交易（但Flashbots声誉良好）。

---

## ✅ 执行清单

### Lido质押（5分钟）
- [ ] 访问lido.fi连接MetaMask
- [ ] 输入金额点击Stake（Gas费$5-$15）
- [ ] 接收stETH（1:1比例）
- [ ] （可选）存入Curve stETH池赚取额外收益

### Rocket Pool（1-2天）
- [ ] 准备16 ETH + 1.6 ETH等值RPL
- [ ] 准备服务器（云或自建）
- [ ] 安装Rocket Pool Smartnode
- [ ] 注册节点并质押RPL
- [ ] 存款16 ETH创建minipool
- [ ] 设置监控告警

### 独立验证者（3-7天）
- [ ] 准备32 ETH + 硬件/云服务器
- [ ] 安装Ubuntu，配置防火墙
- [ ] 安装Geth + Lighthouse
- [ ] 同步区块链（1-3天）
- [ ] 生成验证者密钥（离线）
- [ ] 手写备份助记词（分散存储）
- [ ] 存款32 ETH到Launchpad
- [ ] 导入密钥并启动验证者
- [ ] 注册Beaconcha.in设置告警
- [ ] 测试UPS断电恢复

---

## 🎓 延伸阅读

- **r/ethstaker**（Reddit）：Ethereum质押社区
- **Rocket Pool Discord**：友好的技术支持
- **CoinCashew**：详细图文教程
- **Beaconcha.in**：验证者数据与监控

愿你的ETH质押之旅顺利，收益稳定！🚀💎
`,

  steps: [
    { step_number: 1, title: '选择质押方案', description: '根据资金量和技术能力选择：<1 ETH用Lido，16 ETH用Rocket Pool，32 ETH考虑独立验证者。评估收益、风险、流动性需求。', estimated_time: '30分钟' },
    { step_number: 2, title: '准备资金与工具', description: 'Lido：准备ETH+MetaMask。Rocket Pool：16 ETH+RPL+服务器。独立验证者：32 ETH+硬件（$2K）+Linux环境。', estimated_time: '1-3小时' },
    { step_number: 3, title: '执行质押操作', description: 'Lido：网页点击3次完成。Rocket Pool：安装Smartnode，注册节点，存款。独立验证者：安装Geth+Lighthouse，生成密钥，存款Launchpad。', estimated_time: '5分钟-7天（视方案）' },
    { step_number: 4, title: '监控与维护', description: '所有方案：注册Beaconcha.in设置告警。独立验证者/Rocket Pool：安装Prometheus+Grafana，配置UPS，每日检查在线率和余额增长。', estimated_time: '每周1-2小时' },
    { step_number: 5, title: '收益优化', description: 'Lido：可选将stETH存入Curve池赚取额外收益。Rocket Pool：定期领取RPL奖励。独立验证者：启用MEV-Boost增加收入1-2%。', estimated_time: '持续优化' },
  ],
};

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

    console.log('\n✅ Ethereum质押完全指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
