# Web3 支付系统 - 集成指南

**版本**: v1.0
**完成时间**: 2025-11-20

---

## ✅ 已完成的集成

### 1. Header 导航栏 - BalanceDisplay

**文件**: `frontend/components/shared/Header.tsx`

**已添加**:
```tsx
import { BalanceDisplay } from '@/components/web3/BalanceDisplay';

// 在语言切换器之后、用户菜单之前添加
<BalanceDisplay variant="compact" showRechargeButton={true} />
```

**位置**: 第222行

**效果**:
- 用户登录后自动显示 PP 余额按钮
- 点击展开下拉菜单,显示余额统计和交易历史
- 包含充值按钮,点击打开充值弹窗
- 未登录用户不显示

---

## 📋 待集成的页面

### 2. 策略详情页 - PaywallWrapper

**文件**: `frontend/app/strategies/[slug]/StrategyDetailClient.tsx`

#### 当前状态
- 使用 `useAuthGuard` 强制登录
- 登录后显示完整内容
- 内容在第212-217行的 ReactMarkdown 组件中

#### 集成步骤

**步骤 1**: 添加导入
```tsx
import { PaywallWrapper } from '@/components/web3/PaywallWrapper';
```

**步骤 2**: 包裹详细内容卡片 (第207-218行)

**修改前**:
```tsx
{/* 详细内容卡片 */}
<Card>
  <CardHeader>
    <CardTitle>详细内容</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {strategy.content}
      </ReactMarkdown>
    </div>
  </CardContent>
</Card>
```

**修改后**:
```tsx
{/* 详细内容卡片 */}
<PaywallWrapper
  contentId={strategy.id}
  contentType="strategy"
  contentTitle={strategy.title}
  blurContent={true}  // 模糊预览
>
  <Card>
    <CardHeader>
      <CardTitle>详细内容</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {strategy.content}
        </ReactMarkdown>
      </div>
    </CardContent>
  </Card>
</PaywallWrapper>
```

**步骤 3**: (可选) 移除 useAuthGuard

由于 PaywallWrapper 已经包含访问检查和登录提示,可以移除 `useAuthGuard`:

```tsx
// 删除这些
const { isAuthorized, loading } = useAuthGuard();

if (loading) { ... }
if (!isAuthorized) { return <LoginRequired ... /> }
```

或者保留 `useAuthGuard` 作为额外的安全层。

---

### 3. 套利详情页 - PaywallWrapper

**文件**: `frontend/app/arbitrage/[slug]/page.tsx` (如果存在)

**集成方法**: 与策略详情页相同

```tsx
import { PaywallWrapper } from '@/components/web3/PaywallWrapper';

<PaywallWrapper
  contentId={arbitrage.id}
  contentType="arbitrage"
  contentTitle={arbitrage.title}
  blurContent={true}
>
  {/* 套利详细内容 */}
</PaywallWrapper>
```

---

### 4. 个人中心 - 完整余额显示

**文件**: `frontend/app/member-center/page.tsx` 或 `frontend/app/profile/page.tsx`

#### 集成步骤

**步骤 1**: 添加导入
```tsx
import { BalanceDisplay } from '@/components/web3/BalanceDisplay';
```

**步骤 2**: 在个人中心页面添加

```tsx
export default function MemberCenterPage() {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <h1 className="text-3xl font-bold">个人中心</h1>

      {/* 完整余额显示卡片 */}
      <BalanceDisplay variant="full" showRechargeButton={true} />

      {/* 其他内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 个人信息卡片 */}
        {/* 收藏夹卡片 */}
        {/* 等等... */}
      </div>
    </div>
  );
}
```

---

### 5. 独立充值页面

**文件**: `frontend/app/recharge/page.tsx` (新建)

#### 创建步骤

**步骤 1**: 创建文件
```bash
mkdir -p frontend/app/recharge
touch frontend/app/recharge/page.tsx
```

**步骤 2**: 编写页面代码

