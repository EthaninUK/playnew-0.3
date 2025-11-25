# PlayNew 0.3 - 快速部署指南

10分钟快速部署到 AWS Lightsail!

---

## 📋 前提条件

- ✅ AWS Lightsail 服务器已创建 (IP: 13.158.222.72)
- ✅ SSH 密钥已下载 (LightsailDefaultKey-ap-northeast-playnew.pem)
- ✅ GitHub 账号

---

## 🚀 第一步: 本地准备 (在你的 Mac 上)

### 1. 设置 SSH 密钥权限

```bash
cd /Users/m1/PlayNew_0.3
chmod 400 LightsailDefaultKey-ap-northeast-playnew.pem
```

### 2. 测试 SSH 连接

```bash
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

如果成功连接,输入 `exit` 退出。

### 3. 创建 GitHub 仓库

方法一 - 使用 GitHub CLI (推荐):
```bash
gh repo create playnew-0.3 --private --source=. --remote=origin
git add .
git commit -m "Initial commit: PlayNew 0.3"
git push -u origin main
```

方法二 - 手动创建:
1. 访问 https://github.com/new
2. 仓库名: `playnew-0.3`
3. 类型: Private (私有)
4. 不要初始化任何文件
5. 创建后执行:

```bash
git init
git add .
git commit -m "Initial commit: PlayNew 0.3"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/playnew-0.3.git
git push -u origin main
```

---

## 🖥️ 第二步: 服务器设置 (一次性)

### 1. SSH 连接到服务器

```bash
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

### 2. 运行一键安装脚本

复制粘贴以下完整命令 (一次执行):

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 安装其他工具
sudo apt install nginx git -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ 基础环境安装完成!"
```

### 3. 重新登录 (使 Docker 权限生效)

```bash
exit
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

### 4. 配置 GitHub SSH 访问

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "server@playnew.ai" -f ~/.ssh/id_ed25519 -N ""

# 显示公钥
cat ~/.ssh/id_ed25519.pub
```

复制输出的公钥,然后:
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥并保存

测试连接:
```bash
ssh -T git@github.com
# 应该看到: Hi USERNAME! You've successfully authenticated...
```

### 5. 克隆代码

```bash
# 创建目录
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www

# 克隆仓库 (替换 YOUR_USERNAME)
git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew
cd playnew
```

---

## ⚙️ 第三步: 配置环境变量

### 1. 生成安全密钥

```bash
cd /var/www/playnew

# 生成并保存密钥
echo "========== 复制以下密钥 =========="
echo "DIRECTUS_KEY=$(openssl rand -base64 32)"
echo "DIRECTUS_SECRET=$(openssl rand -base64 32)"
echo "MEILISEARCH_MASTER_KEY=$(openssl rand -base64 32)"
echo "================================="
```

记下这些密钥!

### 2. 创建环境配置

```bash
# 复制模板
cp .env.production.example .env.production
cp frontend/.env.production.example frontend/.env.production
```

### 3. 编辑主配置

```bash
nano .env.production
```

最少需要修改:
- `DIRECTUS_KEY`: 刚才生成的
- `DIRECTUS_SECRET`: 刚才生成的
- `DIRECTUS_ADMIN_PASSWORD`: 设置一个强密码
- `MEILISEARCH_MASTER_KEY`: 刚才生成的
- `PUBLIC_URL`: `http://13.158.222.72`
- `CORS_ORIGIN`: `http://13.158.222.72`
- `DB_CONNECTION_STRING`: 你的 Supabase 连接字符串

按 `Ctrl+X`, `Y`, `Enter` 保存。

### 4. 编辑前端配置

```bash
nano frontend/.env.production
```

修改:
- `NEXT_PUBLIC_APP_URL`: `http://13.158.222.72`
- `NEXT_PUBLIC_DIRECTUS_URL`: `http://13.158.222.72:8055`
- `NEXT_PUBLIC_MEILISEARCH_HOST`: `http://13.158.222.72:7700`
- `MEILISEARCH_MASTER_KEY`: 与主配置相同
- 其他 API keys (Supabase, Stripe, etc.)

按 `Ctrl+X`, `Y`, `Enter` 保存。

---

## 🐳 第四步: 启动服务

```bash
cd /var/www/playnew

# 启动所有服务
docker compose -f docker-compose.prod.yml up -d

# 查看启动日志
docker compose -f docker-compose.prod.yml logs -f
```

等待 2-3 分钟,直到看到 "Server started" 等消息。
按 `Ctrl+C` 退出日志查看。

---

## ✅ 第五步: 验证部署

### 1. 检查服务状态

```bash
docker compose -f docker-compose.prod.yml ps
```

所有服务应该显示 "Up" 状态。

### 2. 测试访问

在浏览器访问:

- ✅ **前端**: http://13.158.222.72
- ✅ **Directus 后台**: http://13.158.222.72:8055/admin
- ✅ **Meilisearch**: http://13.158.222.72:7700

### 3. 登录 Directus

1. 访问 http://13.158.222.72:8055/admin
2. 用户名: the_uk1@outlook.com (或你设置的)
3. 密码: 你在配置中设置的密码

---

## 🔄 后续更新流程

### 在本地修改代码后:

```bash
# 1. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 2. SSH 到服务器
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72

# 3. 进入项目并部署
cd /var/www/playnew
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# 或者使用自动部署脚本
./deploy.sh
```

---

## 🆘 常见问题

### 服务无法启动?

```bash
# 查看详细日志
docker compose -f docker-compose.prod.yml logs directus
docker compose -f docker-compose.prod.yml logs frontend

# 重启服务
docker compose -f docker-compose.prod.yml restart
```

### 端口被占用?

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :8055

# 停止所有容器
docker compose -f docker-compose.prod.yml down
```

### 内存不足?

```bash
# 创建 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 忘记 Directus 密码?

在服务器上:
```bash
cd /var/www/playnew
cat .env.production | grep ADMIN_PASSWORD
```

---

## 📝 下一步

部署成功后,你可以:

1. **绑定域名**: 修改配置中的 URL 为域名
2. **配置 SSL**: 使用 Let's Encrypt 免费证书
3. **设置备份**: 定期备份 Docker volumes
4. **监控**: 安装监控工具
5. **优化**: 配置 CDN, 缓存等

详细说明请查看: [AWS-LIGHTSAIL-DEPLOYMENT.md](./AWS-LIGHTSAIL-DEPLOYMENT.md)

---

## ✨ 完成!

你的 PlayNew 0.3 平台现在已经运行在 AWS Lightsail!

访问: http://13.158.222.72

遇到问题? 查看完整文档: [AWS-LIGHTSAIL-DEPLOYMENT.md](./AWS-LIGHTSAIL-DEPLOYMENT.md)
