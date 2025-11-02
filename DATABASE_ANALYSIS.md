# 数据库表结构分析报告

**生成时间**: 2025-10-20
**总表数**: 44 张表
**项目需求**: 币圈玩法收集录（玩法库、资讯雷达、服务商）

---

## 📊 现有表分类分析

### ✅ 完全保留的表（10 张）

这些表直接符合项目需求或是核心功能：

| 表名 | 列数 | 大小 | 用途 | 保留理由 |
|------|------|------|------|----------|
| **users** | 15 | 160 KB | 用户基础信息 | 核心用户系统 |
| **user_profiles** | 20 | 88 KB | 用户详细资料 | 用户扩展信息 |
| **user_bookmarks** | 8 | 112 KB | 用户收藏 | 对应"收藏"功能 |
| **user_alerts** | 20 | 112 KB | 用户提醒 | 资讯推送功能 |
| **service_providers** | 34 | 224 KB | 服务商 | **完美匹配需求** |
| **tags** | 10 | 48 KB | 标签系统 | 玩法/资讯分类 |
| **strategies** | 36 | 384 KB | 策略/玩法 | **可作为玩法库** |
| **strategy_details** | 15 | 184 KB | 策略详情 | 玩法详细内容 |
| **strategy_ratings** | 13 | 48 KB | 策略评分 | 用户评价系统 |
| **chains** | 13 | 112 KB | 区块链网络 | 链信息（项目需要）|

**总计**: 约 1.47 MB，保留所有数据

---

### 🔄 需要改造的表（8 张）

这些表可以复用但需要调整：

| 表名 | 列数 | 大小 | 当前用途 | 建议改造 |
|------|------|------|----------|----------|
| **collected_content** | 29 | 216 KB | 采集的内容 | → **改为 `news` 表**（资讯雷达） |
| **raw_collected_data** | 32 | 352 KB | 原始采集数据 | → 保留作为资讯缓冲区 |
| **news_sources** | 14 | 96 KB | 资讯来源 | ✅ 直接保留，添加更多源 |
| **news_duplicate_groups** | 10 | 32 KB | 资讯去重 | ✅ 保留，防止重复 |
| **protocols** | 15 | 144 KB | DeFi 协议 | → 可合并到 `strategies` 或独立保留 |
| **category_l1_config** | 12 | 80 KB | 一级分类 | → 简化为统一的分类系统 |
| **category_l2_config** | 11 | 48 KB | 二级分类 | → 简化为统一的分类系统 |
| **radar_feeds** | 29 | 256 KB | 雷达信息流 | → 可作为资讯聚合表 |

**改造策略**: 重命名 + 调整字段 + 迁移数据

---

### 🗑️ 可以删除的表（16 张）

这些是日志、AI处理、或与当前需求不符的表：

#### 日志类（可删除，6 张）
- `admin_logs` (48 KB) - 管理员日志
- `api_logs` (64 KB) - API 调用日志
- `audit_logs` (96 KB) - 审计日志
- `error_logs` (56 KB) - 错误日志
- `collector_run_logs` (64 KB) - 采集器运行日志
- `search_logs` (48 KB) - 搜索日志
- `news_source_logs` (64 KB) - 资讯源日志

**建议**: 保留最近30天数据，然后清空或删除表

#### AI/处理队列类（可删除，3 张）
- `ai_enhancement_queue` (88 KB) - AI 增强队列
- `ai_processing_queue` (24 KB) - AI 处理队列
- `ai_usage_logs` (64 KB) - AI 使用日志

**建议**: 用 n8n + 新的 AI 处理流程替代

#### 其他功能类（可选删除，7 张）
- `ai_providers` (80 KB) - AI 提供商配置
- `news_classification_rules` (64 KB) - 资讯分类规则
- `credibility_list` (40 KB) - 可信度列表
- `content_source_reputation` (48 KB) - 内容源声誉
- `review_queue` (40 KB) - 审核队列
- `feature_flags` (80 KB) - 功能开关
- `system_config` (80 KB) - 系统配置
- `system_settings` (32 KB) - 系统设置
- `version_history` (48 KB) - 版本历史

