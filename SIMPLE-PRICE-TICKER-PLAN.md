# 简易加密货币价格看板 - 实施方案

## 一、功能定义

### 显示内容
```
币种图标 | 币种名称 | 当前价格 | 24h涨跌幅 | 迷你走势图(可选)
```

### 币种选择（精选 15 个）
```
1. Bitcoin (BTC)
2. Ethereum (ETH)
3. BNB (BNB)
4. Solana (SOL)
5. XRP (XRP)
6. Cardano (ADA)
7. Dogecoin (DOGE)
8. Polygon (MATIC)
9. Polkadot (DOT)
10. Avalanche (AVAX)
11. Chainlink (LINK)
12. Uniswap (UNI)
13. Arbitrum (ARB)
14. Optimism (OP)
15. Starknet (STRK)
```

### 更新频率
- 免费用户：每 60 秒更新一次
- 会员用户：每 10 秒更新一次（可选实时）

## 二、界面设计方案

### 方案 A：顶部滚动横幅（推荐）
```
位置：网站顶部，固定在 Header 下方
样式：横向自动滚动
+------------------------------------------------------------------+
|  🔶 BTC $95,234 ↑2.34%  |  💎 ETH $3,456 ↓1.23%  |  🟡 BNB ...  |
+------------------------------------------------------------------+
特点：
- 不占用主要空间
- 始终可见
- 自动滚动展示所有币种
```

### 方案 B：首页侧边小组件
```
位置：首页右侧边栏
样式：垂直列表，显示 Top 10
+------------------------+
|   💰 Crypto Prices     |
+------------------------+
| 🔶 BTC    $95,234  ↑2% |
| 💎 ETH    $3,456   ↓1% |
| 🟡 BNB    $612     ↑5% |
| ⚪ SOL    $145     ↑8% |
| ...                    |
+------------------------+
```

### 方案 C：独立 Market 页面
```
位置：/market 路由
样式：Grid 卡片布局
+------------------+  +------------------+  +------------------+
|  🔶 Bitcoin      |  |  💎 Ethereum     |  |  🟡 BNB          |
|  BTC             |  |  ETH             |  |  BNB             |
|  $95,234.12      |  |  $3,456.78       |  |  $612.45         |
|  ↑ +2.34%        |  |  ↓ -1.23%        |  |  ↑ +5.67%        |
|  [微型走势图]     |  |  [微型走势图]     |  |  [微型走势图]     |
+------------------+  +------------------+  +------------------+
```

## 三、技术实现

### 3.1 数据源（CoinGecko API - 免费）

```javascript
// API Endpoint
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// 获取实时价格
const fetchPrices = async () => {
  const ids = 'bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polygon,polkadot,avalanche-2,chainlink,uniswap,arbitrum,optimism,starknet';

  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  );

  return response.json();
};

// 返回数据格式
{
  "bitcoin": {
    "usd": 95234.12,
    "usd_24h_change": 2.34
  },
  "ethereum": {
    "usd": 3456.78,
    "usd_24h_change": -1.23
  }
}
```

### 3.2 前端实现（Next.js）

#### 组件文件结构
```
frontend/components/market/
├── PriceTicker.tsx          # 滚动横幅组件
├── PriceCard.tsx            # 单个价格卡片
└── useCryptoPrices.ts       # 价格数据 Hook
```

#### 核心代码

**Hook: useCryptoPrices.ts**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export function useCryptoPrices(refreshInterval = 60000) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/market/prices');
        const data = await response.json();
        setPrices(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { prices, loading };
}
```

**组件: PriceTicker.tsx**
```typescript
'use client';

import { useCryptoPrices } from './useCryptoPrices';

