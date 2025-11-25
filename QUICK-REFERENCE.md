# PlayNew 0.3 - 快速参考卡

部署和维护的常用命令速查表。

---

## 🔌 连接服务器

```bash
# 本地 Mac - 快速连接
cd /Users/m1/PlayNew_0.3
./connect.sh

# 或完整命令
ssh -i LightsailDefaultKey-ap-northeast-playnew.pem ubuntu@13.158.222.72
```

---

## 🚀 部署相关

### 首次部署
```bash
# 在服务器上
sudo bash server-init.sh          # 初始化服务器
docker compose -f docker-compose.prod.yml up -d  # 启动服务
```

### 更新部署
```bash
# 方法1: 使用部署脚本 (推荐)
./deploy.sh

# 方法2: 手动步骤
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📦 Docker 管理

### 服务控制
```bash
cd /var/www/playnew

# 启动所有服务
docker compose -f docker-compose.prod.yml up -d

# 停止所有服务
docker compose -f docker-compose.prod.yml down

# 重启服务
docker compose -f docker-compose.prod.yml restart

# 重启特定服务
docker compose -f docker-compose.prod.yml restart frontend
docker compose -f docker-compose.prod.yml restart directus
```

### 查看状态
```bash
# 查看运行状态
docker compose -f docker-compose.prod.yml ps

# 查看资源使用
docker stats

# 查看所有容器
docker ps -a
```

### 日志查看
```bash
# 实时查看所有日志
docker compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs directus
docker compose -f docker-compose.prod.yml logs meilisearch
docker compose -f docker-compose.prod.yml logs n8n

# 查看最后 100 行
docker compose -f docker-compose.prod.yml logs --tail=100
```

### 清理
```bash
# 清理未使用的镜像
docker image prune -f

# 清理所有未使用的资源
docker system prune -a

# 清理 volumes (谨慎!)
docker volume prune
```

---

## 🔍 故障排查

### 服务无法启动
```bash
# 1. 查看详细日志
docker compose -f docker-compose.prod.yml logs [service_name]

# 2. 检查配置
docker compose -f docker-compose.prod.yml config

# 3. 强制重建
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

### 端口占用
```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :8055
sudo lsof -i :7700

# 停止占用进程
sudo kill -9 <PID>
```

### 内存问题
```bash
# 查看内存使用
free -h

# 查看 swap
swapon --show

# 清理 Docker 缓存
docker system prune -a
```

### 磁盘空间
```bash
# 查看磁盘使用
df -h

# 查看大文件
du -sh /var/www/playnew/*

# 清理日志
sudo journalctl --vacuum-time=7d
```

---

## 🔧 系统管理

### 服务管理
```bash
# Nginx
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl stop nginx
sudo systemctl start nginx

# Docker
sudo systemctl status docker
sudo systemctl restart docker
```

### 系统更新
```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 更新 Docker
sudo apt install --only-upgrade docker-ce
```

### 查看资源
```bash
# CPU 和内存
htop

# 磁盘
df -h
du -sh *

# 网络
netstat -tuln
ss -tuln
```

---

## 📝 配置管理

### 环境变量
```bash
# 编辑主配置
nano .env.production

# 编辑前端配置
nano frontend/.env.production

# 查看配置 (不显示密码)
cat .env.production | grep -v PASSWORD
```

### 生成密钥
```bash
# 生成随机密钥
openssl rand -base64 32

# 生成多个
for i in {1..3}; do openssl rand -base64 32; done
```

---

## 🗄️ 数据备份

### 手动备份
```bash
# 创建备份目录
mkdir -p ~/backups

# 备份 Directus 文件
tar -czf ~/backups/directus-$(date +%Y%m%d).tar.gz directus/uploads/

# 备份 Meilisearch
tar -czf ~/backups/meilisearch-$(date +%Y%m%d).tar.gz meilisearch/data/

# 备份环境配置
tar -czf ~/backups/configs-$(date +%Y%m%d).tar.gz .env.production frontend/.env.production
```

### 恢复备份
```bash
# 停止服务
docker compose -f docker-compose.prod.yml down

# 恢复文件
tar -xzf ~/backups/directus-YYYYMMDD.tar.gz

# 启动服务
docker compose -f docker-compose.prod.yml up -d
```

---

## 🌐 网络测试

### 连通性测试
```bash
# 测试前端
curl http://localhost:3000

# 测试 Directus
curl http://localhost:8055/server/health

# 测试 Meilisearch
curl http://localhost:7700/health

# 外部访问测试
curl http://13.158.222.72
```

### DNS 测试
```bash
# 查看 DNS
nslookup playnew.ai

# Ping 测试
ping -c 4 13.158.222.72
```

---

## 📊 性能监控

### 实时监控
```bash
# CPU/内存
htop

# 磁盘 IO
iostat -x 1

# 网络
iftop

# Docker 资源
docker stats
```

### 日志分析
```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -f
```

---

## 🔐 安全相关

### 更改密码
```bash
# 在配置文件中更改
nano .env.production
# 修改 DIRECTUS_ADMIN_PASSWORD

# 重启 Directus
docker compose -f docker-compose.prod.yml restart directus
```

### 防火墙
```bash
# 查看规则
sudo ufw status

# 开放端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 关闭端口
sudo ufw deny 8080/tcp
```

---

## 📱 快速访问

### URL 地址
- 前端: http://13.158.222.72
- Directus: http://13.158.222.72:8055/admin
- Meilisearch: http://13.158.222.72:7700
- n8n: http://13.158.222.72:5678

### 默认登录
- Directus
  - 用户: the_uk1@outlook.com
  - 密码: (配置中设置的)

- n8n
  - 用户: admin
  - 密码: (与 Directus 相同)

---

## 💡 小技巧

### 查看实时日志同时过滤
```bash
docker compose -f docker-compose.prod.yml logs -f | grep ERROR
```

### 一键重启所有服务
```bash
docker compose -f docker-compose.prod.yml restart && \
docker compose -f docker-compose.prod.yml ps
```

### 检查所有服务健康状态
```bash
curl http://localhost:3000 && \
curl http://localhost:8055/server/health && \
curl http://localhost:7700/health && \
echo "所有服务正常!"
```

### 快速查看错误
```bash
docker compose -f docker-compose.prod.yml logs --tail=50 | grep -i error
```

---

## 📞 紧急命令

### 服务崩溃
```bash
# 立即停止所有服务
docker compose -f docker-compose.prod.yml down

# 查看崩溃日志
docker compose -f docker-compose.prod.yml logs --tail=200

# 重启
docker compose -f docker-compose.prod.yml up -d
```

### 系统过载
```bash
# 查看进程
top

# 杀死占用最高的进程
kill -9 <PID>

# 重启 Docker
sudo systemctl restart docker
```

---

保存此文档以便快速查找命令! 🚀
