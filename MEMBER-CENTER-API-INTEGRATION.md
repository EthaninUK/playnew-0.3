# 会员中心 API 集成文档

**日期**: 2025-11-17
**版本**: v1.1.0
**状态**: ✅ 基础集成完成

---

## 📋 集成概述

本文档记录会员中心前端页面与后端 API 的集成工作。

---

## ✅ 已完成工作

### 1. 数据库表设计 ✅

**文件**: `sql/03_create_playpass_tasks.sql` (~350 行)

**创建的表**:

| 表名 | 说明 | 字段数 |
|------|------|--------|
| `playpass_task_templates` | 任务模板表 | 10 |
| `playpass_user_tasks` | 用户任务进度表 | 12 |
| `playpass_task_completions` | 任务完成记录表 | 7 |

**特性**:
- ✅ 支持每日、每周、每月、成就任务
- ✅ 自动重置机制（通过周期时间范围）
- ✅ RLS 安全策略
- ✅ 辅助函数（`initialize_user_tasks`, `update_task_progress`）
- ✅ 自动更新触发器

**初始数据**:
- 4 个每日任务
- 3 个每周任务
- 5 个成就任务

---

### 2. API 端点开发 ✅

**文件**: `frontend/app/api/playpass/tasks/route.ts` (~300 行)

**端点**:

#### GET /api/playpass/tasks
获取用户的任务列表

**请求头**:
```
Authorization: Bearer {access_token}
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "每日签到",
      "description": "完成今日签到",
      "reward_pp": 10,
      "task_type": "daily",
      "action_required": "signin",
      "completed": false,
      "progress": {
        "current": 0,
        "target": 1
      }
    }
  ]
}
```

**当前状态**:
- ✅ 用户认证检查
- ✅ 返回演示数据
- ⏳ 数据库查询（已写好代码，等待数据库表创建）

#### POST /api/playpass/tasks
领取任务奖励

**请求体**:
```json
{
  "taskId": "1",
  "action": "claim"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "taskId": "1",
    "reward_pp": 10,
    "message": "任务奖励领取成功"
  }
}
```

**当前状态**:
- ✅ 用户认证检查
- ✅ 返回演示响应
- ⏳ 数据库更新（已写好代码，等待数据库表创建）

---

### 3. 辅助工具创建 ✅

**文件**: `frontend/lib/supabase-server.ts`

**功能**:
- ✅ `createClient(userToken)` - 创建带用户认证的客户端
- ✅ `createServiceClient()` - 创建服务端客户端（绕过 RLS）

**用途**:
- API routes 中创建 Supabase 客户端
- 支持用户级别和系统级别的数据访问

---

### 4. 用户认证集成 ✅

**更新的组件**:

#### MemberCenterClient.tsx
- ✅ 导入 `useAuth` hook
- ✅ 使用真实的用户认证状态
- ✅ 未登录自动跳转到登录页
- ✅ 添加 redirect 参数（登录后返回会员中心）
- ✅ 改进加载状态显示

**代码变更**:
```typescript
// 之前：使用演示数据
const demoUserId = 'demo-user-' + Date.now();
setUserId(demoUserId);

// 现在：使用真实认证
const { user: authUser, loading: authLoading } = useAuth();
if (!authUser) {
  router.push('/auth/login?redirect=/member-center');
} else {
  setUserId(authUser.id);
}
```

#### TaskCenter.tsx
- ✅ 导入 `useAuth` hook
- ✅ 使用 Supabase session token 调用 API
- ✅ 错误降级到演示数据（不影响用户体验）

