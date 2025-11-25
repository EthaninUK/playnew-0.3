# 体力值系统设计方案

## 一、背景

由于政策和法律相关的规定，平台取消会员付费制度，改为基于"体力值"的免费内容访问控制系统。

---

## 二、核心概念

**体力值（Energy Points）** 是用户在平台上访问优质内容和功能的虚拟积分。这个系统完全免费，通过用户的活跃度和贡献来分配资源访问权限。

---

## 三、体力值系统核心机制

### 1. 基础属性

- **初始体力值**: 新用户注册获得 100 点
- **每日恢复**: 每天 00:00 (UTC+8) 自动恢复 50 点（需登录）
- **最大上限**: 根据用户等级 200-500 点
- **最小保留**: 保持至少 10 点（确保用户始终能访问基础内容）

### 2. 体力值消耗规则

| 内容类型 | 消耗体力值 | 说明 |
|---------|-----------|------|
| **免费内容** | 0 点 | 所有公开的基础策略、新闻列表页 |
| **普通策略详情** | 5 点/次 | 查看完整策略内容 |
| **高级策略详情** | 10 点/次 | 查看精选/高风险高回报策略 (`featured=true`) |
| **套利信号详情** | 15 点/次 | 查看实时套利机会详情 |
| **八卦详情** | 3 点/次 | 查看行业八卦完整内容 |
| **新闻详情** | 2 点/次 | 查看深度新闻分析 |
| **下载资料** | 20 点/次 | 下载PDF、表格等资料 |
| **AI对话** | 5 点/条 | 与AI助手对话（未来功能）|

**注意**:
- 同一内容720小时内重复访问不再扣除体力值
- 免费内容包括：首页、分类页、列表页、关于我们、帮助中心等

### 3. 体力值获取方式

| 行为 | 获得体力值 | 频率限制 | 说明 |
|------|----------|---------|------|
| **每日登录** | +10 点 | 每天1次 | 需在平台停留30秒以上 |
| **连续登录奖励** | +20 点 | 连续7天 | 断签需重新累计 |
| **完善个人资料** | +30 点 | 一次性 | 包括头像、简介、兴趣标签 |
| **分享内容** | +5 点 | 每天5次 | 分享到Twitter/Telegram等 |
| **发表评论** | +3 点 | 每天10条 | 有效评论（>20字） |
| **优质内容评论** | +10 点 | 管理员认定 | 深度分析、有价值观点 |
| **发布策略/攻略** | +50 点 | 审核通过 | 原创内容，质量审核 |
| **邀请新用户** | +40 点 | 每个新用户 | 新用户完成注册并活跃3天 |
| **参与调查问卷** | +15 点 | 不定期 | 平台产品调研 |
| **举报违规内容** | +20 点 | 审核通过 | 有效举报 |
| **观看广告** | +2 点 | 每天10次 | 完整观看15-30秒广告 |
| **完成每周任务** | +30 点 | 每周1次 | 阅读5篇文章、评论3次等 |

---

## 四、用户等级体系

用户等级影响体力上限和内容折扣：

### 🌱 新手用户 (0-500 累计活跃度)
- 体力上限: 200
- 每日恢复: 50
- 内容折扣: 无

### 🌿 活跃用户 (501-2000 累计活跃度)
- 体力上限: 300
- 每日恢复: 70
- 内容折扣: 策略消耗 -20%

### 🌳 资深用户 (2001-5000 累计活跃度)
- 体力上限: 400
- 每日恢复: 100
- 内容折扣: 策略消耗 -40%
- 特权: 部分普通策略免费

### 🏆 核心用户 (5000+ 累计活跃度)
- 体力上限: 500
- 每日恢复: 150
- 内容折扣: 策略消耗 -60%
- 特权: 大部分内容免费，仅高级策略和套利信号需消耗

### 累计活跃度计算公式

```
累计活跃度 = 登录天数 × 2 + 评论数 + 分享数 × 3 + 内容贡献数 × 10
```

