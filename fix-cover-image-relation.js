const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function fixCoverImageRelation() {
  try {
    const token = await getAuthToken();

    console.log('\n🔧 修复 cover_image 字段的关系配置...\n');

    // 1. 检查关系是否已存在
    console.log('1️⃣ 检查现有关系...');
    const checkRes = await axios.get(
      `${DIRECTUS_URL}/relations/strategies/cover_image`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    if (checkRes.status === 200) {
      console.log('   ℹ️  关系已存在，正在更新...');

      // 更新现有关系
      try {
        await axios.patch(
          `${DIRECTUS_URL}/relations/strategies/cover_image`,
          {
            collection: 'strategies',
            field: 'cover_image',
            related_collection: 'directus_files',
            meta: {
              many_collection: 'strategies',
              many_field: 'cover_image',
              one_collection: 'directus_files',
              one_allowed_collections: null,
              one_deselect_action: 'nullify',
              junction_field: null,
              sort_field: null
            },
            schema: {
              on_delete: 'SET NULL'
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('   ✅ 关系已更新');
      } catch (updateError) {
        console.log('   ⚠️  更新关系失败，尝试重新创建...');
      }
    } else {
      console.log('   ℹ️  关系不存在，正在创建...');
    }

    // 2. 创建或重新创建关系
    console.log('\n2️⃣ 创建关系配置...');

    try {
      const createRes = await axios.post(
        `${DIRECTUS_URL}/relations`,
        {
          collection: 'strategies',
          field: 'cover_image',
          related_collection: 'directus_files',
          meta: {
            many_collection: 'strategies',
            many_field: 'cover_image',
            one_collection: 'directus_files',
            one_allowed_collections: null,
            one_deselect_action: 'nullify',
            junction_field: null,
            sort_field: null
          },
          schema: {
            on_delete: 'SET NULL'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('   ✅ 关系创建成功！');
    } catch (createError) {
      if (createError.response?.status === 400) {
        console.log('   ℹ️  关系可能已存在');
      } else {
        throw createError;
      }
    }

    // 3. 验证关系
    console.log('\n3️⃣ 验证关系配置...');
    const verifyRes = await axios.get(
      `${DIRECTUS_URL}/relations/strategies/cover_image`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (verifyRes.status === 200) {
      console.log('   ✅ 关系验证成功');
      const relation = verifyRes.data.data;
      console.log(`   Many Collection: ${relation.collection}`);
      console.log(`   Many Field: ${relation.field}`);
      console.log(`   One Collection: ${relation.related_collection}`);
    }

    console.log('\n🎉 修复完成！\n');

    console.log('📋 下一步操作:');
    console.log('1. 刷新 Directus 后台页面 (Cmd/Ctrl + Shift + R)');
    console.log('2. 重新进入策略编辑页面');
    console.log('3. 尝试选择 Cover Image');
    console.log('4. 选择文件后保存');
    console.log('5. 查看是否成功保存\n');

    console.log('💡 如果仍然不work:');
    console.log('   运行: docker-compose restart directus');
    console.log('   然后等待 30 秒后重试\n');

  } catch (error) {
    console.error('\n❌ 修复失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }

    console.log('\n🔧 手动修复方法:');
    console.log('1. 进入 Directus 后台');
    console.log('2. 设置 → Data Model → strategies');
    console.log('3. 找到 cover_image 字段并点击');
    console.log('4. 在 "Relationship" 部分:');
    console.log('   - Related Collection: directus_files');
    console.log('   - Many to One');
    console.log('5. 保存\n');
  }
}

fixCoverImageRelation();
