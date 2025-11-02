# 空投数据映射到现有玩法库 strategies 表 🎯

## 📊 你的现有结构分析

### 分类层级

#### 一级分类：空投与早期参与
- slug: `airdrops-early`

#### 二级分类（5个）
1. **空投任务** (`airdrop-tasks`) 🎁
2. **积分赛季** (`points-season`) ⭐
3. **测试网&早鸟** (`testnet`) 🔬
4. **启动板&配售** (`launchpad`) 🚀
5. **白名单/预售** (`whitelist`) 📝

---

## 🎯 数据映射方案

### 空投类型 → 二级分类映射

| 空投类型 | 映射到二级分类 | 说明 |
|---------|--------------|------|
| Task-based Airdrop | `airdrop-tasks` | 完成任务即可获得空投 |
| Points/Season Airdrop | `points-season` | 积分赛季活动 |
| Testnet Airdrop | `testnet` | 测试网交互空投 |
| Launchpad/IDO | `launchpad` | 启动板配售 |
| Whitelist/Presale | `whitelist` | 白名单/预售资格 |
| Retroactive | `airdrop-tasks` | 追溯式空投（默认归到空投任务） |
| Snapshot | `airdrop-tasks` | 快照空投（默认归到空投任务） |

### 字段映射表

| 空投数据 | strategies 表字段 | 转换逻辑 |
|---------|------------------|---------|
| **项目名称** | `title` | 直接映射 |
| **项目简介** | `summary` | 直接映射（200字内） |
| **详细说明** | `content` | Markdown 格式，包含任务列表 |
| **项目 Logo** | `cover_image` | 直接映射 URL |
| **Slug** | `slug` | 项目名称转拼音或英文小写 |
| **一级分类** | `category_l1` | 固定值：`airdrops-early` |
| **二级分类** | `category_l2` 或 `category` | 根据空投类型映射（见上表） |
| **支持的链** | `chains` | 数组：`['ethereum', 'arbitrum']` |
| **涉及协议** | `protocols` | 数组：项目相关的协议 |
| **标签** | `tags` | 数组：`['DeFi', 'Layer2', '空投']` |
| **风险等级** | `risk_level` | `1-2`（低）、`3-4`（中）、`5`（高） |
| **难度** | `threshold_tech_level` | `beginner`/`intermediate`/`advanced` |
| **预估时间** | `time_commitment_minutes` | 转换为分钟数 |
| **预估价值** | `apy_min`/`apy_max` | 如果有美元估值，转换为年化收益率 |
| **开始时间** | `published_at` | 空投开始时间 |
| **结束时间** | 存储在 `content` 的元数据中 | 或自定义字段 |
| **数据来源** | `source_name` + `source_url` | 如：`CoinMarketCap` |
| **质量评分** | `source_credibility` | 0-100 |
| **浏览次数** | `view_count` | 默认 0 |
| **收藏次数** | `bookmark_count` | 默认 0 |

---

## 📝 Content 字段 Markdown 模板

```markdown
# {项目名称}

## 🎯 空投概览

- **类型**: {Task-based / Points Season / Testnet}
- **总价值**: ${total_value} USD
- **代币**: {token_symbol}
- **支持链**: {blockchain列表}
- **结束时间**: {end_date}
- **融资情况**: {funding_amount} (投资方: {backers})

## 📋 参与任务

### 必做任务

{遍历 required tasks}

#### {task_number}. {task.title} ({task.points} 积分)

{task.description}

**类型**: {task.type}
**验证方式**: {task.verification}

{如果是链上任务，添加详细步骤}

### 可选任务

{遍历 optional tasks}

## 🔗 相关链接

- 官网: {project_website}
- Twitter: {project_twitter}
- Discord: {project_discord}
- 任务详情: {source_url}

## ⚠️ 风险提示

{根据 risk_level 生成风险提示}

## 📊 数据来源

本信息来自 {source}，最后更新于 {updated_at}
```

---

## 🚀 实现方案

### 方案 A：复用现有 strategies 表（推荐）

**优点**:
- ✅ 不需要修改数据库
- ✅ 无缝集成到现有页面
- ✅ 使用现有的筛选、搜索功能
- ✅ 统一的用户体验

**缺点**:
- ⚠️ 部分空投特有字段需存储在 `content` 中
- ⚠️ 时间字段不够精细（只有开始时间）

### 实现步骤

