# 排行榜(玩法)系统 - 完整开发规划

## 📋 项目概述

打造一个多维度的排行榜系统,展示平台上最受欢迎、最具价值的玩法策略,激励用户互动,提升平台活跃度。

---

## 🎯 核心功能模块

### 1. 排行榜类型 (6大榜单)

#### 1.1 热度榜 (Trending Plays)
- **排序依据**: 综合热度分 = 浏览量×0.3 + 收藏数×2 + 评论数×1.5 + 分享数×3
- **更新频率**: 实时更新(每小时重新计算)
- **时间窗口**: 最近7天、30天、全部时间
- **展示数量**: Top 20

#### 1.2 收益榜 (Top APY)
- **排序依据**: 策略的最高APY (apy_max)
- **分类**: 按风险等级分组
  - 低风险 (1-2级)
  - 中等风险 (3级)
  - 高风险 (4-5级)
- **标注**: 显示 APY 范围、风险等级、资金门槛
- **展示数量**: 每个风险级别 Top 10

#### 1.3 新人友好榜 (Beginner Friendly)
- **排序依据**:
  - 技术门槛低 (threshold_tech_level = 'beginner')
  - 资金门槛低 (threshold_capital_min < 1000)
  - 时间投入少 (time_commitment_minutes < 60)
- **综合评分**: 友好度分 = (6-风险等级)×20 + (3-技术难度)×15 + 收藏数×0.5
- **展示数量**: Top 15

#### 1.4 快速上手榜 (Quick Start)
- **排序依据**: 时间投入 (time_commitment_minutes ASC)
- **筛选条件**: 时间投入 < 30分钟
- **标注**: 显示预计时间、步骤数
- **展示数量**: Top 12

#### 1.5 社区推荐榜 (Community Favorites)
- **排序依据**: 收藏数 (bookmark_count DESC)
- **最低门槛**: 至少5个收藏
- **时间窗口**: 最近30天、全部时间
- **展示数量**: Top 20

#### 1.6 编辑精选榜 (Editor's Choice)
- **排序依据**: 手动设置 is_featured=true 的策略
- **排序字段**: featured_order (新增字段)
- **特点**: 完全由管理员控制
- **展示数量**: 精选10-15个

---

## 🗄️ 数据库设计

### 2.1 扩展 strategies 表

```sql
-- 新增字段
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS hotness_score DECIMAL(10,2) DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS last_hotness_update TIMESTAMP;

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_hotness_score ON strategies(hotness_score DESC);
CREATE INDEX IF NOT EXISTS idx_apy_max ON strategies(apy_max DESC);
CREATE INDEX IF NOT EXISTS idx_bookmark_count ON strategies(bookmark_count DESC);
CREATE INDEX IF NOT EXISTS idx_view_count ON strategies(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_featured ON strategies(is_featured, featured_order);
```

### 2.2 创建排行榜快照表 (可选-性能优化)

```sql
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_type VARCHAR(50) NOT NULL, -- 'trending', 'top_apy', 'beginner', 'quick', 'community', 'editor'
  time_window VARCHAR(20), -- '7d', '30d', 'all', 'low_risk', 'medium_risk', 'high_risk'
  data JSONB NOT NULL, -- 存储完整的排行榜数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_leaderboard_type_window
ON leaderboard_snapshots(leaderboard_type, time_window);

-- 创建更新时间索引
CREATE INDEX idx_leaderboard_updated ON leaderboard_snapshots(updated_at DESC);
```

### 2.3 用户互动记录表

```sql
CREATE TABLE IF NOT EXISTS strategy_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID, -- 可以为空(未登录用户)
  interaction_type VARCHAR(20) NOT NULL, -- 'view', 'bookmark', 'share', 'comment'
  metadata JSONB, -- 额外信息(如分享到的平台)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_interactions_strategy ON strategy_interactions(strategy_id, interaction_type);
CREATE INDEX idx_interactions_time ON strategy_interactions(created_at DESC);
CREATE INDEX idx_interactions_user ON strategy_interactions(user_id);
```

---

## 🎨 前端设计

### 3.1 页面结构

```
/leaderboard
├── /leaderboard?tab=trending         # 热度榜
├── /leaderboard?tab=top-apy          # 收益榜
├── /leaderboard?tab=beginner         # 新人友好榜
├── /leaderboard?tab=quick-start      # 快速上手榜
├── /leaderboard?tab=community        # 社区推荐榜
└── /leaderboard?tab=editor-choice    # 编辑精选榜
```

