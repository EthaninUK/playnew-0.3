# 积分自动发放系统使用指南

## 🎯 系统概述

当管理员在 Directus 后台审核通过用户提交的玩法后，系统会自动将积分发放到用户的 PP 账户中。

## 📊 当前状态

✅ **已完成：**
- ✅ 用户提交玩法功能
- ✅ Directus 后台审核界面
- ✅ `credits_awarded_at` 字段（跟踪积分是否已发放）
- ✅ 自动积分发放脚本
- ✅ 积分已补发到账户（当前用户积分：640 PP）

## 🔄 工作流程

### 1. 用户提交玩法
- 访问：http://localhost:3000/member-center?tab=submit
- 填写玩法标题、选择分类、输入内容
- 点击"立即提交换取积分"

### 2. 管理员审核
- 访问：http://localhost:8055/admin/content/user_submitted_plays
- 查看待审核记录（status = "pending"）
- 点击记录进入编辑页面
- 操作：
  - 修改 `status` 为 "approved"（通过）或 "rejected"（拒绝）
  - 设置 `credits_awarded`（1-100 积分）
  - 填写 `review_notes`（审核意见）
  - 点击保存

### 3. 自动发放积分
- 系统每 5 分钟自动检查新审核通过的记录
- 自动将积分加到用户的 `user_profiles.credits` 字段
- 标记 `credits_awarded_at` 为当前时间（防止重复发放）

### 4. 用户查看积分
- 会员中心顶部显示最新积分
- 提交记录中显示已获得的积分
- 刷新页面即可看到更新

## 🚀 启动自动发放服务

### 方案 A：使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动定时任务（每5分钟运行）
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

### 方案 B：手动运行

```bash
# 每次审核后手动运行
node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js
```

### 方案 C：使用 Cron

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每5分钟运行）
*/5 * * * * cd /Users/m1/PlayNew_0.3 && node auto-award-credits-daemon.js >> logs/credits-daemon.log 2>&1
```

## 📝 字段说明

### user_submitted_plays 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 审核状态：pending（待审核）、approved（已通过）、rejected（已拒绝）|
| `credits_awarded` | integer | 奖励积分数量（1-100）|
| `credits_awarded_at` | timestamp | 积分发放时间（系统自动记录）|
| `review_notes` | text | 审核意见或拒绝原因 |
| `reviewed_at` | timestamp | 审核时间 |
| `reviewed_by` | uuid | 审核人ID |

### user_profiles 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `credits` | integer | 用户当前积分（PP）|

## 🔧 维护命令

### 检查待发放积分
```bash
node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js
```

### 查看用户当前积分
```bash
node -e "const { createClient } = require('@supabase/supabase-js'); \
const supabase = createClient('https://cujpgrzjmmttysphjknu.supabase.co', 'SERVICE_KEY'); \
supabase.from('user_profiles').select('credits').eq('id', 'USER_ID').single().then(r => console.log(r.data));"
```

### 查看所有已通过的提交记录
```bash
node /Users/m1/PlayNew_0.3/verify-submissions-in-directus.js
```

## ⚠️ 注意事项

1. **防止重复发放**：`credits_awarded_at` 字段用于标记积分是否已发放，已发放的记录不会再次发放
2. **积分范围**：建议设置 1-100 积分，根据内容质量调整
3. **自动化运行**：建议使用 PM2 或 cron 自动运行发放脚本
4. **日志查看**：定期检查日志，确保积分正常发放
5. **数据库备份**：定期备份 Supabase 数据库

## 📊 统计数据

### 当前系统状态（2025-11-18）

- 总提交记录：9 条
- 已通过：5 条
- 待审核：3 条
- 已拒绝：1 条
- 已发放积分：640 PP
- 用户当前积分：640 PP ✅

## 🔗 相关链接

- Directus 后台：http://localhost:8055/admin/content/user_submitted_plays
- 会员中心：http://localhost:3000/member-center?tab=submit
- Supabase Dashboard：https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu

## 📞 故障排查

### 问题：积分没有自动发放

1. 检查是否运行了自动发放脚本
2. 查看 PM2 日志：`pm2 logs credits-daemon`
3. 手动运行一次：`node auto-award-credits-daemon.js`
4. 检查 `credits_awarded_at` 字段是否为空

### 问题：重复发放积分

- 检查 `credits_awarded_at` 字段
- 如果为空但用户已收到积分，需要手动设置此字段

### 问题：用户看不到最新积分

- 刷新页面
- 检查浏览器缓存
- 确认积分确实已更新到数据库

## 🎉 总结

系统已完全配置完成！管理员只需在 Directus 后台审核，系统会自动处理积分发放。建议使用 PM2 启动定时任务，实现全自动化。
