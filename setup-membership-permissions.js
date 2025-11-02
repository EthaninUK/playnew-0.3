const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

let accessToken = '';

async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    accessToken = response.data.data.access_token;
    console.log('✅ 登录成功\n');
    return accessToken;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    throw error;
  }
}

const config = () => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

// 创建会员角色
async function createMembershipRoles() {
  console.log('📋 创建会员角色...\n');

  const roles = [
    {
      name: 'Free User',
      icon: 'person',
      description: '免费用户 - 可访问20%基础内容',
      admin_access: false,
      app_access: true,
    },
    {
      name: 'Pro User',
      icon: 'star',
      description: 'Pro会员 - 可访问60%中级内容',
      admin_access: false,
      app_access: true,
    },
    {
      name: 'Max User',
      icon: 'workspace_premium',
      description: 'Max会员 - 可访问100%全部内容',
      admin_access: false,
      app_access: true,
    },
    {
      name: 'Partner',
      icon: 'handshake',
      description: '玩法合伙人 - 全部访问权限+收益分成',
      admin_access: false,
      app_access: true,
    },
  ];

  const createdRoles = [];

  for (const role of roles) {
    try {
      const response = await axios.post(
        `${DIRECTUS_URL}/roles`,
        role,
        config()
      );
      createdRoles.push(response.data.data);
      console.log(`  ✅ 创建角色: ${role.name} (ID: ${response.data.data.id})`);
    } catch (error) {
      if (error.response?.status === 400) {
        // 角色可能已存在,尝试获取
        try {
          const existing = await axios.get(
            `${DIRECTUS_URL}/roles?filter[name][_eq]=${encodeURIComponent(role.name)}`,
            config()
          );
          if (existing.data.data.length > 0) {
            createdRoles.push(existing.data.data[0]);
            console.log(`  ⏭️  角色已存在: ${role.name} (ID: ${existing.data.data[0].id})`);
          }
        } catch (err) {
          console.error(`  ❌ 创建/获取角色失败 ${role.name}:`, error.response?.data || error.message);
        }
      } else {
        console.error(`  ❌ 创建角色失败 ${role.name}:`, error.response?.data || error.message);
      }
    }
  }

  return createdRoles;
}

// 为策略内容添加访问等级字段
async function addAccessLevelToStrategies() {
  console.log('\n📋 为策略表添加访问等级字段...\n');

  try {
    await axios.post(
      `${DIRECTUS_URL}/fields/strategies`,
      {
        field: 'access_level',
        type: 'integer',
        meta: {
          interface: 'select-dropdown',
          note: '内容访问等级:0-基础,1-中级,2-高级,3-合伙人专属',
          options: {
            choices: [
              { text: '等级0 - 免费内容', value: 0 },
              { text: '等级1 - Pro内容', value: 1 },
              { text: '等级2 - Max内容', value: 2 },
              { text: '等级3 - Partner专属', value: 3 },
            ],
          },
          width: 'half',
        },
        schema: {
          is_nullable: true,
          default_value: 0,
        },
      },
      config()
    );
    console.log('  ✅ 添加 access_level 字段到 strategies 表');
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
      console.log('  ⏭️  access_level 字段已存在');
    } else {
      console.error('  ❌ 添加字段失败:', error.response?.data?.errors?.[0]?.message || error.message);
    }
  }
}

// 为快讯内容添加访问等级字段
async function addAccessLevelToNews() {
  console.log('\n📋 为快讯表添加访问等级字段...\n');

  try {
    await axios.post(
      `${DIRECTUS_URL}/fields/news`,
      {
        field: 'access_level',
        type: 'integer',
        meta: {
          interface: 'select-dropdown',
          note: '内容访问等级:0-基础,1-中级,2-高级,3-合伙人专属',
          options: {
            choices: [
              { text: '等级0 - 免费内容', value: 0 },
              { text: '等级1 - Pro内容', value: 1 },
              { text: '等级2 - Max内容', value: 2 },
              { text: '等级3 - Partner专属', value: 3 },
            ],
          },
          width: 'half',
        },
        schema: {
          is_nullable: true,
          default_value: 0,
        },
      },
      config()
    );
    console.log('  ✅ 添加 access_level 字段到 news 表');
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
      console.log('  ⏭️  access_level 字段已存在');
    } else {
      console.error('  ❌ 添加字段失败:', error.response?.data?.errors?.[0]?.message || error.message);
    }
  }
}