**代码变更**:
```typescript
// 获取真实的 session token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// 使用 token 调用 API
const response = await fetch('/api/playpass/tasks', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

### 5. 配置脚本创建 ✅

#### setup-playpass-tasks.sh
Bash 脚本，用于执行 SQL 创建数据库表

**功能**:
- 检查 psql 工具
- 执行 SQL 文件
- 验证表创建
- 显示统计信息

#### setup-playpass-tasks-supabase.js
Node.js 脚本，用于通过 Supabase 客户端验证表

**功能**:
- 验证表是否存在
- 查看任务模板数量
- 提供手动配置指南

---

## ⏳ 待完成工作

### 1. 数据库表创建 ⏳

**问题**: 本地环境没有 psql 工具，需要通过其他方式创建

**解决方案**:

**选项 A: 使用 Supabase Dashboard** (推荐)
1. 登录 Supabase Dashboard
2. 打开 SQL Editor
3. 复制粘贴 `sql/03_create_playpass_tasks.sql`
4. 点击 Run 执行

**选项 B: 使用 Directus 数据库**
由于 Directus 连接的是同一个 Supabase 数据库，可以:
1. 找到 PostgreSQL 容器
2. 使用 docker exec 执行 SQL
3. 或者在 Directus 中手动创建表

**选项 C: 创建迁移端点**
创建 `/api/admin/migrate` 端点来执行 SQL

---

### 2. 连接现有 API ⏳

需要集成的现有 API:

#### 提交玩法 API
- **端点**: `/api/play-exchange/submit` (POST)
- **端点**: `/api/play-exchange/submissions` (GET)
- **状态**: 已存在 ✅
- **需要**: 在 SubmitPlaySection 组件中集成 ✅ (已有代码)

#### 邀请好友 API
- **端点**: `/api/play-exchange/referral` (GET)
- **状态**: 已存在 ✅
- **需要**: 在 InviteFriendSection 组件中集成 ✅ (已有代码)

**工作量**: 这两个组件已经编写了 API 调用代码，只需要:
1. 确保 API 端点正常工作
2. 测试数据流转

---

### 3. PlayPass 组件认证集成 ⏳

需要更新的 PlayPass 组件:

#### PPBalance
- 使用真实用户 ID
- 从 Supabase 获取余额

#### DailySignin
- 使用真实用户 ID
- 调用签到 API
- 更新任务进度

#### PPTransactions
- 使用真实用户 ID
- 从 Supabase 获取交易记录

**工作量**: 这些组件可能已经支持真实数据，需要验证。

---

### 4. 任务进度自动更新 ⏳

需要在相关页面添加任务进度跟踪:

| 操作 | 触发位置 | 任务 ID | API 调用 |
|------|----------|---------|----------|
| 查看策略 | `/strategies/[slug]` | `view_strategies` | `POST /api/playpass/tasks/progress` |
| 查看资讯 | `/news/[slug]` | `view_news` | `POST /api/playpass/tasks/progress` |
| 使用搜索 | 搜索组件 | `search` | `POST /api/playpass/tasks/progress` |
| 查看服务商 | `/providers/[slug]` | `view_providers` | `POST /api/playpass/tasks/progress` |

**实现方式**:
```typescript
// 在页面组件中
useEffect(() => {
  // 页面加载时更新任务进度
  updateTaskProgress('view_strategies');
}, []);

async function updateTaskProgress(action: string) {
  const { data: { session } } = await supabase.auth.getSession();
  await fetch('/api/playpass/tasks/progress', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });
}
```

---

## 🔧 技术实现细节

### 任务系统工作流程

```
┌─────────────────────────────────────────────────┐
│  1. 用户登录                                     │
│     ↓                                            │
│  2. 初始化用户任务                               │
│     - 调用 initialize_user_tasks()              │
│     - 创建当前周期的所有任务                     │
│     ↓                                            │
│  3. 用户执行操作                                 │
│     - 浏览策略、阅读资讯等                       │
│     ↓                                            │
│  4. 更新任务进度                                 │
│     - 调用 update_task_progress()               │
│     - current_count += 1                        │
│     ↓                                            │
│  5. 任务完成                                     │
│     - current_count >= target_count             │
│     - status = 'completed'                      │
│     ↓                                            │
│  6. 用户领取奖励                                 │
│     - 调用 claim API                             │
│     - 增加 PP 余额                               │
│     - status = 'claimed'                        │
│     ↓                                            │
│  7. 周期重置                                     │
│     - 每日 00:00 重置每日任务                    │
│     - 每周一 00:00 重置每周任务                  │
└─────────────────────────────────────────────────┘
```

### 数据流向

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   前端组件    │ ───→ │   API Route  │ ───→ │   Supabase   │
│  TaskCenter  │      │   /api/...   │      │   Database   │
└──────────────┘      └──────────────┘      └──────────────┘
       ↑                      ↓                      ↓
       │                 认证检查               RLS 策略
       │                      ↓                      ↓
       └──────────────── 返回数据 ←────────── 查询/更新
```

### 安全性

1. **RLS 策略**:
   - 用户只能查看自己的任务
   - 用户只能更新自己的任务进度
   - 任务模板公开可读

2. **认证检查**:
   - 所有 API 端点检查 Authorization header
   - 验证 JWT token 有效性
   - 获取当前用户 ID

3. **权限控制**:
   - 普通用户：查看、更新自己的数据
   - 服务角色：管理所有数据

---

## 📊 代码统计

### 新增文件

