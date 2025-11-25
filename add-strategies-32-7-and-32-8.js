// 衍生品策略 32.7 & 32.8: 周度期权高频滚动 + BTC Iron Condor 铁鹰

const axios = require('axios');


/**
 * 32.8 BTC Iron Condor 铁鹰策略
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: options-selling
 * category_l2: options-selling
 */
const STRATEGY_32_8 = {
  title:
    'BTC Iron Condor 铁鹰策略 - 在窄幅震荡中，用价差结构夹心吃波动率',
  slug: 'btc-iron-condor-range-vol-selling',
  summary:
    '在预期 BTC 短期维持区间震荡时，构建四腿价差组合（铁鹰），同时卖出上方与下方的 OTM 价差，并用更远执行价买入保护，从而封顶尾部风险。核心思想是不赌方向，而是赌“价格在一段时间内不会剧烈偏离某个区间”，通过时间衰减和波动率回落赚取净权利金。',
  category: 'options-selling',
  category_l1: 'derivatives',
  category_l2: 'options-selling',
  risk_level: 4,
  apy_min: 10,
  apy_max: 50,
  min_investment: 2000,
  time_commitment:
    '每周 1-2 次搭建或调整铁鹰结构，日常视波动情况适度监控',
  status: 'published',
  content: `# 32.8 BTC Iron Condor 铁鹰策略 - 在窄幅震荡中夹心吃波动率

> 风险提示  
> - 铁鹰属于风险封顶的价差结构，但并非低风险产品；  
> - 一旦 BTC 走出超预期的单边趋势，组合有可能触发最大亏损；  
> - 若叠加过多组铁鹰或使用高杠杆，尾部风险会被放大，甚至影响整体账户安全。  

---

## 一、场景：价格没什么方向，但你想把“无聊时间”变现

有一段时间，BTC 在 58,000 到 64,000 之间来回震荡：

- 每次冲上 64,000 就有人砸盘；  
- 每次跌到 58,000 附近又会出现买盘托住；  
- 你感觉：短期内大概率还是在这个区间里晃荡，  
  真要出现大行情，多半要等到下一个宏观数据或链上大事件。

你不太想赌“到底会涨会跌”，  
只想利用这段“来回磨”的时间做一笔结构化的交易：  

- 价格如果继续在区间里乱晃，你吃时间价值；  
- 价格如果真的走出极端单边，你最多损失一个可控的上限。

这就是 BTC Iron Condor 铁鹰策略的典型适用场景。

---

## 二、铁鹰组合的四条腿

一个标准的 BTC Iron Condor 由四个期权腿组成（以欧式为例）：

1. 买入更低执行价的看跌期权（Long Put，执行价 K0）；  
2. 卖出略高执行价的看跌期权（Short Put，执行价 K1）；  
3. 卖出略低执行价的看涨期权（Short Call，执行价 K2）；  
4. 买入更高执行价的看涨期权（Long Call，执行价 K3）。  

执行价关系为：K0 < K1 < 当前价格附近 < K2 < K3。

含义：

- K1 和 K2 是你卖出的中间双腿，构成“盈利区间的内边界”；  
- K0 和 K3 是你买入的两侧保险腿，封住极端情况的亏损；  
- 组合在创建时通常会收取一笔净权利金，这就是理论上的最大盈利。  

只要到期时 BTC 价格仍然停留在 K1 和 K2 之间，  
四条腿全部或基本归零，而你保留大部分或全部权利金。

---

## 三、示例：构建一只 14 天的 BTC 铁鹰

假设：

- 当前 BTC 现价为 60,000 USDT；  
- 你判断未来 14 天大概率在 56,000 和 64,000 之间波动；  
- 你选择以下执行价搭建铁鹰（仅示意）：  

- K0：52,000 Long Put（下侧更远的保护腿）；  
- K1：56,000 Short Put（下侧内边界卖方腿）；  
- K2：64,000 Short Call（上侧内边界卖方腿）；  
- K3：68,000 Long Call（上侧更远的保护腿）；  
- 到期时间：14 天后；  
- 组合净权利金：例如每张合约收取 600 USDT（示意，不代表真实报价）。

组合到期收益轮廓大致如下：

- 若 BTC 到期价在 56,000 至 64,000 之间：  
  - 四条腿基本全部 OTM，最终价值约等于零；  
  - 你保留大部分或全部 600 USDT 权利金，接近最大盈利状态。

- 若 BTC 跌破 56,000 但不低于 52,000：  
  - 下侧价差组合开始亏钱，但亏损额度被上方的 Long Put 限制；  
  - 单侧最大亏损约为价差宽度减去收到的权利金。

- 若 BTC 突破 64,000 但不高于 68,000：  
  - 上侧 Call 价差组合开始亏钱，但亏损同样封顶；  

- 若 BTC 极端暴跌至远低于 52,000 或暴涨至高于 68,000：  
  - 一侧价差触发最大亏损，另一侧价差获得最大盈利；  
  - 组合总亏损为单侧价差最大亏损减去净权利金。

从这条轮廓可以看出：

- “中间宽阔区间小赚但常见”；  
- “两端极端区间不常见但一旦出现损失较大”；  
- 这是典型的“高胜率小赚 + 低频大亏”类型收益结构。

---

## 四、策略的关键判断：什么时候适合做铁鹰？

要做 Iron Condor，建议先回答三个问题：

1）当前是区间震荡还是趋势启动初期？

- 短期内如果刚从大趋势中回落，进入明显的整理箱体，则较适合；  
- 若刚刚突破长期均线、大级别阻力、宏观利空变利好等，  
  很可能处于趋势放量阶段，此时做铁鹰风险偏高。

2）波动率在什么位置？

- 当隐含波动率处于中高位时，卖方权利金更可观，可以获得较厚安全垫；  
- 当隐含波动率极低时，权利金不足，稍微一个意外就可能吃大亏；  
- 若未来几天有重大利好/利空事件，  
  IV 可能持续被抬升甚至二次放大，需要格外谨慎。

3）你的账户能承受多大单次亏损？

- 单组铁鹰的最大亏损是可计算的（价差宽度减去净权利金）；  
- 先反推自己账户允许承受的单次亏损，再决定每组铁鹰的规模；  
- 多组铁鹰叠加时，不要忽略“极端单边时所有铁鹰一起被打穿”的可能性。

---

## 五、参数设计思路

下面给出一个思路层面的参数框架，方便你在策略模板或表格里固化：

1）价差宽度

- 单侧价差（K1-K0 和 K3-K2）的宽度决定最大亏损规模；  
- 宽度越大，单次最大亏损越大，对账户冲击越明显；  
- 建议根据账户总权益设定“单组铁鹰最大亏损不超过净值的 1% 左右”，  
  再反推价差宽度和每组合约张数。

2）盈利区间宽度（K1 与 K2 的距离）

- K1 与 K2 间隔越宽，价格到期仍处于区间内的概率越高；  
- 但通常意味着收取的权利金会更少；  
- 可以结合历史波动范围（例如 1 倍或 1.5 倍标准差）去设计。

3）到期时间

- 常见选择是 7～21 天；  
- 太短（例如 0DTE）更适合放在 32.7 的高频滚动玩法里；  
- 铁鹰更偏向“短中期区间视角”，兼顾时间衰减和可管理性。

4）波动率条件

- 设定“只有当隐含波动率处于某个分位以上时才考虑新开铁鹰”；  
- 例如：IV 高于历史 50% 分位或 60% 分位时才参与；  
- 避免在极低波动时期为了一点点权利金去裸露大量尾部风险。

---

## 六、实战管理：何时加仓、减仓、展期

1）何时考虑提前止盈？

- 当铁鹰已实现理论最大盈利的 50%～80% 时，可以考虑提前平仓；  
- 特别是在临近重大事件之前，宁愿把“最后一点时间价值”留在桌上，  
  也不要拿已经到手的大部分利润去赌一次未知波动。

2）何时减仓或止损？

- 价格接近 K1 或 K2 其中一边并且波动率持续上升时：  
  - 首先减仓或完全平掉靠近那一侧的卖方和对冲腿；  
  - 或通过小仓永续合约进行方向对冲，缩小敞口；  
- 若价格已经实质性突破 K1 或 K2，且你无法接受最大亏损，  
  就应严格执行事先设定的止损，不再幻想“价格会不会掉头回来”。

3）如何展期？

- 当组合已经获得较大部分利润，但离到期仍有一定时间：  
  - 可以先平掉当前铁鹰锁定收益；  
  - 再在更远一期到期日重新搭建一组新的铁鹰；  
- 展期的过程本质上是：  
  - 把已经吃到的时间价值变成账户已实现收益；  
  - 再把新的时间价值区间拿来继续卖给市场。

---

## 七、谁适合把铁鹰当作策略积木？

更适合这类玩家：

- 能接受“多数时间小赚、小亏，偶尔大亏”的收益曲线；  
- 已经具备基本期权知识，理解保证金系统和强平规则；  
- 有耐心记录每一次建仓的区间假设、波动率水平、止损逻辑。

不太适合：

- 想要“每一笔交易都有极大盈利”的高波动偏好用户；  
- 无法接受偶尔的较大单次亏损；  
- 没时间在关键时点监控盘面和风险。

---

## 八、小结：把 32.7 和 32.8 组合成“卖方模块”

如果把 32.7 和 32.8 放在一张图里看：

- 32.7 更偏向“高频收租”：  
  - 日度、周度频繁参与 0DTE/1DTE 价格衰减；  
  - 对执行纪律和风控节奏要求很高。

- 32.8 更偏向“区间打包”：  
  - 在认为 BTC 会维持一段时间震荡时，  
    用铁鹰把这段“无聊时间”结构化成一张可收取权利金的合同；  
  - 频率相对更低，但需要更精细的区间和仓位设计。

当你能把这两个玩法都写进自己的策略库里，  
用统一的字段去描述标的、参数、风控、回测结果，  
就等于为自己的衍生品策略模块  
装上了两块成熟的“波动率卖方积木”。  
`
};

