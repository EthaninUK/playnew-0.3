# Tawk.to 客服系统集成指南

Tawk.to 是一个完全免费的在线客服系统,提供实时聊天、消息历史、移动应用等功能。

## 🎯 功能特点

- ✅ **完全免费** - 无限座席、无限聊天、无隐藏费用
- ✅ **实时聊天** - 与访客进行实时对话
- ✅ **消息历史** - 保存所有聊天记录
- ✅ **移动应用** - iOS 和 Android 客服端
- ✅ **自动触发** - 根据访客行为自动发送消息
- ✅ **访客监控** - 实时查看网站访客
- ✅ **多语言支持** - 支持中文界面
- ✅ **自定义外观** - 可自定义聊天窗口颜色和位置

## 📋 设置步骤

### 1. 注册 Tawk.to 账号

访问 [https://tawk.to](https://tawk.to) 注册一个免费账号。

### 2. 创建 Property (网站)

1. 登录后,点击 **"Add Property"**
2. 输入网站名称: `PlayNew.ai`
3. 输入网站地址: `https://playnew.ai` (或 `http://localhost:3000` 用于测试)
4. 点击 **"Create Property"**

### 3. 获取 Property ID 和 Widget ID

1. 在 Tawk.to 控制台,点击 **Administration** (左下角齿轮图标)
2. 选择 **Channels** > **Chat Widget**
3. 你会看到一段嵌入代码,格式如下:

```html
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

4. 从 URL 中提取 ID:
   - `YOUR_PROPERTY_ID` - Property ID (例如: `5f8a1b2c3d4e5f6g7h8i9j0k`)
   - `YOUR_WIDGET_ID` - Widget ID (例如: `default` 或 `1a2b3c4d5e6f7g8h`)

### 4. 配置环境变量

编辑 `frontend/.env.local` 文件,填入你的 ID:

```bash
# Tawk.to Configuration (Customer Support)
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=你的_PROPERTY_ID
NEXT_PUBLIC_TAWKTO_WIDGET_ID=你的_WIDGET_ID
```

### 5. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
cd frontend
npm run dev
```

### 6. 验证集成

1. 访问 [http://localhost:3000](http://localhost:3000)
2. 你应该在页面右下角看到 Tawk.to 聊天按钮
3. 点击按钮打开聊天窗口
4. 在 Tawk.to 控制台的 **Dashboard** 中,你可以看到访客并回复消息

## 🎨 自定义外观

### 在 Tawk.to 控制台自定义

1. 进入 **Administration** > **Channels** > **Chat Widget**
2. 点击 **Customize Chat Widget**
3. 可以自定义:
   - **颜色** - 主题色、按钮颜色
   - **位置** - 左下角或右下角
   - **大小** - 聊天窗口大小
   - **欢迎消息** - 自动发送的欢迎语
   - **离线表单** - 当客服不在线时显示的表单

### 推荐设置

```
主题色: #8B5CF6 (紫色,匹配网站风格)
位置: 右下角
欢迎消息: "欢迎来到 PlayNew.ai! 有什么可以帮助您的吗? 🚀"
```

## 💡 高级功能

### 使用辅助函数

在代码中可以使用辅助函数控制聊天窗口:

```typescript
import { tawkToHelpers } from '@/components/TawkToWidget';

// 打开聊天窗口
tawkToHelpers.maximize();

// 最小化聊天窗口
tawkToHelpers.minimize();

// 切换聊天窗口
tawkToHelpers.toggle();

// 隐藏聊天按钮
tawkToHelpers.hideWidget();

// 显示聊天按钮
tawkToHelpers.showWidget();

// 设置访客信息
tawkToHelpers.setAttributes({
  name: '用户名',
  email: 'user@example.com',
});

// 添加标签
tawkToHelpers.addTag('VIP用户');

// 记录事件
tawkToHelpers.addEvent('查看了价格页面', {
  plan: 'premium',
  price: 99,
});
```

### 集成用户信息

如果你的网站有用户系统,可以在用户登录后同步信息到 Tawk.to:

```typescript
// 在用户登录后
useEffect(() => {
  if (user) {
    tawkToHelpers.setAttributes({
      name: user.name,
      email: user.email,
    });

    // 为付费用户添加标签
    if (user.isPremium) {
      tawkToHelpers.addTag('Premium会员');
    }
  }
}, [user]);
```

## 📱 移动应用

Tawk.to 提供免费的移动应用,客服人员可以随时随地回复消息:

- **iOS**: [App Store](https://apps.apple.com/app/tawk-to/id684727241)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=com.tawk.app)

## 🔔 通知设置

1. 在 Tawk.to 控制台,进入 **Your Profile** (右上角头像)
2. 选择 **Notifications**
3. 配置:
   - 桌面通知
   - 邮件通知
   - 移动推送通知

## 📊 监控与分析

Tawk.to 提供丰富的分析数据:

1. 进入 **Monitoring** > **Dashboard**
2. 查看:
   - 实时访客数量
   - 聊天数量统计
   - 响应时间
   - 客服评分
   - 访客地理位置

## 🛠️ 故障排除

### 聊天按钮不显示

1. 检查环境变量是否正确配置
2. 检查浏览器控制台是否有错误
3. 确认网站域名已添加到 Tawk.to Property 的白名单中
4. 清除浏览器缓存后重试

### 控制台显示 "Property ID or Widget ID not configured"

这说明环境变量未正确配置,请检查 `.env.local` 文件。

### 在生产环境中使用

1. 更新 `.env.production` 或生产环境的环境变量
2. 确保生产域名已添加到 Tawk.to Property 中
3. 测试确认聊天功能正常工作

## 📚 更多资源

- [Tawk.to 官方文档](https://www.tawk.to/knowledgebase/)
- [JavaScript API 文档](https://developer.tawk.to/jsapi/)
- [Webhook 集成](https://developer.tawk.to/webhooks/)

## 🎉 完成!

现在你的网站已经集成了完全免费的客服系统!访客可以随时与你联系,你可以通过网页、桌面应用或移动应用回复消息。