// 为服务商内容添加访问等级字段
async function addAccessLevelToProviders() {
  console.log('\n📋 为服务商表添加访问等级字段...\n');

  try {
    await axios.post(
      `${DIRECTUS_URL}/fields/service_providers`,
      {
        field: 'access_level',
        type: 'integer',
        meta: {
          interface: 'select-dropdown',
          note: '内容访问等级:0-基础,1-中级,2-高级,3-合伙人专属',
          options: {
            choices: [
              { text: '等级0 - 免费内容', value: 0 },
              { text: '等级1 - Pro内容', value: 1 },
              { text: '等级2 - Max内容', value: 2 },
              { text: '等级3 - Partner专属', value: 3 },
            ],
          },
          width: 'half',
        },
        schema: {
          is_nullable: true,
          default_value: 0,
        },
      },
      config()
    );
    console.log('  ✅ 添加 access_level 字段到 service_providers 表');
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
      console.log('  ⏭️  access_level 字段已存在');
    } else {
      console.error('  ❌ 添加字段失败:', error.response?.data?.errors?.[0]?.message || error.message);
    }
  }
}

// 创建权限策略
async function createPermissionPolicies(roles) {
  console.log('\n📋 创建权限策略...\n');

  // 注意: Directus 的权限系统通常通过 API 直接设置
  // 这里我们创建一个配置说明文档

  const permissionGuide = {
    free_user: {
      role_name: 'Free User',
      strategies: {
        action: 'read',
        filter: { access_level: { _lte: 0 } },
        note: '只能访问 access_level <= 0 的策略',
      },
      news: {
        action: 'read',
        filter: { access_level: { _lte: 0 } },
        limit: '每日5条',
      },
      service_providers: {
        action: 'read',
        filter: { access_level: { _lte: 0 } },
      },
    },
    pro_user: {
      role_name: 'Pro User',
      strategies: {
        action: 'read',
        filter: { access_level: { _lte: 1 } },
        note: '可以访问 access_level <= 1 的策略 (60%内容)',
      },
      news: {
        action: 'read',
        filter: { access_level: { _lte: 1 } },
        limit: '无限制',
      },
      service_providers: {
        action: 'read',
        filter: { access_level: { _lte: 1 } },
      },
    },
    max_user: {
      role_name: 'Max User',
      strategies: {
        action: 'read',
        filter: { access_level: { _lte: 2 } },
        note: '可以访问 access_level <= 2 的策略 (100%内容)',
      },
      news: {
        action: 'read',
        filter: { access_level: { _lte: 2 } },
        limit: '无限制',
      },
      service_providers: {
        action: 'read',
        filter: { access_level: { _lte: 2 } },
      },
    },
    partner: {
      role_name: 'Partner',
      strategies: {
        action: 'read,create,update',
        filter: null,
        note: '可以访问全部内容,并可创建/编辑自己的策略',
      },
      news: {
        action: 'read',
        filter: null,
        limit: '无限制',
      },
      service_providers: {
        action: 'read',
        filter: null,
      },
      partner_earnings: {
        action: 'read',
        filter: { partner_user_id: { _eq: '$CURRENT_USER' } },
        note: '可以查看自己的收益记录',
      },
      referral_links: {
        action: 'read,create,update',
        filter: { partner_user_id: { _eq: '$CURRENT_USER' } },
        note: '可以管理自己的推荐链接',
      },
    },
  };

  console.log('  📄 权限策略配置指南:');
  console.log(JSON.stringify(permissionGuide, null, 2));

  console.log('\n  💡 提示: 权限需要在 Directus 管理界面中手动配置');
  console.log('  🔗 访问路径: Settings > Roles & Permissions > 选择角色 > 配置各表的权限');

  return permissionGuide;
}

