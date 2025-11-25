# 🚀 玩法交换系统 - 部署指南

## 📋 部署前检查

当前系统状态:
- ✅ 后端 API 已实现 (7个端点)
- ✅ 前端页面已集成真实 API
- ✅ SQL 迁移脚本已准备
- ✅ Directus 权限配置脚本已准备
- ❌ 数据库表尚未创建
- ❌ 权限尚未配置
- ❌ 测试数据尚未添加

---

## 🔧 部署步骤

### 步骤 1: 执行数据库迁移 (Supabase)

**重要**: 这一步必须在 **Supabase Dashboard** 中执行，不是本地数据库！

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧菜单 **SQL Editor**
4. 点击 **New query** 创建新查询
5. 复制以下文件的完整内容到查询编辑器:

```bash
cat /Users/m1/PlayNew_0.3/sql/play_exchange_add_to_existing.sql
```

6. 点击 **Run** 执行 SQL
7. 确认执行成功（应该看到 "Success. No rows returned"）

**检查是否成功**:

执行以下 SQL 检查表是否创建:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles',
    'daily_featured_plays',
    'user_play_exchanges',
    'user_submitted_plays',
    'credit_transactions',
    'referrals'
  )
ORDER BY table_name;
```

应该返回 6 个表名。

---

### 步骤 2: 配置 Directus 权限

**前提条件**: Directus 必须正在运行

```bash
# 确认 Directus 运行状态
docker-compose ps directus

# 如果未运行，启动它
docker-compose up -d directus
```

**运行权限配置脚本**:

```bash
cd /Users/m1/PlayNew_0.3
node configure-play-exchange-permissions.js
```

**预期输出**:

```
✅ 成功配置 user_profiles 的 create 权限
✅ 成功配置 user_profiles 的 read 权限
✅ 成功配置 user_profiles 的 update 权限
✅ 成功配置 daily_featured_plays 的 read 权限
✅ 成功配置 user_play_exchanges 的 create 权限
✅ 成功配置 user_play_exchanges 的 read 权限
✅ 成功配置 user_submitted_plays 的 create 权限
✅ 成功配置 user_submitted_plays 的 read 权限
✅ 成功配置 credit_transactions 的 read 权限
✅ 成功配置 referrals 的 create 权限
✅ 成功配置 referrals 的 read 权限

🎉 所有权限配置完成！共配置 11 个权限。
```

---

### 步骤 3: 添加测试数据

**添加今日精选配置**:

```bash
cd /Users/m1/PlayNew_0.3
node add-daily-featured-sample.js
```

**预期输出**:

```
✅ 今日精选配置已创建！
日期: 2025-11-13
主题: DeFi 挖矿专场
玩法:
  卡片 1: Blur NFT 交易挖空投
  卡片 2: Starknet 测试网任务完成
  卡片 3: Trader Joe 集中流动性 V2
