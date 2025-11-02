# 📋 PlayNew 0.3 部署清单

部署前请逐项检查,确保所有步骤都已完成。

---

## 阶段 1: 本地准备 ✅

### Git 仓库
- [x] Git 已初始化
- [x] 所有文件已提交
- [ ] 在 GitHub 创建私有仓库 `playnew-0.3`
- [ ] 添加远程仓库: `git remote add origin ...`
- [ ] 推送代码: `git push -u origin main`

### 配置文件检查
- [x] `.gitignore` 已创建
- [x] `.env.production.example` 已创建
- [x] `frontend/.env.production.example` 已创建
- [x] `docker-compose.prod.yml` 已创建
- [x] `nginx/playnew.ai.conf` 已创建
- [x] GitHub Actions 配置已创建

---

## 阶段 2: 域名配置

### DNS 记录
- [ ] `playnew.ai` -> `13.158.222.72`
- [ ] `www.playnew.ai` -> `13.158.222.72`
- [ ] `api.playnew.ai` -> `13.158.222.72`
- [ ] `search.playnew.ai` -> `13.158.222.72`
- [ ] `n8n.playnew.ai` -> `13.158.222.72`

### DNS 验证
```bash
nslookup playnew.ai
nslookup api.playnew.ai
```
- [ ] DNS 已生效 (可能需要等待 5-30 分钟)

---

## 阶段 3: 服务器初始化

### SSH 连接
```bash
ssh ubuntu@13.158.222.72
```
- [ ] SSH 连接成功

### 安装必要软件
```bash
wget https://raw.githubusercontent.com/YOUR_USERNAME/playnew-0.3/main/setup-server.sh
sudo bash setup-server.sh
```
- [ ] Docker 已安装
- [ ] Docker Compose 已安装
- [ ] Nginx 已安装
- [ ] Certbot 已安装
- [ ] 防火墙已配置
- [ ] Swap 已创建
- [ ] 系统优化已完成

---

## 阶段 4: 代码部署

### 克隆仓库
```bash
cd /var/www
sudo git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew
sudo chown -R $USER:$USER playnew
cd playnew
```
- [ ] 代码已克隆到 `/var/www/playnew`

### 环境变量配置

#### 生成密钥
```bash
openssl rand -base64 32  # DIRECTUS_KEY
openssl rand -base64 32  # DIRECTUS_SECRET
openssl rand -base64 32  # MEILISEARCH_MASTER_KEY
```
- [ ] 密钥已生成

#### 根目录 .env.production
```bash
cp .env.production.example .env.production
nano .env.production
```
- [ ] `DIRECTUS_KEY` 已填写
- [ ] `DIRECTUS_SECRET` 已填写
- [ ] `MEILISEARCH_MASTER_KEY` 已填写

#### 前端 .env.production
```bash
cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production
```
- [ ] `NEXT_PUBLIC_DIRECTUS_URL` = `https://api.playnew.ai`
- [ ] `NEXT_PUBLIC_MEILISEARCH_HOST` = `https://search.playnew.ai`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://playnew.ai`
- [ ] `DIRECTUS_ADMIN_TOKEN` 已填写
- [ ] `MEILISEARCH_API_KEY` 已填写
- [ ] `OPENROUTER_API_KEY` 已填写
- [ ] **重要**: `STRIPE_SECRET_KEY` 已改为生产密钥(pk_live_...)
- [ ] **重要**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 已改为生产密钥
- [ ] `STRIPE_WEBHOOK_SECRET` 已配置

---

## 阶段 5: SSL 证书

### 停止 Nginx
```bash
sudo systemctl stop nginx
```
- [ ] Nginx 已停止

### 获取证书
```bash
sudo certbot certonly --standalone -d playnew.ai -d www.playnew.ai
sudo certbot certonly --standalone -d api.playnew.ai
sudo certbot certonly --standalone -d search.playnew.ai
sudo certbot certonly --standalone -d n8n.playnew.ai
```
- [ ] playnew.ai 证书已获取
- [ ] api.playnew.ai 证书已获取
- [ ] search.playnew.ai 证书已获取
- [ ] n8n.playnew.ai 证书已获取

### 启动 Nginx
```bash
sudo systemctl start nginx
```
- [ ] Nginx 已启动

---

## 阶段 6: Nginx 配置

```bash
sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload
```
- [ ] Nginx 配置已复制
- [ ] 软链接已创建
- [ ] Nginx 配置测试通过
- [ ] Nginx 已重载

---

## 阶段 7: 首次部署

```bash
./deploy.sh
```
- [ ] 部署脚本执行成功
- [ ] 所有容器已启动
- [ ] 健康检查通过

### 验证部署
```bash
docker-compose -f docker-compose.prod.yml ps
```
- [ ] directus 容器运行中
- [ ] meilisearch 容器运行中
- [ ] n8n 容器运行中
- [ ] frontend 容器运行中

---

## 阶段 8: 功能测试

### 网站访问
- [ ] https://playnew.ai 可访问
- [ ] HTTPS 正常 (绿色锁)
- [ ] 首页加载正常
- [ ] 策略页面正常
- [ ] 新闻页面正常

### API 测试
- [ ] https://api.playnew.ai/server/health 返回 OK
- [ ] https://search.playnew.ai/health 返回 OK

### 管理后台
- [ ] https://api.playnew.ai 可登录 Directus
- [ ] https://n8n.playnew.ai 可登录 n8n

### 功能测试
- [ ] 搜索功能正常
- [ ] 用户注册正常
- [ ] 用户登录正常
- [ ] 支付测试(使用测试卡: 4242 4242 4242 4242)
- [ ] 会员功能正常

---

## 阶段 9: GitHub Actions 自动部署

### 配置 Secrets
在 GitHub 仓库 Settings > Secrets and variables > Actions 添加:
- [ ] `SSH_HOST` = `13.158.222.72`
- [ ] `SSH_USER` = `ubuntu`
- [ ] `SSH_PRIVATE_KEY` = SSH 私钥内容

### 测试自动部署
```bash
# 本地
echo "# Test deployment" >> README.md
git add .
git commit -m "test: trigger deployment"
git push origin main
```
- [ ] GitHub Actions 触发成功
- [ ] 部署流程执行成功
- [ ] 服务器代码已更新

---

## 阶段 10: 监控和维护

### 日志检查
```bash
docker-compose -f docker-compose.prod.yml logs -f
```
- [ ] 无错误日志
- [ ] 所有服务正常运行

### 性能检查
```bash
docker stats
free -h
df -h
```
- [ ] CPU 使用率正常
- [ ] 内存使用率正常
- [ ] 磁盘空间充足

### 备份计划
- [ ] 已设置定期备份脚本
- [ ] Directus 上传文件备份
- [ ] Meilisearch 数据备份
- [ ] n8n 工作流备份

---

## 🎉 部署完成!

全部检查完成后,你的 PlayNew 0.3 就成功上线了!

### 最终验证清单
- [ ] 所有 URL 都能正常访问
- [ ] HTTPS 全部启用
- [ ] 用户可以注册和登录
- [ ] 支付功能正常
- [ ] 搜索功能正常
- [ ] 自动部署已配置

### 下一步
- 监控服务器性能
- 定期查看日志
- 测试自动部署
- 配置监控告警 (可选)

---

**问题排查**: 如遇到问题,查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 的"常见问题"章节