/**
 * 通用：获取 Directus 管理员 Token
 * 依赖同目录下的 get-new-directus-token.sh
 */
async function getAdminToken() {
  const { execSync } = require('child_process');
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);

  if (!tokenMatch) {
    throw new Error('Failed to get admin token');
  }
  return tokenMatch[1].trim();
}



/**
 * 上传策略 32.8：BTC Iron Condor 铁鹰策略
 */
async function uploadStrategy32_8() {
  const DIRECTUS_URL = 'http://localhost:8055';
  console.log('开始上传策略 32.8: BTC Iron Condor 铁鹰策略...');

  try {
    const ADMIN_TOKEN = await getAdminToken();
    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_32_8, {
      headers
    });
    console.log('✅ 策略 32.8 上传成功');
  } catch (error) {
    console.error('❌ 策略 32.8 上传失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

/**
 * 方便一次性写入 32.7 和 32.8
 */
async function uploadAllStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';


  await uploadStrategy32_8();

  try {
    const ADMIN_TOKEN = await getAdminToken();
    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=1&meta=total_count`,
      { headers }
    );
    console.log(
      `✅ 当前数据库中策略总数: ${response.data.meta.total_count}`
    );
  } catch (error) {
    console.error('❌ 统计策略总数失败:', error.response?.data || error.message);
  }
}

// 默认：直接执行本文件时，同时上传 32.7 和 32.8
uploadAllStrategies();