**建议**:
- `feature_flags`, `system_config`, `system_settings` → 合并为一个配置表
- 其他表根据是否有重要数据决定

---

### ⚠️ 需要评估的表（10 张）

需要你确认是否有重要数据：

| 表名 | 列数 | 大小 | 问题 | 建议 |
|------|------|------|------|------|
| **collector_configs** | 17 | 80 KB | 采集器配置 | 如果用 n8n，可删除 |
| **strategy_chains** | 4 | 32 KB | 策略-链关联 | 保留（关联表） |
| **strategy_protocols** | 4 | 32 KB | 策略-协议关联 | 保留（关联表） |
| **strategy_analytics** | 10 | 24 KB | 策略分析 | 保留（统计数据） |
| **user_draft_strategies** | 15 | 48 KB | 用户草稿 | 保留（用户内容） |
| **user_view_history** | 6 | 48 KB | 浏览历史 | 可选（推荐系统需要） |
| **user_history** | 7 | 32 KB | 用户历史 | 可选（与 view_history 重复？） |

---

## 🎯 推荐方案

### 方案 A: 激进清理（推荐）

**目标**: 保留核心功能，删除冗余，优化结构

#### 保留的表（20 张）
```
核心用户系统（4 张）:
├── users
├── user_profiles
├── user_bookmarks
└── user_alerts

玩法库系统（5 张）:
├── strategies (玩法主表)
├── strategy_details (玩法详情)
├── strategy_ratings (评分)
├── strategy_chains (链关联)
└── strategy_protocols (协议关联)

资讯雷达系统（4 张）:
├── news (重命名自 collected_content)
├── news_sources (资讯源)
├── news_duplicate_groups (去重)
└── radar_feeds (资讯流)

服务商系统（1 张）:
└── service_providers

基础数据（4 张）:
├── tags (标签)
├── chains (区块链)
├── protocols (协议)
└── categories (新建：统一分类)

系统支持（2 张）:
├── user_interactions (新建：点赞/收藏/关注)
└── comments (新建：评论系统，或用 Giscus)
```

#### 删除的表（24 张）
```
日志类（7 张）: 全部删除
AI 队列类（3 张）: 全部删除（改用 n8n）
配置类（5 张）: 合并后删除
其他（9 张）: 根据数据情况删除
```

---

### 方案 B: 保守优化

**目标**: 最小改动，保留大部分表

#### 改动
- 只删除空表和日志表
- 保留所有有数据的功能表
- 新增 2-3 张必需的表

---

## 📋 下一步操作

### 需要你决定：

1. **日志表**：是否需要保留历史日志？
   - [ ] 全部删除
   - [ ] 导出后删除
   - [ ] 保留最近 30 天

2. **AI 相关表**：
   - [ ] 删除，使用新的 n8n + AI 流程
   - [ ] 保留，继续使用现有逻辑

3. **采集器配置**：
   - [ ] 删除，改用 n8n
   - [ ] 保留，继续使用

4. **分类系统**：
   - [ ] 简化为一个 categories 表
   - [ ] 保留两级分类

5. **重要数据备份**：
   - [ ] 我需要先导出所有数据
   - [ ] 直接清理空表即可

---

## 💡 我的建议

**选择方案 A（激进清理）**，因为：

1. ✅ **简洁高效** - 20 张表足以支撑所有功能
2. ✅ **易于维护** - 减少 50% 的表
3. ✅ **更好的架构** - 统一的分类和标签系统
4. ✅ **保留核心数据** - 用户、玩法、服务商数据全保留
5. ✅ **现代化** - 用 n8n 替代老旧的采集器

---

## 🚀 执行步骤（待你确认）

1. **备份所有数据**（自动生成备份 SQL）
2. **删除空表和日志表**
3. **重命名和改造表**（collected_content → news）
4. **创建新表**（user_interactions, comments）
5. **迁移数据**
6. **更新索引和约束**
7. **清理旧数据**

---

**请告诉我你的选择，我会生成相应的迁移脚本！** 🎯
