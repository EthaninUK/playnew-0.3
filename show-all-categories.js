const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function showAllCategories() {
  try {
    // 首先登录获取 token
    const loginResponse = await axios.post(
      `${DIRECTUS_URL}/auth/login`,
      {
        email: DIRECTUS_EMAIL,
        password: DIRECTUS_PASSWORD
      }
    );

    const token = loginResponse.data.data.access_token;

    // 使用 token 获取分类
    const response = await axios.get(
      `${DIRECTUS_URL}/items/categories?fields=id,name,slug,icon,order_index&sort=name&limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const categories = response.data.data;

    console.log('\n📂 所有分类列表（按名称排序）\n');
    console.log('='.repeat(80));

    // 按一级分类分组
    const grouped = {};
    const parentCategories = ['空投与早期参与', '链上收益策略', '套利策略', '衍生品策略',
                             '生态任务与新链机会', 'NFT 与链上资产', '工具与基础设施',
                             '节点与基础设施收益', 'MEV 与前沿策略'];

    categories.forEach(cat => {
      // 简单分组逻辑
      let group = '其他';

      if (cat.name.includes('空投') || cat.name.includes('测试网') ||
          cat.name.includes('白名单') || cat.name.includes('启动板') ||
          cat.name.includes('积分')) {
        group = '🎁 空投与早期参与';
      } else if (cat.name.includes('借贷') || cat.name.includes('质押') ||
                cat.name.includes('稳定币') || cat.name.includes('流动性') ||
                cat.name.includes('理财')) {
        group = '💰 链上收益策略';
      } else if (cat.name.includes('套利') || cat.name.includes('搬砖') ||
                cat.name.includes('脱锚')) {
        group = '🔄 套利策略';
      } else if (cat.name.includes('期权') || cat.name.includes('期现') ||
                cat.name.includes('网格') || cat.name.includes('资金费')) {
        group = '📈 衍生品策略';
      } else if (cat.name.includes('NFT')) {
        group = '🖼️  NFT 与链上资产';
      } else if (cat.name.includes('节点')) {
        group = '🖥️  节点与基础设施';
      } else if (cat.name.includes('MEV') || cat.name.includes('Intent')) {
        group = '⚡ MEV 与前沿策略';
      } else if (cat.name.includes('生态') || cat.name.includes('公链') ||
                cat.name.includes('L2')) {
        group = '🌐 生态与新链';
      } else if (cat.name.includes('工具') || cat.name.includes('数据') ||
                cat.name.includes('RPC')) {
        group = '🔧 工具与基础设施';
      }

      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(cat);
    });

    // 打印分组
    Object.keys(grouped).sort().forEach(group => {
      console.log(`\n${group}`);
      console.log('-'.repeat(80));

      grouped[group].forEach(cat => {
        console.log(`\n名称: ${cat.name}`);
        console.log(`Slug: ${cat.slug}`);
        console.log(`ID: ${cat.id}`);
      });
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\n共 ${categories.length} 个分类\n`);

    // 重点：需要创建指南的分类
    console.log('\n📝 建议创建指南的分类（按优先级）：\n');

    const needGuide = [
      { name: '借贷挖息', slug: 'lending', priority: 'HIGH' },
      { name: '流动性引导', slug: 'liquidity-mining', priority: 'HIGH' },
      { name: '稳定币理财', slug: 'stablecoin-yield', priority: 'HIGH' },
      { name: '再质押/LRT', slug: 'restaking', priority: 'HIGH' },
      { name: '跨所搬砖', slug: 'cex-arbitrage', priority: 'MEDIUM' },
      { name: '资金费套利', slug: 'funding-arbitrage', priority: 'MEDIUM' },
      { name: '稳定币脱锚', slug: 'depeg-arbitrage', priority: 'MEDIUM' },
      { name: 'NFT 铸造', slug: 'nft-minting', priority: 'MEDIUM' },
      { name: '网格/趋势', slug: 'grid-trading', priority: 'LOW' },
      { name: '新公链&L2', slug: 'new-chains', priority: 'MEDIUM' },
    ];

    needGuide.forEach(item => {
      const cat = categories.find(c => c.slug === item.slug);
      if (cat) {
        const priority = item.priority === 'HIGH' ? '🔴' :
                        item.priority === 'MEDIUM' ? '🟡' : '🟢';
        console.log(`${priority} ${cat.name} (${cat.slug})`);
        console.log(`   ID: ${cat.id}`);
      }
    });

    console.log('\n使用方法：');
    console.log('1. 复制上面的分类 ID');
    console.log('2. 在 add-guide-template.js 中填入 category 字段');
    console.log('3. 运行脚本创建指南\n');

  } catch (error) {
    console.error('\n❌ 查询失败:', error.message);
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

showAllCategories();
