# PlayNew 0.3 - 生产环境部署指南

完整的 AWS 部署指南,包含自动化部署配置。

---

## 📋 服务器要求

- **操作系统**: Ubuntu 20.04/22.04 LTS
- **配置**: 最低 2GB RAM, 2 vCPU, 60GB SSD (你的服务器配置)
- **域名**: playnew.ai (已配置)
- **IP**: 13.158.222.72

---

## 🚀 快速部署 (首次部署)

### 第一步: 准备 GitHub 仓库

#### 1.1 在本地初始化 Git 仓库

```bash
cd /Users/m1/PlayNew_0.3
git init
git add .
git commit -m "Initial commit: PlayNew 0.3"
```

#### 1.2 在 GitHub 创建私有仓库

1. 访问 https://github.com/new
2. 仓库名: `playnew-0.3`
3. 设置为 **Private** (私有)
4. 不要初始化 README, .gitignore 等

#### 1.3 推送代码到 GitHub

```bash
git remote add origin git@github.com:YOUR_USERNAME/playnew-0.3.git
git branch -M main
git push -u origin main
```

---

### 第二步: 配置域名 DNS

登录你的域名管理面板,添加以下 A 记录:

| 类型 | 主机记录 | 记录值 |
|------|----------|---------|
| A | @ | 13.158.222.72 |
| A | www | 13.158.222.72 |
| A | api | 13.158.222.72 |
| A | search | 13.158.222.72 |
| A | n8n | 13.158.222.72 |

等待 DNS 生效 (可能需要 5-30 分钟)。

验证 DNS:
```bash
nslookup playnew.ai
nslookup api.playnew.ai
```

---

### 第三步: 连接并配置服务器

#### 3.1 SSH 连接到服务器

```bash
ssh ubuntu@13.158.222.72
# 或者使用你的密钥
ssh -i your-key.pem ubuntu@13.158.222.72
```

#### 3.2 运行服务器初始化脚本

```bash
# 下载脚本 (从你的 GitHub 仓库)
wget https://raw.githubusercontent.com/YOUR_USERNAME/playnew-0.3/main/setup-server.sh

# 运行脚本
sudo bash setup-server.sh
```

这个脚本会自动安装:
- Docker & Docker Compose
- Nginx
- Certbot (SSL 证书工具)
- 必要的系统优化 (swap, 文件限制等)

#### 3.3 克隆代码

```bash
# 切换到 www 目录
cd /var/www

# 克隆仓库 (私有仓库需要先配置 SSH key)
sudo git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew

# 设置权限
sudo chown -R $USER:$USER /var/www/playnew
cd playnew
```

**配置 GitHub SSH Key (如果需要):**

```bash
# 生成 SSH key
ssh-keygen -t ed25519 -C "server@playnew.ai"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 复制公钥,添加到 GitHub Settings > SSH Keys
# https://github.com/settings/keys
```

---

### 第四步: 配置环境变量

#### 4.1 生成安全密钥

```bash
# 生成 Directus 密钥
openssl rand -base64 32  # 用于 DIRECTUS_KEY
openssl rand -base64 32  # 用于 DIRECTUS_SECRET

# 生成 Meilisearch 密钥
openssl rand -base64 32  # 用于 MEILISEARCH_MASTER_KEY
```

#### 4.2 创建生产环境配置

```bash
# 根目录配置
cp .env.production.example .env.production
nano .env.production
# 填入刚才生成的密钥

# 前端配置
cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production
# 更新所有配置项
```

**重要配置项检查清单:**

- [ ] `DIRECTUS_KEY` - 新生成的密钥
- [ ] `DIRECTUS_SECRET` - 新生成的密钥
- [ ] `MEILISEARCH_MASTER_KEY` - 新生成的密钥
- [ ] `NEXT_PUBLIC_DIRECTUS_URL` = `https://api.playnew.ai`
- [ ] `NEXT_PUBLIC_MEILISEARCH_HOST` = `https://search.playnew.ai`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://playnew.ai`
- [ ] `STRIPE_SECRET_KEY` - 更换为生产密钥 (不是测试密钥!)
- [ ] `OPENROUTER_API_KEY` - 你的 API key

---

### 第五步: 配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/

# 创建符号链接
sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 注意: 此时会报错,因为还没有 SSL 证书,这是正常的
```

---

### 第六步: 获取 SSL 证书

使用 Certbot 自动获取 Let's Encrypt 免费证书:

```bash
# 停止 Nginx (获取证书时需要)
sudo systemctl stop nginx

# 为所有域名获取证书
sudo certbot certonly --standalone -d playnew.ai -d www.playnew.ai
sudo certbot certonly --standalone -d api.playnew.ai
sudo certbot certonly --standalone -d search.playnew.ai
sudo certbot certonly --standalone -d n8n.playnew.ai

# 启动 Nginx
sudo systemctl start nginx

