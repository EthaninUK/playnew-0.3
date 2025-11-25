# PlayNew 0.3 - 部署方案总结

完整的 AWS Lightsail 部署方案已准备就绪!

---

## 📚 文档结构

### 主要文档

1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐ 推荐先看
   - 10分钟快速部署指南
   - 适合初次部署
   - 包含所有必要步骤

2. **[AWS-LIGHTSAIL-DEPLOYMENT.md](./AWS-LIGHTSAIL-DEPLOYMENT.md)**
   - 完整的部署文档
   - 详细的技术说明
   - 故障排查指南

3. **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)**
   - 部署前/后检查清单
   - 确保不遗漏任何步骤
   - 维护计划

---

## 📝 配置文件

### 环境变量模板
- `.env.production.example` - 主服务配置模板
- `frontend/.env.production.example` - 前端配置模板

**使用方法**:
```bash
# 在服务器上
cp .env.production.example .env.production
cp frontend/.env.production.example frontend/.env.production

# 然后编辑填入真实值
nano .env.production
nano frontend/.env.production
```

### Docker 配置
- `docker-compose.prod.yml` - 生产环境 Docker Compose 配置
- `frontend/Dockerfile.prod` - 前端生产镜像构建文件

---

## 🛠️ 脚本工具

### 1. 服务器连接
```bash
./connect.sh
```
快速 SSH 连接到服务器

### 2. 服务器初始化
```bash
# 在服务器上执行
sudo bash server-init.sh
```
一键安装所有必要软件:
- Docker & Docker Compose
- Nginx
- Git
- 创建 Swap
- 配置防火墙

### 3. 部署脚本
```bash
# 在服务器上执行
./deploy.sh
```
自动化部署流程:
- 拉取最新代码
- 备份数据
- 重建服务
- 健康检查

---

## 🚀 快速开始

### 第一次部署

1. **在本地 Mac**:
   ```bash
   cd /Users/m1/PlayNew_0.3
   
   # 测试 SSH 连接
   ./connect.sh
   
   # 创建 GitHub 仓库并推送代码
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create playnew-0.3 --private --source=. --remote=origin
   git push -u origin main
   ```

2. **在服务器上**:
   ```bash
   # 初始化服务器 (只需一次)
   sudo bash server-init.sh
   
   # 配置 GitHub SSH
   ssh-keygen -t ed25519 -C "server@playnew.ai"
   cat ~/.ssh/id_ed25519.pub
   # 添加到 GitHub: https://github.com/settings/keys
   
   # 克隆代码
   cd /var/www
   git clone git@github.com:YOUR_USERNAME/playnew-0.3.git playnew
   cd playnew
   
   # 配置环境变量
   cp .env.production.example .env.production
   cp frontend/.env.production.example frontend/.env.production
   nano .env.production  # 填入配置
   nano frontend/.env.production  # 填入配置
   
   # 启动服务
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **验证**:
   - 前端: http://13.158.222.72
   - Directus: http://13.158.222.72:8055/admin
   - Meilisearch: http://13.158.222.72:7700/health

### 后续更新

1. **在本地**:
   ```bash
   git add .
   git commit -m "feat: 新功能"
   git push
   ```

2. **在服务器**:
   ```bash
   cd /var/www/playnew
   ./deploy.sh
   ```

---

## 🏗️ 架构说明

```
AWS Lightsail (13.158.222.72)
├── Nginx (80, 443) - 反向代理
├── Docker 容器
│   ├── Frontend (3000) - Next.js
│   ├── Directus (8055) - CMS/API
│   ├── Meilisearch (7700) - 搜索
│   └── n8n (5678) - 自动化
└── 外部服务
    └── Supabase - PostgreSQL 数据库
```

---

## 📦 已配置的服务

### Frontend (Next.js)
- 端口: 3000
- 构建: Docker 多阶段构建
- 优化: Standalone 输出
- 环境: 生产模式

### Directus
- 端口: 8055
- 数据库: Supabase PostgreSQL
- 存储: 本地文件系统
- 缓存: 内存缓存

### Meilisearch
- 端口: 7700
- 数据: 持久化存储
- 模式: 生产模式

### n8n (可选)
- 端口: 5678
- 认证: Basic Auth
- 用途: 数据采集自动化

---

## 🔐 安全配置

已实施的安全措施:

1. **环境变量隔离**
   - 敏感信息不提交到 Git
   - 使用 .gitignore 保护

2. **SSH 密钥管理**
   - 密钥文件权限 400
   - 不提交到版本控制

3. **Docker 安全**
   - 非 root 用户运行
   - 只暴露必要端口到 localhost

4. **访问控制**
   - Rate limiting
   - CORS 配置
   - Basic Auth (n8n)

5. **密钥安全**
   - 随机生成强密钥
   - 定期更换密码

---

## 📊 资源要求

### 最低配置
- CPU: 2 vCPU
- RAM: 4 GB (已配置 2GB swap)
- 存储: 60 GB SSD
- 带宽: 无限制

### 当前配置
- 服务器: AWS Lightsail
- 区域: ap-northeast-1 (东京)
- IP: 13.158.222.72
- OS: Ubuntu

---

## 🔧 常用命令

### 服务管理
```bash
# 查看服务状态
docker compose -f docker-compose.prod.yml ps

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 重启服务
docker compose -f docker-compose.prod.yml restart

# 停止服务
docker compose -f docker-compose.prod.yml down

# 启动服务
docker compose -f docker-compose.prod.yml up -d
```

### 资源监控
```bash
# Docker 资源使用
docker stats

# 系统资源
htop
free -h
df -h
```

### 日志查看
```bash
# 特定服务日志
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs directus

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📈 后续优化

部署成功后可以考虑:

### 短期 (1-2周)
- [ ] 绑定自定义域名
- [ ] 配置 SSL 证书
- [ ] 设置自动备份

### 中期 (1个月)
- [ ] 配置 CDN (CloudFlare)
- [ ] 启用 Redis 缓存
- [ ] 设置监控告警

### 长期
- [ ] 数据库优化
- [ ] 负载均衡
- [ ] 自动扩展
- [ ] CI/CD 集成

---

## 🆘 获取帮助

### 文档
1. 查看 [QUICKSTART.md](./QUICKSTART.md) - 快速开始
2. 查看 [AWS-LIGHTSAIL-DEPLOYMENT.md](./AWS-LIGHTSAIL-DEPLOYMENT.md) - 详细文档
3. 查看 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - 检查清单

### 日志
```bash
# 查看所有日志
docker compose -f docker-compose.prod.yml logs

# 查看特定服务
docker compose -f docker-compose.prod.yml logs [service_name]
```

### 常见问题
参考 [AWS-LIGHTSAIL-DEPLOYMENT.md](./AWS-LIGHTSAIL-DEPLOYMENT.md) 的"故障排查"部分

---

## ✅ 部署完成后

访问以下 URL 验证:

- ✅ **前端**: http://13.158.222.72
- ✅ **Directus 后台**: http://13.158.222.72:8055/admin
- ✅ **Meilisearch**: http://13.158.222.72:7700/health

登录 Directus:
- 用户名: the_uk1@outlook.com
- 密码: (你在配置中设置的)

---

## 🎉 完成!

你的 PlayNew 0.3 平台部署方案已经全部准备好了!

### 下一步:
1. 阅读 [QUICKSTART.md](./QUICKSTART.md)
2. 执行部署步骤
3. 使用 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) 验证

祝部署顺利! 🚀