1. **创建分类关联函数**
   ```javascript
   function mapAirdropTypeToCategory(airdropType) {
     const mapping = {
       'task-based': 'airdrop-tasks',
       'points': 'points-season',
       'testnet': 'testnet',
       'launchpad': 'launchpad',
       'whitelist': 'whitelist',
       'retroactive': 'airdrop-tasks',  // 默认
       'snapshot': 'airdrop-tasks'       // 默认
     };
     return mapping[airdropType] || 'airdrop-tasks';
   }
   ```

2. **获取分类 ID**
   ```javascript
   async function getCategoryId(slug) {
     const response = await axios.get(
       `${DIRECTUS_URL}/items/categories?filter[slug][_eq]=${slug}`
     );
     return response.data.data[0]?.id;
   }
   ```

3. **数据转换示例**
   ```javascript
   async function convertAirdropToStrategy(airdrop) {
     // 获取分类 ID
     const categoryId = await getCategoryId(
       mapAirdropTypeToCategory(airdrop.type)
     );

     // 生成 Markdown 内容
     const content = generateAirdropMarkdown(airdrop);

     // 映射到 strategy 格式
     return {
       title: airdrop.project_name,
       slug: slugify(airdrop.project_name),
       summary: airdrop.project_description.substring(0, 200),
       content: content,
       cover_image: airdrop.project_logo,

       // 分类
       category_l1: 'airdrops-early',
       category: categoryId,  // 二级分类 ID

       // 技术要求
       risk_level: calculateRiskLevel(airdrop.risk_level),
       threshold_tech_level: mapDifficulty(airdrop.difficulty),
       time_commitment_minutes: parseTimeToMinutes(airdrop.estimated_time),

       // 链和协议
       chains: airdrop.blockchain,
       protocols: [airdrop.project_name],
       tags: [...airdrop.tags, '空投', airdrop.type],

       // 数据来源
       source_name: airdrop.source,
       source_url: airdrop.source_url,
       source_credibility: airdrop.quality_score,

       // 状态
       status: 'published',
       published_at: airdrop.start_date,

       // 统计
       view_count: 0,
       bookmark_count: 0
     };
   }
   ```

---

## 🔧 辅助函数

### 1. 时间转换

```javascript
function parseTimeToMinutes(timeStr) {
  // "5分钟" -> 5
  // "1小时" -> 60
  // "3天" -> 4320
  if (!timeStr) return 0;

  const match = timeStr.match(/(\d+)\s*([分小时天周]/);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multiplier = {
    '分': 1,
    '小': 60,
    '时': 60,
    '天': 1440,
    '周': 10080
  };

  return value * (multiplier[unit] || 1);
}
```

### 2. 风险等级转换

```javascript
function calculateRiskLevel(riskStr) {
  // 'low' -> '1-2'
  // 'medium' -> '3-4'
  // 'high' -> '5'
  const mapping = {
    'low': '1-2',
    'medium': '3-4',
    'high': '5'
  };
  return mapping[riskStr] || '3-4';
}
```

### 3. 难度转换

```javascript
function mapDifficulty(difficulty) {
  const mapping = {
    'easy': 'beginner',
    'medium': 'intermediate',
    'hard': 'advanced'
  };
  return mapping[difficulty] || 'beginner';
}
```

### 4. Markdown 内容生成

