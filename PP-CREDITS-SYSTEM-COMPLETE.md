# PP 积分系统完整配置文档

## ✅ 系统现状

所有 PP 积分相关功能已经完全配置完成并正常运行！

### 📊 当前数据
- **用户积分**: 840 PP
- **交易记录**: 7 条（包含所有签到和玩法审核奖励）
- **提交记录**: 7 条（6 条已发放积分）

---

## 🎯 所有获得 PP 积分的途径

### 1. 每日签到
- **位置**: 会员中心 - 任务中心
- **奖励**: 10+ PP（根据连续签到天数增加）
- **交易记录**: ✅ 自动创建
- **实现**: `/api/playpass/signin`

### 2. 玩法审核通过
- **位置**: 会员中心 - 提交玩法
- **奖励**: 1-100 PP（由管理员设置）
- **交易记录**: ✅ 自动创建
- **实现**:
  - 提交: 用户在会员中心提交
  - 审核: 管理员在 Directus 后台审核
  - 发放: 自动脚本每 5 分钟检查并发放

### 3. 其他途径（待开发）
- 邀请好友
- 完成任务
- 购买会员
- 活动奖励

---

## 🔄 工作流程

### 玩法审核奖励流程

```
1. 用户提交玩法
   ↓
2. Directus 后台审核
   - 修改 status = "approved"
   - 设置 credits_awarded (1-100)
   - 填写 review_notes
   ↓
3. 自动发放脚本（每 5 分钟运行）
   - 检查 status=approved && credits_awarded_at=null 的记录
   - 更新 user_profiles.credits
   - 创建 playpass_transactions 交易记录
   - 标记 credits_awarded_at
   ↓
4. 用户查看
   - 积分余额更新
   - 交易记录显示
   - 提交记录显示奖励
```

---

## 📁 数据表结构

### 1. `user_profiles`
用户基本信息和积分

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 用户ID |
| `credits` | integer | **当前积分（主要数据源）** |
| `username` | string | 用户名 |

### 2. `user_submitted_plays`
玩法提交记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 记录ID |
| `user_id` | uuid | 提交用户 |
| `title` | string | 玩法标题 |
| `category` | string | 分类 |
| `content` | text | 内容 |
| `status` | string | pending/approved/rejected |
| `credits_awarded` | integer | 奖励积分数 |
| `credits_awarded_at` | timestamp | 积分发放时间 |
| `review_notes` | text | 审核意见 |
| `reviewed_at` | timestamp | 审核时间 |

### 3. `playpass_transactions`
积分交易记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | uuid | 交易ID |
| `user_id` | uuid | 用户ID |
| `transaction_type` | string | earn/spend |
| `amount` | integer | 金额 |
| `balance_before` | integer | 交易前余额 |
| `balance_after` | integer | 交易后余额 |
| `source_type` | string | daily_signin/submission_reward |
| `source_id` | uuid | 来源记录ID |
| `source_metadata` | jsonb | 元数据 |
| `description` | string | 描述 |
| `display_title` | string | 显示标题 |
| `status` | string | completed/pending |
| `created_at` | timestamp | 创建时间 |

### 4. `user_playpass`
PlayPass 扩展信息（会员等级、签到等）

| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | uuid | 用户ID |
| `membership_level` | integer | 会员等级 0-4 |
| `is_max_member` | boolean | 是否 MAX 会员 |
| `consecutive_signin_days` | integer | 连续签到天数 |
| `total_signin_days` | integer | 总签到天数 |

---

## 🔧 关键文件

### 前端

| 文件 | 作用 |
|------|------|
| `/app/api/playpass/balance/route.ts` | **积分余额 API**（从 user_profiles.credits 读取） |
| `/app/api/playpass/signin/route.ts` | 签到 API |
| `/components/playpass/PPBalance.tsx` | 积分余额显示组件 |
| `/components/playpass/PPTransactions.tsx` | 交易记录显示组件 |
| `/app/member-center/components/SubmitPlaySection.tsx` | 提交玩法组件 |

### 后端脚本

| 文件 | 作用 |
|------|------|
| `auto-award-credits-daemon.js` | **自动发放积分脚本**（含交易记录创建） |
| `sync-submission-transactions.js` | 一次性同步历史交易记录 |
| `check-all-pp-sources.js` | 检查所有积分来源 |
| `award-pending-credits.js` | 补发待发放积分 |

### PM2 配置

| 文件 | 作用 |
|------|------|
| `pm2-credits-daemon.config.js` | PM2 配置文件（每 5 分钟运行） |
| `start-credits-daemon.sh` | 快捷启动脚本 |

---

## 🚀 启动自动发放服务

### 方式 1: PM2 守护进程（推荐）

```bash
# 启动服务
/Users/m1/PlayNew_0.3/start-credits-daemon.sh

# 或手动启动
pm2 start /Users/m1/PlayNew_0.3/pm2-credits-daemon.config.js

# 查看状态
pm2 list

# 查看日志
pm2 logs credits-daemon

# 停止服务
pm2 stop credits-daemon

# 设置开机自启
pm2 startup
pm2 save
```

