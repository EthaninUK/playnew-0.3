# ✅ PlayNew 0.3 - 准备就绪!

代码已经准备好部署到生产环境了! 所有部署文件已创建完成。

---

## 📦 已准备的文件

### 核心配置文件
- ✅ `.gitignore` - Git 忽略文件配置
- ✅ `.env.production.example` - 生产环境变量模板
- ✅ `frontend/.env.production.example` - 前端生产配置模板
- ✅ `docker-compose.prod.yml` - 生产环境 Docker 配置
- ✅ `frontend/Dockerfile.prod` - 前端生产 Dockerfile
- ✅ `frontend/next.config.ts` - Next.js 配置(已启用 standalone)

### 服务器配置
- ✅ `nginx/playnew.ai.conf` - Nginx 反向代理配置
- ✅ `setup-server.sh` - 服务器初始化脚本
- ✅ `deploy.sh` - 自动化部署脚本

### CI/CD
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 自动部署

### 文档
- ✅ `DEPLOYMENT.md` - 完整部署文档
- ✅ `QUICK-DEPLOY.md` - 快速部署指南

---

## 🚀 下一步操作

### 1. 推送到 GitHub (本地执行)

```bash
# 已完成 Git 初始化和首次提交,现在推送到 GitHub

# 在 GitHub 创建私有仓库: https://github.com/new
# 仓库名: playnew-0.3
# 设置为 Private

# 添加远程仓库并推送
git remote add origin git@github.com:YOUR_USERNAME/playnew-0.3.git
git push -u origin main
```

### 2. 配置域名 DNS

在域名管理面板添加 A 记录:
- `@` -> `13.158.222.72`
- `www` -> `13.158.222.72`
- `api` -> `13.158.222.72`
- `search` -> `13.158.222.72`
- `n8n` -> `13.158.222.72`

### 3. 服务器部署

```bash
# SSH 连接服务器
ssh ubuntu@13.158.222.72

# 下载并运行初始化脚本
wget https://raw.githubusercontent.com/YOUR_USERNAME/playnew-0.3/main/setup-server.sh
sudo bash setup-server.sh

# 克隆代码
cd /var/www
sudo git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew
sudo chown -R $USER:$USER playnew
cd playnew

# 配置环境变量
cp .env.production.example .env.production
nano .env.production  # 填入生产密钥

cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production  # 更新配置

# 获取 SSL 证书
sudo systemctl stop nginx
sudo certbot certonly --standalone -d playnew.ai -d www.playnew.ai
sudo certbot certonly --standalone -d api.playnew.ai
sudo certbot certonly --standalone -d search.playnew.ai
sudo certbot certonly --standalone -d n8n.playnew.ai

# 配置 Nginx
sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl start nginx

# 部署!
./deploy.sh
```

### 4. 配置自动部署

在 GitHub 仓库 Settings > Secrets 添加:
- `SSH_HOST`: `13.158.222.72`
- `SSH_USER`: `ubuntu`
- `SSH_PRIVATE_KEY`: 你的 SSH 私钥

---

## 📚 详细文档

- **完整部署指南**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **快速部署**: [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)

---

## ⚠️ 重要提醒

1. **环境变量**: 记得更新所有生产环境变量,特别是:
   - 生成新的 Directus 和 Meilisearch 密钥
   - Stripe 改为**生产密钥**(不是测试密钥!)
   - 所有 URL 改为 `https://playnew.ai`

2. **SSL 证书**: Let's Encrypt 证书 90 天有效,Certbot 会自动续期

3. **服务器内存**: 2GB RAM 有点紧张,已做优化:
   - 启用了 2GB swap
   - 调整了容器内存限制
   - 如果遇到内存问题,考虑升级到 4GB RAM

---

## 🎉 完成后

访问:
- 🌐 https://playnew.ai
- 🔧 https://api.playnew.ai
- 🔍 https://search.playnew.ai
- ⚡ https://n8n.playnew.ai

每次 `git push` 都会自动部署更新!

---

**祝部署顺利! 🚀**
