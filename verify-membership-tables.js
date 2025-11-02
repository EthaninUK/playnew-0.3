const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    // 登录
    console.log('🔐 登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    const token = loginResponse.data.data.access_token;
    console.log('✅ 登录成功\n');

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 检查所有表
    const tables = [
      'memberships',
      'user_subscriptions',
      'payments',
      'partner_earnings',
      'referral_links',
    ];

    console.log('📊 检查会员系统数据库表:\n');

    for (const table of tables) {
      try {
        const response = await axios.get(
          `${DIRECTUS_URL}/items/${table}?limit=10`,
          config
        );
        const count = response.data.data.length;
        console.log(`✅ ${table}: ${count} 条记录`);

        if (table === 'memberships' && count > 0) {
          console.log('   会员等级:');
          response.data.data.forEach((m) => {
            console.log(
              `     - ${m.name} (Level ${m.level}): $${m.price_monthly_usd}/月, $${m.price_yearly_usd}/年`
            );
          });
        }
      } catch (error) {
        if (error.response?.status === 403) {
          console.log(`❌ ${table}: 没有访问权限`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${table}: 表不存在`);
        } else {
          console.log(`❌ ${table}: ${error.message}`);
        }
      }
    }

    console.log('\n🔗 Directus 管理界面: http://localhost:8055/admin');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

main();
