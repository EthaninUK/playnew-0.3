module.exports = {
  apps: [{
    name: 'credits-daemon',
    script: '/Users/m1/PlayNew_0.3/auto-award-credits-daemon.js',
    cron_restart: '*/5 * * * *', // 每5分钟运行一次
    autorestart: false, // cron 模式下不自动重启
    watch: false,
    max_memory_restart: '100M',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/Users/m1/PlayNew_0.3/logs/credits-daemon-error.log',
    out_file: '/Users/m1/PlayNew_0.3/logs/credits-daemon-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
