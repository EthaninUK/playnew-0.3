const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });
  return response.data.data.access_token;
}

function calculateHotnessScore(credibility, likes, comments) {
  return Math.round((credibility || 60) * 0.5 + (likes || 0) * 0.3 + (comments || 0) * 2);
}

async function main() {
  try {
    console.log('🔑 正在登录Directus...');
    const token = await login();
    console.log('✅ 登录成功\n');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('📊 正在获取gossip数据...');

    // 从news集合中获取所有gossip类型的记录
    const response = await axios.get(`${DIRECTUS_URL}/items/news`, {
      headers,
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,title,credibility_score,likes_count,comments_count,published_at,hotness_score,content_published_at',
        'limit': -1
      }
    });

    const allGossip = response.data.data;
    console.log(`找到 ${allGossip.length} 条gossip记录`);

    // 找出缺少字段的记录
    const needUpdate = allGossip.filter(item =>
      !item.content_published_at || item.hotness_score === null || item.hotness_score === undefined
    );

    console.log(`其中 ${needUpdate.length} 条需要更新字段\n`);

    if (needUpdate.length === 0) {
      console.log('✨ 所有记录都已完整，无需更新！');

      // 显示最热门的gossip
      const hotGossip = allGossip
        .filter(item => item.hotness_score)
        .sort((a, b) => b.hotness_score - a.hotness_score)
        .slice(0, 5);

      console.log('\n🔥 最热门的5条gossip:');
      hotGossip.forEach((item, i) => {
        console.log(`${i + 1}. ${item.title.substring(0, 50)}`);
        console.log(`   热度: ${item.hotness_score}`);
      });

      return;
    }

    console.log('🔧 开始更新记录...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < needUpdate.length; i++) {
      const item = needUpdate[i];

      // 计算热度分数
      const hotnessScore = calculateHotnessScore(
        item.credibility_score,
        item.likes_count,
        item.comments_count
      );

      // 使用published_at或当前时间
      const contentPublishedAt = item.published_at || new Date().toISOString();

      const updates = {
        hotness_score: hotnessScore,
        content_published_at: contentPublishedAt
      };

      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/news/${item.id}`,
          updates,
          { headers }
        );

        successCount++;
        console.log(`✅ [${successCount}/${needUpdate.length}] ${item.title.substring(0, 45)}`);
        console.log(`   热度分数: ${hotnessScore}`);

        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        errorCount++;
        console.error(`❌ 更新失败: ${item.title.substring(0, 30)}`);
        console.error(`   错误: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 更新摘要:');
    console.log(`   ✅ 成功: ${successCount}`);
    console.log(`   ❌ 失败: ${errorCount}`);
    console.log(`   📝 总计: ${needUpdate.length}`);
    console.log('='.repeat(60));

    // 验证更新结果
    console.log('\n🔍 正在验证更新结果...');
    const verifyResponse = await axios.get(`${DIRECTUS_URL}/items/news`, {
      headers,
      params: {
        'filter[news_type][_eq]': 'gossip',
        'filter[status][_eq]': 'published',
        'sort': '-hotness_score,-content_published_at',
        'fields': 'title,hotness_score,content_published_at',
        'limit': 5
      }
    });

    console.log('\n🔥 最热门的5条gossip:');
    verifyResponse.data.data.forEach((item, i) => {
      const publishedAt = item.content_published_at
        ? new Date(item.content_published_at).toLocaleString('zh-CN')
        : '无';
      console.log(`${i + 1}. ${item.title.substring(0, 45)}`);
      console.log(`   热度: ${item.hotness_score} | 发布时间: ${publishedAt}`);
    });

    console.log('\n✨ 完成！');

  } catch (error) {
    console.error('\n❌ 执行失败:');
    if (error.response?.data) {
      console.error('API错误:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
