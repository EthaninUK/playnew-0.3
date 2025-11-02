const { Client } = require('pg');

// Using Supabase connection from docker-compose.yml
const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function executeSql() {
  try {
    await client.connect();
    console.log('✅ 已连接到数据库\n');

    console.log('🗑️  删除旧分类...');
    await client.query('DELETE FROM categories');
    console.log('✅ 旧分类已删除\n');

    console.log('➕ 插入新分类...');
    await client.query(`
      INSERT INTO categories (name, slug, description, icon, order_index, status) VALUES
      ('空投任务', 'airdrop-tasks', 'Galxe/Zealy/链上交互', '🎁', 1, 'published'),
      ('积分赛季', 'points-season', 'Points/Megadrop/激励任务', '⭐', 2, 'published'),
      ('测试网&早鸟', 'testnet', 'Testnet/Devnet/Faucet', '🔬', 3, 'published'),
      ('启动板&配售', 'launchpad', 'Launchpool/Launchpad/IEO', '🚀', 4, 'published'),
      ('白名单/预售', 'whitelist', 'Allowlist/Whitelist', '📝', 5, 'published'),
      ('稳定币理财', 'stablecoin-yield', 'CeFi/DeFi', '💰', 6, 'published'),
      ('借贷挖息', 'lending', 'Lending 循环', '🏦', 7, 'published'),
      ('LST 质押', 'lst-staking', 'stETH、wbETH 等', '🔐', 8, 'published'),
      ('再质押/LRT', 'restaking', 'EigenLayer 等', '♻️', 9, 'published'),
      ('RWA/链上国债', 'rwa', 'RWA/链上国债与票据', '🏛️', 10, 'published'),
      ('AMM 做市', 'amm', 'V2/V3 集中流动性/Range Order', '🔄', 11, 'published'),
      ('订单簿做市', 'orderbook', 'CeFi/链上 Orderbook', '📊', 12, 'published'),
      ('聚合器/金库', 'vault', 'Vault/Auto-compound', '🏰', 13, 'published'),
      ('流动性引导', 'liquidity-mining', 'Incentive/Liquidity Mining', '⛏️', 14, 'published'),
      ('资金费套利', 'funding-arbitrage', 'Perp Funding', '💹', 15, 'published'),
      ('期现基差', 'basis-trading', 'Cash & Carry', '📈', 16, 'published'),
      ('跨所搬砖', 'cex-arbitrage', '价差/手续费返佣', '🔀', 17, 'published'),
      ('稳定币脱锚', 'depeg-arbitrage', '折价回归', '⚖️', 18, 'published'),
      ('三角/跨链套利', 'triangle-arbitrage', '同链价差&跨链价差', '🔺', 19, 'published'),
      ('期权卖方', 'options-selling', 'Covered Call/Put', '📉', 20, 'published'),
      ('波动率交易', 'volatility', '日历/蝶式/Gamma', '🌊', 21, 'published'),
      ('网格/趋势', 'grid-trading', '量化规则', '📐', 22, 'published'),
      ('事件驱动', 'event-driven', '上线/解锁/宏观数据', '⚡', 23, 'published'),
      ('新公链&L2', 'new-chains', '任务/桥接', '⛓️', 24, 'published'),
      ('新池/新协议', 'new-protocols', '早期 LP/挖矿', '🆕', 25, 'published'),
      ('生态任务', 'ecosystem-tasks', '官方任务中心', '🎯', 26, 'published'),
      ('链上活跃度', 'onchain-activity', 'TVL 追踪', '📡', 27, 'published'),
      ('NFT 铸造', 'nft-minting', '白名单/盲盒', '🎨', 28, 'published'),
      ('NFT 金融', 'nft-fi', '借贷/碎片化/指数', '💎', 29, 'published'),
      ('铭文/Ordinals', 'inscriptions', 'Ordinals/Runes', '📜', 30, 'published'),
      ('GameFi&SocialFi', 'gamefi', '任务/赛季', '🎮', 31, 'published'),
      ('交易机器人', 'trading-bots', '网格/跟单/CEX&DEX', '🤖', 32, 'published'),
      ('数据跟踪', 'data-tracking', '资金流、鲸鱼地址', '📊', 33, 'published'),
      ('风险与合规', 'risk-compliance', '监控、税务报表', '🛡️', 34, 'published'),
      ('跨链&资产管理', 'cross-chain', '桥、聚合钱包', '🌉', 35, 'published'),
      ('节点运行', 'node-running', 'PoS/轻节点', '🖥️', 36, 'published'),
      ('RPC/预言机', 'rpc-oracle', '中继生态激励', '🔮', 37, 'published'),
      ('MEV/Intent', 'mev', '捆绑拍卖参与', '⚙️', 38, 'published')
    `);
    
    console.log('✅ 新分类已插入\n');

    const result = await client.query('SELECT COUNT(*) as count FROM categories');
    console.log(`✅ 验证：共有 $\{result.rows[0].count\} 个分类\n`);

    const sample = await client.query('SELECT name, slug, icon, description FROM categories ORDER BY order_index LIMIT 5');
    console.log('前 5 个分类示例：');
    sample.rows.forEach((row, idx) => {
      console.log(`  $\{idx + 1\}. $\{row.icon\} $\{row.name\} ($\{row.slug\}) - $\{row.description\}`);
    });

    console.log('\n🎉 分类系统替换完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

executeSql();