```tsx
'use client';

import { useState } from 'react';
import { RechargeDialog } from '@/components/web3/RechargeDialog';
import { Button } from '@/components/ui/button';
import { Coins, Wallet, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RechargePage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // 未登录提示
  if (!user) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">充值 PlayPass</h1>
        <p className="text-muted-foreground mb-8">
          请先登录后再进行充值
        </p>
        <Link href="/auth/login">
          <Button size="lg">前往登录</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
            <Coins className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">充值 PlayPass</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          使用加密货币为您的账户充值积分,解锁更多精彩内容
        </p>
      </div>

      {/* 充值档位说明 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-lg border p-6 text-center">
          <div className="text-sm text-muted-foreground mb-2">小额充值</div>
          <div className="text-2xl font-bold mb-2">$1 - $9</div>
          <div className="text-sm text-muted-foreground">无奖励</div>
        </div>
        <div className="rounded-lg border-2 border-primary p-6 text-center bg-primary/5">
          <div className="text-sm font-medium mb-2 text-primary">推荐</div>
          <div className="text-sm text-muted-foreground mb-2">标准充值</div>
          <div className="text-2xl font-bold mb-2">$10 - $49</div>
          <div className="text-sm font-bold text-green-600">+10% 奖励</div>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="text-sm text-muted-foreground mb-2">超值充值</div>
          <div className="text-2xl font-bold mb-2">$50 - $99</div>
          <div className="text-sm font-bold text-green-600">+20% 奖励</div>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <div className="text-sm text-muted-foreground mb-2">豪华充值</div>
          <div className="text-2xl font-bold mb-2">$100+</div>
          <div className="text-sm font-bold text-green-600">+30% 奖励</div>
        </div>
      </div>

      {/* 充值方式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-lg border p-6">
          <Wallet className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Web3 充值</h3>
          <p className="text-sm text-muted-foreground mb-4">
            使用加密货币充值,支持 Ethereum, Polygon, Base 网络
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground mb-4">
            <li>✅ 支持 ETH, MATIC, USDC, USDT</li>
            <li>✅ 即时到账 (1-3 分钟)</li>
            <li>✅ 安全可靠,链上可查</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6 opacity-50">
          <Zap className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">PP 转赠</h3>
          <p className="text-sm text-muted-foreground mb-4">
            接收其他用户赠送的 PlayPass 积分
          </p>
          <div className="text-sm text-amber-600 font-medium">即将推出</div>
        </div>
      </div>

      {/* 充值按钮 */}
      <div className="text-center">
        <Button size="lg" onClick={() => setOpen(true)} className="px-12">
          <Wallet className="h-5 w-5 mr-2" />
          立即充值
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          充值即表示您同意我们的服务条款和隐私政策
        </p>
      </div>

      {/* 充值弹窗 */}
      <RechargeDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          // 可选: 显示成功消息或跳转到其他页面
        }}
      />
    </div>
  );
}
```

**步骤 3**: 添加导航链接

在 Header 的用户下拉菜单中添加充值入口:

```tsx
<DropdownMenuItem asChild>
  <Link href="/recharge" className="cursor-pointer">
    <Coins className="mr-2 h-4 w-4 text-amber-500" />
    <span className="font-medium">充值 PlayPass</span>
  </Link>
</DropdownMenuItem>
```

---

## 🔧 配置说明

### 1. 环境变量

确保以下环境变量已配置 (`.env.local`):

```bash
# WalletConnect Project ID (必需!)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Directus
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

**获取 WalletConnect Project ID**:
1. 访问 https://cloud.walletconnect.com/
2. 注册/登录账号
3. 创建新项目
4. 复制 Project ID

### 2. 钱包地址配置

```bash
cd /Users/m1/PlayNew_0.3
node update-wallet-addresses.js
```

按提示输入您的钱包地址:
- Ethereum Mainnet: `0x您的钱包地址`
- Polygon: `0x您的钱包地址`
- Base: `0x您的钱包地址`

**⚠️  重要**: 确保这些地址是您控制的钱包!

### 3. RPC 节点配置 (可选)

**当前使用免费 RPC**:
- Ethereum: `https://eth.public-rpc.com`
- Polygon: `https://polygon-rpc.com`
- Base: `https://mainnet.base.org`

**升级到商业 RPC** (推荐生产环境):

1. 注册 Alchemy 或 Infura
2. 获取 API Key
3. 在 Directus 后台更新 RPC URL:
   - 登录 http://localhost:8055
   - 进入 `web3_system_config` 表
   - 更新对应链的 `rpc_url` 字段

---

## 🚀 启动服务

### 1. 启动 Directus
```bash
docker-compose up -d directus
```

### 2. 启动 Frontend
```bash
cd frontend
npm run dev
```

### 3. 访问页面
- 首页: http://localhost:3000
- 策略页: http://localhost:3000/strategies
- 充值页: http://localhost:3000/recharge
- 个人中心: http://localhost:3000/member-center

---

## 📊 测试流程

### 测试 1: 余额显示
1. 登录账号
2. 查看导航栏右上角是否显示 PP 余额按钮
3. 点击余额按钮,查看下拉菜单
4. 验证余额、交易历史是否显示正确

