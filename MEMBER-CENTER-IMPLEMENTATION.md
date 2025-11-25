# 会员中心实现文档

**日期**: 2025-11-17
**版本**: v1.0.0
**状态**: ✅ 完成

---

## 📋 概述

会员中心是 PlayPass 积分系统的前端用户界面，整合了积分管理、每日签到、任务中心、提交玩法和邀请好友等功能。

---

## 🎯 功能特性

### 1. 总览 Tab
- **PlayPass 余额显示**: 完整余额卡片，展示当前积分和详细信息
- **每日签到**: 签到日历和奖励领取
- **快速操作**: 快速跳转到提交玩法和邀请好友
- **会员权益**: 显示当前会员等级和权益
- **任务预览**: 显示今日待完成任务（紧凑模式）

### 2. 任务中心 Tab
- **每日任务**: 可重复完成的日常任务
- **每周任务**: 每周可完成的挑战任务
- **任务进度**: 实时显示任务完成进度
- **积分奖励**: 明确显示每个任务的 PP 奖励
- **完成状态**: 视觉化展示已完成/未完成状态

### 3. 提交玩法 Tab
- **提交表单**: 标题、类别、详细内容
- **分类选择**: 从 Directus 动态加载策略分类
- **提交记录**: 显示用户历史提交和审核状态
- **状态标签**: 待审核、已通过、已拒绝
- **积分奖励**: 显示通过后获得的积分

### 4. 邀请好友 Tab
- **邀请统计**: 已邀请、已注册、获得积分
- **邀请链接**: 专属链接生成和一键复制
- **邀请记录**: 显示最近邀请的好友列表
- **规则说明**: 清晰的邀请规则和奖励机制

### 5. 交易记录 Tab
- **完整交易历史**: 使用 PPTransactions 组件
- **筛选功能**: 支持按类型、时间筛选
- **分页显示**: 最多显示 50 条记录

---

## 📁 文件结构

```
frontend/app/member-center/
├── page.tsx                           # 页面入口（元数据）
├── MemberCenterClient.tsx             # 主客户端组件（~330 行）
└── components/
    ├── TaskCenter.tsx                 # 任务中心组件（~340 行）
    ├── SubmitPlaySection.tsx          # 提交玩法组件（~230 行）
    └── InviteFriendSection.tsx        # 邀请好友组件（~280 行）
```

**总计**: 5 个文件，~1,180 行代码

---

## 🎨 UI 设计

### 布局结构

```
┌─────────────────────────────────────────────────┐
│  Header (固定顶部)                               │
│  - 用户头像                                      │
│  - 紧凑余额显示                                   │
│  - 会员徽章                                       │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  Tab 导航                                        │
│  [总览] [任务中心] [提交玩法] [邀请好友] [交易记录]│
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│                                                  │
│  Tab 内容区域                                     │
│                                                  │
│  (根据选中的 tab 动态显示)                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 颜色方案

- **主色调**: 蓝色 (Blue) - 积分相关
- **辅助色**:
  - 橙色 (Orange) - 任务中心
  - 紫色 (Purple) - 提交玩法
  - 粉色 (Pink/Rose) - 邀请好友
  - 绿色 (Green) - 成功状态

### 响应式设计

- **桌面端**: 3 列网格布局（总览页）
- **平板端**: 2 列网格布局
- **移动端**: 单列堆叠布局
- **Tab 导航**: 支持横向滚动

---

## 🔧 组件详解

### 1. MemberCenterClient.tsx

**主要功能**:
- Tab 状态管理
- 用户认证检查
- 页面布局和导航
- 整合所有子组件

**状态管理**:
```typescript
const [userId, setUserId] = useState<string | null>(null);
const [membershipLevel, setMembershipLevel] = useState(0);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'submit' | 'invite' | 'history'>('overview');
```

**依赖组件**:
- `PPBalance` - PlayPass 余额
- `DailySignin` - 每日签到
- `PPTransactions` - 交易记录
- `MembershipBadge` - 会员徽章
- `TaskCenter` - 任务中心
- `SubmitPlaySection` - 提交玩法
- `InviteFriendSection` - 邀请好友

---

### 2. TaskCenter.tsx

**主要功能**:
- 显示每日任务和每周任务
- 任务进度跟踪
- 任务完成和奖励领取
- 支持紧凑模式和完整模式

**任务类型**:
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  reward_pp: number;
  task_type: 'daily' | 'weekly' | 'achievement';
  action_required: string;
  completed: boolean;
  progress?: {
    current: number;
    target: number;
  };
}
```

