# 🚀 PlayNew 0.3 快速部署指南

最精简的部署步骤,适合快速上线。

---

## ⚡ 5 分钟快速部署

### 步骤 1: 推送代码到 GitHub (本地执行)

```bash
# 1. 初始化 Git
cd /Users/m1/PlayNew_0.3
git init
git add .
git commit -m "Initial commit: PlayNew 0.3 ready for production"

# 2. 在 GitHub 创建私有仓库
# 访问: https://github.com/new
# 仓库名: playnew-0.3
# 设置为 Private (私有)

# 3. 推送代码
git remote add origin git@github.com:YOUR_USERNAME/playnew-0.3.git
git branch -M main
git push -u origin main
```

---

### 步骤 2: 配置域名 DNS

登录域名管理面板,添加 A 记录:

```
@ -> 13.158.222.72
www -> 13.158.222.72
api -> 13.158.222.72
search -> 13.158.222.72
n8n -> 13.158.222.72
```

---

### 步骤 3: 服务器一键初始化

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
```

---

### 步骤 4: 配置环境变量

```bash
# 生成密钥
openssl rand -base64 32  # DIRECTUS_KEY
openssl rand -base64 32  # DIRECTUS_SECRET
openssl rand -base64 32  # MEILISEARCH_MASTER_KEY

# 创建配置文件
cp .env.production.example .env.production
nano .env.production  # 填入密钥

cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production  # 更新配置
```

**必须修改的配置:**
- `DIRECTUS_KEY`, `DIRECTUS_SECRET`, `MEILISEARCH_MASTER_KEY`
- Stripe 改为生产密钥 (不是测试密钥!)
- 其他 API keys

---

### 步骤 5: 获取 SSL 证书

```bash
sudo systemctl stop nginx

sudo certbot certonly --standalone -d playnew.ai -d www.playnew.ai
sudo certbot certonly --standalone -d api.playnew.ai
sudo certbot certonly --standalone -d search.playnew.ai
sudo certbot certonly --standalone -d n8n.playnew.ai

sudo systemctl start nginx
```

---

### 步骤 6: 部署!

```bash
# 配置 Nginx
sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload

# 运行部署脚本
./deploy.sh
```

等待 2-3 分钟,完成!

访问: https://playnew.ai

---

## 🔄 配置自动部署

在 GitHub 仓库 Settings > Secrets 添加:

- `SSH_HOST`: `13.158.222.72`
- `SSH_USER`: `ubuntu`
- `SSH_PRIVATE_KEY`: 你的私钥

完成后,每次 `git push` 都会自动部署!

---

## 📝 常用命令

```bash
# 查看状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 重启
./deploy.sh

# 停止
docker-compose -f docker-compose.prod.yml down
```

---

完整文档: [DEPLOYMENT.md](./DEPLOYMENT.md)
