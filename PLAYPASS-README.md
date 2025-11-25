# 🎟️ PlayPass 系统 - 完整指南

**PlayNew.ai 虚拟积分系统**

**版本**: v2.2.0
**完成日期**: 2025-11-17
**状态**: ✅ 100% 完成（包含 Directus 后台）

---

## 📖 什么是 PlayPass？

PlayPass 是 PlayNew.ai 平台的**虚拟积分系统**，用于激励用户参与和控制内容访问。

### 核心特性

- 🎁 **赚取 PP**: 每日签到、阅读内容、分享、评论
- 💎 **消费 PP**: 解锁优质内容（策略、套利、新闻、八卦）
- 👑 **会员体系**: 5 级会员（Free → Pro → Premium → Partner → MAX）
- 🎨 **后台可配置**: 动态调整价格和奖励规则
- 🎛️ **双后台管理**: Directus 图形界面 + Supabase SQL

---

## 🚀 快速开始

### 1. 数据库设置（首次使用）

```bash
# 1. 登录 Supabase Dashboard
# https://app.supabase.com/project/cujpgrzjmmttysphjknu

# 2. 进入 SQL Editor

# 3. 执行以下脚本（按顺序）:
# - sql/01_create_playpass_tables.sql
# - sql/02_insert_sample_data.sql
```

**验证**:
```sql
SELECT COUNT(*) FROM playpass_pricing_config;  -- 应该有 9 条
SELECT COUNT(*) FROM playpass_reward_config;   -- 应该有 15 条
```

---

### 2. 环境变量配置

```bash
# 进入前端目录
cd frontend

# 创建环境变量文件
cp .env.example .env.local

# 编辑 .env.local，填入以下信息:
NEXT_PUBLIC_SUPABASE_URL=https://cujpgrzjmmttysphjknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**获取密钥**:
Supabase Dashboard → Settings → API

---

### 3. 安装依赖

```bash
cd frontend
npm install
```

---

### 4. 启动开发服务器

```bash
npm run dev
```

**访问**:
- 主应用: http://localhost:3000
- PlayPass 演示: http://localhost:3000/playpass-demo

---

### 5. 配置 Directus 后台（可选但推荐）

```bash
# 1. 启动 Directus
docker-compose up -d directus

# 2. 一键配置 PlayPass 集合
chmod +x setup-playpass-directus-complete.sh
./setup-playpass-directus-complete.sh

# 3. 访问 Directus 后台
open http://localhost:8055