### 测试 2: 充值功能
1. 点击"充值"按钮
2. 输入充值金额 (例如: $10)
3. 验证显示: 基础 1000 PP + 奖励 100 PP = 总计 1100 PP
4. 点击"使用加密货币充值"
5. 选择网络 (Ethereum)
6. 选择代币 (USDC)
7. 连接钱包 (MetaMask)
8. 确认支付信息
9. 发送交易
10. 等待确认 (1-3 分钟)
11. 验证余额是否增加 1100 PP

### 测试 3: 内容解锁 (策略页)
1. 访问策略详情页
2. 如果未付费,应该看到模糊的内容预览和付费墙
3. 点击"使用 1000 PP 解锁"
4. 验证内容是否立即解锁
5. 刷新页面,验证内容保持解锁状态

### 测试 4: Web3 支付解锁
1. 访问未解锁的策略
2. PP 余额不足
3. 点击"使用加密货币支付 $10"
4. 完成 Web3 支付流程
5. 验证内容立即解锁

---

## ⚠️  常见问题

### 1. 余额显示为 0 或不显示

**问题**: BalanceDisplay 不显示或余额为 0

**解决方案**:
1. 检查用户是否已登录
2. 检查 API `/api/web3/recharge-credits` 是否正常
3. 检查数据库 `user_profiles` 表是否有 `credits` 字段
4. 运行数据库迁移脚本:
   ```bash
   node execute-migration.js
   ```

### 2. WalletConnect 连接失败

**问题**: 点击"连接钱包"后无响应

**解决方案**:
1. 检查环境变量 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 是否设置
2. 确认 Project ID 有效 (访问 WalletConnect 控制台)
3. 检查浏览器控制台错误信息

### 3. 交易验证失败

**问题**: 发送交易后一直显示"验证中..."

**解决方案**:
1. 检查 RPC 节点是否正常 (免费 RPC 可能不稳定)
2. 检查交易是否真的上链 (在 Etherscan 查看)
3. 检查收款地址是否正确 (在 Directus 配置中)
4. 查看后端日志:
   ```bash
   cd frontend && npm run dev
   # 查看终端输出
   ```

### 4. 付费墙不显示

**问题**: 策略详情页没有显示付费墙

**解决方案**:
1. 检查是否正确导入 PaywallWrapper
2. 检查 props 是否正确传递 (contentId, contentType, contentTitle)
3. 检查 API `/api/web3/check-access` 是否正常
4. 查看浏览器控制台错误

### 5. 定价配置问题

**问题**: 显示的价格不正确

**解决方案**:
1. 登录 Directus 后台
2. 进入 `web3_pricing_config` 表
3. 检查对应内容类型的定价配置
4. 确保 `is_active = true`
5. 检查 `priority` 字段 (数字越大优先级越高)

---

## 📝 下一步优化

### 短期 (1-2 周)
- [ ] 实现 ERC-20 代币转账支持
- [ ] 添加 Gas 费用估算
- [ ] 集成 CoinGecko 实时代币价格
- [ ] 添加交易失败自动重试

### 中期 (1-2 月)
- [ ] 实现 PP 转赠功能
- [ ] 添加批量购买折扣
- [ ] 实现订阅模式 (月度/年度)
- [ ] 添加推荐奖励系统

### 长期 (3-6 月)
- [ ] 多语言支持 (英文、日文等)
- [ ] 移动端 App (React Native)
- [ ] NFT 会员卡系统
- [ ] DAO 治理功能

---

## 📞 技术支持

### 相关文档
- [Phase 1 总结](PHASE1-COMPLETE-SUMMARY.md) - 数据库设计
- [Phase 2 总结](PHASE2-API-COMPLETE-SUMMARY.md) - API 实现
- [Phase 3 总结](PHASE3-FRONTEND-COMPONENTS-COMPLETE.md) - 前端组件
- [实施计划](HTTP-402-WEB3-IMPLEMENTATION-PLAN.md) - 完整计划

### 组件文档
- Web3PaymentDialog: `frontend/components/web3/Web3PaymentDialog.tsx`
- RechargeDialog: `frontend/components/web3/RechargeDialog.tsx`
- BalanceDisplay: `frontend/components/web3/BalanceDisplay.tsx`
- PaywallWrapper: `frontend/components/web3/PaywallWrapper.tsx`

### API 文档
- Payment Info: `/api/web3/payment-info`
- Check Access: `/api/web3/check-access`
- Verify Transaction: `/api/web3/verify-transaction`
- Recharge Credits: `/api/web3/recharge-credits`

---

**最后更新**: 2025-11-20
**版本**: v1.0
**作者**: Claude Code Assistant
