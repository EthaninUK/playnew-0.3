# 🎯 从这里开始！币圈八卦采集系统快速导航

## 📋 你的需求

你想要一个**完全免费**的自动化系统，每天采集 30-80 条币圈八卦。

## ✅ 我为你创建了什么

### 🆓 两个免费工作流

1. **RSS 聚合采集器** - 监控 10+ 主流币圈媒体
2. **Telegram 频道监控** - 实时监听 TG 频道消息

### 📚 两个版本

#### ⚡ 优化版（强烈推荐）
- 基于 n8n 官方最佳实践
- 使用 SplitInBatches 逐个处理
- 4层级关键词系统
- 10+维度智能评分
- 详细统计报告
- 完善错误处理

#### 基础版
- 简单直接的实现
- 适合快速测试

---

## 🚀 5分钟快速开始

### 第 1 步：选择工作流（推荐优化版）

**新用户推荐**：
- ✅ `rss-gossip-collector-optimized.json` - RSS 优化版
- ✅ `telegram-gossip-collector-optimized.json` - Telegram 优化版

**快速测试**：
- `rss-gossip-collector.json` - RSS 基础版
- `telegram-gossip-collector.json` - Telegram 基础版

### 第 2 步：配置环境变量

编辑 `.env` 文件：

```bash
DIRECTUS_URL=http://host.docker.internal:8055
DIRECTUS_TOKEN=你的token
```

**获取 Token:**
```bash
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'
```

### 第 3 步：启动 n8n

```bash
./start-n8n.sh
```

### 第 4 步：导入工作流

1. 访问 http://localhost:5678
2. 点击 **"+" → "Import from File"**
3. 选择工作流文件
4. 导入成功！

### 第 5 步：测试运行

1. 点击右上角 **"Execute Workflow"**
2. 观察结果
3. 查看统计报告（优化版）

### 第 6 步：启用自动运行

1. 启用触发器节点
2. 保存工作流（Ctrl+S）
3. 完成！

---

## 📖 查看文档

### 我应该先看哪个文档？

#### 🎯 如果你是新用户

1. **先看**: [FREE-SETUP-GUIDE.md](FREE-SETUP-GUIDE.md)
   - 完整的免费方案设置指南
   - 分步骤详细说明
   - 5分钟快速上手

2. **再看**: [OPTIMIZED-VERSION-GUIDE.md](OPTIMIZED-VERSION-GUIDE.md)
   - 优化版 vs 基础版对比
   - 为什么选择优化版
   - n8n 最佳实践说明

#### 🔍 如果你想了解方案对比

1. **看**: [FREE-ALTERNATIVES.md](FREE-ALTERNATIVES.md)
   - RSS vs Telegram vs Twitter 对比
   - 成本分析
   - 优劣势对比

#### 🐛 如果你遇到问题

1. **看**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - 常见问题解决方案
   - 错误诊断方法
   - 修复步骤

#### 📊 如果你想看总览

1. **看**: [README.md](README.md)
   - 项目总览
   - 所有文档索引
   - 快速导航

---

## 🎯 推荐使用方式

### 方案 A: 只用 RSS（最简单）

**适合**：想快速开始，覆盖主流媒体

**工作流**：`rss-gossip-collector-optimized.json`

**预期**：
- 每天 20-50 条八卦
- 可信度 70-85 分
- 30分钟延迟

### 方案 B: 只用 Telegram（最实时）

**适合**：想获取独家爆料和实时消息

**工作流**：`telegram-gossip-collector-optimized.json`

**预期**：
- 每天 10-30 条八卦
- 可信度 55-75 分
- 秒级实时

### 方案 C: RSS + Telegram（最推荐）

**适合**：想要全面覆盖媒体和社交媒体

**工作流**：两个都导入

**预期**：
- 每天 30-80 条八卦
- 可信度 55-85 分（混合）
- 实时 + 定时采集

---

## 💰 成本对比