### 3.2 UI/UX 设计要点

#### 页面头部
```tsx
// 超炫酷排行榜标题区域
- 大标题: "玩法排行榜"
- 实时更新提示: 动态脉冲指示器
- 统计数据卡片:
  - 总策略数
  - 今日新增
  - 本周热门
  - 用户总互动数
```

#### Tab 切换栏
```tsx
// 6个Tab,支持:
- 图标 + 文字
- 激活态高亮动画
- 徽章显示(如"编辑精选"显示数量)
- 响应式布局(移动端可滚动)
```

#### 排行榜卡片设计
```tsx
// 每个策略卡片包含:
1. 排名徽章 (Top 3 特殊样式,金银铜)
2. 策略标题 + 分类图标
3. 关键指标展示:
   - 热度榜: 🔥 热度分 / 👁️ 浏览 / ⭐ 收藏
   - 收益榜: 💰 APY范围 / ⚠️ 风险等级
   - 新人榜: 🎯 友好度评分 / 💼 门槛 / ⏱️ 时间
   - 快速榜: ⚡ 预计时间 / 📋 步骤数
4. 快速操作按钮:
   - 查看详情
   - 收藏/取消收藏
   - 分享
5. 趋势指示器: ↗️ 上升 / ↘️ 下降 / — 持平
```

### 3.3 特殊交互

#### 筛选器 (收益榜特有)
```tsx
// 风险等级切换
<RiskLevelFilter>
  - 低风险 (1-2级)
  - 中等风险 (3级)
  - 高风险 (4-5级)
</RiskLevelFilter>
```

#### 时间窗口切换 (热度榜、社区榜)
```tsx
<TimeWindowSelector>
  - 最近7天
  - 最近30天
  - 全部时间
</TimeWindowSelector>
```

---

## 💻 技术实现

### 4.1 后端 API

#### API 路由设计

```typescript
// /frontend/app/api/leaderboard/route.ts
GET /api/leaderboard?type=trending&window=7d&limit=20
GET /api/leaderboard?type=top_apy&risk=low&limit=10
GET /api/leaderboard?type=beginner&limit=15
GET /api/leaderboard?type=quick&limit=12
GET /api/leaderboard?type=community&window=30d&limit=20
GET /api/leaderboard?type=editor&limit=15

// 响应格式
{
  "type": "trending",
  "window": "7d",
  "updatedAt": "2025-11-16T10:00:00Z",
  "data": [
    {
      "rank": 1,
      "strategy": { ...完整策略对象 },
      "metrics": {
        "hotnessScore": 8567.5,
        "viewCount": 12500,
        "bookmarkCount": 450,
        "commentCount": 89,
        "shareCount": 67,
        "trend": "up" // up/down/stable
      }
    }
  ],
  "total": 138,
  "metadata": {
    "calculatedAt": "2025-11-16T10:00:00Z",
    "algorithm": "hotness_v1"
  }
}
```

#### Directus API 函数

```typescript
// /frontend/lib/directus.ts

// 1. 获取热度榜
export async function getTrendingStrategies(options: {
  window?: '7d' | '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]>

// 2. 获取收益榜
export async function getTopAPYStrategies(options: {
  riskLevel?: 'low' | 'medium' | 'high';
  limit?: number;
}): Promise<RankedStrategy[]>

// 3. 获取新人友好榜
export async function getBeginnerFriendlyStrategies(options: {
  limit?: number;
}): Promise<RankedStrategy[]>

// 4. 获取快速上手榜
export async function getQuickStartStrategies(options: {
  limit?: number;
}): Promise<RankedStrategy[]>

// 5. 获取社区推荐榜
export async function getCommunityFavorites(options: {
  window?: '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]>

// 6. 获取编辑精选榜
export async function getEditorChoiceStrategies(options: {
  limit?: number;
}): Promise<RankedStrategy[]>

// 7. 计算热度分
export async function calculateHotnessScore(strategyId: string): Promise<number>

// 8. 批量更新热度分 (定时任务)
export async function updateAllHotnessScores(): Promise<void>
```

### 4.2 前端组件

#### 核心组件结构

