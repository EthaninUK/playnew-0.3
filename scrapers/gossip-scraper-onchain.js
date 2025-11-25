/**
 * 链上数据八卦采集器
 *
 * 监控:
 * 1. 巨鲸异常转账
 * 2. 项目方代币抛售
 * 3. 交易所资金异动
 */

const axios = require('axios');
const { ethers } = require('ethers');

const CONFIG = {
  // Etherscan API
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
    apiUrl: 'https://api.etherscan.io/api',
  },

  // 监控的知名地址
  watchedAddresses: {
    // Vitalik
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045': {
      name: 'Vitalik Buterin',
      type: 'kol',
      weight: 100,
    },
    // CZ
    '0x28C6c06298d514Db089934071355E5743bf21d60': {
      name: 'CZ (Binance)',
      type: 'exchange',
      weight: 95,
    },
    // 添加更多地址...
  },

  // 阈值
  minTransferAmount: ethers.parseEther('1000'), // 1000 ETH以上才记录
  minTokenValue: 1000000, // $1M USD以上

  directus: {
    url: process.env.DIRECTUS_URL || 'http://localhost:8055',
    email: process.env.DIRECTUS_ADMIN_EMAIL || 'the_uk1@outlook.com',
    password: process.env.DIRECTUS_ADMIN_PASSWORD || 'Mygcdjmyxzg2026!',
  },

  intervalMinutes: 30,
};

