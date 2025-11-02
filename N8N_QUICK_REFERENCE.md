# n8n 快速参考卡 🚀

## 📍 服务地址

| 服务 | URL | 状态 |
|------|-----|------|
| **n8n** | http://localhost:5678 | ✅ 运行中 |
| **Directus** | http://localhost:8055 | ✅ 运行中 |
| **Meilisearch** | http://localhost:7700 | ✅ 运行中 |
| **Next.js** | http://localhost:3000 | ⚠️ 需手动启动 |

## 🔑 登录凭证

### n8n
```
URL: http://localhost:5678
用户名: admin
密码: Mygcdjmyxzg2026!
```

### Directus
```
URL: http://localhost:8055
邮箱: the_uk1@outlook.com
密码: Mygcdjmyxzg2026!
```

## 🎯 快速启动命令

```bash
# 1. 启动所有 Docker 服务
docker-compose up -d

# 2. 查看服务状态
docker-compose ps

# 3. 启动前端 (新终端)
cd frontend && npm run dev

# 4. 访问 n8n
open http://localhost:5678
```

## 📝 工作流模板位置

```
n8n/workflows/
├── crypto-news-scraper.json        # 新闻抓取 (需配置 token)
├── crypto-news-scraper-v2.json     # 新闻抓取 v2 (自动登录) ⭐ 推荐
└── strategy-discovery.json         # 策略发现
```

**推荐使用 v2 版本** - 自动登录，无需手动配置 token!

## 🤖 AI API 端点

| 端点 | 功能 | 方法 |
|------|------|------|
| `/api/ai/translate-and-summarize` | 翻译+摘要 | POST |
| `/api/ai/categorize` | 内容分类 | POST |
| `/api/ai/extract-strategy` | 策略提取 | POST |
| `/api/ai/quality-score` | 质量评分 | POST |

## ⚙️ 配置 AI Key

编辑 `frontend/.env.local`:

```bash
# 选择一个配置:

# OpenAI
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai

# 或 Anthropic
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic

# 或 DeepSeek (中国推荐)
DEEPSEEK_API_KEY=sk-...
AI_PROVIDER=deepseek
```

## 📋 导入工作流步骤

1. 访问 http://localhost:5678
2. 登录 (admin / Mygcdjmyxzg2026!)
3. 点击 "+" → "Import from File"
4. 选择 `n8n/workflows/crypto-news-scraper.json`
5. 重复导入 `strategy-discovery.json`

## 🔐 获取 Directus Token

**⚠️ 新版 Directus 没有 "Access Tokens" 菜单!**

**方法 1: 快速获取 (推荐测试用)**
```bash
./get-directus-token.sh
```
然后在 n8n 中配置 Header Auth 凭证

**方法 2: 使用 v2 工作流 (推荐)**
导入 `crypto-news-scraper-v2.json` - 自动登录，无需配置 token!

📚 详细说明: [DIRECTUS_TOKEN_GUIDE.md](./DIRECTUS_TOKEN_GUIDE.md)

## 🧪 测试命令

```bash
# 测试 Directus
curl http://localhost:8055/server/health

# 测试 n8n
curl http://localhost:5678/healthz

# 测试 AI API (需先启动前端)
curl -X POST http://localhost:3000/api/ai/translate-and-summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","title":"Test","source_language":"en","target_language":"zh"}'

# 查看抓取的新闻
curl -s 'http://localhost:8055/items/news?limit=5'
```

## 📊 查看日志

```bash
# n8n 日志
docker-compose logs n8n -f

# Directus 日志
docker-compose logs directus -f

# 所有服务日志
docker-compose logs -f
```

## 🔄 常用操作

```bash
# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 查看资源占用
docker stats

# 清理未使用的资源
docker system prune
```

## 🐛 故障排除

### n8n 无法连接 Directus
❌ `http://localhost:8055`
✅ `http://directus:8055` (Docker 网络内)

### n8n 无法调用 AI API
❌ `http://localhost:3000`
✅ `http://host.docker.internal:3000` (从容器访问宿主机)

### 工作流超时
在 HTTP Request 节点:
- Options → Timeout: `60000` (60秒)

### 查看错误
```bash
# 检查容器状态
docker-compose ps

# 查看详细日志
docker-compose logs [服务名] --tail=100
```

## 📚 文档链接

| 文档 | 描述 |
|------|------|
| [N8N_WORKFLOW_PLAN.md](./N8N_WORKFLOW_PLAN.md) | 详细工作流设计 |
| [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) | 完整设置指南 |
| [N8N_IMPLEMENTATION_SUMMARY.md](./N8N_IMPLEMENTATION_SUMMARY.md) | 实施总结 |
| [QUICK_START.md](./QUICK_START.md) | 项目快速启动 |

## ⏱️ 工作流执行频率

| 工作流 | 频率 | 可修改 |
|--------|------|--------|
| Crypto News Scraper | 每小时 | Schedule Trigger |
| Strategy Discovery | 每 12 小时 | Schedule Trigger |

## 💡 快速提示

- 🔵 首次使用先**手动执行**测试工作流
- 🟢 确认数据正确保存后再**启用自动执行**
- 🟡 定期检查**执行历史**排查问题
- 🔴 配置**错误通知**及时发现异常

## 🎯 今日待办

- [ ] 配置 AI API Key
- [ ] 启动前端服务
- [ ] 导入 2 个工作流
- [ ] 创建 Directus Token
- [ ] 配置 n8n 凭证
- [ ] 测试运行工作流
- [ ] 启用自动执行

---

**💪 准备好了? 开始吧!**

```bash
# 一键启动所有服务
docker-compose up -d && cd frontend && npm run dev
```

然后访问: http://localhost:5678
