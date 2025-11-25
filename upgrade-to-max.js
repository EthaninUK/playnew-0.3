const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_TOKEN = 'SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function upgradeToMax() {
  console.log('=== 升级用户到 Max 会员 ===\n');

  try {
    // 1. 先查询当前订阅
    const checkResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const existingData = await checkResponse.json();

    if (!existingData.data || existingData.data.length === 0) {
      console.log('❌ 未找到现有订阅记录');
      return;
    }

    const subscriptionId = existingData.data[0].id;
    console.log(`📋 找到订阅记录 ID: ${subscriptionId}`);
    console.log(`   当前会员等级: ${existingData.data[0].membership_id}\n`);

    // 2. 更新到 Max 会员
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const updateResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions/${subscriptionId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membership_id: 3,  // Max 会员的 ID
          status: 'active',
          billing_cycle: 'yearly',
          payment_method: 'cryptocloud',
          amount_paid: 1299,  // Max 会员价格
          crypto_payment_id: 'MANUAL_UPGRADE_' + Date.now(),
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: false,
        }),
      }
    );

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ 升级成功！');
      console.log(`   新会员等级: Max (ID: 3)`);
      console.log(`   有效期至: ${endDate.toISOString().split('T')[0]}`);
      console.log(`   支付金额: $1299\n`);

      // 3. 验证更新
      const verifyResponse = await fetch(
        `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&fields=*,membership_id.*&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        if (verifyData.data && verifyData.data.length > 0) {
          const sub = verifyData.data[0];
          console.log('📊 验证结果:');
          console.log(`   会员名称: ${sub.membership_id?.name}`);
          console.log(`   会员等级: ${sub.membership_id?.level}`);
          console.log(`   状态: ${sub.status}`);
          console.log(`   有效期至: ${sub.end_date.split('T')[0]}`);
        }
      }

      console.log('\n✨ 请刷新前端页面查看变化！');
    } else {
      console.log('❌ 更新失败:', updateResponse.status, updateResponse.statusText);
      const errorText = await updateResponse.text();
      console.log('   错误详情:', errorText);
    }

  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  }
}

upgradeToMax();
