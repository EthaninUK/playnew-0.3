const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_TOKEN = 'SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ';

// 会员等级配置
const membershipTiers = [
  {
    id: 'free',
    name: 'Free',
    level: 0,
    price_monthly_usd: 0,
    price_yearly_usd: 0,
    content_access_level: 20,
    is_active: true,
    sort_order: 1,
    description: '<p>适合新手探索加密玩法</p>',
    features: {
      strategies: '访问 20% 基础玩法策略',
      news: '每日 5 条快讯',
      favorites: '最多收藏 5 个内容',
      search: '基础搜索功能',
      support: '社区支持'
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    level: 1,
    price_monthly_usd: 0, // 不提供月付
    price_yearly_usd: 699,
    content_access_level: 60,
    is_active: true,
    sort_order: 2,
    description: '<p>适合进阶用户深入学习</p>',
    features: {
      strategies: '访问 60% 中级玩法策略',
      news: '无限快讯访问',
      favorites: '无限收藏',
      search: '高级搜索与筛选',
      export: '数据导出功能',
      ai: 'AI 辅助分析（Beta）',
      support: '优先客服支持'
    }
  },
  {
    id: 'max',
    name: 'Max',
    level: 2,
    price_monthly_usd: 0, // 不提供月付
    price_yearly_usd: 1299,
    content_access_level: 100,
    is_active: true,
    sort_order: 3,
    description: '<p>适合专业投资者全面布局</p>',
    features: {
      strategies: '访问 100% 全部玩法策略',
      news: '无限快讯访问',
      favorites: '无限收藏',
      search: '高级搜索与筛选',
      export: '数据导出功能',
      ai: 'AI 智能助手（完整版）',
      reports: '独家深度研报',
      discord: '专属 Discord 社群',
      consulting: '1对1 策略咨询（每月1次）'
    }
  }
];

async function setupMembershipTiers() {
  console.log('🚀 开始配置会员等级...\n');

  for (const tier of membershipTiers) {
    try {
      console.log(`📝 配置 ${tier.name} (Level ${tier.level})...`);

      // 检查是否已存在
      const checkResponse = await axios.get(
        `${DIRECTUS_URL}/items/memberships?filter[id][_eq]=${tier.id}`,
        {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (checkResponse.data.data && checkResponse.data.data.length > 0) {
        // 更新现有记录
        await axios.patch(
          `${DIRECTUS_URL}/items/memberships/${tier.id}`,
          tier,
          {
            headers: {
              'Authorization': `Bearer ${ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`✅ ${tier.name} 已更新`);
      } else {
        // 创建新记录
        await axios.post(
          `${DIRECTUS_URL}/items/memberships`,
          tier,
          {
            headers: {
              'Authorization': `Bearer ${ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`✅ ${tier.name} 已创建`);
      }
    } catch (error) {
      console.error(`❌ 配置 ${tier.name} 失败:`, error.response?.data || error.message);
    }
  }

  console.log('\n✨ 会员等级配置完成！');
}

setupMembershipTiers();
