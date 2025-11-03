# 🚀 GitHub 推送指南

## 问题诊断

无法推送代码到 GitHub,已切换为 HTTPS 方式。

---

## ✅ 推荐方案: Personal Access Token

这是最简单快速的方法!

### 第 1 步: 创建 GitHub 仓库 (如果还没创建)

1. 访问: https://github.com/new
2. 填写信息:
   - **Repository name**: `playnew-0.3`
   - **Description**: PlayNew 0.3 - Crypto Strategies Platform
   - **Visibility**: ⚫ Private (私有)
   - ⚠️ **不要勾选** "Add a README file"
   - ⚠️ **不要勾选** "Add .gitignore"
3. 点击 **"Create repository"**

### 第 2 步: 生成 Personal Access Token

1. 访问: https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息:
   - **Note**: `PlayNew Deployment`
   - **Expiration**: `90 days` (或 `No expiration`)
   - **Select scopes**:
     - ✅ **repo** (勾选完整权限)
4. 点击 **"Generate token"**
5. ⚠️ **立即复制 Token** (只显示一次!)

### 第 3 步: 推送代码

在终端执行:

```bash
cd /Users/m1/PlayNew_0.3
git push -u origin main
```

当提示输入凭证时:
- **Username**: `EthaninUK`
- **Password**: [粘贴刚才复制的 Token]

### 第 4 步: 保存凭证 (避免每次输入)

```bash
git config --global credential.helper store
```

下次推送就不需要再输入了!

---

## 🔐 方案 B: 配置 SSH Key (推荐长期使用)

### 1. 检查是否已有 SSH key

```bash
ls -la ~/.ssh
```

如果看到 `id_rsa` 或 `id_ed25519` 文件,说明已经有了。

### 2. 生成新的 SSH key (如果没有)

```bash
ssh-keygen -t ed25519 -C "the_uk1@outlook.com"
```

一路按回车即可(可以设置密码,也可以留空)。

### 3. 查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出的完整内容(以 `ssh-ed25519` 开头)。

### 4. 添加到 GitHub

1. 访问: https://github.com/settings/keys
2. 点击 **"New SSH key"**
3. 填写:
   - **Title**: `MacBook Pro` (或其他名字)
   - **Key**: [粘贴公钥内容]
4. 点击 **"Add SSH key"**

### 5. 测试 SSH 连接

```bash
ssh -T git@github.com
```

看到 `Hi EthaninUK! You've successfully authenticated` 就成功了!

### 6. 切换为 SSH 并推送

```bash
git remote set-url origin git@github.com:EthaninUK/playnew-0.3.git
git push -u origin main
```

---

## 📝 常见问题

### Q: 忘记保存 Token 了怎么办?
A: 重新生成一个新的 Token,旧的会自动失效。

### Q: Token 过期了怎么办?
A: 在 https://github.com/settings/tokens 重新生成。

### Q: 推送很慢?
A: 第一次推送会上传所有代码,可能需要几分钟。后续推送会很快。

### Q: 提示 "repository not found"?
A: 确认 GitHub 仓库已经创建,且名字完全匹配。

---

## ✅ 验证推送成功

推送成功后,访问:
https://github.com/EthaninUK/playnew-0.3

应该能看到所有代码文件!

---

## 下一步

推送成功后,继续部署流程:
1. 配置域名 DNS
2. 服务器初始化
3. 部署应用

详见: [DEPLOYMENT.md](./DEPLOYMENT.md)