# 4. 登录
# 邮箱: the_uk1@outlook.com
# 密码: Mygcdjmyxzg2026!
```

**配置时间**: 约 30 秒

详细步骤: [PLAYPASS-DIRECTUS-QUICKSTART.md](PLAYPASS-DIRECTUS-QUICKSTART.md)

---

## 📚 文档导航

### 🎯 快速参考

| 文档 | 用途 | 阅读时间 |
|------|------|----------|
| **本文档** | 总览和快速开始 | 5 min |
| [PLAYPASS-DIRECTUS-QUICKSTART.md](PLAYPASS-DIRECTUS-QUICKSTART.md) | Directus 5分钟配置 | 5 min |
| [PLAYPASS-DEPLOYMENT-CHECKLIST.md](PLAYPASS-DEPLOYMENT-CHECKLIST.md) | 部署检查清单 | 10 min |

---

### 📖 完整指南

#### 项目总结

| 文档 | 字数 | 说明 |
|------|------|------|
| [PLAYPASS-PROJECT-SUMMARY.md](PLAYPASS-PROJECT-SUMMARY.md) | 20,000+ | **完整项目总结**（Phase 0-5） |
| [PLAYPASS-PHASE6-DIRECTUS-INTEGRATION.md](PLAYPASS-PHASE6-DIRECTUS-INTEGRATION.md) | 8,000+ | Phase 6: Directus 后台集成 |

---

#### 后台管理

| 文档 | 字数 | 说明 |
|------|------|------|
| [PLAYPASS-DIRECTUS-ADMIN-GUIDE.md](PLAYPASS-DIRECTUS-ADMIN-GUIDE.md) | 20,000+ | **Directus 图形界面管理**（推荐） |
| [PLAYPASS-SUPABASE-ADMIN-GUIDE.md](PLAYPASS-SUPABASE-ADMIN-GUIDE.md) | 15,000+ | Supabase SQL 管理（高级） |

---

#### Phase 详细文档

| Phase | 文档 | 说明 |
|-------|------|------|
| Phase 3 | [PLAYPASS-PHASE3-COMPLETE.md](PLAYPASS-PHASE3-COMPLETE.md) | 前端组件开发 |
| Phase 4 | [PLAYPASS-SUPABASE-ADMIN-GUIDE.md](PLAYPASS-SUPABASE-ADMIN-GUIDE.md) | Supabase 后台配置 |
| Phase 5 | [PLAYPASS-DEPLOYMENT-CHECKLIST.md](PLAYPASS-DEPLOYMENT-CHECKLIST.md) | 测试和部署 |
| Phase 6 | [PLAYPASS-DIRECTUS-INTEGRATION-COMPLETE.md](PLAYPASS-DIRECTUS-INTEGRATION-COMPLETE.md) | Directus 后台集成 |

---

## 🎛️ 后台管理方式

PlayPass 支持**两种后台管理方式**:

### 1. Directus 后台（推荐用于日常管理）

**优势**:
- ✅ 图形界面，无需 SQL 知识
- ✅ 适合所有管理员使用
- ✅ 操作直观，不易出错
- ✅ 自动数据验证
- ✅ 操作审计日志

**适用场景**:
- 修改单个策略价格
- 调整签到奖励金额
- 举办限时双倍活动
- 查看用户余额和交易记录

**快速开始**: [PLAYPASS-DIRECTUS-QUICKSTART.md](PLAYPASS-DIRECTUS-QUICKSTART.md)

---

### 2. Supabase SQL（推荐用于高级操作）

**优势**:
- ✅ SQL 功能强大
- ✅ 适合批量操作
- ✅ 复杂查询灵活
- ✅ 数据导入导出方便

**适用场景**:
- 所有价格批量上涨 20%
- 导入 100 条定价规则
- 复杂统计查询
- 手动调整用户余额

**完整指南**: [PLAYPASS-SUPABASE-ADMIN-GUIDE.md](PLAYPASS-SUPABASE-ADMIN-GUIDE.md)

---

## 🧪 测试

### API 测试

```bash
# 运行 API 测试脚本
chmod +x test-playpass-apis.sh
./test-playpass-apis.sh
```

**测试内容**:
- ✅ 获取余额
- ✅ 每日签到
- ✅ 赚取 PP
- ✅ 获取价格
- ✅ 检查访问权限
- ✅ 消费 PP
- ✅ 解锁内容

---

### 组件测试

访问组件演示页面:
```
http://localhost:3000/playpass-demo
```

**测试内容**:
- ✅ PPBalance - 余额显示
- ✅ ContentUnlock - 内容解锁
- ✅ DailySignin - 每日签到
- ✅ PPTransactions - 交易记录
- ✅ MembershipBadge - 会员徽章

---

## 📦 系统组成

### 数据库（7张表）

| 表名 | 说明 |
|------|------|
| user_playpass | 用户 PP 账户 |
| playpass_transactions | 交易记录 |
| user_unlocked_content | 已解锁内容 |
| **playpass_pricing_config** | **定价配置**（后台可修改） |
| **playpass_reward_config** | **奖励配置**（后台可修改） |
| playpass_membership_config | 会员等级配置 |
| playpass_daily_signin | 每日签到记录 |

---

### API 端点（7个）

| 端点 | 方法 | 说明 |
|------|------|------|
| /api/playpass/balance | GET | 获取余额 |
| /api/playpass/earn | POST | 赚取 PP |
| /api/playpass/spend | POST | 消费 PP |
| /api/playpass/get-price | POST | 获取价格 |
| /api/playpass/get-reward | POST | 获取奖励预览 |
| /api/playpass/daily-signin | POST | 每日签到 |
| /api/playpass/check-access | POST | 检查访问权限 |

---

### 前端组件（5个）

| 组件 | 说明 |
|------|------|
| PPBalance | 余额显示（紧凑/完整模式） |
| ContentUnlock | 内容解锁（价格、权限检查） |
| DailySignin | 每日签到（连续签到、奖励） |
| PPTransactions | 交易记录（筛选、分页） |
| MembershipBadge | 会员徽章（简单/详细模式） |

---

## 🎯 常见操作

### 1. 修改内容价格

**Directus 操作**:
```
1. 登录 http://localhost:8055
2. 进入 "PlayPass 定价配置"
3. 找到目标规则（如 strategy_high_risk）
4. 修改 "PP 价格"
5. 保存
```

**Supabase SQL**:
```sql
UPDATE playpass_pricing_config
SET pp_price = 150
WHERE config_key = 'strategy_high_risk';
```

---

### 2. 举办双倍活动

**Directus 操作**:
```
1. 登录 http://localhost:8055
2. 进入 "PlayPass 奖励配置"
3. 找到 daily_signin
4. 修改:
   - 活动倍率: 2.0
   - 生效开始时间: 2025-12-21 00:00
   - 生效结束时间: 2025-12-22 23:59