```

---

### 步骤 4: 验证部署

**运行自动化测试**:

```bash
chmod +x /Users/m1/PlayNew_0.3/test-play-exchange-complete.sh
/Users/m1/PlayNew_0.3/test-play-exchange-complete.sh
```

**所有测试应该通过**:

- ✅ 测试 1: 获取今日精选 (无需登录)
- ✅ 测试 2: 访问前端页面
- ✅ 测试 3: 数据库表检查 (6个表)
- ✅ 测试 4: 检查 user_profiles 扩展字段
- ✅ 测试 5: 检查数据库触发器
- ✅ 测试 6: 检查今日精选配置
- ✅ 测试 7: API 端点健康检查

---

### 步骤 5: 手动功能测试

#### 5.1 访问页面

在浏览器中打开:

```
http://localhost:3000/play-exchange
```

你应该看到:
- ✅ 漂亮的渐变背景
- ✅ 3 张魔法卡片（显示今日精选）
- ✅ "每日一次免费翻牌机会" 提示
- ✅ "请先登录" 提示（如果未登录）

#### 5.2 注册新用户

1. 点击右上角 "登录" 或页面中的 "立即登录"
2. 选择 "注册"
3. 输入邮箱和密码（例如: test@example.com / Test123456!）
4. 提交注册

**预期结果**:
- ✅ 用户成功注册
- ✅ 自动生成 6 位邀请码
- ✅ 初始积分为 0
- ✅ `first_draw_used` = false

#### 5.3 测试首次翻牌（免费）

1. 登录后回到 `/play-exchange` 页面
2. 你应该看到:
   - ✅ 用户积分显示: 0
   - ✅ "首次翻牌免费" 提示
3. 点击任意一张卡片
4. 等待翻牌动画

**预期结果**:
- ✅ 卡片翻转显示玩法详情
- ✅ Toast 提示: "翻牌成功！这是你的首次免费翻牌"
- ✅ 积分余额仍然是 0
- ✅ 已获得玩法数量 +1

#### 5.4 测试第二次翻牌（消耗积分）

1. 刷新页面（或点击 "继续翻牌"）
2. 现在应该显示: "每次翻牌消耗 1 积分"
3. 尝试点击另一张卡片

**预期结果**:
- ❌ Toast 提示: "积分不足，无法翻牌"
- ✅ 翻牌被阻止

#### 5.5 测试提交玩法

1. 滚动到 "提交玩法" 区域
2. 填写表单:
   - 标题: "测试玩法 - Uniswap V4 Hooks 开发"
   - 分类: 选择任意分类
   - 内容: 输入详细描述（至少 50 字）
3. 点击 "提交审核"

**预期结果**:
- ✅ Toast 提示: "提交成功！等待管理员审核"
- ✅ 表单清空
- ✅ "我的提交记录" 中出现新记录
- ✅ 状态显示: ⏳ 审核中

#### 5.6 测试邀请系统

1. 滚动到 "邀请好友" 区域
2. 你应该看到:
   - ✅ 你的邀请码（6位大写字母+数字）
   - ✅ 完整的邀请链接
   - ✅ 邀请统计（都是 0）
3. 点击 "复制链接"

**预期结果**:
- ✅ Toast 提示: "邀请链接已复制"
- ✅ 链接已复制到剪贴板

4. 用另一个浏览器（或无痕模式）打开邀请链接
5. 注册新账号

**预期结果**:
- ✅ 原账号刷新后积分 +1
- ✅ "邀请统计" 中 "已注册" +1
- ✅ "获得积分" +1

#### 5.7 测试用积分翻牌

1. 回到原账号
2. 现在积分应该是 1
3. 点击任意一张卡片翻牌

**预期结果**:
- ✅ 翻牌成功
- ✅ 积分余额变为 0
- ✅ 已获得玩法数量 +1
- ✅ Toast 提示: "翻牌成功！消耗 1 积分"

---

## 📊 测试清单

使用这个清单确保所有功能正常:

### 基础功能
- [ ] 页面加载正常
- [ ] 今日精选显示 3 个玩法
- [ ] UI 动画流畅
- [ ] 响应式设计正常

### 认证功能
- [ ] 未登录时显示登录提示
- [ ] 注册新用户成功
- [ ] 登录现有用户成功
- [ ] 登出功能正常

### 翻牌功能
- [ ] 首次翻牌免费
- [ ] 首次翻牌后 `first_draw_used` = true
- [ ] 第二次翻牌需要积分
- [ ] 积分不足时阻止翻牌
- [ ] 已拥有的玩法无法重复获取
- [ ] 积分正确扣除
- [ ] 交易记录正确创建

### 提交功能
- [ ] 表单验证正常
- [ ] 提交成功
- [ ] 提交记录显示正确
- [ ] 状态图标显示正确

### 邀请功能
- [ ] 邀请码自动生成
- [ ] 邀请链接正确
- [ ] 复制链接功能正常
- [ ] 邀请注册后积分增加
- [ ] 邀请统计更新
- [ ] 防止重复邀请

### 数据同步
- [ ] 翻牌后积分实时更新
- [ ] 翻牌后玩法数量实时更新
- [ ] 提交后记录实时显示
- [ ] 邀请后统计实时更新

---

## 🐛 常见问题

### 问题 1: 数据库连接失败

**症状**: API 返回 500 错误，数据库连接失败

**解决方案**:
1. 检查 `.env.local` 中的 Supabase 配置:
   ```bash
   cat /Users/m1/PlayNew_0.3/frontend/.env.local | grep SUPABASE
   ```
2. 确认 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 正确
3. 确认 `SUPABASE_SERVICE_ROLE_KEY` 存在且正确

### 问题 2: 权限配置失败

**症状**: `configure-play-exchange-permissions.js` 报错

**解决方案**:
1. 检查 Directus 是否运行: `docker-compose ps directus`
2. 检查 Directus token: 尝试重新获取 token
3. 查看错误信息，可能需要手动在 Directus 后台配置

### 问题 3: 今日精选不显示

**症状**: API 返回空数组或 404

**解决方案**:
1. 检查数据库中是否有配置:
   ```sql
   SELECT * FROM daily_featured_plays WHERE is_active = true;
   ```
2. 重新运行: `node add-daily-featured-sample.js`
3. 确认日期是今天: `2025-11-13`（可能需要修改脚本中的日期）

### 问题 4: 翻牌后积分没有扣除

**症状**: 翻牌成功但积分余额不变

**解决方案**:
1. 检查 API 日志
2. 检查数据库事务是否回滚
3. 检查 RLS 策略是否阻止了更新
4. 查看 `credit_transactions` 表是否有记录

### 问题 5: 邀请链接无效

**症状**: 点击邀请链接后无法注册

**解决方案**:
1. 检查链接格式: `http://localhost:3000/auth/register?ref=ABC123`
2. 确认前端注册页面读取 `ref` 参数
3. 确认 `POST /api/play-exchange/referral` 正确调用
4. 检查 `referrals` 表中是否有记录

