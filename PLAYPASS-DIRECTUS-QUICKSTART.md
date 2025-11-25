# 🚀 PlayPass Directus 快速开始指南

**5 分钟配置完成 Directus 后台管理**

---

## 📋 前置要求

确保以下服务已运行:

```bash
# 检查 Directus 是否运行
curl http://localhost:8055/server/health

# 如果未运行，启动 Directus
docker-compose up -d directus
```

**已完成**:
- ✅ Supabase 数据库已创建 PlayPass 表
- ✅ 已执行 `sql/01_create_playpass_tables.sql`
- ✅ 已执行 `sql/02_insert_sample_data.sql`

---

## ⚡ 一键配置

### 方法 1: 使用一键脚本（推荐）

```bash
# 进入项目目录
cd /Users/m1/PlayNew_0.3

# 运行一键配置脚本
chmod +x setup-playpass-directus-complete.sh
./setup-playpass-directus-complete.sh
```

**脚本会自动**:
1. ✅ 检查 Directus 服务状态
2. ✅ 检查数据库表是否存在
3. ✅ 配置集合元数据（名称、图标）
4. ✅ 配置字段界面（输入框、下拉菜单、JSON 编辑器）
5. ✅ 设置权限（管理员读写，API 只读）
6. ✅ 添加中文翻译

**完成后显示**:
```
✅ PlayPass Directus 配置完成！

📝 下一步操作:
  1. 访问 Directus 后台: http://localhost:8055
  2. 登录:
     邮箱: the_uk1@outlook.com
     密码: Mygcdjmyxzg2026!
  3. 在左侧导航找到 PlayPass 相关集合
  4. 开始管理 PlayPass 配置！
```

---

### 方法 2: 手动分步配置

如果一键脚本失败，可以手动执行：

```bash
# 1. 配置集合
node setup-playpass-directus-collections.js

# 2. 配置权限
node setup-playpass-directus-permissions.js
```

---

## 🎯 访问 Directus 后台

### 登录

**访问地址**: http://localhost:8055

**登录信息**:
- 📧 邮箱: `the_uk1@outlook.com`
- 🔑 密码: `Mygcdjmyxzg2026!`

### 找到 PlayPass 集合

登录后，在左侧导航栏找到以下集合:

```
📦 PlayPass 定价配置
   └─ 管理内容 PP 价格

🎁 PlayPass 奖励配置
   └─ 管理用户赚取 PP 的奖励

👑 PlayPass 会员配置
   └─ 管理会员等级和权益

💰 PlayPass 用户余额 (只读)
   └─ 查看用户余额和统计

📋 PlayPass 交易记录 (只读)
   └─ 查看 PP 交易历史
```

---

## 📝 常见操作

### 1. 修改内容价格

**示例**: 将高风险策略价格改为 150 PP

1. 点击 **📦 PlayPass 定价配置**
2. 找到 `config_key = 'strategy_high_risk'`
3. 点击该行进入详情
4. 修改 **PP 价格**: `100` → `150`
5. 点击右上角 **保存** ✅

**立即生效！**

---

### 2. 举办双倍签到活动

**示例**: 12月21-22日双倍签到 PP

1. 点击 **🎁 PlayPass 奖励配置**
2. 找到 `reward_key = 'daily_signin'`
3. 点击该行进入详情
4. 修改以下字段:
   - **活动倍率**: `2.0`
   - **生效开始时间**: `2025-12-21 00:00:00`
   - **生效结束时间**: `2025-12-22 23:59:59`
5. 点击右上角 **保存** ✅

**时间到了自动恢复正常！**

---

### 3. 查看用户余额

1. 点击 **💰 PlayPass 用户余额**
2. 在搜索框输入 `user_id`
3. 点击查看详情

**可查看**:
- 当前余额
- 会员等级
- 今日赚取/消费
- 累计统计
- 签到天数

---

### 4. 新增定价规则

**示例**: 新手策略免费

1. 点击 **📦 PlayPass 定价配置**
2. 点击右上角 **+ 按钮**
3. 填写:
   - **配置键**: `strategy_beginner_free`
   - **内容类型**: `strategy`
   - **PP 价格**: `0`
   - **匹配条件**:
     ```json
     {"category_l1": "beginner"}
     ```
   - **优先级**: `100`
   - **是否启用**: `true`
4. 点击 **保存** ✅

---

## 🔍 验证配置

### 检查集合是否正确配置

访问以下 URL（需先登录）:

```bash
# 获取 token
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# 检查定价配置
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8055/items/playpass_pricing_config?limit=1"

# 检查奖励配置
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8055/items/playpass_reward_config?limit=1"
```

**预期**: 返回配置数据（JSON 格式）

---

## 🎨 界面预览

### 定价配置界面

```
┌────────────────────────────────────────────┐
│ PlayPass 定价配置                           │
├────────────────────────────────────────────┤
│                                             │
│ 配置键 ┃ strategy_high_risk                │
│ 内容类型 ┃ [下拉菜单] strategy              │
│ PP 价格 ┃ [输入框] 100 PP                  │
│ 匹配条件 ┃ [JSON 编辑器]                    │
│  {                                          │
│    "risk_level": [4, 5]                     │
│  }                                          │
│ 会员折扣 ┃ [JSON 编辑器]                    │
│  {                                          │
│    "0": 0, "1": 0.1, "2": 0.3              │
│  }                                          │
│ 优先级 ┃ [输入框] 10                        │
│ 是否启用 ┃ [开关] ✓                         │
│ 规则描述 ┃ [文本框] 高风险策略定价          │
│                                             │
│          [保存]  [删除]                     │
└────────────────────────────────────────────┘
```

