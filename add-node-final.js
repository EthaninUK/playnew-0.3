#!/usr/bin/env node

const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return crypto.randomUUID();
}

const contentFile = '/Users/m1/PlayNew_0.3/node-strategy-content.md';
const content = fs.readFileSync(contentFile, 'utf8');

const strategy = {
  id: generateUUID(),
  title: 'Layer 2 轻节点运行完全指南',
  slug: 'layer2-light-node-running-guide',
  summary: '通过运行 Layer 2 网络轻节点，支持网络去中心化并获得潜在节点奖励。适合有技术基础和稳定服务器的用户。',
  content: content,
  category: 'infrastructure',
  risk_level: 3,
  threshold_capital: '$240-$600/年',
  threshold_capital_min: 240,
  threshold_tech_level: 'advanced',
  apy_min: 0,
  apy_max: 0,
  apy_type: 'one-time',
  time_commitment: 'high',
  time_commitment_minutes: 480,
  tags: ['节点运营', 'Layer 2', '基础设施', '空投', '技术向', '长期投资'],
  status: 'published',
  source_name: '社区经验 + 官方文档',
  source_url: 'https://docs.celestia.org',
  source_credibility: 4,
  published_at: new Date().toISOString()
};

async function main() {
  try {
    console.log('\n🔐 登录中...');
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });

    const accessToken = authResponse.data.data.access_token;
    console.log('✅ 登录成功！\n');

    console.log(`📝 创建策略: ${strategy.title}\n`);
    
    await axios.post(`${DIRECTUS_URL}/items/strategies`, strategy, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ 策略创建成功！\n');
    console.log('================================================');
    console.log('📊 详情:');
    console.log(`  标题: ${strategy.title}`);
    console.log(`  分类: 基础设施 - 节点运营`);
    console.log(`  风险等级: ${strategy.risk_level}/5`);
    console.log(`  技术要求: 高级`);
    console.log(`  年度成本: $240-$600`);
    console.log(`  潜在收益: $1,000-$10,000+`);
    console.log('================================================');
    console.log('');
    console.log('🎉 完成！\n');
    console.log('查看策略:');
    console.log(`  前端: http://localhost:3000/strategies/${strategy.slug}`);
    console.log(`  后台: http://localhost:8055/admin/content/strategies`);
    console.log('');

  } catch (error) {
    console.error('\n❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
