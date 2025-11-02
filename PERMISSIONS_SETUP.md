# PlayNew 会员权限系统配置指南

## 配置摘要

✅ **已完成的配置:**

1. ✅ 创建了 4 个会员角色
2. ✅ 为内容表添加了 `access_level` 字段
3. ✅ 自动分配了现有内容的访问等级
4. ✅ 准备了权限策略配置指南

---

## 1. 会员角色

已在 Directus 中创建以下角色:

### Free User (免费用户)
- **ID**: `3a078394-4882-4f0e-95a3-3a4448393c30`
- **图标**: person
- **描述**: 免费用户 - 可访问20%基础内容

### Pro User (专业版)
- **ID**: `a1d01804-0022-428f-ac61-bdc1c7c96190`
- **图标**: star
- **描述**: Pro会员 - 可访问60%中级内容

### Max User (最高版)
- **ID**: `11646b09-d8db-4f56-9d4a-e4a128b6ed4b`
- **图标**: workspace_premium
- **描述**: Max会员 - 可访问100%全部内容

### Partner (玩法合伙人)
- **ID**: `ef15fcd3-b4f3-4949-876a-d65e2dd727a8`
- **图标**: handshake
- **描述**: 玩法合伙人 - 全部访问权限+收益分成

---

## 2. 访问等级 (Access Level)

### 内容访问等级分类:

| 等级 | 名称 | 适用会员 | 说明 |
|-----|------|---------|------|
| 0 | 基础内容 | Free + | 所有用户可访问 (约20%内容) |
| 1 | 中级内容 | Pro + | Pro及以上可访问 (约40%内容) |
| 2 | 高级内容 | Max + | Max及以上可访问 (约30%内容) |
| 3 | 合伙人专属 | Partner | 仅合伙人可访问 (约10%内容) |

### 已添加 access_level 字段的表:

- ✅ **strategies** (玩法策略)
- ✅ **news** (快讯)
- ✅ **service_providers** (服务商)

### 自动分配规则:

**Strategies (玩法策略)** - 根据风险等级自动分配:
- 低风险 (1-2) → access_level = 0 (免费)
- 中风险 (3-4) → access_level = 1 (Pro)
- 高风险 (5) → access_level = 2 (Max)

**News (快讯)** - 默认全部为免费:
- 所有快讯 → access_level = 0 (免费)

**Service Providers (服务商)** - 默认全部为免费:
- 所有服务商 → access_level = 0 (免费)

---

## 3. 权限配置指南

### Free User 权限配置

#### Strategies 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 0 } }`
- **说明**: 只能查看 access_level ≤ 0 的策略

#### News 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 0 } }`
- **限制**: 每日5条快讯 (需前端实现)

#### Service Providers 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 0 } }`

#### Memberships 表
- **操作**: `read`
- **过滤器**: 无 (可查看所有会员等级信息)

---

### Pro User 权限配置

#### Strategies 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 1 } }`
- **说明**: 可访问 access_level ≤ 1 的策略 (约60%内容)

#### News 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 1 } }`
- **限制**: 无限制

#### Service Providers 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 1 } }`

#### User Subscriptions 表
- **操作**: `read`
- **过滤器**: `{ "user_id": { "_eq": "$CURRENT_USER" } }`
- **说明**: 只能查看自己的订阅记录

---

### Max User 权限配置

#### Strategies 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 2 } }`
- **说明**: 可访问 access_level ≤ 2 的策略 (100%非合伙人内容)

#### News 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 2 } }`
- **限制**: 无限制

#### Service Providers 表
- **操作**: `read`
- **过滤器**: `{ "access_level": { "_lte": 2 } }`

#### User Subscriptions 表
- **操作**: `read`
- **过滤器**: `{ "user_id": { "_eq": "$CURRENT_USER" } }`

#### Payments 表
- **操作**: `read`
- **过滤器**: `{ "user_id": { "_eq": "$CURRENT_USER" } }`
- **说明**: 只能查看自己的支付记录

---

### Partner 权限配置

#### Strategies 表
- **操作**: `read`, `create`, `update`
- **过滤器**:
  - Read: 无 (可查看全部)
  - Create/Update: `{ "created_by": { "_eq": "$CURRENT_USER" } }` (只能编辑自己创建的)
- **说明**: 合伙人可以创建和发布自己的策略

#### News 表
- **操作**: `read`
- **过滤器**: 无 (可查看全部)

#### Service Providers 表
- **操作**: `read`
- **过滤器**: 无 (可查看全部)

#### User Subscriptions 表
- **操作**: `read`
- **过滤器**: `{ "user_id": { "_eq": "$CURRENT_USER" } }`

#### Payments 表
- **操作**: `read`
- **过滤器**: `{ "user_id": { "_eq": "$CURRENT_USER" } }`

#### Partner Earnings 表
- **操作**: `read`
- **过滤器**: `{ "partner_user_id": { "_eq": "$CURRENT_USER" } }`
- **说明**: 只能查看自己的收益记录

#### Referral Links 表
- **操作**: `read`, `create`, `update`
- **过滤器**: `{ "partner_user_id": { "_eq": "$CURRENT_USER" } }`
- **说明**: 可以管理自己的推荐链接

---

## 4. 在 Directus 中手动配置权限

