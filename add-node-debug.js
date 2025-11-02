#!/usr/bin/env node

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const fs = require('fs');
const contentFile = '/Users/m1/PlayNew_0.3/node-strategy-content.md';
const content = fs.readFileSync(contentFile, 'utf8');

const strategy = {
  title: 'Layer 2 轻节点运行完全指南',
  slug: 'layer2-light-node-running-guide',
  summary: '通过运行 Layer 2 网络轻节点，支持网络去中心化并获得潜在节点奖励。适合有技术基础和稳定服务器的用户。',
  content: content,
  category_l1: 'infrastructure',
  category_l2: 'node-running',
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
  chains: ['Ethereum', 'Celestia', 'Eigenlayer', 'Avail'],
  protocols: ['Celestia', 'Eigenlayer', 'Scroll', 'Avail'],
  status: 'published',
  source_name: '社区经验 + 官方文档',
  source_url: 'https://docs.celestia.org',
  source_credibility: 4,
  published_at: new Date().toISOString()
};

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DIRECTUS_EMAIL, password: DIRECTUS_PASSWORD }),
  });
  const data = await response.json();
  return data.data.access_token;
}

async function createStrategy(token, strategy) {
  const strategyWithId = { id: generateUUID(), ...strategy };
  const response = await fetch(`${DIRECTUS_URL}/items/strategies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(strategyWithId),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    return false;
  }
  return true;
}

async function main() {
  console.log('\n🔐 登录中...');
  const token = await login();
  console.log('✅ 登录成功！\n');
  console.log(`📝 创建策略: ${strategy.title}\n`);
  const success = await createStrategy(token, strategy);
  if (success) {
    console.log('✅ 策略创建成功！\n');
    console.log(`前端: http://localhost:3000/strategies/${strategy.slug}\n`);
  } else {
    console.log('❌ 创建失败 - 请查看上面的错误信息');
  }
}

main().catch(console.error);