```javascript
function generateAirdropMarkdown(airdrop) {
  let md = `# ${airdrop.project_name}\n\n`;

  // 概览
  md += `## 🎯 空投概览\n\n`;
  md += `- **类型**: ${airdrop.airdrop_type}\n`;
  md += `- **总价值**: ${airdrop.total_value || '待定'}\n`;
  md += `- **代币**: ${airdrop.token_symbol || '待公布'}\n`;
  md += `- **支持链**: ${(airdrop.blockchain || []).join(', ')}\n`;
  md += `- **结束时间**: ${airdrop.end_date || '待定'}\n\n`;

  // 项目描述
  md += `## 📖 项目介绍\n\n`;
  md += `${airdrop.project_description}\n\n`;

  // 任务列表
  if (airdrop.tasks && airdrop.tasks.length > 0) {
    md += `## 📋 参与任务\n\n`;

    const requiredTasks = airdrop.tasks.filter(t => t.required);
    const optionalTasks = airdrop.tasks.filter(t => !t.required);

    if (requiredTasks.length > 0) {
      md += `### 🔴 必做任务\n\n`;
      requiredTasks.forEach((task, i) => {
        md += `#### ${i + 1}. ${task.title} (${task.points || 0} 积分)\n\n`;
        md += `${task.description}\n\n`;
        if (task.target_url) {
          md += `**链接**: [${task.platform || '查看详情'}](${task.target_url})\n\n`;
        }
      });
    }

    if (optionalTasks.length > 0) {
      md += `### 🟡 可选任务\n\n`;
      optionalTasks.forEach((task, i) => {
        md += `#### ${i + 1}. ${task.title} (${task.points || 0} 积分)\n\n`;
        md += `${task.description}\n\n`;
      });
    }
  }

  // 相关链接
  md += `## 🔗 相关链接\n\n`;
  if (airdrop.project_website) {
    md += `- [官网](${airdrop.project_website})\n`;
  }
  if (airdrop.project_twitter) {
    md += `- [Twitter](${airdrop.project_twitter})\n`;
  }
  if (airdrop.project_discord) {
    md += `- [Discord](${airdrop.project_discord})\n`;
  }
  md += `- [任务详情](${airdrop.source_url})\n\n`;

  // 风险提示
  md += `## ⚠️ 风险提示\n\n`;
  if (airdrop.risk_level === 'high') {
    md += `本项目为高风险项目，请谨慎参与。\n\n`;
  } else if (airdrop.risk_level === 'medium') {
    md += `本项目为中等风险项目，建议充分了解后参与。\n\n`;
  } else {
    md += `本项目风险相对较低，但仍需注意资金安全。\n\n`;
  }

  // 融资信息
  if (airdrop.funding_amount || airdrop.backers) {
    md += `## 💰 融资信息\n\n`;
    if (airdrop.funding_amount) {
      md += `- **融资金额**: ${airdrop.funding_amount}\n`;
    }
    if (airdrop.backers && airdrop.backers.length > 0) {
      md += `- **投资方**: ${airdrop.backers.join(', ')}\n`;
    }
    md += `\n`;
  }

  return md;
}
```

---

## 📊 示例数据

### 输入（空投数据）

```json
{
  "project_name": "zkSync Era",
  "project_description": "zkSync Era 是以太坊的 Layer 2 扩容解决方案",
  "project_logo": "https://example.com/zksync-logo.png",
  "project_website": "https://zksync.io",
  "project_twitter": "https://twitter.com/zksync",
  "airdrop_type": "task-based",
  "blockchain": ["ethereum", "zksync"],
  "total_value": "$100M",
  "token_symbol": "ZK",
  "difficulty": "medium",
  "estimated_time": "2小时",
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-03-31T23:59:59Z",
  "source": "CoinMarketCap",
  "source_url": "https://coinmarketcap.com/airdrop/zksync",
  "quality_score": 85,
  "risk_level": "low",
  "tags": ["Layer2", "zkRollup"],
  "tasks": [
    {
      "id": "task-1",
      "title": "连接钱包",
      "description": "使用 MetaMask 连接到 zkSync Era",
      "type": "wallet_connect",
      "required": true,
      "points": 10
    },
    {
      "id": "task-2",
      "title": "桥接资产",
      "description": "从以太坊桥接至少 0.01 ETH",
      "type": "bridge",
      "required": true,
      "points": 50
    }
  ]
}
```

### 输出（strategies 表数据）

```json
{
  "title": "zkSync Era",
  "slug": "zksync-era",
  "summary": "zkSync Era 是以太坊的 Layer 2 扩容解决方案",
  "content": "# zkSync Era\n\n## 🎯 空投概览\n\n- **类型**: task-based\n...",
  "cover_image": "https://example.com/zksync-logo.png",
  "category_l1": "airdrops-early",
  "category": "uuid-of-airdrop-tasks-category",
  "risk_level": "1-2",
  "threshold_tech_level": "intermediate",
  "time_commitment_minutes": 120,
  "chains": ["ethereum", "zksync"],
  "protocols": ["zkSync Era"],
  "tags": ["Layer2", "zkRollup", "空投", "task-based"],
  "source_name": "CoinMarketCap",
  "source_url": "https://coinmarketcap.com/airdrop/zksync",
  "source_credibility": 85,
  "status": "published",
  "published_at": "2025-01-01T00:00:00Z",
  "view_count": 0,
  "bookmark_count": 0
}
```

---

## ✅ 总结

通过这个映射方案：

1. ✅ **不需要修改数据库结构**
2. ✅ **完美适配现有分类体系**
3. ✅ **自动归类到"空投与早期参与"的 5 个子分类**
4. ✅ **所有空投数据都保存为 strategy 条目**
5. ✅ **用户在玩法库页面就能看到空投**
6. ✅ **详细的任务信息存储在 Markdown content 中**

**下一步：我立即为你实现 CoinMarketCap 抓取脚本！** 🚀
