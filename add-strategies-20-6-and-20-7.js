const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_20_6 = {
  title: '跨所期权基差套利 - 锁定期权溢价/折价',
  slug: 'cross-exchange-options-basis',
  summary: '在期权相对现货出现贴水或溢价时，跨交易所执行现货-期权套利，锁定基差收益。利用 Put-Call Parity 定价异常获利，年化收益 10-30%。',
  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',
  risk_level: 2,
  apy_min: 10,
  apy_max: 30,
  content: `# 跨所期权基差套利 - 锁定期权溢价/折价

> **预计阅读时间：** 18 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 期权基差原理

### 什么是期权基差？

期权基差是指期权合成价格与现货价格之间的差异。根据 Put-Call Parity：

\`\`\`
合成多头 = Call - Put + K×e^(-rT)

如果：合成多头价格 ≠ 现货价格
则存在基差套利机会
\`\`\`

### Put-Call Parity 公式

\`\`\`
C - P = S - K×e^(-rT)

其中：
C = Call 价格
P = Put 价格
S = 现货价格
K = 行权价
r = 无风险利率
T = 到期时间
\`\`\`

---

## 🎯 策略核心逻辑

### 套利场景

**场景 1：合成价格 > 现货（正基差）**
\`\`\`
操作：
- 买入现货
- 卖出 Call
- 买入 Put

锁定利润 = 合成价格 - 现货价格
\`\`\`

**场景 2：合成价格 < 现货（负基差）**
\`\`\`
操作：
- 做空现货（或卖出持有的现货）
- 买入 Call
- 卖出 Put

锁定利润 = 现货价格 - 合成价格
\`\`\`

---

## 📊 实战案例

### 案例：BTC 期权基差套利

**市场条件：**
- BTC 现货：$60,000
- 30 天后到期
- 行权价：$60,000（ATM）
- 无风险利率：5%

**期权价格：**
- Call：$2,500
- Put：$2,200

**检验 Put-Call Parity：**
\`\`\`
理论：C - P = S - K×e^(-rT)
理论：C - P = 60,000 - 60,000×e^(-0.05×30/365)
理论：C - P = $246

实际：C - P = 2,500 - 2,200 = $300

差异：$300 - $246 = $54（正基差）
\`\`\`

**套利操作：**
\`\`\`
买入 BTC 现货：-$60,000
卖出 Call：+$2,500
买入 Put：-$2,200
净支出：$59,700

到期时无论价格如何，都能以 $60,000 平仓
利润：$60,000 - $59,700 = $300
收益率：0.5%（30天）
年化：6.1%
\`\`\`

---

## 🔧 实操要点

### 监控基差

\`\`\`python
import numpy as np

def check_put_call_parity(
    call_price, put_price, spot_price, strike, days_to_expiry, r=0.05
):
    """检查 Put-Call Parity 套利机会"""
    T = days_to_expiry / 365
    
    # 理论差值
    theoretical_diff = spot_price - strike * np.exp(-r * T)
    
    # 实际差值
    actual_diff = call_price - put_price
    
    # 基差
    basis = actual_diff - theoretical_diff
    
    # 年化收益
    if basis > 0:  # 正基差，做合成空头
        profit = basis
        cost = spot_price
        annual_return = (profit / cost) * (365 / days_to_expiry)
        signal = "SELL_SYNTHETIC"
    else:  # 负基差，做合成多头
        profit = -basis
        cost = strike * np.exp(-r * T)
        annual_return = (profit / cost) * (365 / days_to_expiry)
        signal = "BUY_SYNTHETIC"
    
    return {
        'basis': basis,
        'signal': signal,
        'profit': profit,
        'annual_return': annual_return * 100
    }

# 使用示例
result = check_put_call_parity(
    call_price=2500,
    put_price=2200,
    spot_price=60000,
    strike=60000,
    days_to_expiry=30
)

print(f"基差: \${result['basis']:.2f}")
print(f"信号: {result['signal']}")
print(f"利润: \${result['profit']:.2f}")
print(f"年化: {result['annual_return']:.1f}%")
\`\`\`

### 执行要点

1. **同时执行三笔交易**：现货+Call+Put
2. **使用限价单**：避免滑点侵蚀利润
3. **持有到期**：锁定利润

---

## ⚠️ 风险与应对

| 风险 | 应对 |
|------|------|
| 执行风险 | 使用 API 快速执行 |
| 保证金风险 | 确保充足保证金 |
| 提前行权 | 仅用欧式期权 |

---

## 📈 收益预期

| 基差水平 | 年化收益 | 出现频率 |
|----------|----------|----------|
| 0.1-0.3% | 3-10% | 常见 |
| 0.3-0.5% | 10-20% | 偶尔 |
| >0.5% | 20-30% | 罕见 |

> ⚠️ 基差套利需要大资金才能获得可观绝对收益。`,
  status: 'published'
};

