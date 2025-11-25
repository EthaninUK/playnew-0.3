async function countByCategory() {
  const categories = [
    'airdrop-tasks',
    'points-season',
    'testnet',
    'launchpad',
    'whitelist',
    'stablecoin-yield',
    'lending',
    'lst-staking',
    'restaking',
    'rwa',
    'amm',
    'orderbook',
    'vault',
    'liquidity-mining'
  ];

  console.log('\n📊 各分类策略统计:\n');

  let totalCount = 0;

  for (const category of categories) {
    try {
      const response = await fetch(`http://localhost:8055/items/strategies?filter[status][_eq]=published&filter[category][_eq]=${category}&fields=id&limit=1000`);
      const data = await response.json();

      if (data.data) {
        const count = data.data.length;
        totalCount += count;
        console.log(`   ${category.padEnd(25)} : ${count} 个策略`);
      }
    } catch (error) {
      console.error(`   ${category}: 查询失败`);
    }
  }

  console.log(`\n   总计: ${totalCount} 个策略\n`);
}

countByCategory();