```
/frontend/components/leaderboard/
├── LeaderboardPage.tsx          # 主页面组件
├── LeaderboardTabs.tsx          # Tab切换组件
├── RankedStrategyCard.tsx       # 排行榜卡片
├── RankBadge.tsx                # 排名徽章
├── MetricsDisplay.tsx           # 指标展示
├── TrendIndicator.tsx           # 趋势指示器
├── TimeWindowFilter.tsx         # 时间窗口筛选
├── RiskLevelFilter.tsx          # 风险等级筛选
├── LeaderboardStats.tsx         # 统计数据卡片
└── EmptyLeaderboard.tsx         # 空状态
```

#### 核心组件代码框架

```tsx
// LeaderboardPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { RankedStrategyCard } from '@/components/leaderboard/RankedStrategyCard';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';

type LeaderboardType = 'trending' | 'top_apy' | 'beginner' | 'quick' | 'community' | 'editor';

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('trending');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (type: LeaderboardType) => {
    setLoading(true);
    const response = await fetch(`/api/leaderboard?type=${type}`);
    const result = await response.json();
    setData(result.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* 头部统计 */}
      <LeaderboardStats />

      {/* Tab切换 */}
      <LeaderboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 排行榜列表 */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid gap-4">
            {data.map((item, index) => (
              <RankedStrategyCard
                key={item.strategy.id}
                rank={index + 1}
                strategy={item.strategy}
                metrics={item.metrics}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## ⚙️ 管理后台功能

### 5.1 Directus 后台配置

#### 字段配置
```yaml
strategies表:
  新增字段:
    - hotness_score: 热度分 (Decimal, 只读, 由定时任务更新)
    - share_count: 分享次数 (Integer, 默认0)
    - comment_count: 评论数 (Integer, 默认0)
    - featured_order: 精选排序 (Integer, 可手动设置)
    - last_hotness_update: 最后热度更新时间 (DateTime)

  界面配置:
    - 显示排序: featured_order, hotness_score DESC
    - 快速筛选: is_featured = true
    - 批量操作: 批量设置精选/取消精选
```

#### 权限设置
```yaml
Public角色:
  strategies:
    read:
      - 允许读取所有published策略
      - 包括 hotness_score, bookmark_count 等字段

Admin角色:
  strategies:
    read/update:
      - 可修改 is_featured, featured_order
      - 可查看完整的互动数据
      - 可手动触发热度重计算
```

### 5.2 管理界面增强

#### 自定义面板
```typescript
// 在 Directus Insights 中创建:

1. 热度排行榜面板
   - 图表: 横向柱状图
   - 数据: Top 20 热度策略
   - 更新: 每小时

2. APY分布面板
   - 图表: 散点图
   - X轴: 风险等级
   - Y轴: APY
   - 气泡大小: 收藏数

3. 分类占比面板
   - 图表: 饼图
   - 数据: 各分类策略数量

4. 互动趋势面板
   - 图表: 折线图
   - 数据: 最近30天 浏览/收藏/分享趋势
```

---

## 🔄 定时任务 & 数据更新

### 6.1 热度分计算任务

```typescript
// /scripts/update-hotness-scores.ts

import { directus } from '@/lib/directus';