| 类型 | 数量 | 总行数 |
|------|------|--------|
| SQL 脚本 | 1 | ~350 |
| API Routes | 1 | ~300 |
| 工具函数 | 1 | ~40 |
| Bash 脚本 | 1 | ~150 |
| Node.js 脚本 | 1 | ~100 |
| **总计** | **5** | **~940** |

### 更新文件

| 文件 | 变更行数 | 说明 |
|------|----------|------|
| MemberCenterClient.tsx | ~30 | 集成用户认证 |
| TaskCenter.tsx | ~20 | 集成 API 调用 |
| **总计** | **~50** | |

### 总代码量

- **前端开发** (之前): ~1,180 行
- **API 集成** (本次): ~990 行
- **总计**: ~2,170 行

---

## 🚀 部署检查清单

### 数据库

- [ ] 在 Supabase 执行 `sql/03_create_playpass_tasks.sql`
- [ ] 验证 3 个表已创建
- [ ] 验证 12 个任务模板已插入
- [ ] 测试 RLS 策略
- [ ] 测试辅助函数

### API

- [ ] 测试 `GET /api/playpass/tasks` (未登录)
- [ ] 测试 `GET /api/playpass/tasks` (已登录)
- [ ] 测试 `POST /api/playpass/tasks` (领取奖励)
- [ ] 验证错误处理
- [ ] 验证降级机制

### 前端

- [ ] 测试会员中心页面（未登录）
- [ ] 测试会员中心页面（已登录）
- [ ] 测试任务中心功能
- [ ] 测试提交玩法功能
- [ ] 测试邀请好友功能
- [ ] 测试交易记录功能

### 集成

- [ ] 测试用户注册流程
- [ ] 测试任务初始化
- [ ] 测试任务进度更新
- [ ] 测试任务完成检测
- [ ] 测试任务奖励领取
- [ ] 测试任务周期重置

---

## 📝 使用指南

### 开发者

#### 1. 创建数据库表

```bash
# 选项 A: 使用 Supabase Dashboard
1. 打开 https://app.supabase.com
2. 选择项目
3. 进入 SQL Editor
4. 粘贴 sql/03_create_playpass_tasks.sql
5. 点击 Run

# 选项 B: 使用脚本（需要 psql）
chmod +x setup-playpass-tasks.sh
./setup-playpass-tasks.sh
```

#### 2. 启动开发服务器

```bash
cd frontend
npm run dev
```

#### 3. 访问会员中心

```
http://localhost:3000/member-center
```

#### 4. 测试 API

```bash
# 获取任务列表
curl -H "Authorization: Bearer {token}" \
  http://localhost:3000/api/playpass/tasks

# 领取奖励
curl -X POST -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId":"1","action":"claim"}' \
  http://localhost:3000/api/playpass/tasks
```

---

## 🔍 故障排除

### 问题 1: API 返回 401 Unauthorized

**原因**: Authorization header 缺失或无效

**解决**:
1. 确保用户已登录
2. 检查 session token 是否有效
3. 验证 Supabase 配置

### 问题 2: 任务列表为空

**原因**: 数据库表未创建或任务模板未插入

**解决**:
1. 检查数据库表是否存在
2. 运行 SQL 脚本创建表
3. 验证任务模板数据

### 问题 3: 任务进度不更新

**原因**: update_task_progress 函数未调用

**解决**:
1. 在相关页面添加进度跟踪代码
2. 检查 API 调用是否成功
3. 验证数据库更新

---

## 📚 相关文档

- [MEMBER-CENTER-IMPLEMENTATION.md](MEMBER-CENTER-IMPLEMENTATION.md) - 会员中心前端实现
- [PLAYPASS-PROJECT-SUMMARY.md](PLAYPASS-PROJECT-SUMMARY.md) - PlayPass 项目总结
- [PLAYPASS-README.md](PLAYPASS-README.md) - PlayPass 使用指南

---

## 🎉 总结

**已完成** (80%):
- ✅ 数据库表设计
- ✅ API 端点开发
- ✅ 辅助工具创建
- ✅ 用户认证集成
- ✅ 配置脚本创建

**待完成** (20%):
- ⏳ 数据库表创建（需手动执行 SQL）
- ⏳ 任务进度自动更新
- ⏳ PlayPass 组件认证验证
- ⏳ 完整功能测试

**下一步**:
1. 在 Supabase Dashboard 执行 SQL 创建表
2. 测试 API 端点
3. 添加任务进度跟踪到相关页面
4. 完整测试会员中心功能

---

**最后更新**: 2025-11-17
**版本**: v1.1.0
**状态**: ✅ 基础集成完成，等待数据库表创建
**项目**: PlayNew.ai 会员中心 API 集成