5. 保存
```

**效果**: 时间到了自动生效和恢复

---

### 3. 查看用户余额

**Directus 操作**:
```
1. 登录 http://localhost:8055
2. 进入 "PlayPass 用户余额"
3. 搜索 user_id
4. 查看详情
```

**Supabase SQL**:
```sql
SELECT * FROM user_playpass
WHERE user_id = 'user-123';
```

---

## 🔒 安全性

### 数据库安全

- ✅ **Row Level Security (RLS)** - 用户数据隔离
- ✅ **Service Role Key** - API 使用高权限密钥
- ✅ **Public 只读** - 配置表 Public 角色只能读取

### API 安全

- ✅ **数据验证** - 所有输入都经过验证
- ✅ **SQL 注入防护** - 使用 Supabase ORM
- ✅ **每日上限** - 防止刷 PP
- ✅ **重复检查** - 防止重复奖励

### 权限控制

**Directus**:
- Public 角色: 只读（API 使用）
- Administrator 角色: 完全权限

---

## 📊 项目统计

### 代码

| 类型 | 数量 | 行数 |
|------|------|------|
| SQL 脚本 | 2 | ~500 |
| API 端点 | 7 | ~1,400 |
| React 组件 | 5 | ~2,000 |
| 配置脚本 | 3 | ~850 |
| 测试/示例 | 2 | ~380 |
| **总计** | **19** | **~5,130** |

### 文档

| 类型 | 数量 | 字数 |
|------|------|------|
| 项目总结 | 1 | 20,000+ |
| Phase 文档 | 4 | 40,000+ |
| 后台管理指南 | 2 | 35,000+ |
| 快速开始 | 2 | 13,000+ |
| 部署/测试 | 2 | 10,000+ |
| **总计** | **11** | **~118,000** |

---

## 🎉 完成状态

### Phases

| Phase | 名称 | 完成度 |
|-------|------|--------|
| Phase 0 | 数据库设计 | ✅ 100% |
| Phase 1 | 数据库迁移 | ✅ 100% |
| Phase 2 | API 端点开发 | ✅ 100% |
| Phase 3 | 前端组件开发 | ✅ 100% |
| Phase 4 | Supabase 后台配置 | ✅ 100% |
| Phase 5 | 测试和部署 | ✅ 100% |
| Phase 6 | Directus 后台集成 | ✅ 100% |

**总体完成度**: **100%** ✅

---

## 🚀 部署

### 前置要求

- ✅ Node.js >= 18
- ✅ Supabase 账号
- ✅ Vercel 账号（推荐）或自托管服务器

### 部署步骤

```bash
# 1. 构建项目
cd frontend
npm run build