class OnchainGossipScraper {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.ETH_RPC_URL || 'https://eth.llamarpc.com'
    );
    this.directusToken = null;
    this.lastCheckedBlock = {};
  }

  async init() {
    await this.loginDirectus();
    const blockNumber = await this.provider.getBlockNumber();
    console.log(`✅ Connected to Ethereum, block: ${blockNumber}`);

    // 初始化所有地址的起始区块
    for (const address of Object.keys(CONFIG.watchedAddresses)) {
      this.lastCheckedBlock[address] = blockNumber;
    }
  }

  async loginDirectus() {
    const response = await axios.post(`${CONFIG.directus.url}/auth/login`, {
      email: CONFIG.directus.email,
      password: CONFIG.directus.password,
    });
    this.directusToken = response.data.data.access_token;
  }

  /**
   * 检查地址的交易历史
   */
  async checkAddressTransactions(address, addressInfo) {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = this.lastCheckedBlock[address] || currentBlock - 1000;

      // 获取交易记录(使用Etherscan API更快)
      if (!CONFIG.etherscan.apiKey) {
        console.warn('⚠️  Etherscan API key not configured');
        return;
      }

      const response = await axios.get(CONFIG.etherscan.apiUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: fromBlock,
          endblock: currentBlock,
          sort: 'desc',
          apikey: CONFIG.etherscan.apiKey,
        },
      });

      const txs = response.data.result || [];

      for (const tx of txs) {
        await this.analyzeTransaction(tx, address, addressInfo);
      }

      this.lastCheckedBlock[address] = currentBlock;
    } catch (error) {
      console.error(`Error checking ${address}:`, error.message);
    }
  }

  /**
   * 分析单笔交易
   */
  async analyzeTransaction(tx, watchedAddress, addressInfo) {
    const value = BigInt(tx.value);

    // 过滤小额转账
    if (value < CONFIG.minTransferAmount) {
      return;
    }

    const ethAmount = ethers.formatEther(value);
    const direction = tx.from.toLowerCase() === watchedAddress.toLowerCase() ? 'OUT' : 'IN';

    console.log(`\n🔍 Large transaction detected:`);
    console.log(`   ${addressInfo.name}: ${direction} ${ethAmount} ETH`);
    console.log(`   Hash: ${tx.hash}`);

    // 判断是否异常
    const isToExchange = await this.isExchangeAddress(direction === 'OUT' ? tx.to : tx.from);

    let title, tags, credibility;

    if (direction === 'OUT' && isToExchange) {
      // 转入交易所 = 可能要卖
      title = `🚨 ${addressInfo.name}疑似转移${Math.floor(ethAmount)} ETH到交易所`;
      tags = ['巨鲸异动', 'KOL动态', addressInfo.type];
      credibility = 85; // 链上数据可信度高
    } else if (direction === 'IN' && value > ethers.parseEther('5000')) {
      // 大额转入
      title = `💰 ${addressInfo.name}地址收到${Math.floor(ethAmount)} ETH大额转账`;
      tags = ['巨鲸异动', '资金流动'];
      credibility = 80;
    } else {
      // 普通大额转账
      title = `📊 ${addressInfo.name}转账${Math.floor(ethAmount)} ETH`;
      tags = ['链上数据'];
      credibility = 75;
    }

    // 发布八卦
    const gossipData = {
      title,
      summary: `链上监测:${addressInfo.name}的地址发生${Math.floor(ethAmount)} ETH的大额${direction === 'OUT' ? '转出' : '转入'}`,
      content: `# 链上异动监测\n\n## 交易详情\n\n- **地址**: ${addressInfo.name} (${watchedAddress})\n- **方向**: ${direction}\n- **金额**: ${ethAmount} ETH\n- **目标**: ${direction === 'OUT' ? tx.to : tx.from}\n- **交易哈希**: [${tx.hash}](https://etherscan.io/tx/${tx.hash})\n- **区块**: ${tx.blockNumber}\n- **时间**: ${new Date(tx.timeStamp * 1000).toISOString()}\n\n${isToExchange ? '⚠️ **目标地址疑似交易所,可能准备出售**' : ''}\n\n## 分析\n\n链上数据显示,该地址进行了大额资金转移。请关注后续动向。`,
      ai_summary: `${addressInfo.name}的链上地址${direction === 'OUT' ? '转出' : '收到'}${Math.floor(ethAmount)} ETH${isToExchange ? ',目标为交易所地址' : ''}`,
      source: 'Etherscan',
      source_type: 'onchain',
      url: `https://etherscan.io/tx/${tx.hash}`,
      slug: `onchain-${tx.hash}`,

      news_type: 'gossip',
      credibility_score: credibility,
      verification_status: 'confirmed', // 链上数据已确认
      gossip_tags: tags,
      likes_count: 0,
      comments_count: 0,

      status: 'published',
      category: 'crypto-general',
      content_published_at: new Date(tx.timeStamp * 1000).toISOString(),
      published_at: new Date().toISOString(),
    };

    await this.publishGossip(gossipData);
  }

  /**
   * 判断是否为交易所地址
   */
  async isExchangeAddress(address) {
    // 简化版:可以维护一个交易所地址列表
    const knownExchanges = [
      '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance
      '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', // Binance 2
      '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', // Binance 3
      // 添加更多交易所地址...
    ];

    return knownExchanges.some(ex => ex.toLowerCase() === address.toLowerCase());
  }

  async publishGossip(data) {
    try {
      await axios.post(`${CONFIG.directus.url}/items/news`, data, {
        headers: {
          Authorization: `Bearer ${this.directusToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ Published onchain gossip`);
    } catch (error) {
      if (!error.response?.data?.errors?.[0]?.message?.includes('duplicate')) {
        console.error('Publish error:', error.message);
      }
    }
  }

  async scrape() {
    console.log('\n🔗 Scanning blockchain for gossip...\n');

    for (const [address, info] of Object.entries(CONFIG.watchedAddresses)) {
      await this.checkAddressTransactions(address, info);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }

    console.log('\n✅ Onchain scan completed\n');
  }

  async start() {
    await this.init();

    console.log('🤖 Onchain Gossip Scraper Started');
    console.log(`   Monitoring ${Object.keys(CONFIG.watchedAddresses).length} addresses`);
    console.log(`   Interval: ${CONFIG.intervalMinutes} minutes\n`);

    // 立即执行
    await this.scrape();

    // 定时执行
    setInterval(async () => {
      await this.scrape();
    }, CONFIG.intervalMinutes * 60 * 1000);
  }
}

if (require.main === module) {
  const scraper = new OnchainGossipScraper();
  scraper.start().catch(console.error);
}

module.exports = OnchainGossipScraper;