---

## 五、技术实现方案

### 5.1 数据库设计

#### 表1: user_energy（用户体力表）

```sql
CREATE TABLE user_energy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  current_energy INT DEFAULT 100 CHECK (current_energy >= 0),
  max_energy INT DEFAULT 200 CHECK (max_energy > 0),
  daily_recovery INT DEFAULT 50,
  user_level VARCHAR(20) DEFAULT 'newbie' CHECK (user_level IN ('newbie', 'active', 'senior', 'core')),
  total_activity_score INT DEFAULT 0,
  last_recovery_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP DEFAULT NOW(),
  consecutive_login_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_user_energy_user_id ON user_energy(user_id);
CREATE INDEX idx_user_energy_level ON user_energy(user_level);
```

#### 表2: energy_transactions（体力交易记录）

```sql
CREATE TABLE energy_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  energy_change INT NOT NULL, -- 正数为获得，负数为消耗
  energy_before INT NOT NULL,
  energy_after INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'view_strategy', 'daily_login', 'share', etc.
  content_id UUID, -- 关联的内容ID（如果适用）
  content_type VARCHAR(50), -- 'strategy', 'news', 'arbitrage', 'gossip'
  description TEXT,
  metadata JSONB, -- 额外信息，如分享平台、评论内容等
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_energy_trans_user_id ON energy_transactions(user_id);
CREATE INDEX idx_energy_trans_type ON energy_transactions(transaction_type);
CREATE INDEX idx_energy_trans_created ON energy_transactions(created_at DESC);
CREATE INDEX idx_energy_trans_content ON energy_transactions(content_id, content_type);
```

#### 表3: content_energy_config（内容体力配置）

```sql
CREATE TABLE content_energy_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'news', 'arbitrage', 'gossip'
  is_premium BOOLEAN DEFAULT FALSE, -- 是否为高级内容
  is_free BOOLEAN DEFAULT FALSE, -- 是否完全免费
  base_energy_cost INT DEFAULT 0 CHECK (base_energy_cost >= 0),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(content_type, is_premium)
);

-- 初始数据
INSERT INTO content_energy_config (content_type, is_premium, is_free, base_energy_cost, description) VALUES
('strategy', false, false, 5, '普通策略详情'),
('strategy', true, false, 10, '精选高级策略'),
('news', false, false, 2, '新闻详情'),
('gossip', false, false, 3, '八卦详情'),
('arbitrage', false, false, 15, '套利信号详情');
```

#### 表4: user_content_access（用户内容访问记录）

用于实现"24小时内重复访问不扣费"功能：

```sql
CREATE TABLE user_content_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  first_accessed_at TIMESTAMP DEFAULT NOW(),
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  access_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_content_access_user_content ON user_content_access(user_id, content_id, content_type);
CREATE INDEX idx_content_access_time ON user_content_access(last_accessed_at);

-- 自动清理7天前的记录
CREATE OR REPLACE FUNCTION cleanup_old_content_access()
RETURNS void AS $$
BEGIN
  DELETE FROM user_content_access WHERE last_accessed_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
```

#### 表5: daily_tasks（每日任务配置）

```sql
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_key VARCHAR(50) NOT NULL UNIQUE, -- 'daily_login', 'share_content', etc.
  task_name VARCHAR(100) NOT NULL,
  description TEXT,
  energy_reward INT DEFAULT 0,
  daily_limit INT DEFAULT 1, -- 每日完成次数限制
  is_active BOOLEAN DEFAULT TRUE,
  required_action VARCHAR(50), -- 'login', 'share', 'comment', etc.
  metadata JSONB, -- 任务额外配置
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 初始任务数据
INSERT INTO daily_tasks (task_key, task_name, description, energy_reward, daily_limit, required_action) VALUES
('daily_login', '每日登录', '每天登录平台获得体力值', 10, 1, 'login'),
('share_content', '分享内容', '分享内容到社交媒体', 5, 5, 'share'),
('write_comment', '发表评论', '发表有效评论（>20字）', 3, 10, 'comment'),
('watch_ad', '观看广告', '观看完整广告', 2, 10, 'watch_ad');
```

