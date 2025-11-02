const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function diagnoseIssue() {
  try {
    const token = await getAuthToken();

    console.log('\n🔍 诊断 Cover Image 字段问题...\n');

    // 1. 检查字段配置
    console.log('1️⃣ 检查字段配置...');
    const fieldRes = await axios.get(
      `${DIRECTUS_URL}/fields/strategies/cover_image`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const field = fieldRes.data.data;
    console.log(`   类型: ${field.type}`);
    console.log(`   Schema 类型: ${field.schema?.data_type}`);
    console.log(`   界面: ${field.meta?.interface}`);
    console.log(`   特殊标记: ${JSON.stringify(field.meta?.special)}`);
    console.log(`   是否只读: ${field.meta?.readonly}`);
    console.log(`   是否隐藏: ${field.meta?.hidden}`);

    // 检查是否有外键关系
    if (field.schema?.foreign_key_table) {
      console.log(`   外键表: ${field.schema.foreign_key_table}`);
      console.log(`   外键列: ${field.schema.foreign_key_column}`);
    }

    // 2. 检查关系配置
    console.log('\n2️⃣ 检查关系配置...');
    const relationsRes = await axios.get(
      `${DIRECTUS_URL}/relations/strategies/cover_image`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        validateStatus: () => true
      }
    );

    if (relationsRes.status === 200) {
      const relation = relationsRes.data.data;
      console.log(`   ✅ 关系已配置`);
      console.log(`   关联表: ${relation.related_collection}`);
      console.log(`   关联字段: ${relation.meta?.one_field || 'N/A'}`);
    } else {
      console.log(`   ⚠️  未找到关系配置`);
    }

    // 3. 测试实际更新
    console.log('\n3️⃣ 测试实际更新操作...');

    // 获取一个文件 ID
    const filesRes = await axios.get(
      `${DIRECTUS_URL}/files?limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (filesRes.data.data.length === 0) {
      console.log('   ⚠️  文件库中没有文件，跳过测试');
      console.log('   请先上传一个文件到 Directus 文件库');
      return;
    }

    const fileId = filesRes.data.data[0].id;
    console.log(`   测试文件 ID: ${fileId}`);

    // 获取一个策略
    const strategiesRes = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (strategiesRes.data.data.length === 0) {
      console.log('   ⚠️  没有策略，无法测试');
      return;
    }

    const strategy = strategiesRes.data.data[0];
    const strategyId = strategy.id;
    console.log(`   测试策略: ${strategy.title} (${strategyId})`);
    console.log(`   当前封面: ${strategy.cover_image || '(无)'}`);

    // 尝试更新
    console.log('\n   尝试更新封面...');
    try {
      const updateRes = await axios.patch(
        `${DIRECTUS_URL}/items/strategies/${strategyId}`,
        { cover_image: fileId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('   ✅ 更新请求成功');

      // 验证更新
      const verifyRes = await axios.get(
        `${DIRECTUS_URL}/items/strategies/${strategyId}?fields=cover_image`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const updatedValue = verifyRes.data.data.cover_image;
      console.log(`   更新后的值: ${updatedValue}`);

      if (updatedValue === fileId) {
        console.log('   ✅ 封面更新成功！');
      } else if (updatedValue === null) {
        console.log('   ❌ 封面未保存，值为 null');
        console.log('\n   可能的原因:');
        console.log('   1. 字段类型不匹配');
        console.log('   2. 缺少外键关系');
        console.log('   3. 权限问题');
      } else {
        console.log(`   ⚠️  封面值不匹配: ${updatedValue} !== ${fileId}`);
      }

    } catch (updateError) {
      console.log('   ❌ 更新失败:');
      if (updateError.response) {
        console.log(`   状态码: ${updateError.response.status}`);
        console.log(`   错误: ${JSON.stringify(updateError.response.data, null, 2)}`);
      } else {
        console.log(`   ${updateError.message}`);
      }
    }

    // 4. 给出建议
    console.log('\n📋 诊断结果和建议:\n');

    if (field.type !== 'uuid') {
      console.log('❌ 问题: 字段类型不是 uuid');
      console.log('   解决: 需要重新配置字段类型');
    } else if (!field.meta?.special?.includes('file')) {
      console.log('❌ 问题: 字段缺少 file 特殊标记');
      console.log('   解决: 需要添加 special: ["file"]');
    } else if (relationsRes.status !== 200) {
      console.log('❌ 问题: 缺少与 directus_files 的关系');
      console.log('   解决: 需要创建 many-to-one 关系');
    } else {
      console.log('✅ 字段配置看起来正确');
      console.log('   如果仍然有问题，可能是:');
      console.log('   1. 浏览器缓存问题 - 尝试清除缓存或使用无痕模式');
      console.log('   2. Directus 需要重启 - 运行: docker-compose restart directus');
      console.log('   3. 前端界面问题 - 尝试刷新页面 (Cmd/Ctrl + Shift + R)');
    }

  } catch (error) {
    console.error('\n❌ 诊断失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

diagnoseIssue();
