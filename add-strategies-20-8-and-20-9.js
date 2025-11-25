const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_20_8 = {
  title: 'Vega 套利策略 - 波动率均值回归交易',
  slug: 'vega-arbitrage-mean-reversion',
  summary: '在隐含波动率(IV)远高于历史波动率(HV)时卖出期权，或在 IV 过低时买入，赚取波动率均值回归的收益。适合对波动率有深入理解的交易者，年化收益 20-40%。',
  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',
  risk_level: 3,
  apy_min: 20,
  apy_max: 40,
  content: `# Vega 套利策略 - 波动率均值回归交易

> **预计阅读时间：** 18 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中（3/5）

---

## 📖 Vega 基础

### 什么是 Vega？

Vega 衡量期权价格对隐含波动率(IV)变化的敏感度：

\`\`\`
Vega = Δ期权价格 / Δ隐含波动率

例如：
- Vega = 100
- IV 上升 1% → 期权价格上涨 $100
- IV 下降 1% → 期权价格下跌 $100
\`\`\`

### IV vs HV

\`\`\`
隐含波动率(IV)：市场对未来波动的预期（从期权价格推算）
历史波动率(HV)：过去实际发生的波动

正常情况：IV ≈ HV（略高于 HV）
套利机会：IV 与 HV 大幅偏离
\`\`\`

---

## 🎯 策略核心逻辑

### 波动率溢价(Variance Risk Premium)

统计规律表明：
\`\`\`
IV 通常 > HV（波动率溢价）

原因：
- 投资者愿意为不确定性付出溢价
- 卖期权方需要额外补偿

这意味着：长期卖出期权有正期望值
\`\`\`

### 套利策略

**1. IV 过高时（卖 Vega）**
\`\`\`
信号：IV / HV > 1.3（30%溢价）
操作：卖出 Straddle 或 Strangle
预期：IV 回归均值，赚取 Vega 收益
\`\`\`

**2. IV 过低时（买 Vega）**
\`\`\`
信号：IV / HV < 0.9
操作：买入 Straddle 或 Strangle
预期：IV 回升，赚取 Vega 收益
\`\`\`

---

## 📊 实战案例

### 案例：卖出高 IV 的 BTC 期权

**市场条件（重大新闻后）：**
- BTC 现价：$60,000
- 7 天 ATM IV：85%
- 30 天 HV：55%
- IV/HV 比率：1.55（极端高估）

**操作：卖出 ATM Straddle**
\`\`\`
卖出 $60,000 Call：+$2,800
卖出 $60,000 Put：+$2,500
总权利金：$5,300

组合 Greeks：
Delta：0
Gamma：-0.00008
Theta：+$250/天
Vega：-$180
\`\`\`

**IV 回归后（3天）：**
\`\`\`
IV 从 85% 降至 65%
Vega 收益：20% × $180 = $3,600
Theta 收益：3 × $250 = $750
总收益：$4,350

ROI：$4,350 / $5,000（保证金）= 87%（3天）
\`\`\`

---

## 🔧 实操要点

### IV 百分位监控

\`\`\`python
import numpy as np

class VegaArbitrageMonitor:
    def __init__(self, lookback_days=365):
        self.lookback_days = lookback_days
        self.iv_history = []
        
    def calculate_iv_percentile(self, current_iv):
        """计算 IV 在历史数据中的百分位"""
        if len(self.iv_history) < 30:
            return 50  # 数据不足
        
        percentile = np.percentile(
            self.iv_history[-self.lookback_days:], 
            range(0, 101)
        )
        
        # 找到当前 IV 对应的百分位
        for i, p in enumerate(percentile):
            if current_iv <= p:
                return i
        return 100
    
    def generate_signal(self, current_iv, historical_vol):
        """生成交易信号"""
        iv_percentile = self.calculate_iv_percentile(current_iv)
        iv_hv_ratio = current_iv / historical_vol
        
        if iv_percentile > 80 and iv_hv_ratio > 1.2:
            return {
                'signal': 'SELL_VEGA',
                'strength': 'strong' if iv_percentile > 90 else 'moderate',
                'iv_percentile': iv_percentile,
                'iv_hv_ratio': iv_hv_ratio
            }
        elif iv_percentile < 20 and iv_hv_ratio < 0.9:
            return {
                'signal': 'BUY_VEGA',
                'strength': 'strong' if iv_percentile < 10 else 'moderate',
                'iv_percentile': iv_percentile,
                'iv_hv_ratio': iv_hv_ratio
            }
        else:
            return {
                'signal': 'NEUTRAL',
                'strength': 'none',
                'iv_percentile': iv_percentile,
                'iv_hv_ratio': iv_hv_ratio
            }

# 使用示例
monitor = VegaArbitrageMonitor()
# 假设已填充历史数据

result = monitor.generate_signal(
    current_iv=0.85,
    historical_vol=0.55
)

print(f"信号: {result['signal']}")
print(f"强度: {result['strength']}")
print(f"IV/HV: {result['iv_hv_ratio']:.2f}")
\`\`\`

### Delta 对冲

卖出 Straddle 后需要 Delta 对冲：
\`\`\`
保持 Delta 中性
避免方向风险
专注于 Vega 收益
\`\`\`

---

## ⚠️ 风险与应对

| 风险 | 严重程度 | 应对 |
|------|----------|------|
| IV 持续上升 | 高 | 设置止损 |
| 极端波动 | 高 | 使用价差限制损失 |
| Gamma 风险 | 中 | 避免临近到期 |

### 使用价差降低风险

\`\`\`
替代裸卖 Straddle：
卖出 Iron Condor（限制最大亏损）

结构：
- 卖出 ATM Straddle
- 买入 OTM Strangle（保护）

优势：
- 最大亏损有限
- 保证金需求低
\`\`\`

---

## 📈 收益预期

| IV 状态 | 策略 | 年化收益 |
|---------|------|----------|
| IV 极高 | 卖 Vega | 30-50% |
| IV 正常偏高 | 卖 Vega | 15-30% |
| IV 极低 | 买 Vega | 20-40% |

> ⚠️ Vega 套利需要准确判断 IV 水平和回归时机。建议结合多个指标确认信号。`,
  status: 'published'
};

