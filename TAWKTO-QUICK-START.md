# Tawk.to 快速开始

## ✅ 已完成的集成

Tawk.to 客服系统已经成功集成到 PlayNew.ai 网站中!

### 已添加的文件

1. **组件**: [frontend/components/TawkToWidget.tsx](frontend/components/TawkToWidget.tsx)
   - Tawk.to 客服widget组件
   - 包含辅助函数用于控制聊天窗口

2. **布局**: [frontend/app/layout.tsx](frontend/app/layout.tsx)
   - 已在全局布局中添加 TawkToWidget 组件

3. **环境变量**: [frontend/.env.local](frontend/.env.local)
   - 已添加 Tawk.to 配置变量

## 🚀 快速配置(3分钟)

### 步骤 1: 注册 Tawk.to

1. 访问 https://tawk.to
2. 点击 "Get Started Free" 注册账号
3. 验证邮箱

### 步骤 2: 创建 Property

1. 登录后,会自动创建第一个 Property
2. 输入网站名称: `PlayNew.ai`
3. 输入网站 URL: `http://localhost:3000`

### 步骤 3: 获取 Widget ID

1. 在 Tawk.to 控制台,点击左下角齿轮图标 (Administration)
2. 选择 **Channels** > **Chat Widget**
3. 复制嵌入代码中的 ID

示例代码:
```html
https://embed.tawk.to/67234abc123def456/1hb9c8def
                     ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑   ↑↑↑↑↑↑↑↑↑↑
                     Property ID      Widget ID
```

### 步骤 4: 配置环境变量

编辑 `frontend/.env.local`:

```bash
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=67234abc123def456
NEXT_PUBLIC_TAWKTO_WIDGET_ID=1hb9c8def
```

### 步骤 5: 重启服务器

```bash
# 在终端中按 Ctrl+C 停止服务器
# 然后重新启动
cd frontend
npm run dev
```

### 步骤 6: 测试

1. 访问 http://localhost:3000
2. 你应该在右下角看到聊天按钮 💬
3. 点击打开聊天窗口
4. 在 Tawk.to 控制台可以看到访客并回复

## 🎨 自定义外观

### 在 Tawk.to 控制台:

1. 进入 **Channels** > **Chat Widget**
2. 点击 **Customize Chat Widget**
3. 设置主题色为 `#8B5CF6` (紫色,匹配网站)
4. 设置欢迎消息: "欢迎来到 PlayNew.ai! 有什么可以帮助您的吗? 🚀"
5. 保存更改

## 💡 高级用法

### 在代码中控制聊天窗口

```typescript
import { tawkToHelpers } from '@/components/TawkToWidget';

// 打开聊天窗口
tawkToHelpers.maximize();

// 关闭聊天窗口
tawkToHelpers.minimize();

// 隐藏聊天按钮
tawkToHelpers.hideWidget();

// 显示聊天按钮
tawkToHelpers.showWidget();
```

### 设置访客信息

```typescript
// 在用户登录后
tawkToHelpers.setAttributes({
  name: '用户名',
  email: 'user@example.com',
});
```

### 添加标签

```typescript
// 为VIP用户添加标签
tawkToHelpers.addTag('VIP会员');
```

## 📱 移动应用

下载 Tawk.to 移动应用,随时随地回复消息:

- **iOS**: https://apps.apple.com/app/tawk-to/id684727241
- **Android**: https://play.google.com/store/apps/details?id=com.tawk.app

## 🎯 下一步

1. ✅ 在 Tawk.to 控制台自定义聊天外观
2. ✅ 设置欢迎消息和自动回复
3. ✅ 添加更多客服人员
4. ✅ 配置通知(邮件、推送)
5. ✅ 测试聊天功能

## ❓ 常见问题

**Q: 聊天按钮不显示?**
A: 检查环境变量是否正确配置,重启开发服务器。

**Q: 控制台显示警告?**
A: 如果显示 "Property ID or Widget ID not configured",说明环境变量未配置。

**Q: 如何在生产环境使用?**
A: 更新生产环境的环境变量,确保域名已添加到 Tawk.to Property 中。

## 📚 完整文档

查看 [TAWKTO-SETUP-GUIDE.md](TAWKTO-SETUP-GUIDE.md) 获取详细文档。

---

**提示**: Tawk.to 完全免费,无限座席,无隐藏费用! 🎉
