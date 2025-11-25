const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '节点硬件配置与成本指南：自建vs云服务器全解析',
  slug: 'node-hardware-cost-comparison-guide',
  summary:
    '节点运行成本详解：Ethereum/Solana/Cosmos验证者硬件要求、CPU/内存/存储/带宽配置清单、自建服务器vs云服务器（AWS/GCP/Hetzner/Contabo）成本对比、UPS不间断电源、网络优化、电费计算、3年TCO分析、Intel NUC/Mac Mini/专用服务器选型、Docker容器化部署。',

  category: 'node-running',
  category_l1: 'tools',
  category_l2: '节点运行',

  difficulty_level: 4,
  risk_level: 3,
  apy_min: 0,
  apy_max: 0,

  threshold_capital: '500–5,000 USD（硬件成本）+ 50–200 USD/月（云服务器/电费）',
  threshold_capital_min: 500,
  time_commitment: '搭建阶段20–40小时，运维每周2–5小时监控',
  time_commitment_minutes: 180,
  threshold_tech_level: 'advanced',

  content: `> **适用人群**：计划运行验证者节点的技术用户、希望优化节点成本的Staking参与者、评估自建vs云服务器的决策者
> **阅读时间**：≈ 20–25 分钟
> **关键词**：Validator Node / Hardware Requirements / Cloud Server / AWS / Hetzner / Intel NUC / UPS / TCO / Bandwidth / SSD / Docker / Monitoring

---

## 🧭 TL;DR
- **硬件门槛**：ETH验证者最低16GB内存+2TB SSD（实际推荐32GB+4TB），Solana需128GB内存+2TB NVMe，Cosmos相对轻量（8GB+500GB）
- **自建优势**：3年TCO更低（$2,000 vs $7,200云服务器），数据主权，无带宽限制，初期投入$800–$3,000
- **云服务器优势**：零维护、99.9%可用性、按需扩展、适合测试/小额质押，Hetzner/Contabo性价比高（$20–$80/月）
- **关键考量**：电费（自建+$10–$30/月）、网络稳定性（Slashing风险）、物理安全（UPS必备）、技术能力（Linux运维）
- **推荐方案**：
  - **技术新手/小额**：云服务器（Hetzner AX41）
  - **长期运行/大额**：自建（Intel NUC 13 Pro或组装服务器）
  - **测试环境**：Contabo VPS

---

## 🗂 目录
1. [各链节点硬件要求](#各链节点硬件要求)
2. [自建服务器硬件选型](#自建服务器硬件选型)
3. [云服务器方案对比](#云服务器方案对比)
4. [成本分析：3年TCO对比](#成本分析3年tco对比)
5. [网络与带宽要求](#网络与带宽要求)
6. [UPS与电源管理](#ups与电源管理)
7. [存储方案：SSD vs NVMe](#存储方案ssd-vs-nvme)
8. [操作系统与容器化](#操作系统与容器化)
9. [监控与告警系统](#监控与告警系统)
10. [FAQ](#faq)
11. [硬件采购清单](#硬件采购清单)

---

## 💻 各链节点硬件要求

### Ethereum验证者节点

#### 最低配置（不推荐生产环境）
- **CPU**：4核心（支持AVX2指令集）
- **内存**：16GB DDR4
- **存储**：2TB SSD（Archive Node需10TB+）
- **带宽**：上传10Mbps，下载25Mbps
- **同步时间**：Snap Sync约8–24小时

#### 推荐配置（生产环境）
- **CPU**：8核心（Intel i5-12400 / AMD Ryzen 5 5600X）
- **内存**：32GB DDR4 3200MHz
- **存储**：4TB NVMe SSD（读3000MB/s+）
- **带宽**：上传20Mbps，下载50Mbps，低延迟(<100ms)
- **网络**：固定IP（非必需但推荐），端口转发支持
- **预计增长**：Execution层+200GB/年，Consensus层+50GB/年

**客户端组合示例**：
- Execution: Geth / Nethermind / Besu
- Consensus: Lighthouse / Prysm / Teku
- 总内存占用：Geth 8–16GB + Lighthouse 4–8GB = 12–24GB

---

### Solana验证者节点

#### 官方推荐配置
- **CPU**：16核心/32线程（AMD EPYC / Intel Xeon）
- **内存**：128GB DDR4（实际运行可能需256GB）
- **存储**：2TB NVMe SSD（PCIe 4.0，写入耐久度高）
- **网络**：1Gbps对称带宽，低延迟(<50ms到主要节点)
- **GPU**：非必需（但可加速签名验证）

**为什么配置高**：
- Solana是高性能链（50,000+ TPS设计）
- 需要快速处理海量交易签名
- 内存用于存储账户状态（数百万账户）

**成本警告**：单台Solana验证者每月云服务器成本$500–$1,000+，建议自建或使用质押池（如Marinade）

---

### Cosmos Hub验证者节点

#### 推荐配置（相对轻量）
- **CPU**：4核心（Intel i5或同等）
- **内存**：8GB DDR4
- **存储**：500GB SSD
- **带宽**：上传10Mbps，下载25Mbps

**优势**：
- 硬件门槛低
- 同步速度快（State Sync几分钟完成）
- 适合初学者入门

---

### Polkadot验证者节点

#### 推荐配置
- **CPU**：8核心（3.4GHz+）
- **内存**：32GB DDR4
- **存储**：1TB NVMe SSD
- **带宽**：100Mbps对称

**特殊要求**：
- 需要运行Archive Node（历史数据保留）
- 推荐使用裸机服务器（云VM性能可能不稳定）

---

### Avalanche验证者节点

#### 推荐配置
- **CPU**：8核心
- **内存**：16GB
- **存储**：1TB SSD
- **质押要求**：最低2,000 AVAX（约$60,000–$80,000）

---

## 🛠️ 自建服务器硬件选型

### 方案1：Intel NUC（迷你主机）

#### Intel NUC 13 Pro（推荐）
- **型号**：NUC13ANHi7
- **CPU**：Intel i7-1360P（12核心16线程，最高5.0GHz）
- **内存**：需自配，推荐32GB DDR4（2×16GB）
- **存储**：需自配，推荐2TB NVMe（三星980 Pro）
- **功耗**：待机15W，满载65W
- **价格**：
  - 裸机：$600–$800
  - 内存32GB：$100
  - SSD 2TB：$150
  - **总计**：$850–$1,050

**优点**：
- 体积小（手掌大小）
- 低功耗（年电费<$100）
- 静音
- 品牌可靠

**缺点**：
- 扩展性有限（最多2个NVMe槽）
- 无冗余电源

**适合**：Ethereum单验证者、Cosmos节点

---

### 方案2：Mac Mini M2 Pro（2023）

#### 配置
- **CPU**：Apple M2 Pro（12核CPU）
- **内存**：32GB统一内存
- **存储**：1TB SSD（可外接扩展）
- **功耗**：15W–30W
- **价格**：$1,999（官方价）

**优点**：
- 极低功耗（年电费<$50）
- 性能强悍（Rosetta 2兼容x86软件）
- macOS稳定
- 安静无风扇噪音

**缺点**：
- 价格偏高
- Docker for Mac性能损失10%–20%
- 部分客户端可能无ARM原生支持

**适合**：技术极客、偏好macOS、已有Mac生态

---

### 方案3：组装服务器（高性价比）

#### 配置清单（Ethereum生产级）
| 组件 | 型号 | 价格 |
|------|------|------|
| CPU | AMD Ryzen 5 5600X（6核12线程） | $150 |
| 主板 | ASUS B550M-A | $100 |
| 内存 | 32GB DDR4 3200MHz（2×16GB） | $80 |
| SSD | 2TB NVMe（WD Black SN850X） | $180 |
| 电源 | Corsair 550W 80+ Gold | $70 |
| 机箱 | Fractal Design Node 304（迷你机箱） | $90 |
| 散热 | Noctua NH-L9a（低噪音） | $50 |
| **总计** | | **$720** |

**功耗**：待机40W，满载120W（年电费$150–$180@$0.15/kWh）

**优点**：
- 性价比最高
- 完全可定制
- 易于维修升级
- 多NVMe槽位（可扩展至8TB+）

**缺点**：
- 需要组装知识
- 占用空间较大
- 风扇噪音（可通过静音风扇优化）

**适合**：有DIY经验、运行多个验证者、长期投入

---

### 方案4：二手服务器（极致性价比）

#### Dell PowerEdge R720（2012年款）
- **CPU**：2×Intel Xeon E5-2670（8核×2=16核32线程）
- **内存**：64GB DDR3 ECC
- **存储**：需加装2TB SSD
- **价格**：二手整机$300–$500 + SSD $150 = $450–$650

**优点**：
- 企业级硬件（ECC内存，冗余电源）
- 价格极低
- 适合多节点部署

**缺点**：
- 功耗高（300W+，年电费$400+）
- 噪音大（数据中心级风扇）
- 老旧硬件可能故障

**适合**：有机房环境、电费便宜地区、实验用途

---

## ☁️ 云服务器方案对比

### AWS（Amazon Web Services）

#### 推荐实例：c6i.2xlarge（Ethereum）
- **配置**：8 vCPU，16GB内存，EBS 2TB SSD
- **价格**：
  - 实例：$0.34/小时 × 730小时 = $248/月
  - 存储：2TB EBS gp3：$160/月
  - 流量：1TB出站：$90/月
  - **总计**：$498/月（约$6,000/年）

**优点**：
- 全球分布（低延迟）
- 99.99%可用性SLA
- 完善的监控（CloudWatch）

**缺点**：
- 价格最贵
- 流量费高昂

**适合**：企业级应用、需要高可用性

---

### Google Cloud Platform (GCP)

#### 推荐实例：n2-standard-8
- **配置**：8 vCPU，32GB内存，2TB Persistent SSD
- **价格**：
  - 实例：$0.39/小时 = $285/月
  - 存储：2TB SSD：$340/月
  - 流量：1TB出站：$120/月
  - **总计**：$745/月（Sustained Use Discount后约$600/月）

**优点**：
- 自动折扣（长期使用）
- 网络性能好

**缺点**：
- 价格仍然偏高

---

### Hetzner（性价比之王）

#### 推荐服务器：AX41-NVMe
- **配置**：
  - CPU：AMD Ryzen 5 3600（6核12线程）
  - 内存：64GB DDR4 ECC
  - 存储：2×512GB NVMe SSD RAID1（可升级）
  - 带宽：1Gbps无限流量
- **价格**：€49/月（约$52/月，$624/年）

**优点**：
- 价格极低（AWS的1/10）
- 裸机服务器（无虚拟化损耗）
- 无限流量
- 德国数据中心（隐私保护强）

**缺点**：
- 仅欧洲数据中心（美国/亚洲延迟高）
- 货源紧张（需排队）
- 技术支持英语/德语

**适合**：欧洲用户、成本敏感、长期运行

---

### Contabo（最便宜选项）

#### 推荐方案：VPS L
- **配置**：
  - 10 vCPU
  - 60GB内存
  - 1.6TB NVMe SSD
  - 带宽：无限（32TB流量）
- **价格**：€27.49/月（约$29/月，$348/年）

**优点**：
- 价格最低
- 配置充足

**缺点**：
- 性能不稳定（超售严重）
- 磁盘IO可能不达标（Ethereum同步慢）
- 客服响应慢

**适合**：测试环境、Cosmos等轻量节点、预算极度有限

---

### OVH Cloud

#### 推荐服务器：Rise-2
- **配置**：AMD Ryzen 5 5600X，32GB，2TB NVMe
- **价格**：€59/月（约$63/月）

**优点**：
- 性价比高
- 全球数据中心（美国/欧洲/亚洲）

**缺点**：
- 历史上有大规模故障（2021年火灾）

---

### 云服务器对比总结表

| 服务商 | 月费 | 3年总成本 | 配置 | 适用场景 |
|--------|------|----------|------|---------|
| AWS | $498 | $17,928 | 8vCPU/16GB/2TB | 企业级 |
| GCP | $600 | $21,600 | 8vCPU/32GB/2TB | 高可用 |
| Hetzner | $52 | $1,872 | 6核/64GB/1TB | 最佳性价比 |
| Contabo | $29 | $1,044 | 10vCPU/60GB/1.6TB | 测试/轻量 |
| OVH | $63 | $2,268 | 6核/32GB/2TB | 全球部署 |

---

## 💰 成本分析：3年TCO对比

### 自建服务器（Intel NUC）
| 项目 | 成本 |
|------|------|
| 硬件初期投入 | $1,000 |
| 电费（65W×24h×365天×3年@$0.15/kWh） | $256 |
| 网络费用（家庭宽带，已有） | $0 |
| 维护成本（SSD更换1次） | $150 |
| **3年总成本** | **$1,406** |
| **每月平均** | **$39** |

---

### 自建服务器（组装式）
| 项目 | 成本 |
|------|------|
| 硬件初期投入 | $720 |
| 电费（120W×24h×365天×3年@$0.15/kWh） | $473 |
| 维护成本 | $100 |
| **3年总成本** | **$1,293** |
| **每月平均** | **$36** |

---

### Hetzner云服务器
| 项目 | 成本 |
|------|------|
| 服务器租赁（$52×36月） | $1,872 |
| 流量费 | $0（无限） |
| 备份服务 | $120（可选） |
| **3年总成本** | **$1,872** |
| **每月平均** | **$52** |

---

### AWS云服务器
| 项目 | 成本 |
|------|------|
| 服务器+存储+流量 | $17,928 |
| **3年总成本** | **$17,928** |
| **每月平均** | **$498** |

---

### 结论
- **预算<$1,500**：组装服务器或Contabo
- **预算$1,500–$3,000**：Intel NUC或Hetzner
- **技术能力有限**：Hetzner（最佳平衡）
- **企业级需求**：AWS/GCP（成本10倍但SLA保障）

**盈亏平衡点**：自建服务器在运行4–6个月后即可收回成本（vs Hetzner）

---

## 🌐 网络与带宽要求

### 带宽需求

#### Ethereum验证者
- **下载**：每天约10–30GB（同步+区块接收）
- **上传**：每天约5–15GB（广播区块/证明）
- **月流量**：约450GB–1.35TB
- **延迟要求**：<200ms到主要节点（欧美）

---

#### Solana验证者
- **下载**：每天100GB+
- **上传**：每天50GB+
- **月流量**：4.5TB+
- **延迟要求**：<50ms（严格！）

---

### 家庭网络优化

#### 检查清单
✅ **上传带宽充足**：
- 最低10Mbps（Ethernet）
- 推荐50Mbps+（支持多验证者）
- 测试：https://fast.com

✅ **固定公网IP**（推荐但非必需）：
- 有助于P2P连接稳定性
- 运营商动态IP也可运行（使用DynDNS）

✅ **端口转发配置**：
- Ethereum: 30303 (TCP/UDP)
- Consensus客户端: 9000/13000/3000（视客户端而定）
- 路由器需开启UPnP或手动配置

✅ **备用网络**：
- 4G/5G移动热点（主网络故障时切换）
- 双线路宽带（电信+联通）

---

### Slashing风险与网络
**案例**：
- 网络中断>4小时 → 可能被标记离线
- 双签名（两个实例同时运行） → **立即Slashing**（损失1–50% Stake）

**防范**：
- UPS不间断电源（见下节）
- 监控告警（断网立即通知）
- 绝不运行同一验证者密钥的多个实例

---

## 🔋 UPS与电源管理

### 为什么需要UPS

**场景1：突然停电**
- Ethereum验证者离线>1 epoch（6.4分钟）→ 开始扣罚
- 持续离线1天 → 损失约等于1天收益

**场景2：电压波动**
- 硬件损坏（SSD数据损坏）
- 需要重新同步（8–24小时）

---

### UPS选型

#### 推荐型号：APC Back-UPS 1500VA
- **型号**：BX1500M
- **容量**：1500VA / 900W
- **续航时间**：
  - NUC（65W）：约2小时
  - 组装服务器（120W）：约1小时
- **价格**：$180–$220

---

#### 配置要点
✅ **自动关机脚本**：
- 安装apcupsd（Linux）或APC PowerChute（Windows/Mac）
- 电池剩余10%时自动优雅关闭节点

✅ **测试**：
- 每月拔电源测试UPS是否正常工作
- 每2年更换电池（$50–$80）

---

### 电费计算器

**公式**：年电费 = 功耗(W) × 24h × 365天 ÷ 1000 × 电价($/kWh)

**示例**：
- Intel NUC（65W）+ $0.15/kWh：
  - 65 × 24 × 365 ÷ 1000 × 0.15 = **$85/年**

- 组装服务器（120W）+ $0.15/kWh：
  - 120 × 24 × 365 ÷ 1000 × 0.15 = **$158/年**

- 二手服务器（300W）+ $0.15/kWh：
  - 300 × 24 × 365 ÷ 1000 × 0.15 = **$394/年**

**结论**：功耗差异3年可达$900+，选择低功耗硬件至关重要

---

## 💾 存储方案：SSD vs NVMe

### 技术对比

| 指标 | SATA SSD | NVMe SSD |
|------|----------|----------|
| 接口 | SATA III | PCIe 3.0/4.0 |
| 读取速度 | 550MB/s | 3,500–7,000MB/s |
| 写入速度 | 520MB/s | 3,000–5,000MB/s |
| 延迟 | 50–100μs | 10–20μs |
| 价格（2TB） | $120 | $150–$250 |

---

### Ethereum节点推荐

**最低**：SATA SSD（Samsung 870 EVO 2TB）
- 价格：$120
- 同步时间：Snap Sync 12–24小时
- 适合：测试环境

**推荐**：NVMe SSD（Samsung 980 Pro 2TB）
- 价格：$180
- 同步时间：Snap Sync 6–10小时
- 适合：生产环境

**企业级**：Samsung 980 Pro/WD Black SN850X
- 耐久度：1200TBW（普通消费级600TBW）
- 保修：5年

---

### 写入耐久度（TBW）

**Ethereum写入量**：
- Geth客户端：约50–100GB/天写入
- 年写入量：18–36TB
- 消费级SSD（600TBW）寿命：约16–33年（实际3–5年）

**结论**：消费级NVMe足够，无需企业级（价格贵3倍）

---

### RAID配置（可选）

**RAID 1（镜像）**：
- 2×2TB SSD → 可用2TB
- 数据冗余（一块坏掉仍可运行）
- 适合：自建生产环境

**不推荐RAID 0**：
- 虽然速度翻倍，但任一盘损坏全部数据丢失
- 需重新同步（8–24小时）

---

## 🐧 操作系统与容器化

### 操作系统选择

#### Ubuntu Server 22.04 LTS（推荐）
**优点**：
- 免费开源
- 长期支持（5年安全更新）
- 文档丰富
- Docker/Kubernetes原生支持

**适合**：90%用户

---

#### Debian 12
**优点**：
- 更稳定（保守更新策略）
- 占用资源更少

**适合**：追求极致稳定性

---

#### Windows Server（不推荐）
**缺点**：
- 授权费（$600+）
- 资源占用高
- 大部分节点软件Linux优先支持

---

### Docker容器化部署

#### 优势
✅ **环境隔离**：多个客户端互不干扰
✅ **版本管理**：一键回滚/升级
✅ **资源限制**：限制CPU/内存避免资源争抢
✅ **自动重启**：异常崩溃自动拉起

#### 示例：Docker Compose部署Ethereum
文件：docker-compose.yml

services:
  geth:
    image: ethereum/client-go:latest
    volumes:
      - ./data/geth:/root/.ethereum
    ports:
      - "30303:30303"
      - "8545:8545"
    command: --http --http.addr 0.0.0.0
    restart: unless-stopped

  lighthouse:
    image: sigp/lighthouse:latest
    volumes:
      - ./data/lighthouse:/root/.lighthouse
    command: beacon_node --http
    restart: unless-stopped

启动：docker-compose up -d

---

## 📊 监控与告警系统

### 必备监控指标

#### 系统级
- **CPU使用率**（应<80%）
- **内存使用率**（应<90%）
- **磁盘空间**（剩余>20%触发告警）
- **磁盘IO**（iowait应<10%）
- **网络流量**

#### 节点级
- **Peer连接数**（Ethereum应>50）
- **同步状态**（Head Slot vs Finalized Slot差距）
- **证明参与率**（Attestation Inclusion Rate应>95%）
- **Slashing事件**（必须为0）

---

### 工具推荐

#### Prometheus + Grafana（免费开源）
**功能**：
- 时序数据库（Prometheus）
- 可视化Dashboard（Grafana）
- 预置Ethereum/Solana仪表盘

**安装**：
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3000:3000 grafana/grafana

---

#### beaconcha.in（Ethereum专用，免费）
**功能**：
- 添加验证者公钥
- 邮件/Telegram告警（离线/Slashing）
- 收益追踪

**网址**：https://beaconcha.in

---

#### Uptime Kuma（简易监控）
**功能**：
- HTTP/Ping监控
- 多种通知渠道（Discord/Slack/邮件）
- 自托管

---

## ❓FAQ

**Q1：我技术小白,应该选云服务器还是自建？**
> **云服务器（Hetzner AX41）**：无需硬件知识，Linux基础即可，月费$52可接受。自建需要组装/故障排查/网络配置等技能，不推荐新手。

**Q2：家里网络不稳定,能运行验证者吗？**
> **风险高**：频繁离线会持续扣罚，最终收益可能为负。建议：1) 升级宽带（光纤）+ 备用4G热点，2) 使用云服务器，3) 或选择Lido/Rocket Pool等质押池（无需自己运行节点）。

**Q3：Solana硬件要求太高,有替代方案吗？**
> **是的**：使用质押池（Marinade/Jito），只需钱包即可，收益率仅低1%–2%，远低于自建服务器成本。自建Solana验证者仅适合质押额>100万美元的专业玩家。

**Q4：SSD坏了数据丢失怎么办？**
> **重新同步**（8–24小时）。预防措施：1) 定期备份验证者密钥（keystores文件夹），2) RAID 1镜像，3) 使用企业级SSD（更长寿命）。注意：验证者密钥绝不能同时运行在两台机器（会Slashing）。

**Q5：电费太贵,怎么降低成本？**
> **选择低功耗硬件**：Intel NUC/Mac Mini（50–70W）比二手服务器（300W+）年省$300电费。或考虑Hetzner云服务器（电费包含在租金中）。

---

## 🛒 硬件采购清单

### 方案A：新手入门（云服务器）
- **Hetzner AX41-NVMe**：€49/月
- **无需购买硬件**

**总投入**：$0（首月$52）
**3年成本**：$1,872

---

### 方案B：中级玩家（Intel NUC）
- Intel NUC 13 Pro裸机：$700
- 32GB DDR4内存（Crucial 2×16GB）：$90
- 2TB NVMe SSD（Samsung 980 Pro）：$180
- APC UPS 1500VA：$200

**总投入**：$1,170
**3年成本**：$1,170 + $255（电费） = $1,425

---

### 方案C：进阶玩家（组装服务器）
- AMD Ryzen 5 5600X：$150
- ASUS B550M-A主板：$100
- 32GB DDR4 3200MHz：$80
- 2TB NVMe SSD（WD Black SN850X）：$180
- 550W电源+机箱+散热器：$210
- APC UPS 1500VA：$200

**总投入**：$920
**3年成本**：$920 + $474（电费） = $1,394

---

### 方案D：极客方案（Mac Mini M2 Pro）
- Mac Mini M2 Pro 32GB/1TB：$1,999
- 外接2TB SSD（三星T7）：$180
- APC UPS：$200

**总投入**：$2,379
**3年成本**：$2,379 + $120（电费） = $2,499

---

## 🎓 推荐学习资源

- **Ethereum节点指南**：https://ethereum.org/en/run-a-node/
- **Rocket Pool节点配置**：https://docs.rocketpool.net/
- **Solana验证者文档**：https://docs.solana.com/running-validator
- **Reddit r/ethstaker**：社区讨论
- **CoinCashew Guides**：各链节点详细教程

---

## 🔚 结语

**硬件选择的黄金法则**：
1. **长期运行（>1年）** → 自建服务器（ROI更高）
2. **短期测试/小额质押** → 云服务器（灵活）
3. **技术能力有限** → Hetzner云服务器（平衡点）
4. **追求极致性能** → 组装服务器+企业级SSD

**最重要的投入是时间**：
- 硬件只是成本的1/3
- 学习Linux/Docker/网络配置：20–40小时
- 日常监控运维：每周2–5小时

如果你的时间成本>$20/小时，且质押金额<100 ETH，使用Lido/Rocket Pool可能比自己运行节点更经济！

祝你运行顺利，零Slashing！🚀
`,

  steps: [
    { step_number: 1, title: '评估需求与预算', description: '确定要运行的链（Ethereum/Solana/Cosmos等）、质押金额、技术能力、电费成本、是否有稳定网络环境，决策自建vs云服务器，预算$500–$5,000。', estimated_time: '2–4 小时' },
    { step_number: 2, title: '硬件采购或云服务器租赁', description: '自建：购买CPU/内存/SSD/UPS/网络设备，等待到货组装；云服务器：注册Hetzner/Contabo等，选择配置并开通实例，配置SSH密钥登录。', estimated_time: '1–7 天（采购+物流）' },
    { step_number: 3, title: '系统安装与安全加固', description: '安装Ubuntu Server 22.04，配置SSH密钥认证（禁用密码登录），设置防火墙（ufw），更新系统软件包，安装Docker/Docker Compose，配置自动更新。', estimated_time: '3–6 小时' },
    { step_number: 4, title: '节点客户端部署', description: '根据目标链安装客户端（Geth+Lighthouse/Solana/Cosmos等），配置Docker Compose或systemd服务，同步区块链数据（Ethereum需8–24小时），导入验证者密钥。', estimated_time: '10–30 小时（含同步时间）' },
    { step_number: 5, title: '监控告警与日常运维', description: '配置Prometheus+Grafana监控，设置beaconcha.in邮件告警，制定备份计划（每周备份验证者密钥），测试UPS自动关机，每周检查日志与性能指标。', estimated_time: '5–10 小时初始配置，每周2–5小时运维' },
  ],
};

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function createGuide() {
  try {
    console.log('\n🚀 开始创建节点硬件配置与成本指南...\n');

    const token = await getAuthToken();

    const payload = {
      status: 'published',
      title: GUIDE_CONFIG.title,
      slug: GUIDE_CONFIG.slug,
      summary: GUIDE_CONFIG.summary,
      content: GUIDE_CONFIG.content,
      category: GUIDE_CONFIG.category,
      category_l1: GUIDE_CONFIG.category_l1,
      category_l2: GUIDE_CONFIG.category_l2,
      difficulty_level: GUIDE_CONFIG.difficulty_level,
      risk_level: GUIDE_CONFIG.risk_level,
      apy_min: GUIDE_CONFIG.apy_min,
      apy_max: GUIDE_CONFIG.apy_max,
      threshold_capital: GUIDE_CONFIG.threshold_capital,
      threshold_capital_min: GUIDE_CONFIG.threshold_capital_min,
      time_commitment: GUIDE_CONFIG.time_commitment,
      time_commitment_minutes: GUIDE_CONFIG.time_commitment_minutes,
      threshold_tech_level: GUIDE_CONFIG.threshold_tech_level,
      steps: GUIDE_CONFIG.steps,
      view_count: 0,
      bookmark_count: 0,
    };

    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('\n✅ 节点硬件配置与成本指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

createGuide();
