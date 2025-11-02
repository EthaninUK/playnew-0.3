# Category L1 字段说明

## ⚠️ 重要提示

在创建策略指南时，`category_l1` 字段**只能使用以下预定义的值**，否则会创建失败。

---

## ✅ 允许的 category_l1 值

| category_l1 值 | 中文含义 | 适用分类 |
|---------------|---------|---------|
| `airdrop` | 空投与早期参与 | 空投任务、积分赛季、测试网、白名单等 |
| `yield` | 链上收益策略 | 借贷挖息、稳定币理财、质押、流动性挖矿等 |
| `liquidity` | 流动性策略 | AMM做市、流动性引导、LP收益等 |
| `tools` | 工具与基础设施 | 数据工具、RPC、预言机、交易机器人等 |
| `nft` | NFT 与链上资产 | NFT铸造、NFT金融、数字藏品等 |

---

## 📝 使用示例

### 示例 1：空投类指南

```javascript
const GUIDE_CONFIG = {
  title: '空投任务完全指南',
  category_l1: 'airdrop',  // ✅ 正确
  category_l2: '空投任务',
  // ...
};
```

### 示例 2：收益类指南

```javascript
const GUIDE_CONFIG = {
  title: '稳定币理财完全指南',
  category_l1: 'yield',  // ✅ 正确
  category_l2: '稳定币理财',
  // ...
};
```

### 示例 3：流动性类指南

```javascript
const GUIDE_CONFIG = {
  title: '流动性挖矿完全指南',
  category_l1: 'liquidity',  // ✅ 正确
  category_l2: '流动性引导',
  // ...
};
```

---

## ❌ 常见错误

### 错误 1：使用了完整的英文名称

```javascript
category_l1: 'onchain-yield',  // ❌ 错误！
category_l1: 'yield',          // ✅ 正确
```

### 错误 2：使用了不存在的值

```javascript
category_l1: 'arbitrage',      // ❌ 错误！数据库中不存在此值
category_l1: 'derivatives',    // ❌ 错误！数据库中不存在此值
```

### 错误 3：拼写错误

```javascript
category_l1: 'airop',          // ❌ 拼写错误
category_l1: 'airdrop',        // ✅ 正确
```

---

## 🔍 如何确定使用哪个值？

根据你的指南类型选择：

### 空投相关 → `airdrop`
- 空投任务
- 积分赛季
- 测试网参与
- 白名单申请
- 启动板参与
- 早鸟活动

### 收益相关 → `yield`
- 借贷挖息
- 稳定币理财
- 质押收益
- LST/LRT
- 再质押
- 稳定币做市

### 流动性相关 → `liquidity`
- AMM 做市
- 流动性挖矿
- 流动性引导
- LP 收益
- Curve 流动性

### 工具相关 → `tools`
- 数据追踪工具
- RPC 服务
- 预言机
- 交易机器人
- 钱包工具

### NFT 相关 → `nft`
- NFT 铸造
- NFT 金融
- NFT 交易
- 数字藏品

---

## 🔧 如果需要新的 category_l1 值

如果你的指南不适合现有的任何值，需要：

1. 在 Directus 后台修改数据库约束
2. 或联系管理员添加新的允许值
3. 或选择最接近的现有值

**不建议自行修改数据库约束**，除非你完全理解影响。

---

## 📚 相关分类映射

| 大类 | category_l1 | 具体分类示例 |
|-----|-------------|------------|
| 空投与早期参与 | `airdrop` | 空投任务、积分赛季、测试网&早鸟、白名单/预售、启动板&配售 |
| 链上收益策略 | `yield` | 借贷挖息、稳定币理财、LST质押、再质押/LRT |
| 流动性策略 | `liquidity` | 流动性引导、AMM做市、Curve池 |
| 工具基础设施 | `tools` | 数据跟踪、RPC/预言机、交易机器人 |
| NFT资产 | `nft` | NFT铸造、NFT金融、铭文/Ordinals |

---

## 🐛 错误排查

如果创建时遇到错误：

```
violates check constraint "strategies_category_l1_check"
```

**原因**：使用了不允许的 category_l1 值

**解决**：
1. 检查 category_l1 是否是上述允许的 5 个值之一
2. 检查拼写是否正确
3. 确保使用的是简短形式（如 `yield` 而不是 `onchain-yield`）

---

## 📖 参考文档

- [add-guide-template.js](add-guide-template.js) - 已更新，包含正确的值
- [README-内容创建指南.md](README-内容创建指南.md) - 完整创建流程
- [快速开始.md](快速开始.md) - 快速上手指南

---

最后更新: 2025-10-27
