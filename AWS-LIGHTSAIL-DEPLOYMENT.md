# PlayNew 0.3 - AWS Lightsail 部署方案

完整的 AWS Lightsail 部署指南,使用 Git 进行版本控制和自动化部署。

---

## 📋 服务器信息

- **平台**: AWS Lightsail
- **IP 地址**: 13.158.222.72
- **区域**: ap-northeast-1 (东京)
- **配置**: 4 GB RAM, 2 vCPU, 80 GB SSD
- **操作系统**: Ubuntu
- **SSH 密钥**: LightsailDefaultKey-ap-northeast-playnew.pem

---

## 🎯 部署架构

```
┌─────────────────────────────────────────────────────┐
│                  AWS Lightsail                      │
│                 13.158.222.72                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │              Nginx (反向代理)                 │  │
│  │  - 端口 80/443 (SSL)                         │  │
│  │  - 路由到各服务                              │  │
│  └──────────────────────────────────────────────┘  │
│           │           │           │                 │
│  ┌────────┴───┐  ┌───┴────┐  ┌──┴─────────┐       │
│  │  Frontend  │  │Directus│  │Meilisearch │       │
│  │  (Next.js) │  │  API   │  │   Search   │       │
│  │  :3000     │  │  :8055 │  │   :7700    │       │
│  └────────────┘  └────────┘  └────────────┘       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         Supabase (外部服务)                   │  │
│  │   PostgreSQL + Auth + Storage                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 部署流程概览

1. **本地准备**: 配置 Git, 创建 GitHub 仓库
2. **服务器初始化**: 安装 Docker, Nginx 等基础环境
3. **配置环境变量**: 生产环境配置
4. **Docker 部署**: 使用 Docker Compose 启动服务
5. **Nginx 配置**: 反向代理和 SSL
6. **持续部署**: Git push 自动部署

---

## 🚀 第一阶段: 本地准备 (在 Mac 上执行)

### 1.1 检查 SSH 密钥权限

```bash
cd /Users/m1/PlayNew_0.3

# 设置正确的密钥权限
chmod 400 LightsailDefaultKey-ap-northeast-playnew.pem

# 测试 SSH 连接
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

### 1.2 创建 .gitignore

确保敏感信息不被提交到 Git:

```bash
# 查看 .gitignore 文件
cat .gitignore
```

应该包含:
- `*.pem` (SSH 密钥)
- `.env.local` (本地环境变量)
- `.env.production` (生产环境变量)
- `node_modules/`
- `directus/uploads/` (上传文件)
- `meilisearch/data/` (搜索数据)

### 1.3 创建 GitHub 私有仓库

```bash
# 方法 1: 使用 GitHub CLI (如果已安装)
gh repo create playnew-0.3 --private --source=. --remote=origin --push

# 方法 2: 手动创建
# 1. 访问 https://github.com/new
# 2. 创建私有仓库 "playnew-0.3"
# 3. 不要初始化任何文件
# 4. 执行以下命令:

git init
git add .
git commit -m "Initial commit: PlayNew 0.3 platform"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/playnew-0.3.git
git push -u origin main
```

---

## 🖥️ 第二阶段: 服务器初始化

### 2.1 连接到服务器

```bash
# 在本地 Mac 终端执行
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

### 2.2 更新系统

```bash
# 以下命令在服务器上执行

sudo apt update
sudo apt upgrade -y
```

### 2.3 安装 Docker

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加用户到 docker 组
sudo usermod -aG docker ubuntu

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version

# 重新登录以使组权限生效
exit
# 重新 SSH 连接
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

### 2.4 安装 Nginx

```bash
sudo apt install nginx -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 2.5 安装其他工具

```bash
# Git
sudo apt install git -y

# Node.js (用于运行一些脚本)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 验证
node --version
npm --version
```

### 2.6 配置 SSH 密钥访问 GitHub

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "server@playnew.ai" -f ~/.ssh/id_ed25519 -N ""

# 显示公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出的公钥,然后:
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥
# 4. 保存

# 测试连接
ssh -T git@github.com
```

### 2.7 创建项目目录

```bash
# 创建部署目录
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

# 克隆仓库
git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew

# 进入项目
cd playnew
```

---

## ⚙️ 第三阶段: 配置环境变量

### 3.1 生成安全密钥

```bash
# 在服务器上执行

# 生成 Directus 密钥
echo "DIRECTUS_KEY=$(openssl rand -base64 32)"
echo "DIRECTUS_SECRET=$(openssl rand -base64 32)"

# 生成 Meilisearch 密钥
echo "MEILISEARCH_MASTER_KEY=$(openssl rand -base64 32)"
```

记下这些密钥!

### 3.2 创建生产环境配置

在服务器上创建 `.env.production`:

```bash
cd /var/www/playnew

# 创建主配置文件
nano .env.production
```

填入以下内容 (替换所有 `<YOUR_*>` 占位符):

```env
# ============================================================
# PlayNew 0.3 - Production Environment
# ============================================================

NODE_ENV=production

# ============================================================
# Directus Configuration
# ============================================================
DIRECTUS_KEY=<刚才生成的 KEY>
DIRECTUS_SECRET=<刚才生成的 SECRET>
DIRECTUS_URL=http://directus:8055
DIRECTUS_ADMIN_EMAIL=the_uk1@outlook.com
DIRECTUS_ADMIN_PASSWORD=<你的安全密码>

# ============================================================
# Database (Supabase)
# ============================================================
DB_CLIENT=pg
DB_CONNECTION_STRING=postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# ============================================================
# Meilisearch
# ============================================================
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_MASTER_KEY=<刚才生成的 MEILISEARCH KEY>

# ============================================================
# Public URLs
# ============================================================
PUBLIC_URL=http://13.158.222.72
CORS_ORIGIN=http://13.158.222.72

# ============================================================
# Security
# ============================================================
RATE_LIMITER_ENABLED=true
RATE_LIMITER_POINTS=50
RATE_LIMITER_DURATION=1
```

创建前端配置:

```bash
# 创建前端环境变量
nano frontend/.env.production
```

填入:

```env
# ============================================================
# PlayNew Frontend - Production Environment
# ============================================================

NODE_ENV=production

# App URL
NEXT_PUBLIC_APP_URL=http://13.158.222.72

# Directus API
NEXT_PUBLIC_DIRECTUS_URL=http://13.158.222.72:8055
DIRECTUS_URL=http://directus:8055
DIRECTUS_ADMIN_TOKEN=<从 Directus 后台获取>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cujpgrzjmmttysphjknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTQ4OTMsImV4cCI6MjA3NTU3MDg5M30.VMYdC0L1hy1t3PcshovQvpbkmaCim6zf-hAjC1wn4gQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY

# Meilisearch
NEXT_PUBLIC_MEILISEARCH_HOST=http://13.158.222.72:7700
MEILISEARCH_MASTER_KEY=<与上面相同的 MEILISEARCH KEY>

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=5d114e4b59320fb14eb49e965c43bde8

# Stripe (生产密钥!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<你的生产公钥>
STRIPE_SECRET_KEY=<你的生产密钥>
STRIPE_WEBHOOK_SECRET=<你的 webhook 密钥>

# AI APIs
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Tawk.to
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=69048425b22c021953b686f5
NEXT_PUBLIC_TAWKTO_WIDGET_ID=1j8sq8cov

# CryptoCloud
CRYPTOCLOUD_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiTnprMU9UQT0iLCJ0eXBlIjoicHJvamVjdCIsInYiOiJjZjU1Njg0NDM3ZmU5YTllYzQ4ZGRiYjQ5NTc2OTYxYjkzNTI0ZDg1YzgxZjA4Mzk1ZTUxNjM0MTM1MDJiNGJmIiwiZXhwIjo4ODE2MzgyMDI5NX0.TcIq1qQJOBq7t2_6wXxwa-z1WTmqCJC49L86WMs8d8g
CRYPTOCLOUD_SHOP_ID=bRuvIKfoGx73MfIh
CRYPTOCLOUD_SECRET=ngyifYlOrUd2XR6NuY72xQtTvjtHMC7jJFB3
```

---

## 🐳 第四阶段: Docker 部署

### 4.1 创建生产 Docker Compose 配置

在服务器上创建 `docker-compose.prod.yml`:

```bash
cd /var/www/playnew
nano docker-compose.prod.yml
```

内容详见下面的配置文件。

### 4.2 构建和启动服务

```bash
# 拉取最新代码
git pull origin main

