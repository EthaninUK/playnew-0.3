# 多语言支持实现文档

## 概述

PlayNew平台现已支持中英文双语切换功能,用户可以在导航栏右上角通过语言选择器在"马来西亚(中文)"和"English"之间自由切换。

## 实现的功能

### 1. 核心架构

#### 语言上下文 (LanguageContext)
- **文件**: `frontend/contexts/LanguageContext.tsx`
- **功能**:
  - 管理全局语言状态
  - 支持中文(zh)和英文(en)
  - 自动保存语言偏好到 localStorage
  - 动态更新 HTML lang 属性

#### 翻译文件
- **中文翻译**: `frontend/locales/zh.json`
- **英文翻译**: `frontend/locales/en.json`
- **内容**: 包含平台所有常用文本的翻译

### 2. 语言切换器组件

**文件**: `frontend/components/shared/LanguageSwitcher.tsx`

**特点**:
- 显示语言图标 (Languages icon)
- 使用国旗emoji标识 (🇲🇾 马来西亚, 🇬🇧 英国)
- 下拉菜单样式
- 当前语言显示对勾标记
- 响应式设计(移动端自动隐藏文字)

### 3. 已翻译的组件

#### Header组件 (导航栏)
**文件**: `frontend/components/shared/Header.tsx`

**已翻译内容**:
- 导航链接:
  - 首页 / Home
  - 玩法库 / Strategies
  - 快讯 / News
  - 币圈八卦 / Crypto Gossip
  - 套利 / Arbitrage
- 搜索按钮
- 用户菜单:
  - 个人中心 / Profile
  - 我的收藏 / Favorites
  - 设置 / Settings
  - 登出 / Logout
- 登录/注册按钮

#### Footer组件 (页脚)
**文件**: `frontend/components/shared/Footer.tsx`

**已翻译内容**:
- 品牌标语
- 产品导航:
  - 玩法库 / Strategy Library
  - 快讯中心 / News Center
  - 币圈八卦 / Crypto Gossip
  - 会员服务 / Membership
- 资源链接:
  - 使用指南 / User Guide
  - 常见问题 / FAQ
  - 风险提示 / Risk Warning
- 法律信息:
  - 服务条款 / Terms of Service
  - 隐私政策 / Privacy Policy
  - 免责声明 / Disclaimer
- 版权信息
- 风险警告

### 4. 翻译键结构

```json
{
  "common": {
    // 通用文本: 加载中、查看全部、搜索、筛选等
  },
  "nav": {
    // 导航相关: 菜单项、用户操作
  },
  "hero": {
    // 首页英雄区: 标题、副标题、统计数据
  },
  "home": {
    // 首页内容: 卡片、分类、精选、CTA等
  },
  "strategies": {
    // 玩法库: 标题、描述、筛选、排序、详情页
  },
  "news": {
    // 快讯: 标题、描述、筛选、详情页
  },
  "gossip": {
    // 八卦: 标题、描述、筛选
  },
  "arbitrage": {
    // 套利: 标题、描述、筛选
  },
  "auth": {
    // 认证: 登录提示、注册说明
  },
  "footer": {
    // 页脚: 所有页脚相关文本
  },
  "language": {
    // 语言名称
  }
}
```

## 使用方法

### 在组件中使用翻译

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function MyComponent() {
  const { t, locale, setLocale } = useLanguage();

  return (
    <div>
      <h1>{t.home.title}</h1>
      <p>{t.home.description}</p>
      <button onClick={() => setLocale('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

### 添加新的翻译

1. 在 `locales/zh.json` 中添加中文翻译
2. 在 `locales/en.json` 中添加对应的英文翻译
3. 在组件中使用 `t.{key}.{subkey}` 访问

## 技术细节

### 语言持久化
- 使用 `localStorage` 保存用户的语言偏好
- 键名: `locale`
- 值: `'zh'` 或 `'en'`

### 默认语言
- 默认语言: 中文 (`zh`)
- 首次访问时自动加载中文界面

### 响应式设计
- 桌面端: 完整显示语言名称和国旗
- 移动端: 仅显示国旗图标

## 未来扩展

### 待翻译的页面/组件

1. **首页** (`app/page.tsx`)
   - Hero区域的所有文本
   - 统计数据标签
   - 分类卡片
   - CTA按钮

2. **玩法库页面** (`app/strategies/page.tsx`)
   - 页面标题和描述
   - 筛选器标签
   - 排序选项
   - 空状态提示

3. **玩法详情页** (`app/strategies/[slug]/page.tsx`)
   - 详情页所有section标题
   - 按钮文本
   - 标签和徽章

4. **快讯页面** (`app/news/page.tsx`)
   - 页面标题
   - 筛选选项
   - 分类标签

5. **快讯详情页** (`app/news/[slug]/page.tsx`)
   - 元数据标签
   - 操作按钮

6. **认证页面** (`app/auth/*`)
   - 表单标签
   - 验证消息
   - 提示文本

### 扩展步骤

1. 在翻译文件中添加新的键值对
2. 更新组件以使用 `useLanguage()` hook
3. 用翻译键替换硬编码文本
4. 测试两种语言的显示效果

## 测试

### 功能测试清单

- [x] 语言切换器显示正常
- [x] 点击切换器可以切换语言
- [x] 语言偏好保存到 localStorage
- [x] 刷新页面后语言保持不变
- [x] Header 导航栏文本正确翻译
- [x] Footer 页脚文本正确翻译
- [x] 移动端语言切换器正常工作
- [ ] 所有页面的翻译完整性
- [ ] SEO meta标签的翻译
- [ ] 错误消息的翻译

### 访问测试

1. 访问 http://localhost:3001
2. 点击右上角的语言切换器
3. 选择 "English"
4. 验证界面文本变为英文
5. 刷新页面,确认语言保持为英文
6. 切换回中文,验证功能正常

## 性能优化

- 翻译文件在构建时静态导入
- 无需额外的网络请求
- Context API 确保最小的重渲染
- localStorage 提供即时加载

## 浏览器兼容性

- 支持所有现代浏览器
- 需要 localStorage 支持
- 需要 ES6+ 支持

## 维护建议

1. **保持翻译同步**: 每次添加中文内容时,同时添加英文翻译
2. **使用一致的键名**: 遵循现有的命名约定
3. **避免硬编码文本**: 所有用户可见的文本都应该通过翻译系统
4. **定期审查**: 定期检查翻译的准确性和完整性

## 已知问题

目前没有已知问题。

## 更新日志

### 2025-11-12
- ✅ 实现基础语言切换功能
- ✅ 创建中英文翻译文件
- ✅ 实现 Header 组件翻译
- ✅ 实现 Footer 组件翻译
- ✅ 添加语言持久化
- ✅ 扩展翻译文件内容,包含200+翻译键

## 联系方式

如有问题或建议,请联系开发团队。
