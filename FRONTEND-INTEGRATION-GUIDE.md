# 前端集成指南 - 玩法交换系统

## 🎯 集成概览

前端页面位于: `frontend/app/play-exchange/page.tsx`

需要集成的 API:
1. GET `/api/play-exchange/daily-featured` - 获取今日精选
2. GET `/api/play-exchange/user-info` - 获取用户信息
3. POST `/api/play-exchange/draw` - 翻牌交换
4. POST `/api/play-exchange/submit` - 提交玩法
5. GET `/api/play-exchange/submit` - 获取提交记录
6. GET `/api/play-exchange/referral` - 获取邀请信息

---

## 📝 关键代码片段

### 1. 获取今日精选玩法

替换模拟数据 `DAILY_FEATURED_PLAYS` 为真实 API 调用:

```typescript
// 状态定义
const [dailyFeatured, setDailyFeatured] = useState<{
  date: string;
  theme_label: string;
  plays: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    card_index: number;
  }>;
} | null>(null);

// 加载函数
async function loadDailyFeatured() {
  try {
    const res = await fetch('/api/play-exchange/daily-featured');
    const data = await res.json();
    if (data.success) {
      setDailyFeatured(data.data);
    }
  } catch (error) {
    console.error('加载今日精选失败:', error);
  }
}

// 在 useEffect 中调用
useEffect(() => {
  loadDailyFeatured();
}, []);
```

---

### 2. 获取用户信息（积分、翻牌状态）

```typescript
import { supabase } from '@/lib/supabase';

// 状态定义
const [user, setUser] = useState<any>(null);
const [userInfo, setUserInfo] = useState<{
  credits: number;
  first_draw_used: boolean;
  referral_code: string;
  total_plays: number;
  my_plays: string[];
} | null>(null);

// 检查登录状态
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    setUser(session.user);
    await loadUserInfo(session.access_token);
  }
}

// 加载用户信息
async function loadUserInfo(token: string) {
  try {
    const res = await fetch('/api/play-exchange/user-info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setUserInfo(data.data);
      setCredits(data.data.credits);
      setHasUsedFirstFree(data.data.first_draw_used);
    }
  } catch (error) {
    console.error('加载用户信息失败:', error);
  }
}

// 初始化
useEffect(() => {
  checkAuth();
}, []);
```

---

### 3. 翻牌交换功能

修改 `handleFlipCard` 函数:

```typescript
async function handleFlipCard(index: number) {
  // 检查登录
  if (!user) {
    alert('请先登录');
    router.push('/auth/login');
    return;
  }

  if (selectedIndex !== null || isDrawing) return;

  setIsDrawing(true);
  setSelectedIndex(index);

  // 翻牌动画
  const newFlipped = [false, false, false];
  newFlipped[index] = true;
  setFlippedCards(newFlipped);

  // 延迟后调用 API
  setTimeout(async () => {
    const play = dailyFeatured?.plays[index];
    if (!play) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/play-exchange/draw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          card_index: index,
          play_id: play.id
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.data.message);
        setShowResult(true);
        // 刷新用户信息
        await loadUserInfo(session!.access_token);
      } else {
        alert(data.error);
        // 重置状态
        setIsDrawing(false);
        setSelectedIndex(null);
        setFlippedCards([false, false, false]);
      }
    } catch (error) {
      console.error('翻牌失败:', error);
      alert('翻牌失败，请稍后重试');
      setIsDrawing(false);
      setSelectedIndex(null);
      setFlippedCards([false, false, false]);
    }
  }, 800);
}
```

---

### 4. 提交玩法审核

修改 `handleSubmitPlay` 函数:

```typescript
async function handleSubmitPlay() {
  if (!user) {
    alert('请先登录');
    router.push('/auth/login');
    return;
  }

  if (!submissionForm.title || !submissionForm.category || !submissionForm.content) {
    alert('请填写完整信息');
    return;
  }

  setIsSubmitting(true);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/play-exchange/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionForm)
    });

    const data = await res.json();
    if (data.success) {
      alert(data.data.message);
      setSubmissionForm({ title: '', category: allCategories[0]?.slug || '', content: '' });
      await loadSubmissions(session!.access_token);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('提交失败:', error);
    alert('提交失败，请稍后重试');
  } finally {
    setIsSubmitting(false);
  }
}
```

---

### 5. 获取提交记录

```typescript
const [submissions, setSubmissions] = useState<Array<{
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  credits_awarded: number;
  review_notes: string;
  created_at: string;
}>>([]);

async function loadSubmissions(token: string) {
  try {
    const res = await fetch('/api/play-exchange/submit', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setSubmissions(data.data.submissions);
    }
  } catch (error) {
    console.error('加载提交记录失败:', error);
  }
}
```

---

### 6. 获取邀请信息

