const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ========================================
// 配置区域 - 在这里修改你的内容
// ========================================

const GUIDE_CONFIG = {
  // 标题
  title: '你的板块指南标题',

  // URL 友好的 slug（英文，用连字符分隔）
  slug: 'your-guide-slug',

  // 简短摘要（1-2 句话）
  summary: '这个板块的简短介绍...',

  // 分类 ID（从 Directus 后台复制）
  // 在 Directus 中打开对应分类，从 URL 中复制 ID
  category: '你的分类ID',

  // 一级分类标签（只能使用以下值）
  // 允许的值: 'airdrop', 'yield', 'liquidity', 'tools', 'nft'
  category_l1: 'yield',


 
  // 资金门槛（重要：使用正确的字段名！）
  threshold_capital: '100-1000 USD',        // 文本描述
  threshold_capital_min: 100,               // 最小资金（整数）

  // 时间投入
  time_commitment: '每周 1-2 小时',         // 文本描述
  time_commitment_minutes: 90,              // 时间（分钟）

  // 技术门槛（可选）
  threshold_tech_level: '初级',             // 初级/中级/高级

  // ========================================
  // 正文内容（支持 Markdown 格式）
  // ========================================
  content: `## 什么是 XXX?

简要介绍这个板块的概念...

### 为什么要参与？

- **优势 1**: 说明
- **优势 2**: 说明
- **优势 3**: 说明

## 本板块推荐的内容类型

### 1. **内容类型 1**
详细说明...

**特点**:
- 特点 1
- 特点 2

**参与门槛**:
- 门槛说明

### 2. **内容类型 2**
详细说明...

## 如何参与？

### 第一步：准备工作
详细步骤...

### 第二步：核心操作
详细步骤...

### 第三步：优化技巧
详细步骤...

## 成功策略

### 1. **策略 1**
详细说明...

### 2. **策略 2**
详细说明...

## 风险提示

### 主要风险
- 风险 1
- 风险 2

### 如何规避
- 规避方法 1
- 规避方法 2

## 推荐工具

1. **工具 1** - 说明
2. **工具 2** - 说明

## 常见问题 FAQ

### Q1: 问题 1？
答案...

### Q2: 问题 2？
答案...

## 总结

总结性建议...`,

  // ========================================
  // 步骤说明（5 个步骤）
  // ========================================
  steps: [
    {
      step_number: 1,
      title: '第一步标题',
      description: '详细说明...',
      estimated_time: '5-10 分钟'
    },
    {
      step_number: 2,
      title: '第二步标题',
      description: '详细说明...',
      estimated_time: '10-30 分钟'
    },
    {
      step_number: 3,
      title: '第三步标题',
      description: '详细说明...',
      estimated_time: '1-2 小时'
    },
    {
      step_number: 4,
      title: '第四步标题',
      description: '详细说明...',
      estimated_time: '持续参与'
    },
    {
      step_number: 5,
      title: '第五步标题',
      description: '详细说明...',
      estimated_time: '定期检查'
    }
  ]
};

// ========================================
// 自动执行代码 - 不需要修改
// ========================================

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ 指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);

  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
