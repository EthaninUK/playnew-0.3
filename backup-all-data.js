const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function backupAllData() {
  const client = new Client({
    host: 'aws-1-ap-northeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.cujpgrzjmmttysphjknu',
    password: 'bi3d8FpBFTUWuwOb',
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = '/Users/m1/PlayNew_0.3/backups';

    // 确保备份目录存在
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 1. 备份分类数据
    console.log('📁 Backing up categories...');
    const categoriesResult = await client.query(`
      SELECT * FROM playnew_categories ORDER BY order_index, id
    `);

    const categoriesBackup = {
      timestamp: new Date().toISOString(),
      table: 'playnew_categories',
      count: categoriesResult.rows.length,
      data: categoriesResult.rows
    };

    const categoriesFile = path.join(backupDir, `categories_${timestamp}.json`);
    fs.writeFileSync(categoriesFile, JSON.stringify(categoriesBackup, null, 2));
    console.log(`✅ Categories backed up: ${categoriesResult.rows.length} records`);
    console.log(`   File: ${categoriesFile}\n`);

    // 2. 备份策略数据（包括分类映射）
    console.log('📁 Backing up strategies...');
    const strategiesResult = await client.query(`
      SELECT
        id, title, slug, category, status,
        summary, risk_level, apy_min, apy_max,
        time_commitment,
        category_l1, category_l2,
        created_at, updated_at
      FROM strategies
      WHERE status = 'published'
      ORDER BY created_at DESC
    `);

    const strategiesBackup = {
      timestamp: new Date().toISOString(),
      table: 'strategies',
      count: strategiesResult.rows.length,
      data: strategiesResult.rows
    };

    const strategiesFile = path.join(backupDir, `strategies_${timestamp}.json`);
    fs.writeFileSync(strategiesFile, JSON.stringify(strategiesBackup, null, 2));
    console.log(`✅ Strategies backed up: ${strategiesResult.rows.length} records`);
    console.log(`   File: ${strategiesFile}\n`);

    // 3. 备份策略-分类映射关系
    console.log('📁 Backing up category mapping...');
    const mappingResult = await client.query(`
      SELECT
        s.id,
        s.title,
        s.category as category_slug,
        s.category_l1,
        s.category_l2,
        c.name as category_name,
        c.type as category_type,
        c.parent_id
      FROM strategies s
      LEFT JOIN playnew_categories c ON s.category = c.slug
      WHERE s.status = 'published'
      ORDER BY c.order_index, s.title
    `);

    const mappingBackup = {
      timestamp: new Date().toISOString(),
      description: 'Strategy to Category mapping',
      count: mappingResult.rows.length,
      data: mappingResult.rows
    };

    const mappingFile = path.join(backupDir, `strategy_category_mapping_${timestamp}.json`);
    fs.writeFileSync(mappingFile, JSON.stringify(mappingBackup, null, 2));
    console.log(`✅ Mapping backed up: ${mappingResult.rows.length} records`);
    console.log(`   File: ${mappingFile}\n`);

    // 4. 生成备份统计报告
    const reportFile = path.join(backupDir, `backup_report_${timestamp}.txt`);
    const report = `
=================================================================
  数据备份报告
=================================================================
备份时间: ${new Date().toISOString()}
数据库: directus_play

-----------------------------------------------------------------
📊 备份统计:
-----------------------------------------------------------------
✅ 分类数据 (playnew_categories): ${categoriesResult.rows.length} 条记录
   - 父分类: ${categoriesResult.rows.filter(r => r.type === 'parent').length}
   - 子分类: ${categoriesResult.rows.filter(r => r.type === 'strategy').length}

✅ 策略数据 (strategies): ${strategiesResult.rows.length} 条记录
   - 已发布状态: ${strategiesResult.rows.length}

✅ 分类映射关系: ${mappingResult.rows.length} 条记录

-----------------------------------------------------------------
📁 备份文件:
-----------------------------------------------------------------
1. ${categoriesFile}
2. ${strategiesFile}
3. ${mappingFile}

-----------------------------------------------------------------
📋 分类使用情况:
-----------------------------------------------------------------
`;

    const categoryUsage = {};
    mappingResult.rows.forEach(row => {
      if (row.category_slug) {
        categoryUsage[row.category_slug] = (categoryUsage[row.category_slug] || 0) + 1;
      }
    });

    let usageReport = report;
    Object.entries(categoryUsage).sort((a, b) => b[1] - a[1]).forEach(([slug, count]) => {
      const cat = mappingResult.rows.find(r => r.category_slug === slug);
      usageReport += `${cat?.category_name || slug}: ${count} 个策略\n`;
    });

    usageReport += `
=================================================================
✅ 备份完成！
=================================================================
`;

    fs.writeFileSync(reportFile, usageReport);
    console.log(usageReport);
    console.log(`📄 Report saved to: ${reportFile}`);

    // 5. 创建 SQL 恢复脚本
    console.log('\n📝 Creating restore script...');
    const restoreScript = `#!/bin/bash
# 数据恢复脚本
# 生成时间: ${new Date().toISOString()}

echo "⚠️  Warning: This will restore data from backup"
echo "Backup timestamp: ${timestamp}"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# 使用 Node.js 恢复数据
node << 'EOF'
const { Client } = require('pg');
const fs = require('fs');

async function restore() {
  const client = new Client({
    host: 'aws-1-ap-northeast-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.cujpgrzjmmttysphjknu',
    password: 'bi3d8FpBFTUWuwOb',
    database: 'postgres',
  });

  await client.connect();
  console.log('✅ Connected to database');

  // 恢复分类
  const categories = JSON.parse(fs.readFileSync('${categoriesFile}', 'utf8'));
  console.log(\`Restoring \${categories.count} categories...\`);

  for (const cat of categories.data) {
    await client.query(\`
      INSERT INTO playnew_categories
      (id, name, slug, type, parent_id, description, icon, order_index, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        parent_id = EXCLUDED.parent_id,
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        order_index = EXCLUDED.order_index,
        is_active = EXCLUDED.is_active
    \`, [cat.id, cat.name, cat.slug, cat.type, cat.parent_id, cat.description,
         cat.icon, cat.order_index, cat.is_active, cat.created_at, cat.updated_at]);
  }
  console.log('✅ Categories restored');

  // 恢复策略的分类映射
  const strategies = JSON.parse(fs.readFileSync('${strategiesFile}', 'utf8'));
  console.log(\`Restoring category mapping for \${strategies.count} strategies...\`);

  for (const strategy of strategies.data) {
    await client.query(
      'UPDATE strategies SET category = $1 WHERE id = $2',
      [strategy.category, strategy.id]
    );
  }
  console.log('✅ Strategy categories restored');

  await client.end();
  console.log('✅ Restore completed!');
}

restore().catch(console.error);
EOF
`;

    const restoreFile = path.join(backupDir, `restore_${timestamp}.sh`);
    fs.writeFileSync(restoreFile, restoreScript);
    fs.chmodSync(restoreFile, 0o755);
    console.log(`✅ Restore script created: ${restoreFile}\n`);

    console.log('=================================================================');
    console.log('✅ 完整备份成功！');
    console.log('=================================================================');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

backupAllData();
