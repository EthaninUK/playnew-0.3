const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    console.log('🔑 Logging in to Directus...');

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

    // 获取Public角色ID
    console.log('🔍 Finding Public role...');
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    const publicRole = rolesResponse.data.data.find(role => role.name === 'Public');

    if (!publicRole) {
      console.error('❌ Public role not found!');
      return;
    }

    console.log(`✅ Found Public role: ${publicRole.id}\n`);

    // 获取news集合的read权限
    console.log('🔍 Checking news collection permissions...');
    const permissionsResponse = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=news&filter[role][_eq]=${publicRole.id}&filter[action][_eq]=read`,
      { headers }
    );

    if (permissionsResponse.data.data.length === 0) {
      console.log('⚠️  No read permission found for news collection');
      console.log('📝 Creating new permission with all fields...\n');

      await axios.post(
        `${DIRECTUS_URL}/permissions`,
        {
          role: publicRole.id,
          collection: 'news',
          action: 'read',
          fields: '*', // 允许所有字段
          permissions: {
            status: { _eq: 'published' }
          }
        },
        { headers }
      );

      console.log('✅ Permission created!');
    } else {
      const permission = permissionsResponse.data.data[0];
      console.log(`✅ Found permission: ${permission.id}`);
      console.log(`   Current fields: ${JSON.stringify(permission.fields)}\n`);

      if (permission.fields === '*') {
        console.log('✅ Permission already allows all fields (*)');
      } else {
        console.log('📝 Updating permission to allow all fields...\n');

        await axios.patch(
          `${DIRECTUS_URL}/permissions/${permission.id}`,
          {
            fields: '*' // 改为允许所有字段
          },
          { headers }
        );

        console.log('✅ Permission updated!');
      }
    }

    // 清除Directus缓存
    console.log('\n🔄 Attempting to clear Directus cache...');
    try {
      await axios.post(`${DIRECTUS_URL}/utils/cache/clear`, {}, { headers });
      console.log('✅ Cache cleared');
    } catch (err) {
      console.log('⚠️  Could not clear cache (may require restart)');
    }

    // 测试访问
    console.log('\n✨ Testing API access without authentication...\n');

    // 等待一下让权限生效
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const testResponse = await axios.get(
        `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&filter[status][_eq]=published&limit=1&fields=id,title,hotness_score,credibility_score,verification_status,gossip_tags,likes_count,comments_count`
      );

      if (testResponse.data.data.length > 0) {
        console.log('✅✅✅ SUCCESS! Gossip fields are now accessible! ✅✅✅\n');
        console.log('Sample data:');
        const sample = testResponse.data.data[0];
        console.log(`  Title: ${sample.title}`);
        console.log(`  Hotness: ${sample.hotness_score || 'N/A'}`);
        console.log(`  Credibility: ${sample.credibility_score || 'N/A'}%`);
        console.log(`  Status: ${sample.verification_status || 'N/A'}`);
        console.log(`  Tags: ${sample.gossip_tags?.join(', ') || 'N/A'}`);
        console.log(`  Likes: ${sample.likes_count || 0}`);
        console.log(`  Comments: ${sample.comments_count || 0}`);

        console.log('\n🎉 You can now refresh http://localhost:3000/gossip to see the data!');
      } else {
        console.log('⚠️  No published gossip found');
      }
    } catch (error) {
      console.error('❌ API test still failing:');
      console.error(error.response?.data?.errors?.[0]?.message || error.message);
      console.log('\n💡 You may need to restart Directus:');
      console.log('   docker-compose restart directus');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