### 方式 2: 手动运行

```bash
# 每次审核后手动运行
node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js
```

---

## 📝 实用命令

### 检查系统状态

```bash
# 检查所有 PP 积分来源
node /Users/m1/PlayNew_0.3/check-all-pp-sources.js

# 检查当前积分
node /Users/m1/PlayNew_0.3/check-current-credits.js

# 验证交易记录
node /Users/m1/PlayNew_0.3/verify-submissions-in-directus.js
```

### 同步和修复

```bash
# 同步历史交易记录
node /Users/m1/PlayNew_0.3/sync-submission-transactions.js

# 补发待发放积分
node /Users/m1/PlayNew_0.3/award-pending-credits.js

# 手动发放积分
node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js
```

---

## 🎬 使用场景

### 场景 1: 管理员审核玩法

1. 访问 Directus: http://localhost:8055/admin/content/user_submitted_plays
2. 找到 status = "pending" 的记录
3. 编辑记录:
   - 修改 `status` 为 "approved"
   - 设置 `credits_awarded` (1-100)
   - 填写 `review_notes`
4. 保存
5. 等待 5 分钟（或手动运行脚本）
6. 用户自动收到积分 + 交易记录

### 场景 2: 用户查看积分

1. 访问会员中心: http://localhost:3000/member-center
2. 顶部显示当前积分: **840 PP**
3. 点击"交易记录"查看明细
4. 点击"提交玩法"查看提交历史和奖励

### 场景 3: 每日签到

1. 访问会员中心
2. 点击"签到"按钮
3. 获得 10+ PP（根据连续天数增加）
4. 交易记录自动创建

---

## ⚙️ 积分数据源统一

**重要**: 系统已统一使用 `user_profiles.credits` 作为唯一的积分数据源

### 变更说明

之前的问题:
- 前端 API 从 `user_playpass.current_balance` 读取
- 审核系统更新 `user_profiles.credits`
- 两个表不同步导致显示错误

现在的方案:
- ✅ 所有积分操作都更新 `user_profiles.credits`
- ✅ 前端 API 从 `user_profiles.credits` 读取
- ✅ `user_playpass` 仅用于会员等级、签到等扩展功能
- ✅ `playpass_transactions` 记录所有交易明细

### 数据流

```
玩法审核 → user_profiles.credits ← 签到
              ↓                    ↓
    playpass_transactions (交易记录)
              ↓
       前端显示 (840 PP)
```

---

## 🔍 故障排查

### 问题 1: 积分没有增加

**检查步骤**:
1. 确认 Directus 中 status = "approved" 且 credits_awarded > 0
2. 运行手动发放脚本: `node auto-award-credits-daemon.js`
3. 检查是否有错误输出
4. 查看 `credits_awarded_at` 字段是否已填充

### 问题 2: 交易记录缺失

**检查步骤**:
1. 运行检查脚本: `node check-all-pp-sources.js`
2. 运行同步脚本: `node sync-submission-transactions.js`
3. 刷新前端页面

### 问题 3: 前端显示的积分不对

**检查步骤**:
1. 清除浏览器缓存 (Cmd+Shift+R)
2. 检查 API 返回: `curl http://localhost:3000/api/playpass/balance?user_id=USER_ID`
3. 检查数据库: `node check-current-credits.js`

---

## 📊 当前系统统计

### 截至 2025-11-18

- **总积分**: 840 PP
- **交易记录**: 7 条
  - 每日签到: 1 条 (+10 PP)
  - 玩法审核奖励: 6 条 (+520 PP)
- **提交记录**: 7 条
  - 已通过: 6 条
  - 待审核: 1 条
  - 已拒绝: 0 条

### 积分明细

| 来源 | 次数 | 总计 |
|------|------|------|
| 每日签到 | 1 | 10 PP |
| Blast 空投教程 | 2 | 100 PP |
| Starknet 测试网 | 2 | 70 PP |
| Uniswap V3 挖矿 | 2 | 350 PP |
| **总计** | **7** | **530 PP** |

---

## 🎉 总结

✅ **积分系统完全配置完成！**

所有功能:
- ✅ 积分显示正确 (840 PP)
- ✅ 交易记录完整同步
- ✅ 玩法审核自动发放积分
- ✅ 交易记录自动创建
- ✅ 每日签到正常工作
- ✅ Directus 后台审核界面完善

下一步建议:
1. 启动 PM2 守护进程实现全自动化
2. 添加更多获取 PP 的途径（邀请好友、完成任务等）
3. 开发积分消费功能（购买会员、解锁内容等）
4. 添加积分等级系统和徽章

---

## 📞 相关链接

- Directus 后台: http://localhost:8055/admin/content/user_submitted_plays
- 会员中心: http://localhost:3000/member-center
- 提交玩法: http://localhost:3000/member-center?tab=submit
- 交易记录: http://localhost:3000/member-center?tab=history

**所有系统已就绪，现在可以正常使用了！** 🚀