**显示模式**:
- **紧凑模式** (`compact={true}`): 只显示前 3 个未完成任务
- **完整模式** (`compact={false}`): 分组显示所有任务

**演示数据**:
- 每日签到: +10 PP
- 浏览策略: +5 PP (进度: 2/5)
- 提交玩法: +50 PP
- 邀请好友: +100 PP (每周)

---

### 3. SubmitPlaySection.tsx

**主要功能**:
- 提交玩法表单
- 分类动态加载
- 提交历史记录
- 审核状态显示

**表单字段**:
```typescript
interface SubmissionForm {
  title: string;        // 玩法标题
  category: string;     // 玩法类别
  content: string;      // 详细内容
}
```

**提交状态**:
- `pending` - 待审核（黄色标签）
- `approved` - 已通过（绿色标签，显示获得积分）
- `rejected` - 已拒绝（红色标签，显示拒绝原因）

**分类来源**:
- 从 `getCategoryGroups()` 动态加载 Directus 分类
- 支持分类图标显示

---

### 4. InviteFriendSection.tsx

**主要功能**:
- 邀请统计展示
- 专属链接生成和复制
- 邀请记录列表
- 规则说明

**统计数据**:
```typescript
interface ReferralInfo {
  referral_link: string;
  stats: {
    total_invited: number;      // 已邀请人数
    total_registered: number;   // 已注册人数
    credits_earned: number;     // 获得积分
  };
  recent_referrals: Array<{
    id: string;
    username: string;
    registered_at: string;
    credit_awarded: boolean;
  }>;
}
```

**奖励机制**:
- 每成功邀请 1 人注册: +100 PP
- 无邀请数量限制
- 被邀请人也获得新手奖励

---

## 🔌 API 集成点

### 需要集成的 API

1. **任务中心**:
   - `GET /api/playpass/tasks` - 获取用户任务列表
   - `POST /api/playpass/tasks/{taskId}/claim` - 领取任务奖励

2. **提交玩法**:
   - `POST /api/play-exchange/submit` - 提交玩法
   - `GET /api/play-exchange/submissions` - 获取提交记录

3. **邀请好友**:
   - `GET /api/play-exchange/referral` - 获取邀请信息
   - `POST /api/play-exchange/referral/claim` - 领取邀请奖励

4. **用户认证**:
   - `useAuth()` hook - 获取当前用户信息
   - Supabase session - 获取访问令牌

---

## 📊 数据流

```
┌─────────────┐
│   用户访问   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  检查登录    │  ◄── useAuth() hook
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  加载数据    │  ◄── API 调用
│  - 余额      │
│  - 任务      │
│  - 提交记录  │
│  - 邀请信息  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  渲染页面    │  ◄── MemberCenterClient
│  - Tab 导航  │
│  - 子组件    │
└─────────────┘
```

---

## 🎯 使用方式

### 访问页面

```
URL: http://localhost:3000/member-center
```

### 导航菜单集成

在主导航菜单中添加链接:

```tsx
<Link href="/member-center">
  <User className="w-5 h-5" />
  <span>会员中心</span>
</Link>
```

### 权限要求

- ✅ 需要用户登录
- ✅ 未登录用户会被引导到登录页

---

## 🚀 下一步工作

### 1. API 集成

**优先级: 高**

- [ ] 创建 PlayPass 任务 API 端点
- [ ] 集成提交玩法 API（已存在，需连接）
- [ ] 集成邀请好友 API（已存在，需连接）
- [ ] 替换所有演示数据为真实 API 调用

### 2. 认证集成

**优先级: 高**

- [ ] 集成 Supabase 认证
- [ ] 实现登录保护
- [ ] 获取用户会员等级
- [ ] Session 管理

### 3. 功能增强

**优先级: 中**