### 奖励配置界面

```
┌────────────────────────────────────────────┐
│ PlayPass 奖励配置                           │
├────────────────────────────────────────────┤
│                                             │
│ 奖励键 ┃ daily_signin                      │
│ 行为类型 ┃ [下拉菜单] 每日签到              │
│ 基础奖励 ┃ [输入框] 10 PP                  │
│ 活动倍率 ┃ [输入框] 1.0x                   │
│ 频率限制 ┃ [下拉菜单] 每日一次              │
│ 生效开始时间 ┃ [日期选择器] (可选)          │
│ 生效结束时间 ┃ [日期选择器] (可选)          │
│ 是否启用 ┃ [开关] ✓                         │
│ 规则描述 ┃ [文本框] 每日签到奖励            │
│                                             │
│          [保存]  [删除]                     │
└────────────────────────────────────────────┘
```

---

## 🔧 故障排除

### 问题 1: 无法登录 Directus

**症状**: 提示用户名或密码错误

**解决**:

```bash
# 检查 Directus 日志
docker-compose logs directus --tail=50

# 重置管理员密码
docker-compose exec directus npx directus users update \
  --email the_uk1@outlook.com \
  --password Mygcdjmyxzg2026!
```

---

### 问题 2: 找不到 PlayPass 集合

**症状**: 左侧导航栏没有 PlayPass 集合

**解决**:

1. 检查数据库表是否存在:
   ```bash
   # 访问 Supabase Dashboard
   # 查看 playpass_* 表
   ```

2. 重新运行配置脚本:
   ```bash
   ./setup-playpass-directus-complete.sh
   ```

---

### 问题 3: 配置修改后不生效

**症状**: 在 Directus 修改了价格，但 API 返回的还是旧价格

**解决**:

1. 检查 **是否启用** 开关是否为 `true`
2. 检查 **优先级** 是否被其他规则覆盖
3. 清除浏览器缓存
4. 检查 API 日志:
   ```bash
   # 查看 Next.js 日志
   npm run dev
   ```

---

### 问题 4: JSON 格式错误

**症状**: 保存时提示 JSON 格式错误

**解决**:

使用 JSON 验证工具检查格式:

**正确格式**:
```json
{
  "key": "value",
  "array": [1, 2, 3],
  "nested": {
    "inner": true
  }
}
```

**常见错误**:
```json
// ❌ 单引号
{ 'key': 'value' }

// ❌ 尾随逗号
{ "key": "value", }

// ❌ 注释
{ "key": "value" /* comment */ }

// ✅ 正确格式
{ "key": "value" }
```

---

## 📚 更多文档

**详细指南**:
- [PLAYPASS-DIRECTUS-ADMIN-GUIDE.md](PLAYPASS-DIRECTUS-ADMIN-GUIDE.md) - 完整的 Directus 管理指南（60+ 页）

**其他文档**:
- [PLAYPASS-PROJECT-SUMMARY.md](PLAYPASS-PROJECT-SUMMARY.md) - 项目总结
- [PLAYPASS-SUPABASE-ADMIN-GUIDE.md](PLAYPASS-SUPABASE-ADMIN-GUIDE.md) - Supabase SQL 管理
- [PLAYPASS-DEPLOYMENT-CHECKLIST.md](PLAYPASS-DEPLOYMENT-CHECKLIST.md) - 部署检查清单

---

## 💡 快速提示

### 修改立即生效

✅ 所有在 Directus 中的修改都会**立即生效**
✅ API 会**实时读取**最新配置
✅ **无需重启**服务器

### 推荐工作流

**日常管理**: Directus 图形界面
- 修改单个价格
- 调整奖励金额
- 举办活动

**批量操作**: Supabase SQL
- 批量调价
- 数据导入导出
- 复杂查询

### 安全提示

🔒 不要泄露 Directus 登录信息
🔒 定期备份配置数据
🔒 重要修改前先测试
🔒 不要直接修改用户余额表

---

## ✅ 检查清单

完成配置后，确保:

- [ ] 能够登录 Directus 后台
- [ ] 能够看到 5 个 PlayPass 集合
- [ ] 能够查看现有配置数据
- [ ] 能够修改定价规则并保存
- [ ] 能够修改奖励规则并保存
- [ ] API 能够读取配置（测试一下）

**测试 API**:

```bash
# 测试价格 API
curl -X POST http://localhost:3000/api/playpass/get-price \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "test-1",
    "content_type": "strategy",
    "user_membership_level": 0
  }'

# 预期: 返回价格信息
```

---

## 🎉 完成！

现在你可以:

✅ 在 Directus 后台管理 PlayPass 配置
✅ 修改内容定价
✅ 调整 PP 奖励规则
✅ 管理会员等级
✅ 查看用户数据
✅ 举办活动（双倍 PP、限时免费等）

**开始管理吧！** 🚀

---

**最后更新**: 2025-11-17
**版本**: v2.1.0
**所需时间**: 5 分钟
