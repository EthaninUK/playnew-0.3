const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function restoreCategories() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Create a new table for PlayNew categories (to avoid conflict with Chatwoot)
    console.log('📋 Creating playnew_categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS playnew_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        parent_id UUID REFERENCES playnew_categories(id) ON DELETE CASCADE,
        description TEXT,
        icon TEXT,
        order_index INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table created\n');

    // Step 2: Insert parent categories
    console.log('➕ Inserting parent categories...');
    const parents = [
      { id: '10000000-0000-0000-0000-000000000001', name: 'A. 空投与早期参与', slug: 'airdrops-early', type: 'parent', order: 1 },
      { id: '20000000-0000-0000-0000-000000000002', name: 'B. 链上收益策略', slug: 'onchain-yield', type: 'parent', order: 2 },
      { id: '30000000-0000-0000-0000-000000000003', name: 'C. 套利策略', slug: 'arbitrage', type: 'parent', order: 3 },
      { id: '40000000-0000-0000-0000-000000000004', name: 'D. 衍生品策略', slug: 'derivatives', type: 'parent', order: 4 },
      { id: '50000000-0000-0000-0000-000000000005', name: 'E. 生态任务与新链机会', slug: 'ecosystem-new', type: 'parent', order: 5 },
      { id: '60000000-0000-0000-0000-000000000006', name: 'F. NFT 与链上资产', slug: 'nft-assets', type: 'parent', order: 6 },
      { id: '70000000-0000-0000-0000-000000000007', name: 'G. 工具与基础设施', slug: 'tools-infra', type: 'parent', order: 7 },
      { id: '80000000-0000-0000-0000-000000000008', name: 'H. 节点与基础设施收益', slug: 'node-infra', type: 'parent', order: 8 },
      { id: '90000000-0000-0000-0000-000000000009', name: 'I. MEV 与前沿策略', slug: 'mev-advanced', type: 'parent', order: 9 }
    ];

    for (const parent of parents) {
      await client.query(
        `INSERT INTO playnew_categories (id, name, slug, type, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           order_index = EXCLUDED.order_index`,
        [parent.id, parent.name, parent.slug, parent.type, parent.order, true]
      );
      console.log(`  ✅ ${parent.name}`);
    }

    // Step 3: Insert child categories
    console.log('\n➕ Inserting child categories...');
    const children = [
      // A. 空投与早期参与
      { parent_id: parents[0].id, name: '空投任务', slug: 'airdrop-tasks', type: 'strategy', description: 'Galxe/Zealy/链上交互', icon: '🎁', order: 1 },
      { parent_id: parents[0].id, name: '积分赛季', slug: 'points-season', type: 'strategy', description: 'Points/Megadrop/激励任务', icon: '⭐', order: 2 },
      { parent_id: parents[0].id, name: '测试网&早鸟', slug: 'testnet', type: 'strategy', description: 'Testnet/Devnet/Faucet', icon: '🔬', order: 3 },
      { parent_id: parents[0].id, name: '启动板&配售', slug: 'launchpad', type: 'strategy', description: 'Launchpool/Launchpad/IEO', icon: '🚀', order: 4 },
      { parent_id: parents[0].id, name: '白名单/预售', slug: 'whitelist', type: 'strategy', description: 'Allowlist/Whitelist', icon: '📝', order: 5 },

      // B. 链上收益策略
      { parent_id: parents[1].id, name: '稳定币理财', slug: 'stablecoin-yield', type: 'strategy', description: 'CeFi/DeFi', icon: '💰', order: 6 },
      { parent_id: parents[1].id, name: '借贷挖息', slug: 'lending', type: 'strategy', description: 'Lending 循环', icon: '🏦', order: 7 },
      { parent_id: parents[1].id, name: 'LST 质押', slug: 'lst-staking', type: 'strategy', description: 'stETH、wbETH 等', icon: '🔐', order: 8 },
      { parent_id: parents[1].id, name: '再质押/LRT', slug: 'restaking', type: 'strategy', description: 'EigenLayer 等', icon: '♻️', order: 9 },
      { parent_id: parents[1].id, name: 'RWA/链上国债', slug: 'rwa', type: 'strategy', description: 'RWA/链上国债与票据', icon: '🏛️', order: 10 },
      { parent_id: parents[1].id, name: 'AMM 做市', slug: 'amm', type: 'strategy', description: 'V2/V3 集中流动性/Range Order', icon: '🔄', order: 11 },
      { parent_id: parents[1].id, name: '订单簿做市', slug: 'orderbook', type: 'strategy', description: 'CeFi/链上 Orderbook', icon: '📊', order: 12 },
      { parent_id: parents[1].id, name: '聚合器/金库', slug: 'vault', type: 'strategy', description: 'Vault/Auto-compound', icon: '🏰', order: 13 },
      { parent_id: parents[1].id, name: '流动性引导', slug: 'liquidity-mining', type: 'strategy', description: 'Incentive/Liquidity Mining', icon: '⛏️', order: 14 },

      // C. 套利策略
      { parent_id: parents[2].id, name: '资金费套利', slug: 'funding-arbitrage', type: 'strategy', description: 'Perp Funding', icon: '💹', order: 15 },
      { parent_id: parents[2].id, name: '期现基差', slug: 'basis-trading', type: 'strategy', description: 'Cash & Carry', icon: '📈', order: 16 },
      { parent_id: parents[2].id, name: '跨所搬砖', slug: 'cex-arbitrage', type: 'strategy', description: '价差/手续费返佣', icon: '🔀', order: 17 },
      { parent_id: parents[2].id, name: '稳定币脱锚', slug: 'depeg-arbitrage', type: 'strategy', description: '折价回归', icon: '⚖️', order: 18 },
      { parent_id: parents[2].id, name: '三角/跨链套利', slug: 'triangle-arbitrage', type: 'strategy', description: '同链价差&跨链价差', icon: '🔺', order: 19 },

      // D. 衍生品策略
      { parent_id: parents[3].id, name: '期权卖方', slug: 'options-selling', type: 'strategy', description: 'Covered Call/Put', icon: '📉', order: 20 },
      { parent_id: parents[3].id, name: '波动率交易', slug: 'volatility', type: 'strategy', description: '日历/蝶式/Gamma', icon: '🌊', order: 21 },
      { parent_id: parents[3].id, name: '网格/趋势', slug: 'grid-trading', type: 'strategy', description: '量化规则', icon: '📐', order: 22 },
      { parent_id: parents[3].id, name: '事件驱动', slug: 'event-driven', type: 'strategy', description: '上线/解锁/宏观数据', icon: '⚡', order: 23 },

      // E. 生态任务与新链机会
      { parent_id: parents[4].id, name: '新公链&L2', slug: 'new-chains', type: 'strategy', description: '任务/桥接', icon: '⛓️', order: 24 },
      { parent_id: parents[4].id, name: '新池/新协议', slug: 'new-protocols', type: 'strategy', description: '早期 LP/挖矿', icon: '🆕', order: 25 },
      { parent_id: parents[4].id, name: '生态任务', slug: 'ecosystem-tasks', type: 'strategy', description: '官方任务中心', icon: '🎯', order: 26 },
      { parent_id: parents[4].id, name: '链上活跃度', slug: 'onchain-activity', type: 'strategy', description: 'TVL 追踪', icon: '📡', order: 27 },

      // F. NFT 与链上资产
      { parent_id: parents[5].id, name: 'NFT 铸造', slug: 'nft-minting', type: 'strategy', description: '白名单/盲盒', icon: '🎨', order: 28 },
      { parent_id: parents[5].id, name: 'NFT 金融', slug: 'nft-fi', type: 'strategy', description: '借贷/碎片化/指数', icon: '💎', order: 29 },
      { parent_id: parents[5].id, name: '铭文/Ordinals', slug: 'inscriptions', type: 'strategy', description: 'Ordinals/Runes', icon: '📜', order: 30 },
      { parent_id: parents[5].id, name: 'GameFi&SocialFi', slug: 'gamefi', type: 'strategy', description: '任务/赛季', icon: '🎮', order: 31 },

      // G. 工具与基础设施
      { parent_id: parents[6].id, name: '交易机器人', slug: 'trading-bots', type: 'tool', description: '网格/跟单/CEX&DEX', icon: '🤖', order: 32 },
      { parent_id: parents[6].id, name: '数据跟踪', slug: 'data-tracking', type: 'tool', description: '资金流、鲸鱼地址', icon: '📊', order: 33 },
      { parent_id: parents[6].id, name: '风险与合规', slug: 'risk-compliance', type: 'tool', description: '监控、税务报表', icon: '🛡️', order: 34 },
      { parent_id: parents[6].id, name: '跨链&资产管理', slug: 'cross-chain', type: 'tool', description: '桥、聚合钱包', icon: '🌉', order: 35 },

      // H. 节点与基础设施收益
      { parent_id: parents[7].id, name: '节点运行', slug: 'node-running', type: 'strategy', description: 'PoS/轻节点', icon: '🖥️', order: 36 },
      { parent_id: parents[7].id, name: 'RPC/预言机', slug: 'rpc-oracle', type: 'strategy', description: '中继生态激励', icon: '🔮', order: 37 },

      // I. MEV 与前沿策略
      { parent_id: parents[8].id, name: 'MEV/Intent', slug: 'mev', type: 'strategy', description: '捆绑拍卖参与', icon: '⚙️', order: 38 }
    ];

    for (const child of children) {
      await client.query(
        `INSERT INTO playnew_categories (name, slug, type, parent_id, description, icon, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           parent_id = EXCLUDED.parent_id,
           description = EXCLUDED.description,
           icon = EXCLUDED.icon,
           order_index = EXCLUDED.order_index`,
        [child.name, child.slug, child.type, child.parent_id, child.description, child.icon, child.order, true]
      );
      console.log(`  ✅ ${child.icon} ${child.name}`);
    }

    // Step 4: Register collection in Directus
    console.log('\n📝 Registering collection in Directus...');
    await client.query(`
      INSERT INTO directus_collections (collection, icon, note, display_template, hidden, singleton, translations, archive_field, archive_app_filter, archive_value, unarchive_value, sort_field, accountability, color, item_duplication_fields, sort, "group", collapse, preview_url, versioning)
      VALUES ('playnew_categories', 'category', 'PlayNew 分类系统', '{{name}}', false, false, NULL, NULL, true, NULL, NULL, 'order_index', 'all', NULL, NULL, NULL, NULL, 'open', NULL, false)
      ON CONFLICT (collection) DO UPDATE SET
        icon = EXCLUDED.icon,
        note = EXCLUDED.note,
        display_template = EXCLUDED.display_template;
    `);
    console.log('✅ Collection registered\n');

    // Step 5: Verify
    const parentCount = await client.query("SELECT COUNT(*) as count FROM playnew_categories WHERE type = 'parent'");
    const childCount = await client.query("SELECT COUNT(*) as count FROM playnew_categories WHERE parent_id IS NOT NULL");

    console.log('📊 Verification:');
    console.log(`  - Parent categories: ${parentCount.rows[0].count}`);
    console.log(`  - Child categories: ${childCount.rows[0].count}`);
    console.log(`  - Total: ${parseInt(parentCount.rows[0].count) + parseInt(childCount.rows[0].count)}`);

    console.log('\n✅ Categories restored successfully!');
    console.log('\n📌 Note: The collection is named "playnew_categories" to avoid conflict with Chatwoot\'s "categories" table.');
    console.log('📌 You can now access it in Directus admin panel.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

restoreCategories();
