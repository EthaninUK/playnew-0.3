const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// 先获取父分类 "C. 套利策略" 的 ID
let PARENT_CATEGORY_ID = null;

// 定义6个新的二级分类
const NEW_CATEGORIES = [
  {
    name: '期权与波动率套利',
    slug: 'options-volatility-arbitrage',
    icon: '💱',
    description: '通过期权和波动率相关策略进行套利，包括 Delta 对冲、隐含波动率套利、Gamma/Vega 策略等',
    type: 'strategy',
    order_index: 20,
    is_active: true
  },
  {
    name: '做市与点差套利',
    slug: 'market-making-spread',
    icon: '🎯',
    description: '通过做市商策略和点差套利获取收益，包括 AMM 做市、订单簿做市、返佣套利等',
    type: 'strategy',
    order_index: 27,
    is_active: true
  },
  {
    name: '预言机与清算套利',
    slug: 'oracle-liquidation',
    icon: '🔮',
    description: '利用预言机价格差异和清算机会套利，包括预言机滞后、清算折价、闪电贷清算等',
    type: 'strategy',
    order_index: 28,
    is_active: true
  },
  {
    name: 'NFT 套利',
    slug: 'nft-arbitrage',
    icon: '🖼️',
    description: '通过 NFT 市场价差和机制套利，包括跨市场套利、碎片化套利、稀有度错价等',
    type: 'strategy',
    order_index: 29,
    is_active: true
  },
  {
    name: '结构性与事件套利',
    slug: 'structural-event-arbitrage',
    icon: '📊',
    description: '利用市场结构性机会和事件驱动套利，包括上线下架、解锁对冲、分叉快照、监管事件等',
    type: 'strategy',
    order_index: 30,
    is_active: true
  },
  {
    name: '成本与流程套利',
    slug: 'cost-process-arbitrage',
    icon: '💰',
    description: '通过优化成本和流程套利，包括资金成本利差、手续费优化、Gas 优化、VIP 等级返佣等',
    type: 'strategy',
    order_index: 31,
    is_active: true
  }
];

async function main() {
  try {
    console.log('认证中...');

    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    const token = authResponse.data.data.access_token;
    console.log('认证成功！\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // 查找父分类 "C. 套利策略" 的 ID
    console.log('查找父分类 "C. 套利策略"...');
    const parentResponse = await axios.get(
      `${DIRECTUS_URL}/items/playnew_categories?filter[slug][_eq]=arbitrage-strategies`,
      config
    );

    if (parentResponse.data.data && parentResponse.data.data.length > 0) {
      PARENT_CATEGORY_ID = parentResponse.data.data[0].id;
      console.log(`找到父分类 ID: ${PARENT_CATEGORY_ID}\n`);
    } else {
      console.log('未找到父分类，将创建无父级的分类\n');
    }

    console.log('开始创建分类...\n');

    let createdCount = 0;
    let skippedCount = 0;

    for (const category of NEW_CATEGORIES) {
      try {
        // 先检查是否已存在
        const existingResponse = await axios.get(
          `${DIRECTUS_URL}/items/playnew_categories?filter[slug][_eq]=${category.slug}`,
          config
        );

        if (existingResponse.data.data && existingResponse.data.data.length > 0) {
          console.log(`⏭️  分类 "${category.name}" (${category.slug}) 已存在，跳过`);
          skippedCount++;
          continue;
        }

        // 添加父分类 ID
        const categoryData = {
          ...category,
          parent_id: PARENT_CATEGORY_ID
        };

        // 创建新分类
        const response = await axios.post(
          `${DIRECTUS_URL}/items/playnew_categories`,
          categoryData,
          config
        );

        console.log(`✅ 创建成功: ${category.icon} ${category.name}`);
        console.log(`   Slug: ${category.slug}`);
        console.log(`   Order: ${category.order_index}\n`);
        createdCount++;

      } catch (error) {
        console.error(`❌ 创建失败: ${category.name}`);
        if (error.response && error.response.data) {
          console.error(`   错误:`, JSON.stringify(error.response.data, null, 2));
        } else {
          console.error(`   错误: ${error.message}`);
        }
        console.log('');
      }
    }

    console.log('========================================');
    console.log('🎉 分类创建完成！');
    console.log(`✅ 成功创建: ${createdCount} 个`);
    console.log(`⏭️  已存在跳过: ${skippedCount} 个`);
    console.log(`📊 总计: ${NEW_CATEGORIES.length} 个分类`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