#### 表6: user_task_progress（用户任务进度）

```sql
CREATE TABLE user_task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_key VARCHAR(50) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  completed_count INT DEFAULT 0,
  total_energy_earned INT DEFAULT 0,
  last_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_key, date)
);

-- 索引
CREATE INDEX idx_task_progress_user_date ON user_task_progress(user_id, date);
CREATE INDEX idx_task_progress_task ON user_task_progress(task_key, date);
```

---

### 5.2 API 端点设计

#### 1. GET /api/energy/status
获取用户当前体力值状态

**Response:**
```json
{
  "success": true,
  "data": {
    "current_energy": 150,
    "max_energy": 200,
    "daily_recovery": 50,
    "user_level": "active",
    "total_activity_score": 850,
    "next_recovery_at": "2025-01-12T00:00:00Z",
    "consecutive_login_days": 5
  }
}
```

#### 2. POST /api/energy/consume
消耗体力值（查看内容）

**Request:**
```json
{
  "content_type": "strategy",
  "content_id": "uuid-here",
  "content_slug": "uniswap-v3-strategy"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "energy_consumed": 5,
    "remaining_energy": 145,
    "transaction_id": "uuid-here",
    "is_free_access": false,
    "reason": "已在24小时内访问过" // 如果免费
  }
}
```

**Error Response (体力不足):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_ENERGY",
    "message": "体力值不足",
    "required": 10,
    "current": 5,
    "suggestions": [
      "完成每日登录任务获得 10 点",
      "分享内容获得 5 点",
      "观看广告获得 2 点"
    ]
  }
}
```

#### 3. POST /api/energy/earn
获得体力值（完成任务）

**Request:**
```json
{
  "action_type": "daily_login",
  "metadata": {
    "platform": "web",
    "session_duration": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "energy_earned": 10,
    "current_energy": 160,
    "transaction_id": "uuid-here",
    "message": "每日登录奖励 +10 体力值",
    "consecutive_login_days": 6,
    "bonus": null
  }
}
```

#### 4. GET /api/energy/transactions
查询体力交易历史

**Query Parameters:**
- `limit`: 每页数量 (默认 20)
- `offset`: 偏移量 (默认 0)
- `type`: 过滤类型 (可选)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "energy_change": -5,
        "energy_before": 150,
        "energy_after": 145,
        "transaction_type": "view_strategy",
        "content_type": "strategy",
        "description": "查看策略：Uniswap V3 流动性挖矿",
        "created_at": "2025-01-11T10:30:00Z"
      }
    ],
    "total_count": 48,
    "pagination": {
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### 5. GET /api/energy/daily-tasks
获取每日任务列表及进度

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-11",
    "tasks": [
      {
        "task_key": "daily_login",
        "task_name": "每日登录",
        "description": "每天登录平台获得体力值",
        "energy_reward": 10,
        "daily_limit": 1,
        "completed": true,
        "progress": {
          "current": 1,
          "total": 1
        },
        "next_available_at": "2025-01-12T00:00:00Z"
      },
      {
        "task_key": "share_content",
        "task_name": "分享内容",
        "description": "分享内容到社交媒体",
        "energy_reward": 5,
        "daily_limit": 5,
        "completed": false,
        "progress": {
          "current": 2,
          "total": 5
        },
        "next_available_at": null
      }
    ],
    "total_earned_today": 20
  }
}
```

#### 6. GET /api/energy/check-access
检查是否可以访问某个内容（不实际扣费）

**Query Parameters:**
- `content_type`: 内容类型
- `content_id`: 内容ID

**Response:**
```json
{
  "success": true,
  "data": {
    "can_access": true,
    "is_free": false,
    "energy_cost": 5,
    "current_energy": 150,
    "reason": "首次访问需消耗 5 点体力值",
    "already_accessed": false,
    "free_until": null
  }
}
```

