# 前端快速启动指南

## ✅ 已完成的工作

1. **创建 Next.js 项目结构**
   - TypeScript + Tailwind CSS
   - App Router (Next.js 15)
   - Directus SDK 集成

2. **已创建的核心文件**
   - `lib/directus.ts` - Directus 客户端和 API 函数
   - `app/layout.tsx` - 根布局(导航栏 + 页脚)
   - `app/page.tsx` - 首页
   - `app/globals.css` - 全局样式
   - `.env.local` - 环境变量

3. **已实现的功能**
   - 首页 Hero 区域
   - 分类展示
   - 精选玩法卡片
   - 统计数据
   - 响应式设计

## 🚀 启动项目

### 前提条件

确保 Directus 正在运行:
```bash
# 在项目根目录
docker-compose up -d
```

### 启动开发服务器

```bash
cd frontend
npm run dev
```

访问: http://localhost:3000

## 📁 项目结构

```
frontend/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   ├── strategies/          # 玩法相关页面
│   └── about/               # 关于页面
├── lib/
│   └── directus.ts          # Directus 客户端
├── components/              # 可复用组件
├── types/                   # TypeScript 类型
├── public/                  # 静态资源
├── .env.local               # 环境变量
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.ts       # Tailwind 配置
└── next.config.ts           # Next.js 配置
```

## 🎨 首页功能

### 1. Hero 区域
- 大标题
- 描述文案
- CTA 按钮(跳转到玩法列表)

### 2. 分类展示
- 从 Directus 获取所有分类
- 网格布局
- 点击跳转到筛选页面

### 3. 精选玩法
- 显示最新的 6 个已发布玩法
- 显示:
  * 标题
  * 风险等级徽章
  * 简介
  * APY 范围
  * 起投金额

### 4. 统计数据
- 玩法数量
- 分类数量
- 支持的链数量

## 📝 下一步开发建议

### 1. 玩法列表页 (`/strategies`)

创建 `app/strategies/page.tsx`:
- 显示所有玩法
- 筛选功能(按分类、风险等级、APY)
- 排序功能
- 分页

### 2. 玩法详情页 (`/strategies/[slug]`)

创建 `app/strategies/[slug]/page.tsx`:
- 显示完整内容(Markdown渲染)
- 标签和分类
- 支持的链和协议
- 相关推荐

### 3. 组件化

创建可复用组件:
```
components/
├── StrategyCard.tsx        # 玩法卡片
├── CategoryFilter.tsx      # 分类筛选器
├── RiskBadge.tsx          # 风险徽章
└── SearchBar.tsx          # 搜索栏
```

### 4. 添加 Meilisearch 搜索

集成 Meilisearch 实现全文搜索功能。

### 5. 状态管理

使用 Zustand 管理:
- 筛选条件
- 收藏列表
- 用户偏好

## 🔧 常用命令

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🌐 API 端点

所有 API 调用在 `lib/directus.ts` 中:

```typescript
// 获取玩法列表
const strategies = await getStrategies(10)

// 获取单个玩法
const strategy = await getStrategy('uniswap-v3-concentrated-liquidity')

// 获取分类
const categories = await getCategories()

// 获取标签
const tags = await getTags()

// 获取链
const chains = await getChains()
```

## 🎯 Directus 数据

当前可用数据:
- ✅ 10 个玩法策略
- ✅ 8 个分类
- ✅ 6 个标签
- ✅ 6 条区块链
- ✅ 5 个协议

## 🐛 故障排除

### 问题 1: 无法连接到 Directus

**解决方案**:
```bash
# 检查 Directus 是否运行
docker-compose ps

# 重启 Directus
docker-compose restart directus

# 检查环境变量
cat .env.local
```

### 问题 2: 数据获取失败

**解决方案**:
- 检查 Directus 权限是否配置正确
- 测试 API: `curl http://localhost:8055/items/strategies`
- 查看浏览器控制台错误

### 问题 3: 样式不生效

**解决方案**:
- 清除 .next 缓存: `rm -rf .next`
- 重新启动: `npm run dev`

## 📚 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **CMS**: Directus
- **状态管理**: Zustand
- **搜索**: Meilisearch (待集成)

## 🎨 设计规范

### 颜色
- 主色: Blue-600 (#2563EB)
- 成功: Green-600
- 警告: Yellow-600
- 危险: Red-600
- 灰度: Gray-50 to Gray-900

### 风险等级颜色
- 1 (极低): Green
- 2 (低): Blue
- 3 (中等): Yellow
- 4 (中高): Orange
- 5 (高): Red

### 间距
- 容器: max-w-7xl
- 内边距: px-4 sm:px-6 lg:px-8
- 卡片间距: gap-4 / gap-6

## 🚀 部署

### Vercel (推荐)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

环境变量:
- `NEXT_PUBLIC_DIRECTUS_URL`: 你的 Directus 生产环境 URL

### 其他平台
- Netlify
- Railway
- AWS Amplify

---

🎉 恭喜！前端基础框架已搭建完成！现在可以开始开发更多功能了。
