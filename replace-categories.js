const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAdminToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

// 新的分类结构
const newCategories = [
  // A. 空投 / 积分 / 上线前机会
  { name: '空投任务', slug: 'airdrop-tasks', code: 'A1', parent: null, level: 1, icon: '🎁', description: 'Galxe/Zealy/链上交互' },
  { name: '积分赛季', slug: 'points-season', code: 'A2', parent: null, level: 1, icon: '⭐', description: 'Points/Megadrop/激励任务' },
  { name: '测试网&早鸟', slug: 'testnet', code: 'A3', parent: null, level: 1, icon: '🔬', description: 'Testnet/Devnet/Faucet' },
  { name: '启动板&配售', slug: 'launchpad', code: 'A4', parent: null, level: 1, icon: '🚀', description: 'Launchpool/Launchpad/IEO' },
  { name: '白名单/预售', slug: 'whitelist', code: 'A5', parent: null, level: 1, icon: '📝', description: 'Allowlist/Whitelist' },
  
  // B. 稳健收益 / 存借 / 质押
  { name: '稳定币理财', slug: 'stablecoin-yield', code: 'B1', parent: null, level: 1, icon: '💰', description: 'CeFi/DeFi' },
  { name: '借贷挖息', slug: 'lending', code: 'B2', parent: null, level: 1, icon: '🏦', description: 'Lending 循环' },
  { name: 'LST 质押', slug: 'lst-staking', code: 'B3', parent: null, level: 1, icon: '🔐', description: 'stETH、wbETH 等' },
  { name: '再质押/LRT', slug: 'restaking', code: 'B4', parent: null, level: 1, icon: '♻️', description: 'EigenLayer 等' },
  { name: 'RWA/链上国债', slug: 'rwa', code: 'B5', parent: null, level: 1, icon: '🏛️', description: 'RWA/链上国债与票据' },
  
  // C. 做市 / 流动性
  { name: 'AMM 做市', slug: 'amm', code: 'C1', parent: null, level: 1, icon: '🔄', description: 'V2/V3 集中流动性/Range Order' },
  { name: '订单簿做市', slug: 'orderbook', code: 'C2', parent: null, level: 1, icon: '📊', description: 'CeFi/链上 Orderbook' },
  { name: '聚合器/金库', slug: 'vault', code: 'C3', parent: null, level: 1, icon: '🏰', description: 'Vault/Auto-compound' },
  { name: '流动性引导', slug: 'liquidity-mining', code: 'C4', parent: null, level: 1, icon: '⛏️', description: 'Incentive/Liquidity Mining' },
  
  // D. 套利 / 对冲 / 中性策略
  { name: '资金费套利', slug: 'funding-arbitrage', code: 'D1', parent: null, level: 1, icon: '💹', description: 'Perp Funding' },
  { name: '期现基差', slug: 'basis-trading', code: 'D2', parent: null, level: 1, icon: '📈', description: 'Cash & Carry' },
  { name: '跨所搬砖', slug: 'cex-arbitrage', code: 'D3', parent: null, level: 1, icon: '🔀', description: '价差/手续费返佣' },
  { name: '稳定币脱锚', slug: 'depeg-arbitrage', code: 'D4', parent: null, level: 1, icon: '⚖️', description: '折价回归' },
  { name: '三角/跨链套利', slug: 'triangle-arbitrage', code: 'D5', parent: null, level: 1, icon: '🔺', description: '同链价差&跨链价差' },
  
  // E. 衍生品策略
  { name: '期权卖方', slug: 'options-selling', code: 'E1', parent: null, level: 1, icon: '📉', description: 'Covered Call/Put' },
  { name: '波动率交易', slug: 'volatility', code: 'E2', parent: null, level: 1, icon: '🌊', description: '日历/蝶式/Gamma' },
  { name: '网格/趋势', slug: 'grid-trading', code: 'E3', parent: null, level: 1, icon: '📐', description: '量化规则' },
  { name: '事件驱动', slug: 'event-driven', code: 'E4', parent: null, level: 1, icon: '⚡', description: '上线/解锁/宏观数据' },
  
  // F. 新链 / 新生态雷达
  { name: '新公链&L2', slug: 'new-chains', code: 'F1', parent: null, level: 1, icon: '⛓️', description: '任务/桥接' },
  { name: '新池/新协议', slug: 'new-protocols', code: 'F2', parent: null, level: 1, icon: '🆕', description: '早期 LP/挖矿' },
  { name: '生态任务', slug: 'ecosystem-tasks', code: 'F3', parent: null, level: 1, icon: '🎯', description: '官方任务中心' },
  { name: '链上活跃度', slug: 'onchain-activity', code: 'F4', parent: null, level: 1, icon: '📡', description: 'TVL 追踪' },
  
  // G. NFT / 铭文 / GameFi / SocialFi
  { name: 'NFT 铸造', slug: 'nft-minting', code: 'G1', parent: null, level: 1, icon: '🎨', description: '白名单/盲盒' },
  { name: 'NFT 金融', slug: 'nft-fi', code: 'G2', parent: null, level: 1, icon: '💎', description: '借贷/碎片化/指数' },
  { name: '铭文/Ordinals', slug: 'inscriptions', code: 'G3', parent: null, level: 1, icon: '📜', description: 'Ordinals/Runes' },
  { name: 'GameFi&SocialFi', slug: 'gamefi', code: 'G4', parent: null, level: 1, icon: '🎮', description: '任务/赛季' },
  
  // H. 工具与自动化
  { name: '交易机器人', slug: 'trading-bots', code: 'H1', parent: null, level: 1, icon: '🤖', description: '网格/跟单/CEX&DEX' },
  { name: '数据跟踪', slug: 'data-tracking', code: 'H2', parent: null, level: 1, icon: '📊', description: '资金流、鲸鱼地址' },
  { name: '风险与合规', slug: 'risk-compliance', code: 'H3', parent: null, level: 1, icon: '🛡️', description: '监控、税务报表' },
  { name: '跨链&资产管理', slug: 'cross-chain', code: 'H4', parent: null, level: 1, icon: '🌉', description: '桥、聚合钱包' },
  
  // I. 节点 / 验证者
  { name: '节点运行', slug: 'node-running', code: 'I1', parent: null, level: 1, icon: '🖥️', description: 'PoS/轻节点' },
  { name: 'RPC/预言机', slug: 'rpc-oracle', code: 'I2', parent: null, level: 1, icon: '🔮', description: '中继生态激励' },
  { name: 'MEV/Intent', slug: 'mev', code: 'I3', parent: null, level: 1, icon: '⚙️', description: '捆绑拍卖参与' },
];

