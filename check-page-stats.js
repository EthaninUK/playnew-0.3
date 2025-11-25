const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkPageStats() {
  console.log('🔍 检查玩法库页面统计数据...\n');

  try {
    const response = await fetch('http://localhost:3000/strategies');
    const html = await response.text();

    // 查找统计卡片部分
    const statsSection = html.match(/数据统计[\s\S]{1,2000}?个分类/);

    if (statsSection) {
      console.log('找到统计区域:');
      console.log(statsSection[0].substring(0, 500));
      console.log('...\n');

      // 提取数字
      const numbers = statsSection[0].match(/>\d+</g);
      if (numbers && numbers.length >= 2) {
        const strategies = numbers[0].replace(/[><]/g, '');
        const categories = numbers[1].replace(/[><]/g, '');

        console.log(`📊 页面显示:`);
        console.log(`   策略: ${strategies} 个`);
        console.log(`   分类: ${categories} 个\n`);
      }
    } else {
      console.log('❌ 未找到统计区域\n');
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkPageStats();