export default function PriceTicker() {
  const { prices, loading } = useCryptoPrices(60000); // 60秒更新

  if (loading) return <div className="animate-pulse">Loading prices...</div>;

  return (
    <div className="bg-gray-900 border-b border-gray-800 overflow-hidden">
      <div className="animate-scroll flex space-x-8 py-3 px-4">
        {[...prices, ...prices].map((crypto, index) => (
          <div key={`${crypto.id}-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-gray-400 font-medium">{crypto.symbol.toUpperCase()}</span>
            <span className="text-white font-semibold">
              ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
              {crypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.change24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**API Route: /api/market/prices/route.ts**
```typescript
import { NextResponse } from 'next/server';

const CRYPTO_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism' },
  { id: 'starknet', symbol: 'STRK', name: 'Starknet' },
];

export async function GET() {
  try {
    const ids = CRYPTO_LIST.map(c => c.id).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from CoinGecko');
    }

    const data = await response.json();

    const formattedPrices = CRYPTO_LIST.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      price: data[crypto.id]?.usd || 0,
      change24h: data[crypto.id]?.usd_24h_change || 0,
    }));

    return NextResponse.json(formattedPrices);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
```

**CSS 动画 (Tailwind)**
```css
/* globals.css 添加滚动动画 */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
```

### 3.3 集成到现有页面

**在 Layout 中添加 Ticker**
```typescript
// frontend/app/layout.tsx
import PriceTicker from '@/components/market/PriceTicker';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <PriceTicker />  {/* 👈 添加价格横幅 */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## 四、实施步骤

### Step 1: 创建 API Route (5 分钟)
```bash
# 创建 API 文件
touch frontend/app/api/market/prices/route.ts
```

### Step 2: 创建组件 (10 分钟)
```bash
# 创建组件目录
mkdir -p frontend/components/market
touch frontend/components/market/PriceTicker.tsx
touch frontend/components/market/useCryptoPrices.ts
```

### Step 3: 添加样式 (5 分钟)
```bash
# 在 globals.css 添加滚动动画
```

### Step 4: 集成到页面 (5 分钟)
```bash
# 在 layout.tsx 引入 PriceTicker
```

### Step 5: 测试 (5 分钟)
```bash
npm run dev
# 访问 http://localhost:3000 查看效果
```

**总计：约 30 分钟完成**

## 五、效果预览

### 滚动效果
```
[自动向左滚动，鼠标悬停暂停]
BTC $95,234 ↑2.34% | ETH $3,456 ↓1.23% | BNB $612 ↑5.67% | SOL $145 ↑8.90% | ...
```

### 颜色方案
- 背景：深色 (bg-gray-900)
- 价格上涨：绿色 (text-green-500)
- 价格下跌：红色 (text-red-500)
- 数字跳动：使用 transition 平滑过渡

## 六、可选增强功能

### 1. 添加价格变化动画
```typescript
// 价格变化时短暂高亮
const [prevPrice, setPrevPrice] = useState(price);

useEffect(() => {
  if (price > prevPrice) {
    // 闪烁绿色
    element.classList.add('flash-green');
  } else if (price < prevPrice) {
    // 闪烁红色
    element.classList.add('flash-red');
  }
  setPrevPrice(price);
}, [price]);
```

### 2. 点击查看详情
```typescript
// 点击币种名称跳转到详情页（未来扩展）
<Link href={`/market/${crypto.symbol.toLowerCase()}`}>
  {crypto.symbol}
</Link>
```

### 3. 会员实时推送
```typescript
// 使用 WebSocket 实现实时更新（会员功能）
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
```

## 七、成本与性能

### API 调用量
```
CoinGecko 免费限制：10-50 次/分钟

我们的用量：
- 1 次请求获取 15 个币种价格
- 每 60 秒请求 1 次
- 每小时 60 次
- 每天 1,440 次

✅ 完全在免费额度内
```

### 性能优化
```typescript
// Next.js App Router 缓存
export async function GET() {
  const response = await fetch(API_URL, {
    next: { revalidate: 60 } // 服务端缓存 60 秒
  });
}

// 客户端只需要从自己的 API 获取数据
// 不会每个用户都直接请求 CoinGecko
```

## 八、部署清单

- [ ] 创建 `/api/market/prices` API Route
- [ ] 创建 `PriceTicker.tsx` 组件
- [ ] 创建 `useCryptoPrices.ts` Hook
- [ ] 添加滚动动画 CSS
- [ ] 在 Layout 中集成组件
- [ ] 测试价格更新功能
- [ ] 测试响应式布局（移动端）
- [ ] 部署到生产环境

---

## 立即开始？

这个方案：
✅ 简单易实现（30 分钟完成）
✅ 零额外成本（免费 API）
✅ 性能优秀（缓存优化）
✅ 用户体验好（平滑滚动）

**需要我现在就帮你实现吗？**