# 2. 部署到 Vercel（推荐）
vercel deploy --prod

# 或自托管
npm run start
```

**详细步骤**: [PLAYPASS-DEPLOYMENT-CHECKLIST.md](PLAYPASS-DEPLOYMENT-CHECKLIST.md)

---

## 💡 提示

### 修改立即生效

✅ 所有在 Directus 或 Supabase 中的修改都会**立即生效**
✅ API 会**实时读取**最新配置
✅ **无需重启**服务器

### 备份建议

在重要修改前建议导出备份:

**Directus**:
- 进入集合 → 选择全部 → 导出 CSV

**Supabase**:
```sql
COPY playpass_pricing_config TO '/tmp/pricing_backup.csv' CSV HEADER;
```

---

## ❓ 常见问题

### Q: 修改配置后多久生效？

A: **立即生效**。Directus 或 Supabase 修改直接写入数据库，API 实时读取。

### Q: 如何备份数据？

A: 参考上面的"备份建议"部分，可以使用 Directus 导出或 Supabase SQL 导出。

### Q: Directus 和 Supabase 哪个更好？

A: **各有优势**，推荐：
- **日常管理**: Directus（图形界面，简单快速）
- **高级操作**: Supabase SQL（批量修改，复杂查询）

### Q: 如何手动调整用户余额？

A: 不建议直接修改 `user_playpass` 表。应使用 Supabase SQL 正确调整（参考 [PLAYPASS-SUPABASE-ADMIN-GUIDE.md](PLAYPASS-SUPABASE-ADMIN-GUIDE.md) FAQ Q7）

---

## 📞 支持

### 遇到问题？

1. 检查本文档和相关文档的 FAQ 部分
2. 查看日志:
   - Next.js: `npm run dev` 控制台输出
   - Directus: `docker-compose logs directus`
3. 验证数据库数据: Supabase Dashboard

### 文档索引

**总览**:
- [README](PLAYPASS-README.md) ← 本文档

**快速参考**:
- [Directus 5分钟配置](PLAYPASS-DIRECTUS-QUICKSTART.md)
- [部署检查清单](PLAYPASS-DEPLOYMENT-CHECKLIST.md)

**完整指南**:
- [项目总结](PLAYPASS-PROJECT-SUMMARY.md) - Phase 0-5
- [Phase 6 集成](PLAYPASS-PHASE6-DIRECTUS-INTEGRATION.md) - Directus 后台

**后台管理**:
- [Directus 管理指南](PLAYPASS-DIRECTUS-ADMIN-GUIDE.md) - 图形界面（20,000字）
- [Supabase 管理指南](PLAYPASS-SUPABASE-ADMIN-GUIDE.md) - SQL 方式（15,000字）

**Phase 详情**:
- [Phase 3 完成](PLAYPASS-PHASE3-COMPLETE.md) - 前端组件
- [Phase 6 完成](PLAYPASS-DIRECTUS-INTEGRATION-COMPLETE.md) - Directus 集成

---

## 🎊 开始使用

1. ✅ 按照"快速开始"部分设置环境
2. ✅ 配置 Directus 后台（可选但推荐）
3. ✅ 运行测试验证一切正常
4. ✅ 开始为用户提供服务
5. ✅ 使用 Directus 管理日常配置

**PlayPass 系统已准备就绪！** 🚀

---

**最后更新**: 2025-11-17
**版本**: v2.2.0
**状态**: ✅ 100% 完成
**项目**: PlayNew.ai PlayPass 系统

---

**PlayPass - 让内容价值可量化，让用户参与更有趣！** 🎟️
**Directus 后台 - 让配置管理更简单！** 🎛️