```typescript
const [referralInfo, setReferralInfo] = useState<{
  referral_code: string;
  referral_link: string;
  stats: {
    total_invited: number;
    total_registered: number;
    total_credits_earned: number;
  };
  records: Array<any>;
} | null>(null);

async function loadReferralInfo(token: string) {
  try {
    const res = await fetch('/api/play-exchange/referral', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setReferralInfo(data.data);
      setReferralCode(data.data.referral_code);
      setReferralStats({
        invited: data.data.stats.total_invited,
        registered: data.data.stats.total_registered,
        creditsEarned: data.data.stats.total_credits_earned
      });
    }
  } catch (error) {
    console.error('加载邀请信息失败:', error);
  }
}
```

---

## 🔄 完整初始化流程

```typescript
useEffect(() => {
  async function init() {
    // 1. 加载分类数据
    await loadCategories();

    // 2. 加载今日精选（无需登录）
    await loadDailyFeatured();

    // 3. 检查登录状态
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);

      // 4. 加载用户信息
      await loadUserInfo(session.access_token);

      // 5. 加载提交记录
      await loadSubmissions(session.access_token);

      // 6. 加载邀请信息
      await loadReferralInfo(session.access_token);
    }
  }

  init();
}, []);
```

---

## 📋 UI 更新要点

### 显示真实数据

1. **今日精选卡片**: 使用 `dailyFeatured?.plays` 替代 `DAILY_FEATURED_PLAYS`
2. **用户积分**: 显示 `userInfo?.credits`
3. **翻牌按钮文字**: 根据 `userInfo?.first_draw_used` 显示 "免费翻牌" 或 "消耗 1 积分"
4. **提交记录**: 映射 `submissions` 数组显示状态图标
5. **邀请统计**: 显示 `referralInfo?.stats`

### 添加 toast 通知

安装 sonner (已在 package.json 中):
```typescript
import { toast } from 'sonner';

// 成功提示
toast.success('翻牌成功！');

// 错误提示
toast.error('积分不足');
```

---

## 🧪 测试步骤

### 1. 准备测试账号
```bash
# 在浏览器中访问
http://localhost:3000/auth/register

# 注册一个测试账号
```

### 2. 测试翻牌功能
1. 访问 `/play-exchange`
2. 查看今日精选（应显示 3 个真实玩法）
3. 点击任意卡片翻牌
4. 首次应该免费，查看积分余额没有变化
5. 再次翻牌应提示需要积分

### 3. 测试提交玩法
1. 填写提交表单
2. 提交后查看"我的提交记录"
3. 状态应显示为 "⏳ 审核中"

### 4. 测试邀请系统
1. 复制邀请链接
2. 用另一个浏览器无痕模式打开链接
3. 注册新账号
4. 原账号刷新页面，查看积分+1

---

## ⚠️ 注意事项

1. **错误处理**: 所有 API 调用都需要 try-catch
2. **Loading 状态**: 添加 loading spinner 提升用户体验
3. **权限检查**: 敏感操作前检查 `user` 状态
4. **Token 刷新**: Supabase 会自动处理 token 刷新
5. **数据同步**: API 操作成功后及时刷新相关数据

---

## 🚀 快速集成脚本

由于文件太大，我提供了一个辅助函数文件，可以直接导入使用:

创建 `frontend/lib/play-exchange-api.ts`:

```typescript
import { supabase } from './supabase';

// 获取 access token
async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
}

// API 封装
export const playExchangeAPI = {
  // 获取今日精选
  async getDailyFeatured() {
    const res = await fetch('/api/play-exchange/daily-featured');
    return res.json();
  },

  // 获取用户信息
  async getUserInfo() {
    const token = await getAccessToken();
    const res = await fetch('/api/play-exchange/user-info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // 翻牌
  async draw(cardIndex: number, playId: string) {
    const token = await getAccessToken();
    const res = await fetch('/api/play-exchange/draw', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ card_index: cardIndex, play_id: playId })
    });
    return res.json();
  },

  // 提交玩法
  async submitPlay(title: string, category: string, content: string) {
    const token = await getAccessToken();
    const res = await fetch('/api/play-exchange/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, category, content })
    });
    return res.json();
  },

  // 获取提交记录
  async getSubmissions() {
    const token = await getAccessToken();
    const res = await fetch('/api/play-exchange/submit', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // 获取邀请信息
  async getReferralInfo() {
    const token = await getAccessToken();
    const res = await fetch('/api/play-exchange/referral', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};
```

然后在页面中使用:
```typescript
import { playExchangeAPI } from '@/lib/play-exchange-api';

// 使用示例
const data = await playExchangeAPI.getDailyFeatured();
const userInfo = await playExchangeAPI.getUserInfo();
```

---

## 📖 下一步

完成集成后，运行以下测试:

```bash
# 1. 启动开发服务器
npm run dev

# 2. 访问页面
http://localhost:3000/play-exchange

# 3. 测试完整流程
- 注册/登录
- 查看今日精选
- 翻牌获取玩法
- 提交玩法
- 邀请好友
```

全部测试通过后，玩法交换系统即可上线！🎉