#### 7. POST /api/energy/recover
手动触发体力恢复（仅管理员或定时任务）

**Request:**
```json
{
  "user_id": "uuid" // 可选，不传则恢复所有用户
}
```

---

### 5.3 定时任务设计

#### 每日体力恢复 (Cron Job)

**执行时间**: 每天 00:00 UTC+8

**伪代码**:
```sql
-- 更新所有用户的体力值
UPDATE user_energy
SET
  current_energy = LEAST(current_energy + daily_recovery, max_energy),
  last_recovery_at = NOW(),
  updated_at = NOW()
WHERE last_recovery_at < CURRENT_DATE;

-- 重置连续登录天数（超过48小时未登录）
UPDATE user_energy
SET consecutive_login_days = 0
WHERE last_login_at < NOW() - INTERVAL '48 hours';
```

#### 清理过期访问记录

**执行时间**: 每天 03:00 UTC+8

```sql
DELETE FROM user_content_access
WHERE last_accessed_at < NOW() - INTERVAL '7 days';
```

#### 用户等级更新

**执行时间**: 每小时

```sql
UPDATE user_energy
SET
  user_level = CASE
    WHEN total_activity_score >= 5000 THEN 'core'
    WHEN total_activity_score >= 2001 THEN 'senior'
    WHEN total_activity_score >= 501 THEN 'active'
    ELSE 'newbie'
  END,
  max_energy = CASE
    WHEN total_activity_score >= 5000 THEN 500
    WHEN total_activity_score >= 2001 THEN 400
    WHEN total_activity_score >= 501 THEN 300
    ELSE 200
  END,
  daily_recovery = CASE
    WHEN total_activity_score >= 5000 THEN 150
    WHEN total_activity_score >= 2001 THEN 100
    WHEN total_activity_score >= 501 THEN 70
    ELSE 50
  END
WHERE updated_at < NOW() - INTERVAL '1 hour';
```

---

### 5.4 前端组件设计

#### 组件1: EnergyDisplay（体力值显示）

位置：Header 组件中

```tsx
// components/energy/EnergyDisplay.tsx
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EnergyDisplayProps {
  current: number;
  max: number;
  level: string;
}

export function EnergyDisplay({ current, max, level }: EnergyDisplayProps) {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
      <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-gray-900">{current}</span>
          <span className="text-xs text-gray-500">/ {max}</span>
        </div>
        <Progress value={percentage} className="w-24 h-1.5" />
      </div>
    </div>
  );
}
```

#### 组件2: EnergyInsufficientDialog（体力不足弹窗）

```tsx
// components/energy/EnergyInsufficientDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, Gift, Share2, MessageSquare } from 'lucide-react';

interface Suggestion {
  icon: React.ReactNode;
  title: string;
  reward: number;
  action: () => void;
}

export function EnergyInsufficientDialog({
  open,
  onClose,
  required,
  current
}: Props) {
  const suggestions: Suggestion[] = [
    {
      icon: <Gift className="w-5 h-5" />,
      title: '完成每日任务',
      reward: 10,
      action: () => router.push('/tasks')
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: '分享内容',
      reward: 5,
      action: () => handleShare()
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: '发表评论',
      reward: 3,
      action: () => handleComment()
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            体力值不足
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            查看此内容需要 <strong>{required}</strong> 点体力值，
            您当前仅有 <strong>{current}</strong> 点。
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium">快速获取体力值：</p>
            {suggestions.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                onClick={item.action}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.title}
                </span>
                <span className="text-yellow-600">+{item.reward}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### 组件3: DailyTasksPanel（每日任务面板）

```tsx
// components/energy/DailyTasksPanel.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';

