# CI/CD 自动化部署设置指南

## 📋 目录
- [概述](#概述)
- [当前运维模式对比](#当前运维模式对比)
- [完整的 Git CI/CD 设置](#完整的-git-cicd-设置)
- [GitHub Secrets 配置](#github-secrets-配置)
- [使用方法](#使用方法)
- [回滚方案](#回滚方案)

---

## 概述

PlayNew 0.3 已经配置好完整的 Git + CI/CD 自动化部署系统。

### 架构图

```
┌─────────────────┐
│   本地开发环境   │
│                 │
│  - 修改代码      │
│  - 运行测试      │
│  - Git commit   │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│   GitHub        │
│                 │
│  - 代码托管      │
│  - Actions CI/CD│
│  - 版本控制      │
└────────┬────────┘
         │ SSH deploy
         ▼
┌─────────────────┐
│  AWS 服务器      │
│                 │
│  - Git pull     │
│  - 自动构建      │
│  - PM2 reload   │
│  - Health check │
└─────────────────┘
```

---

## 当前运维模式对比

### ❌ 旧模式 (手动部署)

```bash
# 问题重重的手动流程
本地修改代码
  ↓
手动 scp 上传单个文件
  ↓
SSH 登录服务器
  ↓
手动执行命令
  ↓
祈祷没有出错 🙏
```

**缺点:**
- ❌ 容易漏传文件
- ❌ 没有版本控制
- ❌ 无法回滚
- ❌ 团队协作困难
- ❌ 部署不一致
- ❌ 人工错误率高

### ✅ 新模式 (自动化 CI/CD)

```bash
# 优雅的自动化流程
git add .
git commit -m "feat: add new feature"
git push origin main
  ↓
☕️ 喝杯咖啡,自动部署完成!
```

**优点:**
- ✅ 完整的版本控制
- ✅ 自动化测试
- ✅ 一键回滚
- ✅ 团队协作友好
- ✅ 部署记录完整
- ✅ 零人工错误

---

## 完整的 Git CI/CD 设置

### 1. 初始化服务器 Git 仓库

```bash
# 在服务器上
cd /var/www/playnew
git init
git remote add origin https://github.com/yourusername/PlayNew_0.3.git
git fetch origin
git branch --set-upstream-to=origin/main main
```

### 2. 部署脚本

项目中已包含两个部署脚本:

#### `deploy-pm2.sh` (当前使用 - PM2 前端)
- 适用于: 前端用 PM2,后端用 Docker
- 特点: 快速构建,零停机部署
- 使用场景: 日常代码更新

#### `deploy.sh` (全 Docker 方案)
- 适用于: 全部服务用 Docker
- 特点: 环境一致性强
- 使用场景: 大版本升级

### 3. GitHub Actions Workflow

已配置文件: `.github/workflows/deploy.yml`

**触发条件:**
- Push 到 `main` 分支
- 手动触发 (workflow_dispatch)

**执行流程:**
1. Checkout 代码
2. SSH 连接服务器
3. 执行部署脚本
4. 健康检查
5. 通知结果

---

## GitHub Secrets 配置

在 GitHub 仓库设置中添加以下 Secrets:

### 必需的 Secrets

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SSH_HOST` | 服务器 IP 地址 | `13.158.222.72` |
| `SSH_USER` | SSH 用户名 | `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN RSA PRIVATE KEY-----\n...` |

### 如何添加 Secrets

1. 打开 GitHub 仓库
2. **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加上述三个 secrets

### 获取 SSH 私钥

```bash
# 在本地
cat /Users/m1/PlayNew_0.3/LightsailDefaultKey-ap-northeast-1\ \(2\).pem
```

复制完整内容(包括 BEGIN 和 END 行)粘贴到 `SSH_PRIVATE_KEY`。

---

## 使用方法

### 方法 1: 自动部署 (推荐)

```bash
# 本地开发
git add .
git commit -m "feat: add payment integration"
git push origin main

# 🎉 自动触发部署!
# 查看部署进度: GitHub → Actions 标签
```

### 方法 2: 手动触发部署

1. GitHub 仓库 → **Actions** 标签
2. 选择 **Deploy to Production** workflow
3. 点击 **Run workflow**
4. 选择分支 (通常是 `main`)
5. 点击绿色的 **Run workflow** 按钮

### 方法 3: 服务器上手动部署

```bash
# SSH 到服务器
ssh -i "LightsailDefaultKey-ap-northeast-1 (2).pem" ubuntu@13.158.222.72

# 进入项目目录
cd /var/www/playnew

# 拉取最新代码
git pull origin main

# 运行部署脚本
chmod +x deploy-pm2.sh
./deploy-pm2.sh
```

---

## 回滚方案

### 快速回滚到上一个版本

```bash
# SSH 到服务器
ssh -i "key.pem" ubuntu@13.158.222.72

cd /var/www/playnew

# 查看最近的提交
git log --oneline -5

# 回滚到上一个提交
git reset --hard HEAD~1

# 重新部署
./deploy-pm2.sh
```

### 回滚到特定版本

```bash
# 查找要回滚的 commit hash
git log --oneline

# 回滚到指定 commit
git reset --hard <commit-hash>

# 例如:
git reset --hard 6a71686

# 重新部署
./deploy-pm2.sh
```

---

## 监控和日志

### 查看部署日志

```bash
# 前端日志 (PM2)
pm2 logs playnew-frontend

# 后端日志 (Docker)
docker-compose -f docker-compose.prod.yml logs -f directus
docker-compose -f docker-compose.prod.yml logs -f meilisearch
docker-compose -f docker-compose.prod.yml logs -f n8n
```

### 查看服务状态

```bash
# PM2 状态
pm2 status

# Docker 状态
docker-compose -f docker-compose.prod.yml ps

# 组合命令
./deploy-pm2.sh status  # (如果添加了 status 参数)
```

---

## 故障排查

### 部署失败

1. **检查 GitHub Actions 日志**
   - GitHub → Actions → 选择失败的 workflow → 查看详细日志

2. **SSH 连接失败**
   - 确认 SSH_HOST, SSH_USER, SSH_PRIVATE_KEY 设置正确
   - 确认服务器防火墙允许 SSH (端口 22)

3. **构建失败**
   - 查看构建日志: `pm2 logs playnew-frontend --lines 100`
   - 检查环境变量配置

4. **服务无法访问**
   - 检查 Nginx 配置: `sudo nginx -t`
   - 检查 SSL 证书: `sudo certbot certificates`
   - 检查防火墙: `sudo ufw status`

### 常见问题

#### Q: 如何测试部署脚本而不影响生产环境?

A: 创建 `staging` 分支,配置单独的 GitHub Actions workflow

#### Q: 如何添加自动测试?

A: 在 `.github/workflows/deploy.yml` 中添加测试步骤:

```yaml
- name: Run tests
  run: |
    cd frontend
    npm test
```

#### Q: 如何配置通知?

A: 使用 Slack/Discord/Email 通知 Actions:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 最佳实践

### 1. 分支策略

```
main (生产环境)
  ↑
develop (开发环境)
  ↑
feature/* (功能分支)
```

### 2. Commit 规范

```bash
# 功能
git commit -m "feat: add user authentication"

# 修复
git commit -m "fix: resolve payment gateway timeout"

# 文档
git commit -m "docs: update API documentation"

# 样式
git commit -m "style: format code"

# 重构
git commit -m "refactor: optimize database queries"
```

### 3. 部署前检查清单

- [ ] 代码已通过本地测试
- [ ] 环境变量已更新
- [ ] 数据库迁移已准备
- [ ] 回滚计划已制定
- [ ] 团队已通知

---

## 总结

现在您有了一个完整的 Git + CI/CD 自动化部署系统:

✅ **版本控制**: 完整的 Git 历史记录
✅ **自动部署**: Push 代码即自动部署
✅ **零停机**: PM2 reload 保证服务连续性
✅ **健康检查**: 自动验证服务状态
✅ **一键回滚**: 快速恢复到任何版本
✅ **团队协作**: GitHub PR review workflow

**下一步:**
1. 完成 GitHub Secrets 配置
2. Push 代码触发首次自动部署
3. 查看 GitHub Actions 部署进度
4. 享受自动化带来的便利! 🎉
