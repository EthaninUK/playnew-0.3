const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    console.log('🔑 Logging in to Directus as admin...');

    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    });

    const token = loginResponse.data.data.access_token;
    console.log('✅ Login successful\n');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 检查这些字段在 Directus 中是否被标记为"hidden"
    console.log('🔍 Checking field visibility in Directus...\n');

    const gossipFields = [
      'credibility_score',
      'hotness_score',
      'verification_status',
      'gossip_tags',
      'likes_count',
      'comments_count'
    ];

    for (const fieldName of gossipFields) {
      try {
        const fieldResponse = await axios.get(
          `${DIRECTUS_URL}/fields/news/${fieldName}`,
          { headers }
        );

        const field = fieldResponse.data.data;
        const isHidden = field.meta?.hidden || false;

        console.log(`📋 ${fieldName}:`);
        console.log(`   Hidden: ${isHidden ? '❌ YES' : '✅ NO'}`);
        console.log(`   Interface: ${field.meta?.interface || 'none'}`);

        // 如果字段被隐藏,取消隐藏
        if (isHidden) {
          console.log(`   🔧 Unhiding field...`);

          await axios.patch(
            `${DIRECTUS_URL}/fields/news/${fieldName}`,
            {
              meta: {
                ...field.meta,
                hidden: false
              }
            },
            { headers }
          );

          console.log(`   ✅ Field unhidden!`);
        }

        console.log('');

      } catch (error) {
        if (error.response?.status === 403) {
          console.error(`❌ ${fieldName}: Field doesn't exist or permission denied`);
        } else {
          console.error(`❌ ${fieldName}: ${error.message}`);
        }
        console.log('');
      }
    }

    console.log('\n✨ Verification: Testing API access...\n');

    // 不带认证测试(Public角色)
    try {
      const testResponse = await axios.get(
        `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&filter[status][_eq]=published&limit=1&fields=id,title,hotness_score,credibility_score,verification_status`
      );

      if (testResponse.data.data.length > 0) {
        console.log('✅ SUCCESS! Gossip fields are now accessible!');
        console.log('\nSample data:');
        console.log(JSON.stringify(testResponse.data.data[0], null, 2));
      } else {
        console.log('⚠️  No published gossip found');
      }
    } catch (error) {
      console.error('❌ API test failed:');
      console.error(error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
