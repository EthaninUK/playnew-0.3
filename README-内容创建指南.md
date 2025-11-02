# PlayNew 内容创建完全指南

## 🎯 快速开始

你现在有两种方式创建板块指南：

### 方式 1：使用脚本（推荐，快速）

```bash
# 1. 查看所有分类和 ID
node show-all-categories.js

# 2. 复制模板并编辑
cp add-guide-template.js add-lending-guide.js

# 3. 编辑文件，填写内容（见下方详细说明）

# 4. 运行脚本创建
node add-lending-guide.js
```

### 方式 2：在 Directus 后台手动创建

1. 访问 http://localhost:8055
2. 进入 Strategies 集合
3. 点击右上角"+ 创建"按钮
4. 填写所有字段（见下方字段说明）
5. 保存

---

## 📝 创建指南的详细步骤（脚本方式）

### 步骤 1：选择要创建的分类

运行查看分类命令：
```bash
node show-all-categories.js
```

已创建指南的分类（✅）：
- 空投任务
- 积分赛季
- 测试网&早鸟
- 启动板&配售
- 白名单/预售

建议优先创建的分类（🔴 HIGH）：
- 借贷挖息 (id: 7096a247-b8aa-4f36-9499-c88fdbbf5545)
- 流动性引导 (id: c6d63661-1ef9-4cd0-8117-ed9fb518ca31)
- 稳定币理财 (id: c1540c56-581f-44e0-8885-a48106d7377c)
- 再质押/LRT (id: d0c8ecb8-2652-42d8-98b4-d334cc236e28)
- LST 质押 (id: fab597a5-2d87-479a-8682-be30d95e925a)

### 步骤 2：复制并编辑模板

```bash
# 创建新文件（以借贷挖息为例）
cp add-guide-template.js add-lending-guide.js

# 用你喜欢的编辑器打开
code add-lending-guide.js  # 或 vim, nano 等
```

### 步骤 3：填写配置信息

在 `GUIDE_CONFIG` 对象中填写以下内容：

```javascript
const GUIDE_CONFIG = {
  // 1. 基本信息
  title: '借贷挖息完全指南',  // 指南标题
  slug: 'lending-guide',      // URL slug（英文，连字符分隔）
  summary: '借贷挖息是 DeFi 中风险较低的收益策略...',  // 简短摘要（1-2句话）

  // 2. 分类信息
  category: '7096a247-b8aa-4f36-9499-c88fdbbf5545',  // 从 show-all-categories.js 复制
  category_l1: 'onchain-yield',  // 一级分类
  category_l2: '借贷挖息',        // 二级分类名称（中文）

  // 3. 难度和风险
  difficulty_level: 1,  // 1=非常简单, 2=简单, 3=中等, 4=困难, 5=非常困难
  risk_level: 2,        // 1=极低, 2=低, 3=中, 4=高, 5=极高

  // 4. 收益和资金
  apy_min: 5,           // 最低年化收益率（%）
  apy_max: 20,          // 最高年化收益率（%）
  min_capital: 100,     // 最低资金要求（USD）
  recommended_capital: 1000,  // 推荐资金（USD）

  // 5. 正文内容（Markdown 格式）
  content: `...`,  // 见下方内容结构

  // 6. 步骤说明
  steps: [...]  // 见下方步骤格式
};
```

### 步骤 4：编写正文内容

建议的内容结构（8000-15000 字）：

```markdown
## 什么是借贷挖息？

简要介绍概念、原理...

### 为什么要参与？

- **优势 1**: 详细说明
- **优势 2**: 详细说明
- **优势 3**: 详细说明

## 本板块推荐的内容类型

### 1. **类型 1**
详细说明...

**特点**:
- 特点 1
- 特点 2

**参与门槛**:
- 最低资金：XXX USD
- 技术要求：初级/中级/高级

### 2. **类型 2**
详细说明...

## 如何参与？

### 第一步：准备工作
1. 准备钱包
2. 准备资金
3. 了解平台

### 第二步：选择平台
- 平台 1 - 特点
- 平台 2 - 特点

### 第三步：存入资金
详细步骤...

### 第四步：收益管理
如何复投、提取收益...

## 成功策略

### 1. **风险分散策略**
不要把所有资金放在一个平台...

### 2. **收益优化策略**
如何最大化收益...

### 3. **时机选择策略**
什么时候进入/退出...

## 风险提示

### 主要风险
1. **智能合约风险**: 说明
2. **流动性风险**: 说明
3. **价格波动风险**: 说明

### 如何规避
- 规避方法 1
- 规避方法 2

## 推荐平台/工具

1. **平台 1**
   - 优势：...
   - 风险：...
   - 推荐指数：⭐⭐⭐⭐⭐

2. **平台 2**
   - ...

## 常见问题 FAQ

### Q1: 需要多少资金开始？
详细回答...

### Q2: 风险大吗？
详细回答...

### Q3: 收益能持续吗？
详细回答...

## 实战案例

### 案例 1：稳健型策略
- 投入：1000 USD
- 平台：Aave
- 周期：3 个月
- 收益：...

### 案例 2：进取型策略
- ...

## 总结与建议

总结性建议，包括：
- 适合人群
- 推荐配置
- 注意事项
```

