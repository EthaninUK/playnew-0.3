# Directus 玩法交换权限配置手册

## 📋 配置概览

为了让玩法交换系统正常工作，需要为 **Public** 角色配置以下表的读写权限。

---

## 🔐 权限配置步骤

### 前置条件
1. 登录 Directus 后台: `http://localhost:8055`
2. 使用管理员账号: `the_uk1@outlook.com`

---

## 📊 需要配置的表和权限

### 1. `user_profiles` (用户扩展信息)

**路径**: Settings → Roles & Permissions → Public → user_profiles

**需要的权限**:
```
✅ Create (创建)
  - 字段权限: 全部字段
  - 条件: 无

✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: id = $CURRENT_USER

✅ Update (更新)
  - 字段权限: credits, first_draw_used
  - 条件: id = $CURRENT_USER
```

**配置步骤**:
1. 进入 **Settings** → **Roles & Permissions**
2. 点击 **Public** 角色
3. 找到 `user_profiles` 表
4. 点击表名右侧的 ⚙️ 图标
5. 勾选权限：
   - ☑️ **Create** - 允许创建（注册时自动创建）
   - ☑️ **Read** - 设置条件 `id = $CURRENT_USER`
   - ☑️ **Update** - 只允许更新 credits 和 first_draw_used 字段
6. 点击 **Save** 保存

---

### 2. `daily_featured_plays` (今日精选玩法)

**路径**: Settings → Roles & Permissions → Public → daily_featured_plays

**需要的权限**:
```
✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: is_active = true
```

**配置步骤**:
1. 找到 `daily_featured_plays` 表
2. 勾选 ☑️ **Read**
3. 设置筛选条件: `is_active = true`
4. 字段权限: 全部字段可读
5. 点击 **Save**

---

### 3. `user_play_exchanges` (用户玩法交换记录)

**路径**: Settings → Roles & Permissions → Public → user_play_exchanges

**需要的权限**:
```
✅ Create (创建)
  - 字段权限: 全部字段
  - 条件: user_id = $CURRENT_USER

✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: user_id = $CURRENT_USER
```

**配置步骤**:
1. 找到 `user_play_exchanges` 表
2. 勾选 ☑️ **Create** 和 ☑️ **Read**
3. 两个权限都设置条件: `user_id = $CURRENT_USER`
4. 字段权限: 全部字段
5. 点击 **Save**

---

### 4. `user_submitted_plays` (用户提交的玩法)

**路径**: Settings → Roles & Permissions → Public → user_submitted_plays

**需要的权限**:
```
✅ Create (创建)
  - 字段权限: title, category, content, user_id
  - 条件: user_id = $CURRENT_USER

✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: user_id = $CURRENT_USER
```

**配置步骤**:
1. 找到 `user_submitted_plays` 表
2. 勾选 ☑️ **Create**
   - 允许字段: title, category, content, user_id
   - 条件: `user_id = $CURRENT_USER`
3. 勾选 ☑️ **Read**
   - 全部字段可读
   - 条件: `user_id = $CURRENT_USER`
4. 点击 **Save**

---

### 5. `credit_transactions` (积分交易记录)

**路径**: Settings → Roles & Permissions → Public → credit_transactions

**需要的权限**:
```
✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: user_id = $CURRENT_USER
```

**配置步骤**:
1. 找到 `credit_transactions` 表
2. 勾选 ☑️ **Read**
3. 设置条件: `user_id = $CURRENT_USER`
4. 字段权限: 全部字段可读
5. 点击 **Save**

---

### 6. `referrals` (邀请关系记录)

**路径**: Settings → Roles & Permissions → Public → referrals

**需要的权限**:
```
✅ Create (创建)
  - 字段权限: referrer_id, referred_id, referral_code
  - 条件: 无

✅ Read (读取)
  - 字段权限: 全部字段
  - 条件: referrer_id = $CURRENT_USER
```

**配置步骤**:
1. 找到 `referrals` 表
2. 勾选 ☑️ **Create**
   - 允许字段: referrer_id, referred_id, referral_code
   - 无条件限制
3. 勾选 ☑️ **Read**
   - 全部字段可读
   - 条件: `referrer_id = $CURRENT_USER`
4. 点击 **Save**

---

## 🎯 关键点说明

### 为什么使用 `$CURRENT_USER`？
- `$CURRENT_USER` 是 Directus 的特殊变量，代表当前登录用户的 ID
- 这确保用户只能访问自己的数据，保证数据隔离

### Public 角色 vs 登录用户
- **Public** 角色：未登录用户（匿名访问）
- **配置后效果**：只有登录用户才能访问这些接口
- Supabase 会自动处理用户认证，传递正确的 user_id

---

## ✅ 验证配置

配置完成后，可以通过以下方式验证：

### 1. 测试读取今日精选
```bash
curl -s 'http://localhost:8055/items/daily_featured_plays?filter[is_active]=true'
```

应该返回今日精选玩法列表（如果有数据）。

### 2. 测试用户权限（需要登录）
```bash
# 获取用户 profile
curl -s 'http://localhost:8055/items/user_profiles/me' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

应该返回当前用户的 profile 数据。

---

## 🚨 常见问题

### Q1: 提示 "You don't have permission to access this"
**解决**:
- 检查是否已为 Public 角色配置权限
- 确认条件设置正确（如 `user_id = $CURRENT_USER`）
- 检查字段权限是否勾选

### Q2: 无法创建数据
**解决**:
- 确认 **Create** 权限已勾选
- 检查必填字段是否在允许的字段列表中
- 查看 Directus 日志获取详细错误信息

### Q3: RLS 策略冲突
**解决**:
- 由于使用了 Supabase RLS，Directus 权限作为第二层防护
- 如果两者冲突，优先检查 Supabase RLS 策略
- 可以暂时禁用 Supabase RLS 进行调试

---

## 📝 权限配置检查清单

在继续开发前，请确认以下所有项：

- [ ] `user_profiles` - Create, Read, Update 权限已配置
- [ ] `daily_featured_plays` - Read 权限已配置
- [ ] `user_play_exchanges` - Create, Read 权限已配置
- [ ] `user_submitted_plays` - Create, Read 权限已配置
- [ ] `credit_transactions` - Read 权限已配置
- [ ] `referrals` - Create, Read 权限已配置
- [ ] 所有条件都使用 `$CURRENT_USER` 进行用户隔离
- [ ] 测试 API 可以正常访问

---

## 🔄 下一步

权限配置完成后，继续：
1. 实现后端 API 接口
2. 前端与后端集成
3. 完整流程测试

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 Directus 后台日志: Settings → Logs
2. 检查浏览器开发者工具的 Network 面板
3. 确认 Supabase RLS 策略是否生效
