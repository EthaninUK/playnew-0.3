# 如何在 Directus 中上传和使用图片/视频

## 问题诊断

从你的截图看，Strategies 表中确实有一些字段可以关联媒体文件，但可能字段类型配置不正确。

## 解决方案

### 方案 1：检查和配置 Cover Image 字段

1. **检查字段类型**
   - 进入 Directus 设置 → Data Model → Strategies
   - 找到 `cover_image` 字段
   - 字段类型应该是 **"File"** 或 **"Image"**

2. **如果字段不存在或类型错误，需要重新配置**

### 方案 2：使用 Directus 文件库

#### 步骤 1：上传文件到 Directus

1. 在 Directus 左侧菜单找到 **"File Library"** (文件库) 图标
2. 点击 "+ Upload Files" 按钮
3. 选择你要上传的图片或视频
4. 上传完成后，点击文件可以看到详情

#### 步骤 2：在 Strategies 中引用文件

如果 `cover_image` 字段配置正确：
1. 编辑 Strategy 项目
2. 找到 Cover Image 字段
3. 点击字段，会弹出文件选择器
4. 从文件库中选择已上传的图片

---

## 脚本方式：检查和修复字段配置

让我创建一个脚本来检查当前的字段配置：