### 步骤:

1. **访问 Directus 管理界面**
   - URL: http://localhost:8055/admin
   - 登录账号: the_uk1@outlook.com

2. **进入权限设置**
   - 点击左侧菜单 Settings (设置)
   - 选择 Roles & Permissions (角色与权限)

3. **配置每个角色**
   - 选择一个角色 (如 "Free User")
   - 点击进入该角色的权限配置页面

4. **为每个表设置权限**

   **以 Strategies 表为例 (Free User):**

   a. 找到 `strategies` 表

   b. 启用 `Read` 权限

   c. 点击 "Customize Permissions"

   d. 在 "Item Permissions" 中设置过滤器:
   ```json
   {
     "access_level": {
       "_lte": 0
     }
   }
   ```

   e. 在 "Field Permissions" 中选择允许读取的字段

   f. 保存配置

5. **重复步骤4** 为该角色的其他表设置权限

6. **重复步骤3-5** 为其他角色配置权限

---

## 5. 前端集成说明

### 获取用户会员等级

前端需要实现以下逻辑:

1. **用户登录后,从 Supabase Auth 获取 user_id**

2. **查询 user_subscriptions 表获取当前订阅**
   ```typescript
   const { data: subscription } = await supabase
     .from('user_subscriptions')
     .select('*, membership:membership_id(*)')
     .eq('user_id', userId)
     .eq('status', 'active')
     .single();
   ```

3. **获取会员等级的 content_access_level**
   ```typescript
   const accessLevel = subscription?.membership?.content_access_level || 0;
   ```

4. **根据 access_level 过滤内容**
   ```typescript
   // 在 Directus API 请求中添加过滤器
   const strategies = await fetch(
     `${DIRECTUS_URL}/items/strategies?filter[access_level][_lte]=${accessLevel}`
   );
   ```

### 显示会员标识

在用户头像或名称旁显示会员徽章:

```typescript
const membershipBadge = {
  0: { name: 'Free', color: 'gray', icon: '🆓' },
  1: { name: 'Pro', color: 'blue', icon: '⭐' },
  2: { name: 'Max', color: 'purple', icon: '👑' },
  3: { name: 'Partner', color: 'gold', icon: '🤝' },
};
```

### 内容锁定提示

对于用户无权访问的内容,显示升级提示:

```tsx
{strategy.access_level > userAccessLevel && (
  <div className="locked-content">
    <Lock className="h-6 w-6" />
    <p>此内容需要 {membershipName} 会员</p>
    <Button onClick={handleUpgrade}>立即升级</Button>
  </div>
)}
```

---

## 6. 数据统计

### 当前内容分布:

- **Strategies (玩法策略)**: 56 个
  - 低风险 (Free): 约 20个
  - 中风险 (Pro): 约 25个
  - 高风险 (Max): 约 11个

- **News (快讯)**: 100 条
  - 全部设为免费访问

- **Service Providers (服务商)**: 约 20个
  - 全部设为免费访问

### 建议调整:

1. **策略内容**:
   - 将部分高质量策略设为 level 1-2,增加付费会员价值
   - 保留一些基础策略为 level 0,吸引新用户

2. **快讯内容**:
   - 普通快讯: level 0 (免费)
   - 深度分析: level 1 (Pro)
   - 独家报告: level 2 (Max)

3. **服务商内容**:
   - 基础信息: level 0 (免费)
   - 详细对比: level 1 (Pro)
   - 独家评测: level 2 (Max)

---

## 7. 下一步任务

- [ ] 在 Directus 管理界面中手动配置各角色的权限
- [ ] 开发前端会员定价页面
- [ ] 集成 Stripe 支付系统
- [ ] 集成加密货币支付
- [ ] 实现支付成功后自动分配角色
- [ ] 开发会员中心页面
- [ ] 实现合伙人收益分成系统

---

## 8. 重要提醒

1. **安全性**: 权限过滤必须在服务端 (Directus) 进行,前端过滤仅用于 UI 展示

2. **测试**: 配置完权限后,务必使用不同角色的账号测试访问权限

3. **备份**: 在修改权限配置前,建议备份 Directus 数据库

4. **文档**: 保持此文档更新,记录所有权限配置变更

---

## 附录: API 过滤器示例

### Directus API 过滤语法

```
# 等于
filter[field][_eq]=value

# 小于等于
filter[field][_lte]=value

# 大于等于
filter[field][_gte]=value

# 在列表中
filter[field][_in]=value1,value2

# 与当前用户相关
filter[user_id][_eq]=$CURRENT_USER

# 组合过滤器
filter[_and][0][access_level][_lte]=1
filter[_and][1][status][_eq]=published
```

### 完整请求示例

```bash
# Free User 查询策略
curl 'http://localhost:8055/items/strategies?filter[access_level][_lte]=0&filter[status][_eq]=published'

# Pro User 查询策略
curl 'http://localhost:8055/items/strategies?filter[access_level][_lte]=1&filter[status][_eq]=published'

# Partner 查询自己的收益
curl 'http://localhost:8055/items/partner_earnings?filter[partner_user_id][_eq]=$CURRENT_USER'
```

---

**文档版本**: 1.0
**创建时间**: 2025-10-28
**最后更新**: 2025-10-28
