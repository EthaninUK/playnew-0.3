# PlayNew 0.3 - 部署检查清单

在部署前和部署后使用此清单确保一切正常。

---

## 📋 部署前检查

### 本地准备
- [ ] SSH 密钥权限设置为 400
- [ ] 能够成功 SSH 连接到服务器
- [ ] 代码已提交到 Git
- [ ] .gitignore 正确配置 (不包含 .env, *.pem)
- [ ] GitHub 仓库已创建

### 环境变量
- [ ] 已生成所有安全密钥 (Directus, Meilisearch)
- [ ] .env.production 已配置
- [ ] frontend/.env.production 已配置
- [ ] Supabase 连接字符串正确
- [ ] Stripe 使用生产密钥 (不是测试密钥)
- [ ] 所有 API keys 已填写

### 服务器准备
- [ ] Docker 已安装
- [ ] Docker Compose 已安装
- [ ] Nginx 已安装
- [ ] GitHub SSH key 已配置
- [ ] 代码已克隆到 /var/www/playnew

---

## 🚀 部署步骤

### 1. 服务器初始化
```bash
# 在服务器上执行
sudo bash server-init.sh
```
- [ ] 系统已更新
- [ ] Docker 安装成功
- [ ] Nginx 运行中
- [ ] Swap 已创建

### 2. 配置环境
```bash
# 在服务器上执行
cd /var/www/playnew
cp .env.production.example .env.production
nano .env.production
```
- [ ] 密钥已生成并填入
- [ ] URL 已更新为服务器 IP
- [ ] 数据库连接字符串正确

### 3. 启动服务
```bash
# 在服务器上执行
docker compose -f docker-compose.prod.yml up -d
```
- [ ] Directus 容器启动
- [ ] Meilisearch 容器启动
- [ ] Frontend 容器启动
- [ ] n8n 容器启动

### 4. 验证服务
```bash
# 检查容器状态
docker compose -f docker-compose.prod.yml ps
```
- [ ] 所有容器显示 "Up"
- [ ] 没有错误日志

---

## ✅ 部署后验证

### 基本功能
- [ ] 前端可访问: http://IP
- [ ] Directus 后台可访问: http://IP:8055/admin
- [ ] Directus 可以登录
- [ ] Meilisearch 健康检查通过: http://IP:7700/health

### 数据库连接
- [ ] Directus 成功连接到 Supabase
- [ ] 可以在 Directus 后台看到数据
- [ ] 前端可以获取数据

### 功能测试
- [ ] 首页正常显示
- [ ] 策略列表加载正常
- [ ] 新闻列表加载正常
- [ ] 搜索功能正常
- [ ] 用户注册/登录正常
- [ ] 支付功能正常 (如果启用)

### 性能检查
```bash
# 在服务器上执行
docker stats
free -h
df -h
```
- [ ] CPU 使用率正常 (< 80%)
- [ ] 内存使用正常 (< 3GB)
- [ ] 磁盘空间充足 (> 20GB 剩余)

### 安全检查
- [ ] 默认密码已更改
- [ ] 只开放必要端口
- [ ] 环境变量文件未提交到 Git
- [ ] SSH key 权限正确 (400)

---

## 🔄 持续维护检查

### 每日
- [ ] 检查服务运行状态
- [ ] 查看错误日志
- [ ] 监控资源使用

### 每周
- [ ] 备份数据
- [ ] 检查磁盘空间
- [ ] 清理旧 Docker 镜像

### 每月
- [ ] 更新系统包
- [ ] 更新 Docker 镜像
- [ ] 检查安全更新
- [ ] 测试备份恢复

---

## 🆘 故障排查

### 服务无法启动
```bash
# 查看日志
docker compose -f docker-compose.prod.yml logs [service_name]

# 重启服务
docker compose -f docker-compose.prod.yml restart [service_name]

# 重建服务
docker compose -f docker-compose.prod.yml up -d --force-recreate [service_name]
```

### 数据库连接失败
- [ ] 检查 Supabase 连接字符串
- [ ] 检查网络连接
- [ ] 检查 Supabase 项目状态

### 内存不足
```bash
# 检查内存使用
free -h

# 增加 swap
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

### 端口被占用
```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :8055

# 停止占用进程
sudo kill -9 <PID>
```

---

## 📞 紧急联系

如果遇到严重问题:

1. **停止所有服务**: `docker compose -f docker-compose.prod.yml down`
2. **备份数据**: 参考备份命令
3. **查看日志**: `docker compose -f docker-compose.prod.yml logs`
4. **回滚代码**: `git checkout <previous_commit>`

---

## ✨ 优化建议

部署成功后可以考虑:

- [ ] 绑定域名
- [ ] 配置 SSL/HTTPS
- [ ] 设置 CDN (CloudFlare)
- [ ] 配置自动备份
- [ ] 设置监控告警
- [ ] 优化数据库查询
- [ ] 启用 Redis 缓存
- [ ] 配置日志轮转

---

完成所有检查后,你的 PlayNew 0.3 就可以稳定运行了! 🎉