| 方案 | 月成本 | 年成本 |
|------|--------|--------|
| RSS | **$0** | **$0** ✅ |
| Telegram | **$0** | **$0** ✅ |
| RSS + Telegram | **$0** | **$0** ✅ |
| Twitter API | $100+ | $1200+ ❌ |

**你每年可以节省 $1200+！**

---

## 🔧 自定义配置

### RSS 工作流

#### 添加更多 RSS 源

编辑 **"RSS源配置"** 节点：

```javascript
[
  { name: '你的媒体', url: 'https://example.com/rss', weight: 90, lang: 'zh', category: 'media' },
  // 添加更多
]
```

#### 调整关键词

编辑 **"过滤和评分"** 节点，修改关键词库。

#### 调整发布阈值

编辑 **"发布到Directus"** 节点：

```javascript
// 70分以上发布
"status": {{ $json.credibilityScore >= 70 ? '"published"' : '"draft"' }}
```

### Telegram 工作流

#### 配置 Bot

1. 在 Telegram 搜索 @BotFather
2. 发送 `/newbot` 创建 bot
3. 获取 Bot Token
4. 在 n8n 中配置凭证

#### 添加 Bot 到频道

1. 将 bot 添加为频道管理员
2. 或在群组中添加 bot

---

## 📊 监控效果

### 查看采集统计

```bash
# RSS 采集数量
curl -s 'http://localhost:8055/items/news?filter[source_type][_eq]=rss&aggregate[count]=id' | jq

# Telegram 采集数量
curl -s 'http://localhost:8055/items/news?filter[source_type][_eq]=telegram&aggregate[count]=id' | jq

# 查看最新八卦
open http://localhost:3000/gossip
```

### 查看 n8n 日志

n8n 界面 → 左侧 **"Executions"**

优化版会显示详细的统计报告：
- ✅ 成功发布数量
- ⚠️ 重复跳过数量
- ❌ 失败数量
- 🎯 可信度分布
- 📰 最新发布列表

---

## 🆘 需要帮助？

### 常见问题

1. **RSS 无法获取某些源** → 正常，优化版会自动跳过
2. **Telegram 无反应** → 检查 bot 是否添加到频道
3. **Directus 发布失败** → 检查 Token 是否有效
4. **采集数量太少** → 调整关键词库

### 查看文档

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查
- [FREE-SETUP-GUIDE.md](FREE-SETUP-GUIDE.md) - 设置指南
- [OPTIMIZED-VERSION-GUIDE.md](OPTIMIZED-VERSION-GUIDE.md) - 优化版说明

---

## 🎉 总结

你现在拥有：

✅ **2个优化版工作流** - 基于 n8n 最佳实践
✅ **完整的文档体系** - 从入门到进阶
✅ **预期效果** - 每天 30-80 条八卦
✅ **零成本运营** - 完全免费

---

## 🚀 下一步

1. **立即开始** → 导入 `rss-gossip-collector-optimized.json`
2. **测试24小时** → 观察采集效果
3. **可选扩展** → 导入 `telegram-gossip-collector-optimized.json`
4. **持续优化** → 根据数据调整配置

**开始使用吧！** 🎉

如有问题，查看文档或 n8n 日志。

---

## 📚 完整文档索引

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [START-HERE.md](START-HERE.md) | 👈 快速导航 | 所有人 |
| [FREE-SETUP-GUIDE.md](FREE-SETUP-GUIDE.md) | 设置指南 | 新用户 |
| [OPTIMIZED-VERSION-GUIDE.md](OPTIMIZED-VERSION-GUIDE.md) | 优化版说明 | 想深入了解 |
| [FREE-ALTERNATIVES.md](FREE-ALTERNATIVES.md) | 方案对比 | 想选择方案 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 故障排查 | 遇到问题 |
| [README.md](README.md) | 项目总览 | 想看全貌 |

**祝你成功运营币圈最热门的八卦平台！** 🎉
