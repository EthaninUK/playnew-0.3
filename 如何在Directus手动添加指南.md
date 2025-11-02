# 如何在 Directus 手动添加板块指南

## 方法 1：在 Directus 后台手动创建

### 步骤 1：进入 Strategies 集合
1. 打开 Directus 后台：http://localhost:8055
2. 点击左侧菜单的 "Strategies"
3. 点击右上角的 "+ 创建" 按钮

### 步骤 2：填写基本信息

#### 必填字段：

1. **Title** (标题)
   - 例如：`流动性挖矿完全指南`

2. **Slug** (URL 别名)
   - 英文，用连字符分隔
   - 例如：`liquidity-mining-guide`

3. **Summary** (摘要)
   - 1-2 句话的简短介绍
   - 例如：`流动性挖矿是 DeFi 中最常见的收益策略。本指南教你如何安全参与流动性挖矿，规避无常损失。`

4. **Category** (分类)
   - 点击输入框，会显示所有分类
   - 选择对应的分类（例如：借贷挖息）
   - 或者直接粘贴分类 ID（从你的截图中看到的格式）

5. **Category L1** (一级分类)
   - 选项：`airdrop`, `onchain-yield`, `arbitrage`, `derivatives`, `ecosystem-new`, `nft-assets`, `tools-infra`, `node-infra`, `mev-advanced`

6. **Category L2** (二级分类)
   - 填写中文分类名称
   - 例如：`借贷挖息`

7. **Status** (状态)
   - 选择 `published` 才会在前端显示

### 步骤 3：填写详细内容

8. **Content** (正文内容)
   - 支持 Markdown 格式
   - 可以包含标题、列表、粗体、斜体等

   ```markdown
   ## 什么是流动性挖矿？

   流动性挖矿（Liquidity Mining）...

   ### 为什么要参与？

   - **高收益**: 年化收益可达 20%-100%
   - **多样化**: 支持多种代币对

   ## 本板块推荐的内容类型

   ### 1. **稳定币池**
   低风险，适合新手...
   ```

9. **Difficulty Level** (难度等级)
   - 1 = 非常简单
   - 2 = 简单
   - 3 = 中等
   - 4 = 困难
   - 5 = 非常困难

10. **Risk Level** (风险等级)
    - 1 = 极低风险
    - 2 = 低风险
    - 3 = 中等风险
    - 4 = 高风险
    - 5 = 极高风险

11. **APY Min / APY Max** (年化收益率范围)
    - 填写数字，例如：`20` 和 `100`

12. **Min Capital / Recommended Capital** (资金要求)
    - 以美元计，例如：`100` 和 `1000`

### 步骤 4：可选字段

13. **Is Featured** (是否推荐)
    - 勾选后会在首页显示

14. **Steps** (步骤说明)
    - 如果有关联的 Strategy Details 表，可以在这里添加步骤

15. **Published At** (发布时间)
    - 会自动设置为当前时间

### 步骤 5：保存
- 点击右上角的 "保存" 按钮
- 保存后记录下 Slug，访问地址为：`http://localhost:3000/strategies/{slug}`

---

## 方法 2：使用脚本模板（更快）

### 步骤 1：获取分类 ID

在你的截图中，Category 字段显示的就是分类 ID（例如：`83a5412f-9dd0-46dc-bc62-704ab901445e`）

你可以通过以下方式查看所有分类：

```bash
curl -s 'http://localhost:8055/items/categories?fields=id,name,slug' | node -p "JSON.parse(require('fs').readFileSync(0)).data.map(c => \`\${c.name} (\${c.slug}): \${c.id}\`).join('\\n')"
```

### 步骤 2：编辑脚本模板

打开 `add-guide-template.js` 文件，修改配置区域：

```javascript
const GUIDE_CONFIG = {
  title: '流动性挖矿完全指南',
  slug: 'liquidity-mining-guide',
  summary: '流动性挖矿是 DeFi 中最常见的收益策略...',
  category: '7096a247-b8aa-4f36-9499-c88fdbbf5545', // 借贷挖息的分类 ID
  category_l1: 'onchain-yield',
  category_l2: '借贷挖息',
  difficulty_level: 2,
  risk_level: 2,
  apy_min: 20,
  apy_max: 100,
  min_capital: 100,
  recommended_capital: 1000,
  content: `你的 Markdown 内容...`,
  steps: [
    // 步骤说明...
  ]
};
```

### 步骤 3：运行脚本

```bash
node add-guide-template.js
```

---

## 如何查找分类 ID

### 方法 1：在 Directus 后台查看
1. 打开 Categories 集合
2. 点击某个分类
3. 浏览器地址栏中 URL 的最后一段就是 ID
   - 例如：`http://localhost:8055/admin/content/categories/7096a247-b8aa-4f36-9499-c88fdbbf5545`
   - ID 就是：`7096a247-b8aa-4f36-9499-c88fdbbf5545`

### 方法 2：使用脚本查询

创建一个查询脚本：

```javascript
// show-categories.js
const axios = require('axios');

axios.get('http://localhost:8055/items/categories?fields=id,name,slug&sort=name')
  .then(response => {
    console.log('\n所有分类列表：\n');
    response.data.data.forEach(cat => {
      console.log(`名称: ${cat.name}`);
      console.log(`Slug: ${cat.slug}`);
      console.log(`ID: ${cat.id}`);
      console.log('---');
    });
  })
  .catch(error => {
    console.error('查询失败:', error.message);
  });
```

运行：`node show-categories.js`

---

## 需要创建指南的分类列表

根据现有的分类，以下是一些可能需要创建指南的分类：

### 空投与早期参与类
- ✅ 空投任务 (airdrop-tasks) - 已创建
- ✅ 积分赛季 (points-season) - 已创建
- ✅ 测试网&早鸟 (testnet) - 已创建
- ✅ 启动板&配售 (launchpad) - 已创建
- ✅ 白名单/预售 (whitelist) - 已创建

### 链上收益策略类
- ⏳ 借贷挖息 (lending)
- ⏳ 流动性引导 (liquidity-mining)
- ⏳ 稳定币理财 (stablecoin-yield)
- ⏳ 再质押/LRT (restaking)
- ⏳ LST 质押 (lst-staking)

### 套利策略类
- ⏳ 跨所搬砖 (cex-arbitrage)
- ⏳ 三角/跨链套利 (triangle-arbitrage)
- ⏳ 稳定币脱锚 (depeg-arbitrage)
- ⏳ 资金费套利 (funding-arbitrage)

### 衍生品策略类
- ⏳ 网格/趋势 (grid-trading)
- ⏳ 期权卖方 (options-selling)
- ⏳ 期现基差 (basis-trading)

### NFT 与链上资产类
- ⏳ NFT 铸造 (nft-minting)
- ⏳ NFT 金融 (nft-fi)

---

## 推荐工作流程

1. **先确定要创建的分类**
2. **查找该分类的 ID**
3. **复制 `add-guide-template.js` 并重命名**
   - 例如：`add-lending-guide.js`
4. **编辑文件，填写内容**
5. **运行脚本创建**
6. **在浏览器中验证**

这样可以批量快速创建高质量的指南内容！
