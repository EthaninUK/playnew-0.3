# Crypto Market Tracker - 集成方案设计

## 项目概述
将 OpenStock 的核心理念应用于 PlayNew 平台，创建一个专注于加密货币的市场追踪系统。

## 一、核心功能模块

### 1.1 实时价格追踪（Price Tracker）
```
功能：
- 实时显示 Top 100 加密货币价格
- 支持搜索和自定义 Watchlist
- 24h 涨跌幅、成交量、市值
- 价格走势迷你图表

数据源：
- CoinGecko API (免费，每分钟更新)
- Binance WebSocket (付费用户可用实时推送)
```

### 1.2 价格提醒系统（Price Alerts）
```
功能：
- 用户设置目标价格（高于/低于）
- 支持百分比变化提醒（涨跌 X%）
- 多种通知方式：邮件、站内消息、Webhook
- 免费用户：3 个提醒
- 会员用户：无限提醒

技术实现：
- Directus collection: price_alerts
- N8N 定时任务检查价格
- Chatwoot 发送通知
```

### 1.3 市场事件日历（Event Calendar）
```
功能：
- CPI/非农数据公布时间（宏观事件）
- 项目 Token 解锁日期
- 空投快照时间
- 重大升级/硬分叉
- 财报/AMA 时间

数据源：
- CoinGecko Events API
- 手动整理（运营团队）
- 社区提交（PlayPass 用户特权）

关联：
- 关联到对应的 Strategies（如 35.4 CPI 博弈策略）
- 事件前推送提醒给订阅用户
```

### 1.4 黑客事件追踪（Security Incidents）
```
功能：
- 自动抓取黑客攻击新闻
- 损失金额评估
- 项目代币价格变化
- 抄底机会评分

数据源：
- Rekt News RSS
- PeckShield Twitter
- SlowMist 监控
- 整合到 Gossip 系统

关联：
- 35.6 黑客攻击套利策略
- 自动标记相关 News
```

## 二、技术架构

### 2.1 后端 API 设计

#### Directus Collections
```sql
-- 价格提醒表
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES directus_users(id),
  symbol VARCHAR(20),           -- BTC, ETH
  target_price DECIMAL(20, 8),  -- 目标价格
  condition VARCHAR(10),         -- 'above' | 'below' | 'change'
  percentage DECIMAL(5, 2),      -- 变化百分比
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户 Watchlist
CREATE TABLE user_watchlist (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES directus_users(id),
  symbol VARCHAR(20),
  notes TEXT,
  added_at TIMESTAMP DEFAULT NOW()
);

-- 市场事件表
CREATE TABLE market_events (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  event_type VARCHAR(50),        -- 'cpi', 'airdrop', 'unlock', 'hack'
  event_date TIMESTAMP,
  related_tokens JSONB,           -- ['BTC', 'ETH']
  related_strategies JSONB,       -- 关联策略 IDs
  impact_score INTEGER,           -- 1-5 影响评分
  status VARCHAR(20),             -- 'upcoming', 'live', 'completed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 价格历史缓存（可选，减少 API 调用）
CREATE TABLE price_cache (
  symbol VARCHAR(20),
  price DECIMAL(20, 8),
  price_change_24h DECIMAL(10, 4),
  market_cap BIGINT,
  volume_24h BIGINT,
  updated_at TIMESTAMP,
  PRIMARY KEY (symbol, updated_at)
);
```

#### Next.js API Routes
```typescript
// /api/market/prices
// 获取实时价格（CoinGecko API）

// /api/market/alerts
// CRUD 用户的价格提醒

// /api/market/events
// 获取市场事件日历

// /api/market/watchlist
// 管理用户 Watchlist

// /api/market/incidents
// 获取安全事件（黑客攻击）
```

### 2.2 前端页面设计

#### 页面结构
```
/market                    # 市场总览页
/market/[symbol]          # 单币种详情页
/market/alerts            # 我的提醒管理
/market/events            # 事件日历
/market/incidents         # 安全事件追踪
```

#### 组件设计
```typescript
// components/market/
PriceCard.tsx             // 价格卡片
PriceChart.tsx            // TradingView 轻量图表
AlertForm.tsx             // 价格提醒设置
EventCalendar.tsx         // 事件日历组件
IncidentCard.tsx          // 安全事件卡片
WatchlistManager.tsx      // Watchlist 管理
```

### 2.3 数据更新策略

#### 免费层
```
- 价格数据：每 60 秒更新（CoinGecko API）
- 事件数据：每 24 小时更新
- 新闻数据：每 30 分钟更新
```

#### 会员层
```
- 价格数据：WebSocket 实时推送（Binance）
- 事件数据：每 6 小时更新
- 新闻数据：每 10 分钟更新
- 独家提醒推送
```