- [ ] 任务自动完成检测
- [ ] 实时任务进度更新
- [ ] 提交玩法图片上传
- [ ] 邀请链接二维码生成
- [ ] 分享到社交媒体

### 4. 性能优化

**优先级: 中**

- [ ] 数据缓存策略
- [ ] 懒加载组件
- [ ] 图片优化
- [ ] 骨架屏加载状态

### 5. 测试

**优先级: 中**

- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E 测试
- [ ] 响应式测试

---

## 📝 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **通知**: Sonner (toast)
- **动画**: Framer Motion (部分组件)
- **认证**: Supabase Auth
- **状态管理**: React Hooks (useState, useEffect)

---

## 🎨 设计资源

### 图标使用

- `User` - 用户头像
- `Award` - 总览/奖励
- `Target` - 任务中心
- `Send` - 提交玩法
- `Users` - 邀请好友
- `History` - 交易记录
- `TrendingUp` - 余额/统计
- `Calendar` - 签到
- `Gift` - 奖励/礼物
- `CheckCircle2` - 完成状态
- `Clock` - 每日任务
- `Loader2` - 加载状态

### 渐变配色

```css
/* 主头像 */
from-blue-500 to-purple-500

/* 提交玩法 */
from-indigo-600 to-purple-600

/* 邀请好友 */
from-pink-600 to-rose-600

/* 任务中心 */
from-orange-500 to-orange-600

/* 背景 */
from-gray-50 via-blue-50 to-purple-50
```

---

## 🔍 代码示例

### 调用会员中心组件

```tsx
import MemberCenterClient from '@/app/member-center/MemberCenterClient';

export default function MemberCenterPage() {
  return <MemberCenterClient />;
}
```

### 使用任务中心组件

```tsx
// 紧凑模式（预览）
<TaskCenter userId={userId} compact />

// 完整模式
<TaskCenter userId={userId} />
```

### 整合到现有页面

```tsx
// 在个人资料页添加快速入口
<Link href="/member-center?tab=tasks">
  <Button>查看任务中心</Button>
</Link>

// 在策略详情页添加提交入口
<Link href="/member-center?tab=submit">
  <Button>提交类似玩法</Button>
</Link>
```

---

## ✅ 完成检查清单

### 页面结构
- [x] 页面入口 (page.tsx)
- [x] 主客户端组件 (MemberCenterClient.tsx)
- [x] Header 固定栏
- [x] Tab 导航
- [x] 响应式布局

### Tab 功能
- [x] 总览 Tab
- [x] 任务中心 Tab
- [x] 提交玩法 Tab
- [x] 邀请好友 Tab
- [x] 交易记录 Tab

### 组件开发
- [x] TaskCenter 组件（紧凑+完整模式）
- [x] SubmitPlaySection 组件
- [x] InviteFriendSection 组件

### UI/UX
- [x] 颜色方案
- [x] 图标系统
- [x] 加载状态
- [x] 空状态
- [x] 错误处理
- [x] 响应式设计

### 待完成
- [ ] API 集成
- [ ] 认证集成
- [ ] 真实数据替换演示数据
- [ ] 测试

---

## 📚 相关文档

- [PLAYPASS-PROJECT-SUMMARY.md](PLAYPASS-PROJECT-SUMMARY.md) - PlayPass 项目总结
- [PLAYPASS-README.md](PLAYPASS-README.md) - PlayPass 使用指南
- [PLAYPASS-PHASE6-DIRECTUS-INTEGRATION.md](PLAYPASS-PHASE6-DIRECTUS-INTEGRATION.md) - Directus 集成

---

## 🎉 总结

会员中心前端页面已完成基础开发，包含 5 个功能 Tab 和 3 个主要子组件。

**已完成**:
- ✅ 页面布局和导航
- ✅ 所有 Tab 界面
- ✅ 所有子组件
- ✅ UI/UX 设计
- ✅ 演示数据

**待集成**:
- ⏳ API 端点
- ⏳ 用户认证
- ⏳ 真实数据

**预计工作量**: API 集成约需 4-6 小时

---

**最后更新**: 2025-11-17
**版本**: v1.0.0
**状态**: ✅ 前端开发完成，等待 API 集成
**项目**: PlayNew.ai 会员中心