# 启动所有服务
docker compose -f docker-compose.prod.yml up -d

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 检查服务状态
docker compose -f docker-compose.prod.yml ps
```

### 4.3 等待服务启动

```bash
# 等待 Directus 初始化 (约 1-2 分钟)
docker compose -f docker-compose.prod.yml logs -f directus

# 等待 Frontend 构建 (约 2-3 分钟)
docker compose -f docker-compose.prod.yml logs -f frontend
```

---

## 🌐 第五阶段: Nginx 配置

### 5.1 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/playnew
```

填入以下配置:

```nginx
# PlayNew 0.3 - Nginx Configuration

# 前端
server {
    listen 80;
    server_name 13.158.222.72;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Directus API
server {
    listen 8055;
    server_name 13.158.222.72;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Meilisearch
server {
    listen 7700;
    server_name 13.158.222.72;

    location / {
        proxy_pass http://localhost:7700;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/playnew /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## ✅ 第六阶段: 验证部署

### 6.1 检查服务状态

```bash
# Docker 容器状态
docker compose -f docker-compose.prod.yml ps

# 应该看到所有服务都是 Up 状态
```

### 6.2 测试访问

```bash
# 测试前端
curl http://13.158.222.72

# 测试 Directus
curl http://13.158.222.72:8055/server/health

# 测试 Meilisearch
curl http://13.158.222.72:7700/health
```

在浏览器访问:
- 前端: http://13.158.222.72
- Directus 后台: http://13.158.222.72:8055/admin
- Meilisearch: http://13.158.222.72:7700

---

## 🔄 第七阶段: 持续部署

### 7.1 创建部署脚本

在服务器上创建 `/var/www/playnew/deploy.sh`:

```bash
#!/bin/bash

echo "========================================="
echo "PlayNew 0.3 - 自动部署"
echo "========================================="

# 进入项目目录
cd /var/www/playnew

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 重启服务
echo "🔄 重启 Docker 服务..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查状态
echo "✅ 检查服务状态..."
docker compose -f docker-compose.prod.yml ps

echo "========================================="
echo "部署完成!"
echo "========================================="
```

设置权限:

```bash
chmod +x deploy.sh
```

### 7.2 使用方法

每次更新代码后,在本地:

```bash
# 1. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 2. SSH 到服务器
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72

# 3. 运行部署脚本
cd /var/www/playnew
./deploy.sh
```

---

## 📊 监控和维护

### 查看日志

```bash
# 所有服务日志
docker compose -f docker-compose.prod.yml logs -f

# 特定服务
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f directus

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 重启服务

```bash
# 重启所有
docker compose -f docker-compose.prod.yml restart

# 重启单个
docker compose -f docker-compose.prod.yml restart frontend
```

### 查看资源使用

```bash
# Docker 资源
docker stats

# 系统资源
htop
df -h
free -h
```

---

## 🔒 安全建议

1. **更改默认密码**: 部署后立即更改所有默认密码
2. **配置防火墙**: 只开放必要端口
3. **定期备份**: 备份 Docker volumes
4. **监控日志**: 定期检查异常访问
5. **更新系统**: 定期执行 `sudo apt update && sudo apt upgrade`

---

## 🆘 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker compose -f docker-compose.prod.yml logs <service_name>

# 重建容器
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

### 内存不足

```bash
# 创建 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
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

## 📝 后续优化

1. **配置域名**: 绑定域名并配置 SSL
2. **CDN**: 使用 CloudFlare 加速
3. **数据库优化**: 调整 PostgreSQL 参数
4. **缓存**: 配置 Redis 缓存
5. **监控**: 安装 Prometheus + Grafana

---

## ✨ 完成!

你的 PlayNew 0.3 平台现在已经部署到 AWS Lightsail!

访问: http://13.158.222.72

后续只需:
1. 在本地修改代码
2. `git push origin main`
3. 在服务器执行 `./deploy.sh`