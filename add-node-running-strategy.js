#!/usr/bin/env node

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

const strategy = {
  title: 'Layer 2 轻节点运行完全指南',
  slug: 'layer2-light-node-running-guide',
  summary: '通过运行 Layer 2 网络轻节点，支持网络去中心化并获得潜在节点奖励。适合有技术基础和稳定服务器的用户。',
  content: `
## 策略概述

Layer 2 生态系统需要大量节点运营者来保证网络的去中心化和健壮性。运行轻节点不仅能获得潜在的空投和奖励，还能深度参与项目生态，提升未来收益概率。

## 为什么运行节点？

✅ **核心优势**:
- **空投潜力**: 历史上多个项目向早期节点运营者发放丰厚空投
- **网络贡献**: 直接支持区块链去中心化
- **技术积累**: 深入理解区块链技术栈
- **优先权益**: 节点运营者通常获得优先参与权
- **长期收益**: 未来可能获得区块奖励或验证收入

## 推荐运行的节点

### 1. **Eigenlayer AVS 节点** (高潜力)

**项目背景**:
- 以太坊重质押协议
- 已融资超过1亿美元
- 节点运营者是核心参与者

**硬件要求**:
- CPU: 4核+
- 内存: 8GB+
- 存储: 500GB SSD
- 带宽: 100Mbps+
- 系统: Ubuntu 22.04

**收益预期**:
- 节点运营奖励: 待发布
- AVS 服务费: 预计5-15% APY
- 空投潜力: 极高

---

### 2. **Celestia Light Node** (推荐新手)

**项目背景**:
- 模块化区块链领军项目
- 轻节点门槛低
- 官方明确支持节点运营者

**硬件要求**:
- CPU: 2核+
- 内存: 2GB+
- 存储: 50GB SSD
- 带宽: 10Mbps+
- 系统: Linux/Mac/Windows

**收益预期**:
- 主网空投: 已发放（错过了）
- 未来激励: 持续运行可能获得额外奖励
- 生态积分: 参与生态治理

---

### 3. **Scroll Sequencer Node** (即将开放)

**项目背景**:
- zkEVM Layer 2
- 计划开放节点运营
- 去中心化路线图明确

**硬件要求**:
- CPU: 8核+
- 内存: 16GB+
- 存储: 1TB SSD
- 带宽: 1Gbps+
- 系统: Ubuntu 22.04

**收益预期**:
- Sequencer 收入分成
- 代币激励
- 优先参与权

---

### 4. **Avail DA Node** (数据可用性)

**项目背景**:
- Polygon 孵化的 DA 层
- 测试网活跃
- 节点奖励计划进行中

**硬件要求**:
- CPU: 4核+
- 内存: 8GB+
- 存储: 500GB SSD
- 带宽: 100Mbps+

**收益预期**:
- 测试网积分
- 主网空投
- 长期节点奖励

---

## 详细操作步骤

### 阶段一：服务器准备

#### 1. **选择服务器方案**

**云服务器推荐**:
- **AWS EC2**: \$20-50/月 (按需实例)
- **DigitalOcean**: \$12-24/月 (性价比高)
- **Vultr**: \$12-24/月 (全球节点多)
- **阿里云/腾讯云**: ¥100-300/月 (国内访问快)

**家庭服务器**:
- **Mini PC**: Intel NUC / 零刻 (\$300-600一次性)
- **树莓派**: 不推荐（性能不足）
- **闲置电脑**: 可以，但需保证稳定性

#### 2. **系统初始化**

\`\`\`bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git build-essential

# 安装 Docker（大部分节点需要）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
\`\`\`

#### 3. **安全配置**

\`\`\`bash
# 配置防火墙
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 26656/tcp  # P2P (根据节点调整)
sudo ufw enable

# 创建专用用户
sudo adduser noderunner
sudo usermod -aG docker noderunner
\`\`\`

---

### 阶段二：节点部署

以 **Celestia Light Node** 为例:

#### 1. **安装节点软件**

\\\`\\\`\\\`bash
# 安装 Celestia Node
cd \\$HOME
wget https://github.com/celestiaorg/celestia-node/releases/download/v0.11.0/celestia-node_Linux_x86_64.tar.gz
tar -xvf celestia-node_Linux_x86_64.tar.gz
sudo mv celestia /usr/local/bin/

# 验证安装
celestia version
\\\`\\\`\\\`

#### 2. **初始化节点**

\`\`\`bash
# 初始化轻节点
celestia light init --p2p.network mocha

# 获取节点密钥（重要！备份！）
celestia light auth admin --p2p.network mocha
\`\`\`

#### 3. **启动节点**

\`\`\`bash
# 使用 systemd 管理节点
sudo tee /etc/systemd/system/celestia-light.service > /dev/null <<EOF
[Unit]
Description=Celestia Light Node
After=network.target

[Service]
User=noderunner
ExecStart=/usr/local/bin/celestia light start --core.ip consensus.lunaroasis.net --p2p.network mocha
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable celestia-light
sudo systemctl start celestia-light

# 查看日志
sudo journalctl -u celestia-light -f
\`\`\`

#### 4. **验证节点状态**

\`\`\`bash
# 检查节点是否同步
curl -X GET http://localhost:26658/header/1

# 查看节点信息
curl -X GET http://localhost:26658/head

# 检查 peers 连接
celestia p2p peers
\`\`\`

---

### 阶段三：监控和维护

#### 1. **设置监控告警**

\`\`\`bash
# 安装 prometheus-node-exporter
sudo apt install -y prometheus-node-exporter

# 使用 Grafana Cloud 免费监控
# 或使用 Uptime Kuma 自建监控
\`\`\`

#### 2. **自动化脚本**

创建健康检查脚本:

\\\`\\\`\\\`bash
#!/bin/bash
# health_check.sh

TELEGRAM_BOT_TOKEN="你的token"
TELEGRAM_CHAT_ID="你的chat_id"

# 检查节点是否运行
if ! systemctl is-active --quiet celestia-light; then
    curl -s -X POST https://api.telegram.org/bot\\${TELEGRAM_BOT_TOKEN}/sendMessage \\
    -d chat_id=\\${TELEGRAM_CHAT_ID} \\
    -d text="⚠️ Celestia节点已停止运行！"

    # 自动重启
    sudo systemctl restart celestia-light
fi

# 检查磁盘空间
DISK_USAGE=\\$(df -h / | awk 'NR==2 {print \\$5}' | sed 's/%//')
if [ \\$DISK_USAGE -gt 80 ]; then
    curl -s -X POST https://api.telegram.org/bot\\${TELEGRAM_BOT_TOKEN}/sendMessage \\
    -d chat_id=\\${TELEGRAM_CHAT_ID} \\
    -d text="⚠️ 磁盘使用率已达 \\${DISK_USAGE}%"
fi
\\\`\\\`\\\`

#### 3. **定期维护清单**

每周检查:
- [ ] 节点同步状态
- [ ] 磁盘空间使用
- [ ] 内存使用率
- [ ] 网络连接数

每月检查:
- [ ] 更新节点软件
- [ ] 备份关键数据
- [ ] 安全补丁更新
- [ ] 日志清理

---

## 成本收益分析

### 初期投入

**服务器成本**:
- 云服务器: \$20-50/月
- 家庭服务器: \$300-600 (一次性)

**时间成本**:
- 初始搭建: 4-8 小时
- 每周维护: 1-2 小时

### 潜在收益

**历史案例**:

1. **Arbitrum 节点运营者**
   - 空投: 额外 10-20% 奖励
   - 价值: \$2,000-10,000

2. **Celestia 轻节点**
   - 主网空投: 符合条件
   - 价值: \$500-2,000

3. **Optimism 节点**
   - 早期运营者额外奖励
   - 价值: \$1,000-5,000

**预期 ROI**:
- 成本: \$240-600/年
- 潜在收益: \$1,000-10,000+
- 回报周期: 6-18 个月

---

## 风险管理

### ⚠️ 技术风险

1. **服务器故障**
   - 解决: 选择可靠服务商，做好备份

2. **网络中断**
   - 解决: 使用高可用性方案

3. **软件漏洞**
   - 解决: 及时更新，关注安全公告

4. **Slash 惩罚**
   - 解决: 只运行一个实例，避免双签

### ⚠️ 经济风险

1. **没有空投**
   - 不保证所有项目都会空投
   - 运行多个节点分散风险

2. **代币价格下跌**
   - 即使获得空投，代币可能贬值
   - 及时变现或长期持有

3. **硬件折旧**
   - 服务器/设备有使用寿命
   - 计入长期成本

### ⚠️ 合规风险

1. **家庭带宽限制**
   - 检查 ISP 的 TOS
   - 避免违反服务条款

2. **电力成本**
   - 24/7 运行消耗电力
   - 计算实际成本

---

## 进阶优化

### 1. **多节点运营**

如果资金允许，同时运行多个项目节点:

\`\`\`
单服务器方案 (推荐配置: 16GB RAM, 8核 CPU):
├── Celestia Light Node
├── Avail DA Node
├── Eigenlayer Operator
└── Monitoring Stack
\`\`\`

### 2. **自动化运维**

使用 Ansible 批量管理:

\`\`\`yaml
# playbook.yml
- hosts: nodes
  tasks:
    - name: Update node software
      shell: |
        cd /opt/node
        git pull
        sudo systemctl restart node
\`\`\`

### 3. **收益最大化策略**

- **参与测试网**: 许多项目测试网也有奖励
- **提交反馈**: 活跃的节点运营者更受重视
- **加入社区**: Discord/Telegram 获取第一手信息
- **运行多个钱包**: 避免女巫攻击检测

---

## 推荐学习资源

### 文档和教程
- [Celestia 官方文档](https://docs.celestia.org)
- [Eigenlayer Operator Guide](https://docs.eigenlayer.xyz)
- [Node Runner Community](https://noderunners.network)

### 社区和论坛
- **Discord**: 加入各项目的 Node Runner 频道
- **Twitter**: 关注 @nodeops, @ValidatorDAO
- **YouTube**: "How to Run Crypto Nodes" 教程

### 工具推荐
- **Uptime Kuma**: 免费的监控工具
- **Telegram Bot**: 告警通知
- **DeBank**: 追踪钱包活动

---

## 节点运营检查清单

### 启动前
- [ ] 研究项目背景和代币经济
- [ ] 确认硬件要求
- [ ] 准备服务器或云主机
- [ ] 学习基础 Linux 命令
- [ ] 阅读官方文档

### 部署中
- [ ] 完成系统初始化
- [ ] 安装必要软件
- [ ] 配置防火墙和安全
- [ ] 启动节点服务
- [ ] 验证同步状态

### 运营中
- [ ] 设置监控告警
- [ ] 加入社区获取更新
- [ ] 定期检查日志
- [ ] 及时更新软件
- [ ] 备份关键文件

---

## 常见问题 FAQ

**Q: 我需要多少技术知识？**
A: 基础的 Linux 命令行操作即可，跟着教程一步步来。建议先从轻节点开始。

**Q: 必须 24/7 在线吗？**
A: 是的，大部分节点需要保持在线以获得奖励。使用云服务器最可靠。

**Q: 一定会有空投吗？**
A: 不保证。但历史上多个项目都向节点运营者发放了空投。这是一种概率游戏。

**Q: 可以在 Windows 上运行吗？**
A: 大部分节点支持 Linux。建议使用 Ubuntu 22.04 LTS。

**Q: 电费和服务器费用值得吗？**
A: 取决于你的预期。如果获得空投，通常能覆盖成本并盈利。同时运行多个节点可以提高成功率。

**Q: 会被 Slash 吗？**
A: 轻节点通常不会被 Slash。只有验证节点才有惩罚机制。

---

## 总结

运行 Layer 2 节点是参与区块链生态的深度方式，虽然需要一定的技术能力和持续投入，但潜在收益可观。建议:

1. **从简单开始**: Celestia 轻节点是最好的入门选择
2. **分散风险**: 同时运行 2-3 个不同项目的节点
3. **长期视角**: 节点运营是 6-12 个月的长期投资
4. **持续学习**: 关注新项目，及早布局

记住：**早期参与 + 持续运营 = 更高空投概率**
`,
  category_l1: 'infrastructure',
  category_l2: 'node-running',
  category: 'infrastructure',
  risk_level: 3,
  threshold_capital: '\$240-\$600/年',
  threshold_capital_min: 240,
  threshold_tech_level: 'advanced',
  apy_min: 0,
  apy_max: 0,
  apy_type: 'one-time',
  time_commitment: 'high',
  time_commitment_minutes: 480,
  tags: ['节点运营', 'Layer 2', '基础设施', '空投', '技术向', '长期投资'],
  chains: ['Ethereum', 'Celestia', 'Eigenlayer', 'Avail'],
  protocols: ['Celestia', 'Eigenlayer', 'Scroll', 'Avail'],
  status: 'published',
  source_name: '社区经验 + 官方文档',
  source_url: 'https://docs.celestia.org',
  source_credibility: 4,
  published_at: new Date().toISOString()
};