const STRATEGY_20_7 = {
  title: 'Gamma 中性套利 - 从波动中赚取对冲利润',
  slug: 'gamma-neutral-arbitrage',
  summary: '构建 Gamma 中性组合，通过频繁调整 Delta 对冲，在价格波动中实现"买低卖高"的对冲利润。适合高频监控能力的交易者，年化收益 25-50%。',
  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',
  risk_level: 3,
  apy_min: 25,
  apy_max: 50,
  content: `# Gamma 中性套利 - 从波动中赚取对冲利润

> **预计阅读时间：** 20 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中（3/5）

---

## 📖 Gamma 基础

### 什么是 Gamma？

Gamma 是 Delta 相对于标的价格的变化率：

\`\`\`
Gamma = ΔDelta / Δ标的价格

Gamma 高 → Delta 变化快
Gamma 低 → Delta 变化慢
\`\`\`

### Gamma 的特征

\`\`\`
期权 Gamma 分布：
- ATM 期权：Gamma 最大
- OTM/ITM 期权：Gamma 较小
- 临近到期：Gamma 急剧增大
\`\`\`

---

## 🎯 策略核心逻辑

### Gamma Scalping 原理

当你持有正 Gamma 头寸（如买入期权）时，可以通过 Delta 对冲"买低卖高"：

\`\`\`
价格上涨 → Delta 增加 → 卖出现货（高价卖）
价格下跌 → Delta 减少 → 买入现货（低价买）

每次价格波动都能赚取对冲利润
\`\`\`

### Gamma 中性组合

为了最大化 Gamma Scalping 收益并控制风险，构建 Gamma 中性组合：

\`\`\`
买入 ATM Straddle（高 Gamma）
卖出 OTM Strangle（低 Gamma）

组合 Gamma ≈ 0
但通过 Delta 对冲仍能获利
\`\`\`

---

## 📊 实战案例

### 案例：BTC Gamma Scalping

**初始设置：**
- BTC 现价：$60,000
- 买入 $60,000 ATM Straddle
  - Call Delta: +0.50, Gamma: 0.00004
  - Put Delta: -0.50, Gamma: 0.00004
  - 组合 Delta: 0, Gamma: 0.00008

**对冲过程（1天）：**

| 时间 | BTC价格 | 组合Delta | 操作 | 对冲成本 |
|------|---------|-----------|------|----------|
| 9:00 | $60,000 | 0 | 初始 | - |
| 10:00 | $61,000 | +0.08 | 卖0.08 BTC | +$4,880 |
| 12:00 | $59,500 | -0.12 | 买0.20 BTC | -$11,900 |
| 15:00 | $60,500 | +0.04 | 卖0.16 BTC | +$9,680 |
| 17:00 | $60,000 | 0 | 结束 | - |

**对冲利润计算：**
\`\`\`
卖出总额：$4,880 + $9,680 = $14,560
买入总额：$11,900
对冲利润：$14,560 - $11,900 = $2,660

扣除：
- Theta 损失：$300（一天时间价值）
- 手续费：$100
净利润：$2,260
\`\`\`

---

## 🔧 实操要点

### 对冲频率选择

\`\`\`
高频对冲（每小时）：
- 利润：高
- 成本：高（手续费）
- 适合：高波动市场

低频对冲（每天）：
- 利润：低
- 成本：低
- 适合：低波动市场

建议：价格变动 1-2% 时对冲
\`\`\`

### Gamma Scalping 代码

\`\`\`python
class GammaScalper:
    def __init__(self, gamma_per_contract, num_contracts):
        self.position_gamma = gamma_per_contract * num_contracts
        self.current_delta = 0
        self.hedge_threshold = 0.05  # 5% Delta 变化触发对冲
        
    def calculate_delta_change(self, price_change):
        """计算 Delta 变化"""
        return self.position_gamma * price_change
    
    def should_hedge(self, new_delta):
        """判断是否需要对冲"""
        return abs(new_delta - self.current_delta) > self.hedge_threshold
    
    def execute_hedge(self, current_price, new_delta):
        """执行对冲"""
        hedge_amount = new_delta - self.current_delta
        
        if hedge_amount > 0:
            # Delta 增加，卖出现货
            action = "SELL"
            pnl = hedge_amount * current_price
        else:
            # Delta 减少，买入现货
            action = "BUY"
            pnl = hedge_amount * current_price
        
        self.current_delta = new_delta
        return action, abs(hedge_amount), pnl

# 模拟对冲
scalper = GammaScalper(gamma_per_contract=0.00004, num_contracts=2)

prices = [60000, 61000, 59500, 60500, 60000]
total_pnl = 0

for i in range(1, len(prices)):
    price_change = prices[i] - prices[i-1]
    delta_change = scalper.calculate_delta_change(price_change)
    new_delta = scalper.current_delta + delta_change
    
    if scalper.should_hedge(new_delta):
        action, amount, pnl = scalper.execute_hedge(prices[i], new_delta)
        total_pnl += pnl
        print(f"价格 {prices[i]}: {action} {amount:.4f} BTC, PnL: \${pnl:.0f}")

print(f"总对冲利润: \${total_pnl:.0f}")
\`\`\`

---

## ⚠️ 风险与应对

| 风险 | 严重程度 | 应对 |
|------|----------|------|
| Theta 损失 | 高 | 选择长期期权 |
| 低波动 | 中 | 避免低 IV 环境 |
| 执行延迟 | 中 | 自动化对冲 |

### 盈利条件

\`\`\`
实际波动率 > 隐含波动率 + 对冲成本

关键：
- 选择 IV 低估的期权
- 高效的对冲执行
- 控制交易成本
\`\`\`

---

## 📈 收益预期

| 波动率状态 | 年化收益 | 备注 |
|------------|----------|------|
| 高波动 | 35-50% | 最佳环境 |
| 中波动 | 20-35% | 正常收益 |
| 低波动 | 0-20% | 可能亏损 Theta |

> ⚠️ Gamma 中性套利需要高频监控和自动化执行能力。对冲频率和阈值的选择是成功的关键。`,
  status: 'published'
};

async function main() {
  try {
    console.log('认证中...');

    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    const token = authResponse.data.data.access_token;
    console.log('认证成功！\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const strategies = [STRATEGY_20_6, STRATEGY_20_7];

    for (const strategy of strategies) {
      const existingResponse = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${strategy.slug}`,
        config
      );

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        console.log(`⏭️  策略 "${strategy.title}" 已存在，跳过`);
        continue;
      }

      await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        config
      );

      console.log(`✅ 策略创建成功: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}`);
      console.log(`   APY: ${strategy.apy_min}-${strategy.apy_max}%\n`);
    }

    const countResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=0&meta=total_count`,
      config
    );

    console.log('========================================');
    console.log(`📊 数据库中策略总数: ${countResponse.data.meta.total_count}`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
