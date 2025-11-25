# 🚀 PlayNew 服务状态

## ✅ 已启动的服务

### 1. Docker 服务

| 服务 | 状态 | 地址 | 说明 |
|------|------|------|------|
| **Directus** | ✅ 运行中 | http://localhost:8055 | CMS 和内容管理 |
| **Meilisearch** | ✅ 运行中 | http://localhost:7700 | 搜索引擎 |
| **n8n** | ✅ 运行中 | http://localhost:5678 | 工作流自动化 |

### 2. Next.js 前端

| 服务 | 状态 | 地址 |
|------|------|------|
| **Next.js** | ✅ 运行中 | http://localhost:3000 |
| **玩法交换页面** | ✅ 可访问 | http://localhost:3000/play-exchange |
| **玩法库** | ✅ 可访问 | http://localhost:3000/strategies |
| **快讯** | ✅ 可访问 | http://localhost:3000/news |
| **币圈八卦** | ✅ 可访问 | http://localhost:3000/gossip |
| **套利** | ✅ 可访问 | http://localhost:3000/arbitrage |

### 3. 环境配置

| 配置项 | 状态 |
|--------|------|
| **.env.local** | ✅ 已配置 |
| **Supabase 配置** | ✅ 已设置 |
| **Directus 配置** | ✅ 已设置 |

---

## ⏳ 待完成的配置

### 玩法交换系统部署

玩法交换系统使用 **Supabase 云数据库**，需要完成以下步骤：

#### 步骤 1: 数据库迁移 (Supabase Dashboard)

1. 访问: https://supabase.com/dashboard
2. 选择你的项目
3. 点击 **SQL Editor** → **New query**
4. 复制文件内容: `sql/play_exchange_add_to_existing.sql`
5. 点击 **Run** 执行
6. 确认成功

#### 步骤 2: 配置 Directus 权限

```bash
node configure-play-exchange-permissions.js
```

#### 步骤 3: 添加测试数据

```bash
node add-daily-featured-sample.js
```

---

## 🧪 验证服务

运行以下命令检查所有服务状态：

```bash
./check-all-services.sh
```

或手动检查：

```bash
# 1. 检查 Directus
curl http://localhost:8055/server/health

# 2. 检查前端
curl http://localhost:3000

# 3. 检查玩法交换 API
curl http://localhost:3000/api/play-exchange/daily-featured

# 4. 检查 Meilisearch
curl http://localhost:7700/health
```

---

## 📋 服务管理命令

### 启动所有服务

```bash
# 启动 Docker 服务
docker-compose up -d

# 启动前端 (新终端)
cd frontend && npm run dev
```

### 停止所有服务

```bash
# 停止 Docker 服务
docker-compose down

# 停止前端
# Ctrl+C 或 kill $(cat /tmp/next-dev.pid)
```

### 查看服务日志

```bash
# Docker 服务日志
docker-compose logs -f directus
docker-compose logs -f meilisearch
docker-compose logs -f n8n

# 前端日志
tail -f /tmp/next-dev.log
```

### 重启服务

```bash
# 重启 Directus
docker-compose restart directus

# 重启前端
kill $(cat /tmp/next-dev.pid)
cd frontend && npm run dev
```

---

## 🎯 快速访问

### 用户端

- 🏠 **首页**: http://localhost:3000
- 🎁 **玩法交换**: http://localhost:3000/play-exchange
- ⚡ **玩法库**: http://localhost:3000/strategies
- 📈 **快讯**: http://localhost:3000/news
- 🔥 **币圈八卦**: http://localhost:3000/gossip
- 🔄 **套利**: http://localhost:3000/arbitrage

### 管理端

- 📊 **Directus CMS**: http://localhost:8055
  - 用户名: `the_uk1@outlook.com`
  - 密码: `Mygcdjmyxzg2026!`

- 🔧 **n8n 工作流**: http://localhost:5678

- 🔍 **Meilisearch**: http://localhost:7700

---

## 🛠️ 故障排除

### 问题 1: Docker 服务无法启动

**解决方案**:
```bash
# 1. 确保 Docker Desktop 正在运行
open -a Docker

# 2. 等待 Docker 启动
sleep 30

# 3. 重新启动服务
docker-compose up -d
```

### 问题 2: 前端无法访问

**解决方案**:
```bash
# 1. 检查进程
ps aux | grep next

# 2. 杀死旧进程
pkill -f "next dev"

# 3. 重新启动
cd frontend && npm run dev
```

### 问题 3: Directus 连接失败

**解决方案**:
```bash
# 1. 检查日志
docker-compose logs directus --tail=50

# 2. 重启服务
docker-compose restart directus

# 3. 等待启动完成
sleep 10

# 4. 验证
curl http://localhost:8055/server/health
```

### 问题 4: 玩法交换 API 返回错误

**可能原因**:
1. Supabase 数据库表未创建
2. Directus 权限未配置
3. 测试数据未添加

**解决方案**:
查看 [PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md](PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md) 完成部署步骤。

---

## 📚 相关文档

- [README-PLAY-EXCHANGE.md](README-PLAY-EXCHANGE.md) - 玩法交换快速开始
- [PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md](PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md) - 详细部署指南
- [PLAY-EXCHANGE-API-GUIDE.md](PLAY-EXCHANGE-API-GUIDE.md) - API 使用文档
- [check-all-services.sh](check-all-services.sh) - 服务状态检查脚本

---

## ✅ 当前状态总结

```
Docker 服务:    ████████████████████ 100% (3/3 运行中)
前端服务:       ████████████████████ 100% (运行中)
环境配置:       ████████████████████ 100% (已配置)
数据库迁移:     ░░░░░░░░░░░░░░░░░░░░   0% (待执行)
权限配置:       ░░░░░░░░░░░░░░░░░░░░   0% (待执行)
测试数据:       ░░░░░░░░░░░░░░░░░░░░   0% (待添加)

总体就绪度:     ████████░░░░░░░░░░░░  60%
```

**下一步**: 完成玩法交换系统的数据库部署（参考 README-PLAY-EXCHANGE.md）

---

**最后更新**: 2025-11-14
**服务状态**: ✅ 核心服务运行中
