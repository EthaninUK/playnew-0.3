# 🔑 设置永久Directus Token - 图文教程

## 您的永久Token（请复制）：

```
2133b2cb28c65e2e09957765b38738a3fd5c244d430a3fa3502fe51a7e0644f9
```

---

## 📝 设置步骤（5分钟完成）

### 步骤 1: 访问Directus管理后台

在浏览器中打开：
```
http://localhost:8055
```

### 步骤 2: 登录账号

- **Email**: `the_uk1@outlook.com`
- **Password**: `Mygcdjmyxzg2026!`

### 步骤 3: 进入用户管理

1. 点击左侧边栏的 **User Directory** 图标（人形图标）
2. 或者点击 **Settings → Users & Roles → Users**

### 步骤 4: 编辑您的用户

1. 在用户列表中找到 `the_uk1@outlook.com`
2. 点击该用户进入编辑页面

### 步骤 5: 设置Token

1. 向下滚动找到 **"Token"** 字段
2. 粘贴上面生成的token：
   ```
   2133b2cb28c65e2e09957765b38738a3fd5c244d430a3fa3502fe51a7e0644f9
   ```
3. 点击右上角的 **保存按钮**（✓ 图标）

### 步骤 6: 更新环境变量

编辑文件：`/Users/m1/PlayNew_0.3/frontend/.env.local`

找到这一行：
```env
DIRECTUS_ADMIN_TOKEN=eyJhbGciOiJ...（旧的token）
```

替换为：
```env
DIRECTUS_ADMIN_TOKEN=2133b2cb28c65e2e09957765b38738a3fd5c244d430a3fa3502fe51a7e0644f9
```

### 步骤 7: 重启前端服务

在终端执行：
```bash
# 停止当前服务
pkill -f "next-server"

# 重新启动
cd /Users/m1/PlayNew_0.3/frontend
npm run dev
```

---

## ✅ 验证Token是否工作

### 方法1: 使用curl测试

```bash
curl -H "Authorization: Bearer 2133b2cb28c65e2e09957765b38738a3fd5c244d430a3fa3502fe51a7e0644f9" \
  http://localhost:8055/items/user_subscriptions
```

**期望结果**: 返回订阅记录的JSON数据（不是401错误）

### 方法2: 测试支付流程

1. 访问 http://localhost:3000/pricing
2. 选择一个会员套餐
3. 使用测试卡支付: `4242 4242 4242 4242`
4. 支付成功后，访问 http://localhost:3000/membership
5. 应该显示正确的会员等级（不再是Free）

---

## 🎯 这个Token的优势

✅ **永不过期** - 不会像JWT token那样15分钟就失效
✅ **专用于API** - 专门设计用于服务器端调用
✅ **权限完整** - 拥有管理员权限，可以创建/读取订阅记录
✅ **可随时吊销** - 如果泄露，可以在Directus后台清除

---

## ⚠️ 安全提示

1. **不要提交到Git** - .env.local 已在 .gitignore 中
2. **不要分享** - 这个token拥有完整的管理员权限
3. **定期检查** - 确保token没有被滥用

---

## 🐛 如果遇到问题

### 问题1: 保存token后显示错误

**解决**: 确保token格式正确，没有多余的空格或换行

### 问题2: 401 Unauthorized 错误持续出现

**解决**:
1. 检查.env.local中的token是否正确复制
2. 确认已重启前端服务
3. 在Directus中确认token已保存

### 问题3: Webhook仍然失败

**解决**:
1. 检查Next.js服务器日志
2. 确认Stripe webhook endpoint配置正确
3. 测试新的支付确认token有效

---

## 📞 完成后的验证清单

- [ ] Token已在Directus用户设置中保存
- [ ] .env.local文件已更新
- [ ] 前端服务已重启
- [ ] curl测试返回数据（不是401）
- [ ] 新支付能正确创建订阅记录
- [ ] 会员中心显示正确的会员等级

---

**完成这些步骤后，您的会员系统将正常工作！** 🎉
