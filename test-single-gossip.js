const axios = require('axios');
const crypto = require('crypto');

function generateUUID() {
  return crypto.randomUUID();
}

async function testSingleGossip() {
  try {
    // Login to Directus
    const loginResponse = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });

    const token = loginResponse.data.data.access_token;

    const testGossip = {
      id: generateUUID(),
      status: 'published',
      title: '测试八卦标题',
      ai_summary: '这是一个测试八卦的摘要',
      content: '## 测试八卦标题\n\n这是一个测试八卦的内容',
      news_type: 'gossip',
      category: '全部话题',
      source: '匿名爆料',
      source_type: 'rss',
      url: `https://playnew.ai/gossip/test-${Date.now()}`,
      author_name: '匿名用户',
      content_published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),

      verification_status: 'unverified',
      credibility_score: 50,
      hotness_score: 60,
      likes_count: 10,
      comments_count: 5,
      shares_count: 3,
      view_count: 100,

      source_reliability: 3,
      content_completeness: 4,
      timeliness: 4,

      // Try PostgreSQL array format
      gossip_tags: '{热点,独家}',

      slug: `gossip-test-${Date.now()}`,
      seo_title: '测试八卦标题',
      seo_description: '这是一个测试八卦的摘要',
    };

    console.log('Sending gossip data:');
    console.log(JSON.stringify(testGossip, null, 2));

    const response = await axios.post('http://localhost:8055/items/news', testGossip, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('\n✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testSingleGossip();