# 测试 Nginx 配置
sudo nginx -t

# 重载 Nginx
sudo nginx -s reload
```

**设置自动续期:**

```bash
# Let's Encrypt 证书 90 天有效期,需要定期续期
# Certbot 已自动配置 cron job,无需手动操作

# 测试续期
sudo certbot renew --dry-run
```

---

### 第七步: 首次部署

```bash
# 确保在项目目录
cd /var/www/playnew

# 运行部署脚本
./deploy.sh
```

部署脚本会:
1. 拉取最新代码
2. 检查环境配置
3. 构建 Docker 镜像
4. 启动所有容器
5. 健康检查

等待 2-3 分钟,所有服务应该都启动完成。

---

### 第八步: 验证部署

访问以下 URL 验证:

1. **主站**: https://playnew.ai
2. **API**: https://api.playnew.ai/server/health
3. **搜索**: https://search.playnew.ai/health
4. **n8n**: https://n8n.playnew.ai (需要登录)

检查容器状态:
```bash
docker-compose -f docker-compose.prod.yml ps
```

查看日志:
```bash
# 查看所有日志
docker-compose -f docker-compose.prod.yml logs

# 查看特定服务
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs directus
```

---

## 🔄 配置 GitHub Actions 自动部署

### 配置 GitHub Secrets

1. 访问仓库 Settings > Secrets and variables > Actions
2. 添加以下 secrets:

| Secret Name | Value | 说明 |
|-------------|-------|------|
| `SSH_HOST` | `13.158.222.72` | 服务器 IP |
| `SSH_USER` | `ubuntu` | SSH 用户名 |
| `SSH_PRIVATE_KEY` | `你的私钥内容` | SSH 私钥 |

**获取 SSH 私钥:**

在**本地电脑**上:
```bash
cat ~/.ssh/id_rsa
# 或者
cat ~/.ssh/id_ed25519

# 复制完整内容,包括 -----BEGIN ... 和 -----END ...
```

### 测试自动部署

```bash
# 在本地做一个小改动
echo "# Test deployment" >> README.md
git add .
git commit -m "test: trigger deployment"
git push origin main
```

访问 GitHub 仓库 > Actions 查看部署进度。

每次推送到 `main` 分支,都会自动触发部署!

---

## 📊 监控和维护

### 查看系统资源

```bash
# 内存使用
free -h

# 磁盘使用
df -h

# Docker 资源使用
docker stats
```

### 查看日志

```bash
# 实时日志
docker-compose -f docker-compose.prod.yml logs -f

# 特定服务日志
docker-compose -f docker-compose.prod.yml logs -f frontend

# Nginx 日志
sudo tail -f /var/log/nginx/playnew-access.log
sudo tail -f /var/log/nginx/playnew-error.log
```

### 重启服务

```bash
# 重启所有服务
docker-compose -f docker-compose.prod.yml restart

# 重启特定服务
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart directus
```

### 备份数据

```bash
# 创建备份目录
mkdir -p ~/backups

# 备份 Directus 上传文件
tar -czf ~/backups/directus-uploads-$(date +%Y%m%d).tar.gz directus/uploads/

# 备份 Meilisearch 数据
tar -czf ~/backups/meilisearch-$(date +%Y%m%d).tar.gz meilisearch/data/

# 备份 n8n 工作流
tar -czf ~/backups/n8n-$(date +%Y%m%d).tar.gz n8n/data/
```

**注意**: Supabase 数据库已在云端,有自动备份。

---

## 🔧 常见问题

### 1. 服务器内存不足

```bash
# 查看 swap 使用
swapon --show

# 如果没有 swap,创建 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Docker 镜像构建失败

```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 3. SSL 证书即将过期

```bash
# Certbot 会自动续期,手动测试:
sudo certbot renew --dry-run

# 强制续期
sudo certbot renew --force-renewal
```

### 4. 忘记 Directus 管理员密码

在 `docker-compose.prod.yml` 中查看:
```yaml
ADMIN_EMAIL: 'the_uk1@outlook.com'
ADMIN_PASSWORD: 'Mygcdjmyxzg2026!'
```

### 5. 前端无法连接 API

检查环境变量:
```bash
docker exec playnew-frontend env | grep DIRECTUS
```

---

## 📞 支持

如果遇到问题:

1. 查看日志: `docker-compose -f docker-compose.prod.yml logs`
2. 检查服务状态: `docker-compose -f docker-compose.prod.yml ps`
3. 重启服务: `./deploy.sh`

---

## 🎉 完成!

你的 PlayNew 0.3 现已部署到生产环境!

- 🌐 主站: https://playnew.ai
- 🔧 API: https://api.playnew.ai
- 🔍 搜索: https://search.playnew.ai
- ⚡ 自动化: https://n8n.playnew.ai

每次推送代码到 GitHub,都会自动部署更新!
