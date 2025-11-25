const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_TOKEN = 'SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ';

async function updateMembershipPrices() {
  console.log('=== 更新会员等级价格配置 ===\n');

  const updates = [
    {
      id: 2,
      name: 'Pro',
      price_yearly_usd: 699,
      price_monthly_usd: Math.round(699 / 12 * 100) / 100, // 约 $58.25/月
    },
    {
      id: 3,
      name: 'Max',
      price_yearly_usd: 1299,
      price_monthly_usd: Math.round(1299 / 12 * 100) / 100, // 约 $108.25/月
    },
    {
      id: 4,
      name: 'Partner',
      price_yearly_usd: 0,
      price_monthly_usd: 0,
    },
  ];

  try {
    for (const update of updates) {
      console.log(`更新 ${update.name} 会员...`);

      const response = await fetch(
        `${DIRECTUS_URL}/items/memberships/${update.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_yearly_usd: update.price_yearly_usd,
            price_monthly_usd: update.price_monthly_usd,
          }),
        }
      );

      if (response.ok) {
        console.log(`✅ ${update.name}: 年费 $${update.price_yearly_usd}, 月费 $${update.price_monthly_usd}`);
      } else {
        const error = await response.text();
        console.log(`❌ ${update.name} 更新失败:`, error);
      }
    }

    console.log('\n=== 验证更新结果 ===\n');

    // 查询所有会员等级
    const verifyResponse = await fetch(
      `${DIRECTUS_URL}/items/memberships?sort=level`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      console.log('当前会员等级配置:\n');

      for (const membership of data.data) {
        console.log(`${membership.name} (ID: ${membership.id}, Level: ${membership.level})`);
        console.log(`  年费: $${membership.price_yearly_usd}`);
        console.log(`  月费: $${membership.price_monthly_usd}`);
        console.log('');
      }
    }

    console.log('✨ 价格更新完成！');
    console.log('\n📝 在 Directus 后台查看: http://localhost:8055/admin/content/memberships');

  } catch (error) {
    console.error('❌ 更新失败:', error.message);
  }
}

updateMembershipPrices();
