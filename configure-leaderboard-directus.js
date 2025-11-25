#!/usr/bin/env node

/**
 * 配置 Directus 排行榜字段和权限
 * 为 strategies 集合添加排行榜相关字段的显示和编辑权限
 */

const { createDirectus, rest, staticToken, readFields, updateField, createField } = require('@directus/sdk');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_TOKEN = 'SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ';

const directus = createDirectus(DIRECTUS_URL).with(rest()).with(staticToken(DIRECTUS_TOKEN));

async function configureLeaderboardFields() {
  console.log('🚀 开始配置 Directus 排行榜字段...\n');

  try {
    // 1. 检查现有字段
    console.log('📊 检查 strategies 集合的字段...');
    const fields = await directus.request(readFields('strategies'));

    const existingFields = fields.map(f => f.field);
    console.log('✅ 找到字段:', existingFields.length, '个\n');

    // 需要配置的排行榜字段
    const leaderboardFields = [
      {
        field: 'hotness_score',
        meta: {
          interface: 'input',
          display: 'formatted-value',
          display_options: {
            format: true,
            decimals: 2,
            suffix: ' 分'
          },
          options: {
            placeholder: '自动计算',
            iconRight: 'trending_up'
          },
          readonly: true,
          hidden: false,
          width: 'half',
          group: 'leaderboard',
          note: '热度评分 - 由系统自动计算 (view×0.3 + bookmark×2 + comment×1.5 + share×3)',
          translations: [
            { language: 'zh-CN', translation: '热度分' },
            { language: 'en-US', translation: 'Hotness Score' }
          ]
        }
      },
      {
        field: 'share_count',
        meta: {
          interface: 'input',
          display: 'formatted-value',
          options: {
            placeholder: '0',
            iconRight: 'share'
          },
          readonly: false,
          hidden: false,
          width: 'half',
          group: 'leaderboard',
          note: '分享次数 - 可手动修改',
          translations: [
            { language: 'zh-CN', translation: '分享数' },
            { language: 'en-US', translation: 'Share Count' }
          ]
        }
      },
      {
        field: 'comment_count',
        meta: {
          interface: 'input',
          display: 'formatted-value',
          options: {
            placeholder: '0',
            iconRight: 'comment'
          },
          readonly: false,
          hidden: false,
          width: 'half',
          group: 'leaderboard',
          note: '评论数 - 可手动修改',
          translations: [
            { language: 'zh-CN', translation: '评论数' },
            { language: 'en-US', translation: 'Comment Count' }
          ]
        }
      },
      {
        field: 'featured_order',
        meta: {
          interface: 'input',
          display: 'formatted-value',
          options: {
            placeholder: '留空则不显示在精选榜',
            iconRight: 'filter_1',
            min: 1
          },
          readonly: false,
          hidden: false,
          width: 'half',
          group: 'leaderboard',
          note: '编辑精选排序 - 数字越小越靠前 (仅在 is_featured=true 时生效)',
          translations: [
            { language: 'zh-CN', translation: '精选排序' },
            { language: 'en-US', translation: 'Featured Order' }
          ]
        }
      },
      {
        field: 'last_hotness_update',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          display_options: {
            relative: true
          },
          options: {
            iconRight: 'access_time'
          },
          readonly: true,
          hidden: false,
          width: 'half',
          group: 'leaderboard',
          note: '最后热度更新时间 - 由定时任务自动更新',
          translations: [
            { language: 'zh-CN', translation: '热度更新时间' },
            { language: 'en-US', translation: 'Last Hotness Update' }
          ]
        }
      }
    ];

    // 2. 更新字段元数据
    console.log('🔧 配置字段元数据...');
    for (const fieldConfig of leaderboardFields) {
      if (existingFields.includes(fieldConfig.field)) {
        try {
          await directus.request(
            updateField('strategies', fieldConfig.field, {
              meta: fieldConfig.meta
            })
          );
          console.log(`✅ 已配置: ${fieldConfig.field}`);
        } catch (error) {
          console.log(`⚠️  ${fieldConfig.field} 配置失败:`, error.message);
        }
      } else {
        console.log(`⏭️  跳过 ${fieldConfig.field} (字段不存在)`);
      }
    }

    // 3. 创建字段分组 (如果不存在)
    console.log('\n📁 配置字段分组...');
    try {
      // Note: Directus 字段分组需要通过界面手动创建
      // 这里只是提示
      console.log('ℹ️  请在 Directus 界面中创建 "排行榜" 字段分组,并将以下字段拖入:');
      console.log('   - hotness_score (热度分)');
      console.log('   - share_count (分享数)');
      console.log('   - comment_count (评论数)');
      console.log('   - featured_order (精选排序)');
      console.log('   - last_hotness_update (更新时间)');
    } catch (error) {
      console.log('⚠️  分组配置提示完成');
    }

    // 4. 配置列表显示
    console.log('\n📋 配置建议:');
    console.log('');
    console.log('在 Directus 管理界面中:');
    console.log('1. 进入 Settings → Data Model → strategies');
    console.log('2. 在列表视图中添加以下列:');
    console.log('   - hotness_score (热度分)');
    console.log('   - bookmark_count (收藏数)');
    console.log('   - view_count (浏览量)');
    console.log('   - is_featured (是否精选)');
    console.log('   - featured_order (精选排序)');
    console.log('');
    console.log('3. 设置默认排序:');
    console.log('   - 主排序: hotness_score DESC');
    console.log('   - 副排序: view_count DESC');
    console.log('');
    console.log('4. 添加快速筛选:');
    console.log('   - is_featured = true (查看精选策略)');
    console.log('   - hotness_score > 100 (高热度策略)');

    console.log('\n✅ Directus 配置完成!');

  } catch (error) {
    console.error('❌ 配置失败:', error.message);
    process.exit(1);
  }
}

// 运行配置
configureLeaderboardFields();
