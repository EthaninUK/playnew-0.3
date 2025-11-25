const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_TOKEN = 'SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function checkUserPayments() {
  console.log('=== 检查用户购买记录 ===\n');

  try {
    // 1. 查询用户订阅记录 (user_subscriptions)
    console.log('1. 用户订阅记录 (user_subscriptions):');
    const subsResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&sort=-start_date`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (subsResponse.ok) {
      const subsData = await subsResponse.json();
      console.log(`   找到 ${subsData.data?.length || 0} 条订阅记录:\n`);

      if (subsData.data && subsData.data.length > 0) {
        for (const sub of subsData.data) {
          console.log(`   订阅 ID: ${sub.id}`);
          console.log(`   会员等级: ${sub.membership_id}`);
          console.log(`   状态: ${sub.status}`);
          console.log(`   支付金额: $${sub.amount_paid}`);
          console.log(`   支付方式: ${sub.payment_method}`);
          console.log(`   加密支付ID: ${sub.crypto_payment_id || 'N/A'}`);
          console.log(`   开始日期: ${sub.start_date}`);
          console.log(`   结束日期: ${sub.end_date}`);
          console.log('');
        }
      }
    } else {
      console.log(`   查询失败: ${subsResponse.status} ${subsResponse.statusText}`);
    }

    // 2. 查询会员等级表 (memberships)
    console.log('\n2. 会员等级配置 (memberships):');
    const membershipsResponse = await fetch(
      `${DIRECTUS_URL}/items/memberships?sort=level`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (membershipsResponse.ok) {
      const membershipsData = await membershipsResponse.json();
      console.log(`   找到 ${membershipsData.data?.length || 0} 个会员等级:\n`);

      if (membershipsData.data && membershipsData.data.length > 0) {
        for (const membership of membershipsData.data) {
          console.log(`   ID: ${membership.id} | 名称: ${membership.name} | 等级: ${membership.level} | 年费: $${membership.price_yearly_usd}`);
        }
      }
    }

    // 3. 查询用户订阅 (带会员详情)
    console.log('\n\n3. 用户订阅详情 (带会员信息):');
    const detailResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&fields=*,membership_id.*&sort=-start_date&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      if (detailData.data && detailData.data.length > 0) {
        const sub = detailData.data[0];
        console.log(`   当前订阅:`);
        console.log(`   - 订阅ID: ${sub.id}`);
        console.log(`   - 会员名称: ${sub.membership_id?.name || 'N/A'}`);
        console.log(`   - 会员等级: ${sub.membership_id?.level || 'N/A'}`);
        console.log(`   - 状态: ${sub.status}`);
        console.log(`   - 支付金额: $${sub.amount_paid}`);
        console.log(`   - 有效期至: ${sub.end_date}`);
      } else {
        console.log('   未找到活跃订阅');
      }
    }

    console.log('\n=== 检查完成 ===\n');
    console.log('📝 Directus 后台查看位置:');
    console.log('   • 用户订阅: http://localhost:8055/admin/content/user_subscriptions');
    console.log('   • 会员等级: http://localhost:8055/admin/content/memberships');
    console.log('   • 支付记录: Supabase Dashboard -> Table Editor -> payments');

  } catch (error) {
    console.error('查询出错:', error.message);
  }
}

checkUserPayments();
