const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// 登录获取token
async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('登录失败:', error.response?.data || error.message);
    throw error;
  }
}

// 计算热度分数
function calculateHotnessScore(credibility, likes, comments) {
  // 热度分数算法：可信度权重 + 点赞数 + 评论数*2
  return Math.round(credibility * 0.5 + likes * 0.3 + comments * 2);
}

// 获取所有gossip记录
async function getGossipWithoutFields(token) {
  try {
    // 先尝试获取没有content_published_at的记录
    const response = await axios.get(`${DIRECTUS_URL}/items/gossip`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        filter: JSON.stringify({
          news_type: { _eq: 'gossip' }
        }),
        fields: 'id,title,credibility_score,likes_count,comments_count,published_at,hotness_score,content_published_at',
        limit: -1
      }
    });

    // 过滤出缺少字段的记录
    const allGossip = response.data.data;
    const needUpdate = allGossip.filter(item =>
      !item.content_published_at || !item.hotness_score
    );

    return needUpdate;
  } catch (error) {
    console.error('获取gossip失败:', error.response?.data || error.message);
    console.error('错误详情:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

// 更新gossip记录
async function updateGossip(token, id, updates) {
  try {
    const response = await axios.patch(
      `${DIRECTUS_URL}/items/gossip/${id}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`更新gossip ${id} 失败:`, error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('正在登录Directus...');
    const token = await login();
    console.log('✓ 登录成功\n');

    console.log('正在获取缺少字段的gossip记录...');
    const gossipItems = await getGossipWithoutFields(token);
    console.log(`找到 ${gossipItems.length} 条需要更新的记录\n`);

    if (gossipItems.length === 0) {
      console.log('没有需要更新的记录');
      return;
    }

    // 更新每条记录
    for (let i = 0; i < gossipItems.length; i++) {
      const item = gossipItems[i];

      // 计算热度分数
      const hotnessScore = calculateHotnessScore(
        item.credibility_score || 60,
        item.likes_count || 0,
        item.comments_count || 0
      );

      // 使用published_at作为content_published_at，或使用当前时间
      const contentPublishedAt = item.published_at || new Date().toISOString();

      const updates = {
        hotness_score: hotnessScore,
        content_published_at: contentPublishedAt
      };

      console.log(`[${i + 1}/${gossipItems.length}] 更新: ${item.title}`);
      console.log(`  - hotness_score: ${hotnessScore}`);
      console.log(`  - content_published_at: ${contentPublishedAt}`);

      await updateGossip(token, item.id, updates);
      console.log('  ✓ 更新成功\n');
    }

    console.log(`\n✓ 所有 ${gossipItems.length} 条记录已更新完成！`);

    // 验证更新
    console.log('\n正在验证更新结果...');
    const verifyResponse = await axios.get(`${DIRECTUS_URL}/items/gossip`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        filter: {
          news_type: { _eq: 'gossip' },
          status: { _eq: 'published' }
        },
        fields: ['id', 'title', 'hotness_score', 'content_published_at'],
        sort: ['-hotness_score', '-content_published_at'],
        limit: 5
      }
    });

    console.log('\n最热门的5条gossip:');
    verifyResponse.data.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   热度: ${item.hotness_score}, 发布时间: ${item.content_published_at}`);
    });

  } catch (error) {
    console.error('\n执行失败:', error.message);
    process.exit(1);
  }
}

main();