### 步骤 5：填写步骤说明

```javascript
steps: [
  {
    step_number: 1,
    title: '准备钱包和资金',
    description: '创建或连接支持 EVM 的钱包（如 MetaMask），准备 USDT/USDC 等稳定币。建议准备至少 100 USD 以上的资金以覆盖 gas 费用。',
    estimated_time: '10-20 分钟'
  },
  {
    step_number: 2,
    title: '选择借贷平台',
    description: '研究并选择安全可靠的借贷平台，如 Aave、Compound 等。查看平台的 APY、TVL、安全审计报告等关键指标。',
    estimated_time: '30 分钟 - 1 小时'
  },
  {
    step_number: 3,
    title: '存入资金开始挖息',
    description: '连接钱包，选择要存入的资产和金额，确认交易。存入后立即开始产生利息，可随时查看收益。',
    estimated_time: '10-15 分钟'
  },
  {
    step_number: 4,
    title: '监控和优化',
    description: '定期检查 APY 变化，根据市场情况调整策略。可以将收益复投以实现复利效果。',
    estimated_time: '每周 10-20 分钟'
  },
  {
    step_number: 5,
    title: '提取收益',
    description: '收益可随时提取，无需等待锁定期。建议在 gas 费较低时批量提取以节省成本。',
    estimated_time: '5-10 分钟'
  }
]
```

### 步骤 6：运行脚本

```bash
node add-lending-guide.js
```

成功后会显示：
```
✅ 指南创建成功!
   ID: xxx-xxx-xxx
   Slug: lending-guide
   访问: http://localhost:3000/strategies/lending-guide
```

### 步骤 7：验证和更新前端配置

如果需要自动置顶，编辑 `frontend/lib/directus.ts`：

```typescript
const categoryGuides: Record<string, string> = {
  'airdrop-tasks': 'airdrop-tasks-guide',
  'points-season': 'points-season-guide',
  'testnet': 'testnet-guide',
  'launchpad': 'launchpad-guide',
  'whitelist': 'whitelist-guide',
  'lending': 'lending-guide',  // 添加新的映射
};
```

---

## 🖼️ 添加图片

### 步骤 1：修复字段（已完成）

已成功将 `cover_image` 字段更新为支持文件上传！

### 步骤 2：上传图片

两种方式：

**方式 A：在 Directus 后台上传**
1. 访问 http://localhost:8055
2. 点击左侧"文件"图标
3. 点击"+ Upload Files"
4. 选择图片上传

**方式 B：在编辑 Strategy 时直接上传**
1. 编辑任意 Strategy
2. 找到 Cover Image 字段
3. 点击字段可以直接上传或从库中选择

### 图片规范

- **尺寸**: 1200x630 px（推荐）
- **格式**: JPG, PNG, WebP
- **大小**: < 2MB
- **命名**: 英文，描述性，如 `lending-guide-cover.jpg`

---

## 📊 字段说明参考

### 必填字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| title | 文本 | 指南标题 | "借贷挖息完全指南" |
| slug | 文本 | URL slug | "lending-guide" |
| summary | 文本 | 简短摘要 | "借贷挖息是..." |
| category | UUID | 分类 ID | "7096a247-..." |
| category_l1 | 选择 | 一级分类 | "onchain-yield" |
| category_l2 | 文本 | 二级分类 | "借贷挖息" |
| content | 长文本 | 正文（Markdown） | "## 什么是..." |
| status | 选择 | 状态 | "published" |