const STRATEGY_20_9 = {
  title: '期权到期日 Pin 效应套利 - 利用价格收敛现象',
  slug: 'options-expiry-pinning-arbitrage',
  summary: '利用期权到期日的 Pin 效应（价格向大量未平仓行权价收敛），提前布局现货和期权头寸获利。适合对市场微观结构有理解的交易者，年化收益 15-35%。',
  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',
  risk_level: 3,
  apy_min: 15,
  apy_max: 35,
  content: `# 期权到期日 Pin 效应套利 - 利用价格收敛现象

> **预计阅读时间：** 16 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中（3/5）

---

## 📖 什么是 Pin 效应？

### Pin 效应定义

Pin 效应（又称 Pinning）是指在期权到期日，标的价格倾向于"钉住"（收敛于）持仓量最大的行权价。

\`\`\`
现象：
- 到期日前 1-2 天
- 价格向"Max Pain"行权价移动
- 在该行权价附近波动减小
\`\`\`

### 为什么会发生？

**做市商对冲效应：**
\`\`\`
做市商卖出大量 ATM 期权 → 需要 Delta 对冲
价格上涨 → Delta 增加 → 卖出现货（压低价格）
价格下跌 → Delta 减少 → 买入现货（推高价格）

结果：价格被"钉住"在行权价附近
\`\`\`

**Max Pain 理论：**
\`\`\`
Max Pain = 期权买方损失最大的价格

在这个价格：
- 最多 Call 和 Put 到期作废
- 期权卖方利润最大化
- 做市商倾向于将价格推向此处
\`\`\`

---

## 🎯 策略核心逻辑

### 识别 Pin 目标

**1. 分析未平仓量(Open Interest)**
\`\`\`
找到 OI 最大的行权价
这通常是 Pin 的目标价格
\`\`\`

**2. 计算 Max Pain**
\`\`\`
Max Pain = 使期权买方总损失最大的价格

计算方法：
对每个可能的到期价格，计算：
- 所有 Call 的内在价值总和
- 所有 Put 的内在价值总和
- 总内在价值 = Call + Put

Max Pain = 总内在价值最小的价格
\`\`\`

### 套利策略

**策略 1：现货布局**
\`\`\`
如果当前价格 > Max Pain：
- 做空现货/合约
- 预期价格下跌到 Max Pain

如果当前价格 < Max Pain：
- 做多现货/合约
- 预期价格上涨到 Max Pain
\`\`\`

**策略 2：卖出期权**
\`\`\`
在 Max Pain 附近卖出 Straddle
预期：
- 价格被钉住，波动减小
- 期权到期作废或价值很小
- 赚取全部/大部分权利金
\`\`\`

---

## 📊 实战案例

### 案例：BTC 月度期权到期

**市场条件（到期前 2 天）：**
- BTC 现价：$62,500
- 月度期权到期

**未平仓量分析：**

| 行权价 | Call OI | Put OI | 总 OI |
|--------|---------|--------|-------|
| $58,000 | 500 | 3,200 | 3,700 |
| $60,000 | 2,800 | 2,500 | 5,300 |
| $62,000 | 1,500 | 800 | 2,300 |
| $64,000 | 2,200 | 400 | 2,600 |

**Max Pain 计算：$60,000**

**套利操作：**
\`\`\`
当前价格 $62,500 > Max Pain $60,000

操作：
1. 做空 BTC 期货/永续
2. 目标：$60,000
3. 止损：$64,000

预期利润：
($62,500 - $60,000) / $62,500 = 4%（2天）
\`\`\`

**实际结果：**
- 到期日 BTC 收于 $60,200
- 利润：$2,300/$62,500 = 3.7%

---

## 🔧 实操要点

### Max Pain 计算代码

\`\`\`python
def calculate_max_pain(options_data):
    """
    计算 Max Pain
    options_data: [{'strike': K, 'call_oi': N, 'put_oi': M}, ...]
    """
    strikes = [opt['strike'] for opt in options_data]
    min_pain = float('inf')
    max_pain_strike = None
    
    for test_price in strikes:
        total_pain = 0
        
        for opt in options_data:
            strike = opt['strike']
            call_oi = opt['call_oi']
            put_oi = opt['put_oi']
            
            # Call 内在价值
            if test_price > strike:
                total_pain += (test_price - strike) * call_oi
            
            # Put 内在价值
            if test_price < strike:
                total_pain += (strike - test_price) * put_oi
        
        if total_pain < min_pain:
            min_pain = total_pain
            max_pain_strike = test_price
    
    return max_pain_strike, min_pain

# 使用示例
options_data = [
    {'strike': 58000, 'call_oi': 500, 'put_oi': 3200},
    {'strike': 60000, 'call_oi': 2800, 'put_oi': 2500},
    {'strike': 62000, 'call_oi': 1500, 'put_oi': 800},
    {'strike': 64000, 'call_oi': 2200, 'put_oi': 400},
]

max_pain, pain_value = calculate_max_pain(options_data)
print(f"Max Pain: \${max_pain}")
\`\`\`

### 入场时机

\`\`\`
最佳入场：到期前 24-48 小时
原因：
- Pin 效应此时开始显现
- 足够时间让价格收敛
- 时间价值快速衰减
\`\`\`

### 仓位管理

\`\`\`
建议仓位：账户 5-10%
原因：
- Pin 效应不是 100% 发生
- 需要多次尝试积累利润
- 控制单次损失
\`\`\`

---

## ⚠️ 风险与应对

| 风险 | 严重程度 | 应对 |
|------|----------|------|
| Pin 失败 | 中 | 设置止损 |
| 突发新闻 | 高 | 到期日避开重大事件 |
| 流动性 | 中 | 选择主流期权 |

### Pin 失败的情况

\`\`\`
Pin 效应可能失败当：
- 有重大新闻/事件
- OI 分布不集中
- 市场趋势强劲

建议：
- 仅在 OI 高度集中时操作
- 避开 FOMC、CPI 等事件
- 设置严格止损（1-2%）
\`\`\`

---

## 📈 收益预期

| 市场状态 | 成功率 | 单次收益 | 年化 |
|----------|--------|----------|------|
| OI 集中 | 70% | 2-4% | 25-35% |
| OI 分散 | 50% | 1-2% | 10-20% |
| 有事件 | 30% | 不建议 | N/A |

**保守估计年化：15-35%**

> ⚠️ Pin 效应套利需要准确判断市场微观结构。建议先观察多个到期日周期，确认 Pin 效应的规律后再实盘操作。`,
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

    const strategies = [STRATEGY_20_8, STRATEGY_20_9];

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