// 更新现有策略的访问等级 (示例)
async function updateStrategiesAccessLevel() {
  console.log('\n📋 更新策略访问等级...\n');

  try {
    // 获取所有策略
    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?fields=id,title,risk_level`,
      config()
    );

    const strategies = response.data.data || [];
    console.log(`  📊 找到 ${strategies.length} 个策略\n`);

    // 根据风险等级自动分配访问等级
    // 低风险 (1-2) -> access_level 0 (免费)
    // 中风险 (3-4) -> access_level 1 (Pro)
    // 高风险 (5) -> access_level 2 (Max)

    let updated = 0;

    for (const strategy of strategies) {
      let accessLevel = 0;

      if (strategy.risk_level >= 5) {
        accessLevel = 2; // Max
      } else if (strategy.risk_level >= 3) {
        accessLevel = 1; // Pro
      } else {
        accessLevel = 0; // Free
      }

      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/strategies/${strategy.id}`,
          { access_level: accessLevel },
          config()
        );
        updated++;
      } catch (error) {
        console.error(`  ❌ 更新策略 ${strategy.id} 失败`);
      }
    }

    console.log(`  ✅ 更新了 ${updated} 个策略的访问等级`);
    console.log(`     - 低风险(1-2) -> 免费内容`);
    console.log(`     - 中风险(3-4) -> Pro内容`);
    console.log(`     - 高风险(5) -> Max内容`);

  } catch (error) {
    console.error('  ❌ 更新失败:', error.response?.data || error.message);
  }
}

// 更新快讯的访问等级
async function updateNewsAccessLevel() {
  console.log('\n📋 更新快讯访问等级...\n');

  try {
    // 获取所有快讯
    const response = await axios.get(
      `${DIRECTUS_URL}/items/news?fields=id,title,news_type`,
      config()
    );

    const news = response.data.data || [];
    console.log(`  📊 找到 ${news.length} 条快讯\n`);

    // 根据类型分配访问等级
    // 普通快讯 -> access_level 0 (免费)
    // 深度分析 -> access_level 1 (Pro)
    // 独家报告 -> access_level 2 (Max)

    let updated = 0;

    for (const item of news) {
      let accessLevel = 0;

      // 默认所有快讯都是免费的
      // 可以根据具体需求调整
      accessLevel = 0;

      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/news/${item.id}`,
          { access_level: accessLevel },
          config()
        );
        updated++;
      } catch (error) {
        console.error(`  ❌ 更新快讯 ${item.id} 失败`);
      }
    }

    console.log(`  ✅ 更新了 ${updated} 条快讯的访问等级`);

  } catch (error) {
    console.error('  ❌ 更新失败:', error.response?.data || error.message);
  }
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始配置会员权限系统...\n');

    await login();

    // 1. 创建角色
    const roles = await createMembershipRoles();

    // 2. 为内容表添加访问等级字段
    await addAccessLevelToStrategies();
    await addAccessLevelToNews();
    await addAccessLevelToProviders();

    // 3. 创建权限策略配置指南
    const permissionGuide = await createPermissionPolicies(roles);

    // 4. 更新现有内容的访问等级
    await updateStrategiesAccessLevel();
    await updateNewsAccessLevel();

    console.log('\n✅ 权限系统配置完成！');
    console.log('\n📝 下一步操作:');
    console.log('   1. 访问 Directus 管理界面: http://localhost:8055/admin');
    console.log('   2. 进入 Settings > Roles & Permissions');
    console.log('   3. 为每个角色配置具体的表访问权限');
    console.log('   4. 设置过滤规则,根据 access_level 字段限制内容访问');
    console.log('\n💡 权限配置参考已保存在控制台输出中');

  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    process.exit(1);
  }
}

main();
