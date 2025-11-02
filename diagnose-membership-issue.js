#!/usr/bin/env node

/**
 * 会员问题诊断脚本
 * 排查支付成功后会员中心显示Free会员的问题
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!DIRECTUS_ADMIN_TOKEN) {
  console.error('❌ Error: DIRECTUS_ADMIN_TOKEN not set');
  console.log('Please set it: export DIRECTUS_ADMIN_TOKEN="your-token"');
  process.exit(1);
}

async function diagnose() {
  console.log('\n=== 会员问题诊断 ===\n');

  // 1. 检查所有订阅记录
  console.log('1️⃣  检查订阅记录...');
  try {
    const subsResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?fields=*,membership_id.*&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    if (!subsResponse.ok) {
      const error = await subsResponse.json();
      console.error('❌ 无法获取订阅记录:', error);
      return;
    }

    const subsData = await subsResponse.json();
    console.log(`✓ 找到 ${subsData.data?.length || 0} 条订阅记录\n`);

    if (subsData.data && subsData.data.length > 0) {
      subsData.data.forEach((sub, idx) => {
        console.log(`订阅 #${idx + 1}:`);
        console.log(`  - ID: ${sub.id}`);
        console.log(`  - User ID: ${sub.user_id}`);
        console.log(`  - Membership: ${sub.membership_id?.name || sub.membership_id} (Level: ${sub.membership_id?.level || 'unknown'})`);
        console.log(`  - Status: ${sub.status}`);
        console.log(`  - Start: ${sub.start_date}`);
        console.log(`  - End: ${sub.end_date}`);
        console.log(`  - Stripe Sub ID: ${sub.stripe_subscription_id || 'none'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ 查询订阅记录失败:', error.message);
  }

  // 2. 检查 Stripe 最近的支付
  console.log('\n2️⃣  检查 Stripe 最近的支付会话...');
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
    });

    console.log(`✓ 找到 ${sessions.data.length} 个支付会话\n`);

    sessions.data.forEach((session, idx) => {
      console.log(`会话 #${idx + 1}:`);
      console.log(`  - ID: ${session.id}`);
      console.log(`  - Status: ${session.status} (Payment: ${session.payment_status})`);
      console.log(`  - Customer: ${session.customer_email || session.customer}`);
      console.log(`  - Amount: $${(session.amount_total || 0) / 100}`);
      console.log(`  - Metadata:`);
      console.log(`    - userId: ${session.metadata?.userId || 'missing'}`);
      console.log(`    - membershipId: ${session.metadata?.membershipId || 'missing'}`);
      console.log(`    - billingCycle: ${session.metadata?.billingCycle || 'missing'}`);
      console.log(`  - Subscription: ${session.subscription || 'none'}`);
      console.log(`  - Created: ${new Date(session.created * 1000).toISOString()}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ 查询 Stripe 会话失败:', error.message);
  }

  // 3. 测试 /api/subscription 接口
  console.log('\n3️⃣  测试 /api/subscription 接口...');
  console.log('⚠️  需要用户登录才能测试此接口');
  console.log('请在浏览器中访问 http://localhost:3000/membership 并查看控制台日志');

  // 4. 检查 webhook 日志
  console.log('\n4️⃣  检查最近的 webhook 事件...');
  try {
    const events = await stripe.events.list({
      limit: 10,
      types: ['checkout.session.completed', 'customer.subscription.*'],
    });

    console.log(`✓ 找到 ${events.data.length} 个相关 webhook 事件\n`);

    events.data.forEach((event, idx) => {
      console.log(`事件 #${idx + 1}:`);
      console.log(`  - Type: ${event.type}`);
      console.log(`  - ID: ${event.id}`);
      console.log(`  - Created: ${new Date(event.created * 1000).toISOString()}`);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log(`  - Session ID: ${session.id}`);
        console.log(`  - User ID: ${session.metadata?.userId || 'missing'}`);
        console.log(`  - Membership ID: ${session.metadata?.membershipId || 'missing'}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ 查询 webhook 事件失败:', error.message);
  }

  // 5. 诊断结论
  console.log('\n=== 诊断结论 ===\n');
  console.log('可能的问题:');
  console.log('1. Webhook 未正确处理（检查日志中是否有 metadata 缺失）');
  console.log('2. user_id 匹配问题（Supabase user.id vs Stripe metadata.userId）');
  console.log('3. Directus token 权限问题（创建订阅记录失败）');
  console.log('4. 用户登录了错误的账号（检查当前登录的邮箱）');
  console.log('\n建议:');
  console.log('- 进行一次完整的测试支付');
  console.log('- 查看前端控制台日志（F12）');
  console.log('- 查看 Next.js 服务器日志（webhook 处理日志）');
  console.log('- 确认登录的邮箱是否是购买会员的邮箱');
}

// 加载环境变量
require('dotenv').config({ path: '/Users/m1/PlayNew_0.3/frontend/.env.local' });

diagnose().catch(console.error);
