/**
 * PM2 配置文件 - 用于生产环境部署
 *
 * 使用方法:
 * pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'gossip-twitter',
      script: './gossip-scraper-twitter.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/twitter-error.log',
      out_file: './logs/twitter-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'gossip-telegram',
      script: './gossip-scraper-telegram.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/telegram-error.log',
      out_file: './logs/telegram-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'gossip-onchain',
      script: './gossip-scraper-onchain.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/onchain-error.log',
      out_file: './logs/onchain-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