export function DailyTasksPanel() {
  const { data: tasks, isLoading } = useDailyTasks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>每日任务</CardTitle>
        <CardDescription>完成任务获取体力值</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks?.map(task => (
          <div key={task.task_key} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <div>
                <p className="font-medium">{task.task_name}</p>
                <p className="text-sm text-gray-500">
                  {task.progress.current}/{task.progress.total}
                </p>
              </div>
            </div>
            <span className="text-yellow-600 font-medium">+{task.energy_reward}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

#### 组件4: EnergyTransactionHistory（体力历史）

```tsx
// components/energy/EnergyTransactionHistory.tsx
export function EnergyTransactionHistory() {
  const { data, fetchNextPage, hasNextPage } = useEnergyTransactions();

  return (
    <div className="space-y-2">
      {data?.pages.map(page =>
        page.transactions.map(tx => (
          <div key={tx.id} className="flex items-center justify-between p-3 border-b">
            <div>
              <p className="text-sm font-medium">{tx.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
            <span className={cn(
              "font-medium",
              tx.energy_change > 0 ? "text-green-600" : "text-red-600"
            )}>
              {tx.energy_change > 0 ? '+' : ''}{tx.energy_change}
            </span>
          </div>
        ))
      )}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} variant="outline">
          加载更多
        </Button>
      )}
    </div>
  );
}
```

---

### 5.5 内容访问控制中间件

在查看详情页前拦截并检查体力值：

```tsx
// hooks/useEnergyGate.ts
export function useEnergyGate() {
  const router = useRouter();
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

  async function checkAndConsumeEnergy(
    contentType: string,
    contentId: string,
    contentSlug: string
  ): Promise<boolean> {
    try {
      // 1. 检查访问权限
      const checkRes = await fetch(
        `/api/energy/check-access?content_type=${contentType}&content_id=${contentId}`
      );
      const checkData = await checkRes.json();

      // 2. 如果免费或已访问过，直接通过
      if (checkData.data.is_free || checkData.data.already_accessed) {
        return true;
      }

      // 3. 检查体力值是否足够
      if (!checkData.data.can_access) {
        setShowInsufficientDialog(true);
        return false;
      }

      // 4. 消耗体力值
      const consumeRes = await fetch('/api/energy/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type: contentType, content_id: contentId })
      });

      if (!consumeRes.ok) {
        toast.error('体力值扣除失败');
        return false;
      }

      // 5. 显示成功提示
      const consumeData = await consumeRes.json();
      toast.success(`消耗 ${consumeData.data.energy_consumed} 点体力值`);

      return true;
    } catch (error) {
      console.error('Energy gate error:', error);
      return false;
    }
  }

  return { checkAndConsumeEnergy, showInsufficientDialog, setShowInsufficientDialog };
}
```

使用示例：

```tsx
// app/strategies/[slug]/page.tsx
export default function StrategyDetailPage({ params }: { params: { slug: string } }) {
  const { checkAndConsumeEnergy } = useEnergyGate();
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const allowed = await checkAndConsumeEnergy('strategy', strategyId, params.slug);
      setCanView(allowed);
    }
    checkAccess();
  }, [params.slug]);

  if (!canView) {
    return <EnergyGatePlaceholder />;
  }

  return <StrategyDetail strategy={strategy} />;
}
```

---

## 六、实施步骤

### Phase 1: 数据库和后端基础 (第1周)

**目标**: 建立体力值系统的数据基础

- [ ] 创建 `user_energy` 表
- [ ] 创建 `energy_transactions` 表
- [ ] 创建 `content_energy_config` 表
- [ ] 创建 `user_content_access` 表
- [ ] 创建 `daily_tasks` 表
- [ ] 创建 `user_task_progress` 表
- [ ] 编写初始化SQL脚本
- [ ] 为所有现有用户创建初始体力值记录

### Phase 2: API 端点开发 (第2周)

**目标**: 实现所有体力值相关API

- [ ] 实现 `/api/energy/status` (获取状态)
- [ ] 实现 `/api/energy/consume` (消耗体力)
- [ ] 实现 `/api/energy/earn` (获得体力)
- [ ] 实现 `/api/energy/transactions` (历史记录)
- [ ] 实现 `/api/energy/daily-tasks` (任务列表)
- [ ] 实现 `/api/energy/check-access` (检查访问权限)
- [ ] 编写API单元测试
- [ ] 编写API集成测试

### Phase 3: 定时任务和自动化 (第2周)

**目标**: 实现体力值自动恢复和管理

- [ ] 设置每日体力恢复 Cron Job
- [ ] 设置访问记录清理 Cron Job
- [ ] 设置用户等级自动更新 Cron Job
- [ ] 实现连续登录检测逻辑
- [ ] 实现活跃度自动计算
- [ ] 测试定时任务可靠性

### Phase 4: 内容标记和配置 (第3周)

**目标**: 为现有内容配置体力消耗

- [ ] 标记所有策略的 `featured` 字段（区分普通/高级）
- [ ] 配置新闻的体力消耗规则
- [ ] 配置八卦的体力消耗规则
- [ ] 配置套利信号的体力消耗规则
- [ ] 创建免费内容白名单
- [ ] 编写内容管理后台界面（Directus）

### Phase 5: 前端UI开发 (第3-4周)

**目标**: 实现用户侧的体力值界面

- [ ] 在 Header 添加体力值显示组件
- [ ] 创建体力不足弹窗组件
- [ ] 创建每日任务面板
- [ ] 创建体力历史记录页面
- [ ] 实现内容访问拦截逻辑 (`useEnergyGate`)
- [ ] 添加体力值变化动画效果
- [ ] 创建体力值说明页面 `/energy/help`
- [ ] 添加新手引导

### Phase 6: 用户体验优化 (第4周)

**目标**: 优化交互和视觉效果

- [ ] 添加体力值获得/消耗的 Toast 提示
- [ ] 优化体力不足时的引导流程
- [ ] 添加内容预览功能（不消耗体力）
- [ ] 实现"收藏"功能（已查看内容可免费再次访问）
- [ ] 添加体力值使用建议（智能推荐）
- [ ] A/B 测试不同的体力消耗值

### Phase 7: 测试和调优 (第5周)

**目标**: 确保系统稳定和平衡

- [ ] 进行内部测试（10-20人）
- [ ] 收集测试反馈
- [ ] 调整体力消耗/获取比例
- [ ] 性能测试（高并发场景）
- [ ] 安全测试（防止刷体力值）
- [ ] 修复发现的 Bug

### Phase 8: 清理旧系统 (第5周)

**目标**: 移除会员付费系统

- [ ] 删除 `/api/subscription` 相关代码
- [ ] 删除 `/api/memberships` 相关代码
- [ ] 删除 Stripe 支付集成
- [ ] 删除会员相关数据表（或标记为已弃用）
- [ ] 删除 `/pricing` 页面
- [ ] 删除 `/membership` 页面
- [ ] 更新文档和帮助中心

### Phase 9: 上线和监控 (第6周)

**目标**: 正式发布并持续监控

- [ ] 部署到生产环境
- [ ] 发布公告通知用户
- [ ] 设置数据监控面板（体力值消耗/获取统计）
- [ ] 监控用户反馈
- [ ] 准备应急回滚方案
- [ ] 持续优化参数

---

## 七、风险和应对

### 风险1: 体力值被刷

**风险**: 用户通过自动化脚本刷体力值

**应对**:
- 添加验证码（Google reCAPTCHA）
- 检测异常行为（短时间内大量操作）
- 设置每日任务的时间间隔限制
- 使用 IP 限流

### 风险2: 体力值不够用

**风险**: 用户反馈体力值太少，影响体验

**应对**:
- 初期设置较宽松的体力值（降低消耗50%）
- 根据数据逐步调整
- 提供更多获取体力的方式
- 对新用户给予额外奖励

### 风险3: 用户流失

**风险**: 部分用户不适应新系统离开

**应对**:
- 提前1-2周公告，说明原因
- 给予老用户补偿（额外体力值或等级）
- 提供详细的新手教程
- 收集反馈快速迭代

### 风险4: 技术故障

**风险**: 体力值系统出现 Bug 导致误扣或无法恢复

**应对**:
- 详细的日志记录
- 体力值交易可追溯、可回滚
- 定期备份数据
- 设置告警机制

---

## 八、数据监控指标

### 关键指标 (KPI)

1. **用户活跃度**
   - DAU (日活跃用户)
   - MAU (月活跃用户)
   - 平均停留时间

2. **体力值平衡**
   - 平均体力值余额
   - 每日体力消耗总量
   - 每日体力获取总量
   - 体力值消耗/获取比例（目标：0.8-1.2）

3. **内容访问**
   - 被查看内容的数量
   - 被查看最多的内容类型
   - 平均每用户每日访问内容数

4. **任务完成率**
   - 每日登录完成率
   - 分享任务完成率
   - 评论任务完成率

5. **用户等级分布**
   - 各等级用户占比
   - 等级晋升速度

### 监控 Dashboard

建议使用工具：
- **数据可视化**: Grafana / Metabase
- **日志分析**: Elasticsearch + Kibana
- **用户行为**: Mixpanel / Amplitude

---

## 九、优势总结

✅ **合规性**: 完全免费，无付费内容，符合监管要求
✅ **用户粘性**: 每日登录和任务机制提高 DAU/MAU
✅ **公平性**: 活跃用户获得更多权益，体现价值
✅ **可持续性**: 可通过广告、数据分析、API 授权等方式变现
✅ **灵活性**: 可随时调整体力消耗规则，快速响应市场
✅ **社区驱动**: 鼓励用户贡献内容、互动讨论
✅ **数据价值**: 用户行为数据更有价值（真实活跃度）

---

## 十、后续优化方向

### 短期（1-3个月）
- 增加更多获取体力的方式（问卷、推荐等）
- 优化任务系统（每周任务、成就系统）
- 添加体力值礼包（节日活动）

### 中期（3-6个月）
- 引入"VIP体验卡"（临时提升体力上限，非付费购买）
- 实现内容推荐算法（降低用户不感兴趣内容的消耗）
- 添加社交功能（好友互赠体力值）

### 长期（6-12个月）
- 开发体力值兑换系统（兑换实体奖品、合作平台优惠）
- 引入积分商城（用体力值兑换工具、服务）
- 构建创作者激励体系（内容贡献者分享收益）

---

## 十一、FAQ（常见问题）

**Q1: 为什么要取消会员制？**
A: 根据相关政策和法律规定，为确保平台合规运营，我们决定采用免费的体力值系统。

**Q2: 体力值会过期吗？**
A: 不会。您的体力值会一直保留，但会有上限限制。

**Q3: 如何快速获得体力值？**
A: 每日登录、分享内容、发表评论、邀请好友等都可以获得体力值。

**Q4: 可以购买体力值吗？**
A: 不可以。体力值系统完全免费，无法通过付费购买。

**Q5: 什么内容需要消耗体力值？**
A: 查看策略详情、套利信号、深度新闻等高价值内容需要消耗体力值。列表页、首页等基础内容完全免费。

**Q6: 体力值不够怎么办？**
A: 您可以通过完成每日任务、分享内容、发表评论等方式快速获取体力值。

**Q7: 同一内容会重复扣费吗？**
A: 不会。24小时内重复访问同一内容不会再次扣除体力值。

**Q8: 如何提升用户等级？**
A: 通过持续活跃、贡献内容、完成任务等方式提升活跃度，活跃度达到一定值会自动晋升等级。

---

## 附录

### A. 数据库完整初始化脚本

见 `/sql/init-energy-system.sql`

### B. API 详细文档

见 `/docs/api/energy-system.md`

### C. 前端组件库

见 `/frontend/components/energy/`

### D. 测试用例

见 `/tests/energy-system/`

---

**文档版本**: v1.0
**最后更新**: 2025-01-11
**作者**: PlayNew 产品团队
**审核**: [待审核]