---

## 📈 性能优化建议

1. **缓存今日精选**:
   - 今日精选数据可以缓存 1 小时
   - 使用 Next.js ISR 或 Redis

2. **优化数据库查询**:
   - 为 `user_id` 添加索引
   - 为 `is_active` 添加索引
   - 为 `feature_date` 添加索引

3. **前端优化**:
   - 使用 React.memo 优化组件渲染
   - 使用 useMemo 缓存计算结果
   - 懒加载提交记录和邀请记录

---

## 🔒 安全检查

- [x] JWT token 验证
- [x] RLS 策略配置
- [x] 输入验证
- [x] SQL 注入防护
- [x] XSS 防护
- [x] CSRF token（Next.js 自带）
- [x] 防止重复操作（unique 约束）

---

## 🎉 部署完成后

恭喜！如果所有测试都通过，你的玩法交换系统已经成功部署！

**下一步**:
1. 部署到生产环境（Vercel、Railway 等）
2. 配置生产环境的 Supabase 项目
3. 添加更多今日精选配置
4. 开发管理员审核界面
5. 添加积分商城功能

**文档链接**:
- [产品需求文档](MAGIC-CARD-EXCHANGE-V2.md)
- [API 使用指南](PLAY-EXCHANGE-API-GUIDE.md)
- [前端集成指南](FRONTEND-INTEGRATION-GUIDE.md)
- [实施总结](PLAY-EXCHANGE-IMPLEMENTATION-SUMMARY.md)

---

## 📞 获取帮助

如果遇到问题:
1. 查看测试脚本输出
2. 检查浏览器控制台
3. 检查 Next.js 终端日志
4. 检查 Supabase 日志
5. 参考文档和代码注释
