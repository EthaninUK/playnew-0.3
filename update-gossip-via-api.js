const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// 从环境变量获取token，或者通过登录获取
const ADMIN_TOKEN = process.env.DIRECTUS_TOKEN;

async function getToken() {
  if (ADMIN_TOKEN) {
    return ADMIN_TOKEN;
  }

  // 登录获取token
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function main() {
  try {
    console.log('获取访问token...');
    const token = await getToken();
    console.log('✓ Token获取成功\n');

    // 尝试直接通过API获取并更新gossip
    console.log('正在获取gossip数据...');

    // 使用简单的filter
    const response = await axios.get(`${DIRECTUS_URL}/items/gossip`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,title,credibility_score,likes_count,comments_count,published_at,hotness_score,content_published_at',
        'limit': -1
      }
    });

    const allGossip = response.data.data;
    console.log(`找到 ${allGossip.length} 条gossip记录`);

    // 过滤出需要更新的
    const needUpdate = allGossip.filter(item =>
      !item.content_published_at || item.hotness_score === null || item.hotness_score === undefined
    );

    console.log(`其中 ${needUpdate.length} 条需要更新\n`);

    if (needUpdate.length === 0) {
      console.log('所有记录都已完整，无需更新');
      return;
    }

    // 更新每条记录
    for (let i = 0; i < needUpdate.length; i++) {
      const item = needUpdate[i];

      // 计算hotness_score
      const credibility = item.credibility_score || 60;
      const likes = item.likes_count || 0;
      const comments = item.comments_count || 0;
      const hotnessScore = Math.round(credibility * 0.5 + likes * 0.3 + comments * 2);

      // 使用published_at或当前时间作为content_published_at
      const contentPublishedAt = item.published_at || new Date().toISOString();

      console.log(`[${i + 1}/${needUpdate.length}] ${item.title.substring(0, 40)}...`);

      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/gossip/${item.id}`,
          {
            hotness_score: hotnessScore,
            content_published_at: contentPublishedAt
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`  ✓ 更新成功 (hotness: ${hotnessScore})\n`);
      } catch (error) {
        console.error(`  ✗ 更新失败:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    console.log('\n验证更新结果...');
    const verifyResponse = await axios.get(`${DIRECTUS_URL}/items/gossip`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        'filter[news_type][_eq]': 'gossip',
        'filter[status][_eq]': 'published',
        'sort': '-hotness_score,-content_published_at',
        'fields': 'title,hotness_score,content_published_at',
        'limit': 5
      }
    });

    console.log('\n最热门的5条gossip:');
    verifyResponse.data.data.forEach((item, i) => {
      const publishedAt = item.content_published_at ? new Date(item.content_published_at).toLocaleString('zh-CN') : '无';
      console.log(`${i + 1}. ${item.title.substring(0, 50)}`);
      console.log(`   热度: ${item.hotness_score}, 发布: ${publishedAt}`);
    });

    console.log('\n✓ 完成！');

  } catch (error) {
    console.error('\n执行出错:');
    if (error.response?.data) {
      console.error('API错误:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