## 三、与现有系统集成

### 3.1 与 Strategies 整合
```javascript
// 策略页面关联市场数据
Strategy 35.4 CPI 博弈
  ↓ 关联
Market Event: "美国 CPI 数据公布"
  ↓ 提醒
用户收到事件前 24h 提醒
```

### 3.2 与 News/Gossip 整合
```javascript
// 自动标记相关新闻
Gossip "某项目被黑 $10M"
  ↓ 自动创建
Market Incident 事件
  ↓ 关联
Strategy 35.6 黑客攻击套利
```

### 3.3 与 PlayPass 整合
```javascript
// 会员特权
免费用户：
- 3 个价格提醒
- 基础事件日历
- 延迟价格数据

PlayPass 会员：
- 无限价格提醒
- 完整事件日历
- 实时价格推送
- 提交自定义事件
- 优先获取安全事件通知
```

## 四、实施优先级

### Phase 1: MVP (1-2 周)
- [ ] 实时价格追踪页面（Top 50 币种）
- [ ] 价格提醒系统（基础版）
- [ ] Directus collections 创建
- [ ] 整合 CoinGecko API

### Phase 2: 增强功能 (2-3 周)
- [ ] 用户 Watchlist 功能
- [ ] 市场事件日历
- [ ] TradingView 图表集成
- [ ] N8N 自动化提醒

### Phase 3: 高级功能 (3-4 周)
- [ ] 安全事件追踪系统
- [ ] Binance WebSocket 实时数据
- [ ] 与 Strategies 深度整合
- [ ] 移动端推送通知

### Phase 4: 社区功能
- [ ] 用户提交市场事件
- [ ] 事件评论和讨论
- [ ] 抄底机会评分系统
- [ ] 社区预警系统

## 五、API 选择建议

### 推荐方案：混合使用

#### 1. CoinGecko (主要数据源 - 免费)
```
优点：
- 完全免费
- 覆盖广（13,000+ 币种）
- 提供市场数据、历史数据、事件
- 稳定可靠

限制：
- 每分钟 10-50 次请求（免费版）
- 数据延迟 1-2 分钟

API Endpoints:
GET /coins/markets          # 市场数据
GET /coins/{id}             # 币种详情
GET /simple/price           # 简单价格查询
GET /events                 # 事件数据
```

#### 2. Binance API (实时数据 - 免费)
```
优点：
- WebSocket 实时推送
- 完全免费
- 低延迟

限制：
- 仅限 Binance 上架的币种
- 需要处理 WebSocket 连接

适用场景：
- 会员用户实时价格推送
- 高频交易策略监控
```

#### 3. CryptoCompare (备选 - 部分免费)
```
优点：
- 新闻聚合 API
- 社交数据
- 历史数据丰富

限制：
- 免费版有限制
```

## 六、成本估算

### 开发成本
- Backend API: 40 小时
- Frontend 页面: 50 小时
- Directus 配置: 10 小时
- N8N 自动化: 15 小时
- 测试部署: 15 小时
**总计：约 130 小时**

### 运营成本
```
免费方案（推荐开始）：
- CoinGecko API: $0/月
- Binance API: $0/月
- 服务器成本：包含在现有 VPS
**总计：$0/月**

付费升级（可选，未来考虑）：
- CoinGecko Pro: $129/月（更高频率调用）
- CryptoCompare: $50/月（新闻 API）
```

## 七、差异化特色

与 OpenStock 不同，我们的优势：

1. **策略驱动**：价格追踪与具体套利策略深度绑定
2. **事件预警**：提前通知用户 CPI、空投、黑客事件
3. **社区智慧**：PlayPass 用户可以提交和分享事件
4. **加密原生**：专注链上数据、DeFi 协议、NFT
5. **中文优先**：面向中文用户的本地化体验

## 八、风险与免责

### 法律合规
```
必须明确声明：
1. 仅供信息参考，不构成投资建议
2. 价格数据可能延迟或不准确
3. 用户自行承担交易风险
4. 不是交易所，不提供交易服务
```

### 数据准确性
```
- 使用多个数据源交叉验证
- 显示数据更新时间
- 异常数据标记和过滤
```

## 九、下一步行动

1. **确认需求**：你想先实现哪些功能？
2. **创建数据库表**：运行 SQL 脚本创建 collections
3. **配置 Directus 权限**：设置 API 访问权限
4. **开发 MVP**：实时价格追踪页面
5. **集成现有功能**：关联 Strategies 和 News

---

## 快速启动命令

如果你批准这个方案，我可以立即帮你：

1. 创建 Directus collections（价格提醒、事件日历）
2. 编写 CoinGecko API 集成代码
3. 开发 `/market` 页面原型
4. 设置 N8N 价格提醒 workflow

**你想从哪个部分开始？**