### 可选但推荐字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| difficulty_level | 整数 | 难度（1-5） | 2 |
| risk_level | 整数 | 风险（1-5） | 2 |
| apy_min | 数字 | 最低 APY | 5 |
| apy_max | 数字 | 最高 APY | 20 |
| min_capital | 数字 | 最低资金 | 100 |
| recommended_capital | 数字 | 推荐资金 | 1000 |
| is_featured | 布尔 | 是否推荐 | true |
| cover_image | 文件 | 封面图片 | （上传文件） |

### Category L1 选项

- `airdrop` - 空投与早期参与
- `onchain-yield` - 链上收益策略
- `arbitrage` - 套利策略
- `derivatives` - 衍生品策略
- `ecosystem-new` - 生态任务与新链
- `nft-assets` - NFT 与链上资产
- `tools-infra` - 工具与基础设施
- `node-infra` - 节点与基础设施
- `mev-advanced` - MEV 与前沿策略

---

## 🎯 创建清单

使用这个清单确保指南质量：

### 内容质量
- [ ] 标题清晰，准确描述内容
- [ ] 摘要简洁，吸引读者
- [ ] 正文结构完整（概念、方法、策略、风险、FAQ）
- [ ] 内容长度 8000-15000 字
- [ ] Markdown 格式正确
- [ ] 包含实用的工具/平台推荐

### 技术配置
- [ ] Slug 使用英文和连字符
- [ ] 分类 ID 正确
- [ ] Category L1 和 L2 匹配
- [ ] 难度和风险等级合理
- [ ] APY 范围准确
- [ ] 资金要求合理
- [ ] Status 设为 published
- [ ] Is Featured 设为 true

### 步骤说明
- [ ] 包含 5 个步骤
- [ ] 每个步骤有标题、描述、预计时间
- [ ] 步骤逻辑清晰、可操作

### 验证测试
- [ ] 脚本运行成功
- [ ] 可以在后台看到新创建的指南
- [ ] 前端页面可以访问
- [ ] 在分类页面中显示正确
- [ ] 置顶功能工作正常（如果配置）
- [ ] 图片显示正常（如果添加）

---

## 🚀 批量创建建议

如果要创建多个指南，推荐顺序：

### 第一批（链上收益，用户需求大）
1. 借贷挖息
2. 稳定币理财
3. 流动性引导
4. 再质押/LRT
5. LST 质押

### 第二批（套利策略，进阶玩家）
1. 跨所搬砖
2. 资金费套利
3. 稳定币脱锚

### 第三批（新兴领域）
1. NFT 铸造
2. 新公链&L2

---

## 📚 参考资源

- 已创建的指南示例：
  - `add-airdrop-tasks-intro.js`
  - `add-points-season-guide.js`
  - `add-three-guides.js`

- 配置文件：
  - `frontend/lib/directus.ts` - 数据获取和置顶逻辑
  - `docker-compose.yml` - Directus 配置

- 文档：
  - `如何在Directus手动添加指南.md`
  - `图片视频使用完全指南.md`

---

## ❓ 常见问题

### Q: 创建后看不到指南？
A: 检查 `status` 是否设为 `published`

### Q: 指南没有置顶？
A: 需要在 `frontend/lib/directus.ts` 的 `categoryGuides` 中添加映射

### Q: 图片上传失败？
A: 确保已运行 `node fix-cover-image-field.js`

### Q: 如何修改已创建的指南？
A:
1. 在 Directus 后台找到对应的 Strategy
2. 直接编辑
3. 或使用脚本更新（需要知道 ID）

### Q: 可以删除指南吗？
A: 可以，在 Directus 后台删除即可，或将 status 改为 draft

---

## 💡 专业提示

1. **内容为王**: 花时间写高质量内容，比快速创建更重要
2. **参考现有**: 查看已创建的指南，保持风格一致
3. **用户视角**: 从初学者角度写，解释清楚每个概念
4. **实用性**: 提供具体的平台、工具、步骤
5. **更新维护**: 定期更新 APY、平台信息等
6. **添加图片**: 有图片的指南更吸引人
7. **SEO 友好**: Title 和 Summary 要包含关键词

---

需要帮助？运行这些命令：

```bash
# 查看所有分类
node show-all-categories.js

# 检查图片字段
node check-media-fields.js

# 创建新指南
node add-guide-template.js
```

祝你创建出优质的内容！🎉