async function replaceCategories() {
  try {
    const token = await getAdminToken();
    const headers = { Authorization: `Bearer ${token}` };

    console.log('🔄 开始替换分类系统...\n');

    // 1. 删除所有旧分类
    console.log('🗑️  删除旧分类...');
    const oldCategories = await axios.get(`${DIRECTUS_URL}/items/categories`, { headers });
    
    for (const cat of oldCategories.data.data) {
      await axios.delete(`${DIRECTUS_URL}/items/categories/${cat.id}`, { headers });
    }
    console.log(`✅ 删除了 ${oldCategories.data.data.length} 个旧分类\n`);

    // 2. 创建新分类
    console.log('➕ 创建新分类...');
    let created = 0;
    
    for (const category of newCategories) {
      await axios.post(
        `${DIRECTUS_URL}/items/categories`,
        {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          order_index: created + 1,
          status: 'published'
        },
        { headers }
      );
      created++;
      
      if (created % 10 === 0) {
        console.log(`  已创建 ${created}/${newCategories.length} 个分类`);
      }
    }
    
    console.log(`✅ 创建了 ${created} 个新分类\n`);

    // 3. 验证结果
    console.log('🔍 验证新分类...');
    const verify = await axios.get(
      `${DIRECTUS_URL}/items/categories?sort=order_index&limit=10&fields=name,slug,icon,description`,
      { headers }
    );
    
    console.log('\n前 10 个分类：');
    verify.data.data.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.icon} ${cat.name} (${cat.slug}) - ${cat.description}`);
    });

    console.log('\n✅ 分类系统替换完成！');
    console.log('\n⚠️  注意：现有策略的分类关联已清空，需要重新分配。');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

replaceCategories();