export async function updateHotnessScores() {
  console.log('⏰ 开始更新热度分...');

  // 获取最近7天有互动的策略
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const strategies = await directus.request(
    readItems('strategies', {
      filter: { status: { _eq: 'published' } },
      fields: ['id', 'view_count', 'bookmark_count', 'comment_count', 'share_count', 'created_at'],
      limit: -1,
    })
  );

  for (const strategy of strategies) {
    // 计算热度分
    // 公式: view_count × 0.3 + bookmark_count × 2 + comment_count × 1.5 + share_count × 3
    const hotnessScore =
      (strategy.view_count || 0) * 0.3 +
      (strategy.bookmark_count || 0) * 2 +
      (strategy.comment_count || 0) * 1.5 +
      (strategy.share_count || 0) * 3;

    // 时间衰减因子 (越新的策略权重越高)
    const ageInDays = (Date.now() - new Date(strategy.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.max(0.5, 1 - (ageInDays / 365)); // 一年后衰减到50%

    const finalScore = hotnessScore * decayFactor;

    // 更新数据库
    await directus.request(
      updateItem('strategies', strategy.id, {
        hotness_score: finalScore.toFixed(2),
        last_hotness_update: new Date().toISOString(),
      })
    );
  }

  console.log(`✅ 已更新 ${strategies.length} 个策略的热度分`);
}

// Cron 配置: 每小时运行一次
// 0 * * * * node dist/scripts/update-hotness-scores.js
```

### 6.2 排行榜快照任务 (可选)

```typescript
// /scripts/generate-leaderboard-snapshots.ts

export async function generateLeaderboardSnapshots() {
  console.log('📸 生成排行榜快照...');

  const types = [
    { type: 'trending', windows: ['7d', '30d', 'all'] },
    { type: 'top_apy', windows: ['low', 'medium', 'high'] },
    { type: 'beginner', windows: ['all'] },
    { type: 'quick', windows: ['all'] },
    { type: 'community', windows: ['30d', 'all'] },
    { type: 'editor', windows: ['all'] },
  ];

  for (const config of types) {
    for (const window of config.windows) {
      const data = await fetchLeaderboardData(config.type, window);

      // 保存到快照表
      await directus.request(
        createItem('leaderboard_snapshots', {
          leaderboard_type: config.type,
          time_window: window,
          data: JSON.stringify(data),
          updated_at: new Date().toISOString(),
        })
      );
    }
  }

  console.log('✅ 排行榜快照生成完成');
}

// Cron 配置: 每30分钟运行一次
// */30 * * * * node dist/scripts/generate-leaderboard-snapshots.js
```

---

## 📱 移动端优化

### 7.1 响应式设计

```tsx
// 移动端优化要点:
1. Tab 可横向滚动
2. 卡片紧凑布局
3. 指标信息优先级排序
4. 触摸友好的按钮尺寸
5. 下拉刷新支持
```

### 7.2 性能优化

```typescript
// 虚拟滚动 (长列表)
import { useVirtualizer } from '@tanstack/react-virtual';

// 图片懒加载
import Image from 'next/image';

// 分页加载
const [page, setPage] = useState(1);
const loadMore = () => setPage(prev => prev + 1);
```

---

## 🚀 上线计划

### Phase 1: MVP (1-2周)
- ✅ 数据库字段扩展
- ✅ 基础 API 开发
- ✅ 3个核心榜单: 热度榜、收益榜、编辑精选榜
- ✅ 简单的前端展示页面
- ✅ 管理后台字段配置

### Phase 2: 完善功能 (1周)
- ✅ 新人友好榜、快速上手榜、社区推荐榜
- ✅ 时间窗口筛选
- ✅ 风险等级筛选
- ✅ 趋势指示器
- ✅ 分享功能

### Phase 3: 优化体验 (1周)
- ✅ 定时任务自动化
- ✅ 排行榜快照缓存
- ✅ 移动端优化
- ✅ 性能优化
- ✅ SEO 优化

### Phase 4: 数据分析 (持续)
- ✅ 用户行为追踪
- ✅ A/B 测试
- ✅ 算法调优
- ✅ 个性化推荐

---

## 📊 成功指标

### 核心 KPI
- 排行榜页面 PV: 目标 10,000/月
- 用户互动率: 目标 25% (浏览→收藏/分享)
- 平均停留时长: 目标 3分钟+
- 策略点击率: 目标 40%

### 内容质量
- Top 10 策略质量分: 目标 4.5/5
- 用户反馈评分: 目标 4.0/5
- 策略覆盖率: 各分类至少1个 Top 10

---

## 🛠️ 技术栈总结

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 + React 18 |
| 样式 | Tailwind CSS + shadcn/ui |
| 状态管理 | React Hooks + SWR |
| 后端 | Next.js API Routes |
| 数据库 | PostgreSQL (via Directus) |
| ORM | Directus SDK |
| 定时任务 | Node.js Cron / Directus Flows |
| 缓存 | Redis (可选) |
| 部署 | Vercel / 自托管 |

---

## 📝 注意事项

1. **数据一致性**: 确保热度分计算公式在前后端保持一致
2. **性能监控**: 排行榜查询可能成为热点,需监控数据库性能
3. **反作弊**: 防止刷榜行为,考虑加入用户行为检测
4. **灰度发布**: 先向小部分用户开放,收集反馈后全量上线
5. **备份方案**: 定时任务失败时,使用缓存数据兜底

---

## 🎉 总结

这是一个完整的排行榜系统方案,涵盖:
- ✅ 6大榜单类型,满足不同用户需求
- ✅ 完善的数据库设计
- ✅ 清晰的前后端架构
- ✅ 灵活的管理后台配置
- ✅ 自动化的数据更新机制
- ✅ 优秀的用户体验设计

建议从 Phase 1 的 MVP 开始,快速验证核心功能,然后根据用户反馈迭代优化!

需要我开始实现某个具体模块吗? 🚀