async function login() {
  const response = await fetch(`\${DIRECTUS_URL}/auth/login`, {
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

  const response = await fetch(`\${DIRECTUS_URL}/items/strategies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer \${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(strategyWithId),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed: \${error}`);
    return false;
  }

  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  添加节点运行玩法');
    console.log('================================================');
    console.log('');

    console.log('🔐 登录中...\n');
    const token = await login();
    console.log('✅ 登录成功！\n');

    console.log(`📝 创建策略: \${strategy.title}\n`);
    const success = await createStrategy(token, strategy);

    if (success) {
      console.log('✅ 策略创建成功！\n');
      console.log('================================================');
      console.log('📊 详情:');
      console.log(`  标题: \${strategy.title}`);
      console.log(`  分类: 基础设施 - 节点运营`);
      console.log(`  风险等级: \${strategy.risk_level}/5`);
      console.log(`  技术要求: 高级`);
      console.log(`  年度成本: \$240-\$600`);
      console.log(`  潜在收益: \$1,000-\$10,000+`);
      console.log('================================================');
      console.log('');
      console.log('🎉 完成！\n');
      console.log('查看策略:');
      console.log(`  前端: http://localhost:3000/strategies/\${strategy.slug}`);
      console.log(`  后台: http://localhost:8055/admin/content/strategies`);
      console.log('');
    } else {
      console.log('❌ 创建失败');
      process.exit(1);
    }

  } catch (error) {
    console.error('');
    console.error('❌ 错误:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
