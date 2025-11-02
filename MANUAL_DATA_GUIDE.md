# 手动添加示例数据指南

由于 Directus 权限系统的复杂性，建议通过 Admin UI 手动添加示例数据。

## 访问 Directus Admin UI

1. 打开浏览器访问: http://localhost:8055/admin
2. 使用以下凭据登录:
   - Email: `the_uk1@outlook.com`
   - Password: `Mygcdjmyxzg2026!`

---

## 添加服务商数据

### 1. 进入 Service Providers 集合
在左侧菜单找到 `service_providers` 集合，点击进入。

### 2. 点击右上角 "Create Item" 按钮

### 3. 填写 Uniswap 数据示例

#### 基本信息
- **ID**: `provider-1`
- **Name**: `Uniswap`
- **Slug**: `uniswap`
- **Description**:
  ```
  Uniswap 是以太坊上最大的去中心化交易所（DEX），采用自动做市商（AMM）模型，允许用户无需订单簿即可交易 ERC-20 代币。V3 版本引入了集中流动性机制，大幅提高资金效率。
  ```
- **Category**: `dex`
- **Provider Type**: `dex`
- **Status**: `published`

#### 链接
- **Logo URL**: `https://cryptologos.cc/logos/uniswap-uni-logo.png`
- **Website URL**: `https://uniswap.org`
- **Twitter URL**: `https://twitter.com/Uniswap`
- **Discord URL**: `https://discord.com/invite/uniswap`
- **Github URL**: `https://github.com/Uniswap`

#### 数据指标
- **Security Score**: `5`
- **TVL**: `3500000000` (35亿美元)
- **Rating**: `4.8`
- **Review Count**: `1250`
- **View Count**: `15230`
- **Bookmark Count**: `890`

#### 数组字段
- **Chains** (添加多个):
  - `Ethereum`
  - `Polygon`
  - `Arbitrum`
  - `Optimism`
  - `Base`
  - `BNB Chain`

- **Tags** (添加多个):
  - `AMM`
  - `DEX`
  - `DeFi`
  - `Swap`

- **Features** (添加多个):
  - `集中流动性`
  - `多链部署`
  - `无需许可`
  - `开源协议`
  - `治理代币 UNI`

- **Audit Reports** (添加多个):
  - `https://github.com/Uniswap/v3-core/blob/main/audits/tob/audit.pdf`
  - `https://github.com/Uniswap/v3-core/blob/main/audits/abdk/audit.pdf`

#### 时间字段
- **Created At**: (当前时间)
- **Updated At**: (当前时间)
- **Published At**: (当前时间)

### 4. 点击 "Save" 保存

---

## 添加更多服务商 (可选)

### Aave (借贷协议)
```
ID: provider-2
Name: Aave
Slug: aave
Description: Aave 是领先的去中心化借贷协议，允许用户存入加密资产赚取利息，或以超额抵押方式借出资产。支持闪电贷功能，是 DeFi 生态的核心基础设施。
Category: lending
Provider Type: lending
Logo URL: https://cryptologos.cc/logos/aave-aave-logo.png
Website URL: https://aave.com
Security Score: 5
TVL: 6200000000
Rating: 4.9
Review Count: 980
Chains: Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base
Tags: Lending, Borrowing, DeFi, Flash Loans
Features: 闪电贷, 隔离资产, E-Mode, 多链部署, 治理代币 AAVE
Status: published
```

### MetaMask (钱包)
```
ID: provider-4
Name: MetaMask
Slug: metamask
Description: MetaMask 是最流行的以太坊钱包和浏览器扩展，支持与 DApp 交互。提供简单易用的界面，是 Web3 世界的入口。全球超过 3000 万用户使用。
Category: wallet
Provider Type: wallet
Logo URL: https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg
Website URL: https://metamask.io
Security Score: 4
Rating: 4.5
Review Count: 8500
View Count: 25600
Chains: Ethereum, Polygon, BNB Chain, Avalanche, Arbitrum, Optimism, Base
Tags: Wallet, Browser Extension, Mobile, Web3
Features: 浏览器扩展, 移动应用, 硬件钱包支持, Swap 功能, 多链支持
Status: published
```

---

## 添加资讯数据

### 1. 进入 News 集合
在左侧菜单找到 `news` 集合，点击进入。

### 2. 添加资讯示例

#### Bitcoin 突破新高
```
ID: news-1
Title: Bitcoin突破新高：机构投资持续涌入
Slug: bitcoin-breaks-new-high
Summary: Bitcoin价格突破历史新高，机构投资者持续买入，市场情绪乐观。灰度、MicroStrategy等机构持仓继续增加。
URL: https://www.coindesk.com/markets/2025/01/bitcoin-breaks-new-high
Source Type: article
Category: market
Source: CoinDesk
Source URL: https://www.coindesk.com
View Count: 1250
Tags: Bitcoin, BTC, 机构投资, 新高
Status: published
Published At: (2小时前的时间)

Content: (Markdown格式)
# Bitcoin突破新高

Bitcoin价格在今日突破历史新高，达到$XX,XXX美元，创下新的里程碑。

## 机构持续买入

- **灰度比特币信托(GBTC)**: 持仓量持续增长
- **MicroStrategy**: 再次增持XXX枚BTC
- **特斯拉**: 持有价值超过XX亿美元的BTC

## 市场分析

分析师认为，本轮上涨主要由以下因素驱动：

1. 机构投资者大量买入
2. 通胀预期上升
3. 供应量减少（减半效应）
4. DeFi生态繁荣

## 未来展望

多位分析师预测，Bitcoin可能在未来几个月内继续上涨，目标价格在$XXX,XXX - $XXX,XXX之间。
```

---

## 验证页面效果

添加数据后，访问以下页面查看效果：

1. **服务商列表**: http://localhost:3000/providers
2. **服务商详情**: http://localhost:3000/providers/uniswap
3. **资讯列表**: http://localhost:3000/news
4. **资讯详情**: http://localhost:3000/news/bitcoin-breaks-new-high

---

## 注意事项

### 必填字段
确保以下字段一定要填写：
- `id`, `name`, `slug`
- `category` (很重要！)
- `status` = `published`
- `chains` (至少一个)
- `tags` (至少一个)

### 时间字段
- 所有时间字段使用 ISO 8601 格式
- 可以使用 Directus UI 的日期选择器

### 数组字段
- 点击 "+" 按钮添加数组项
- 每个item单独输入并保存

---

## 完整的示例数据

所有8个服务商和5条资讯的完整数据在以下文件中:
- `add-sample-providers.js` - 服务商数据
- `add-sample-news.js` - 资讯数据

可以复制这些JavaScript对象中的值，粘贴到Directus Admin UI的对应字段中。

---

## 疑难解答

### 如果保存时出现错误:
1. 检查 `status` 是否设置为 `published`
2. 检查 `category` 是否已填写
3. 检查必填字段是否都已填写
4. 检查数组字段格式是否正确

### 如果页面不显示数据:
1. 确认 `status` = `published`
2. 刷新前端页面（Ctrl+R 或 Cmd+R）
3. 检查浏览器控制台是否有错误

---

**提示**: 只需添加 1-2 条数据就可以测试页面效果了！无需添加全部8个服务商。
