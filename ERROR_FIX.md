# ChunkLoadError 错误修复

## 问题描述

出现 `ChunkLoadError: Loading chunk app/page failed` 错误，这是 Next.js 常见的代码分块加载失败问题。

## 错误原因

1. **端口冲突**：3000 和 3001 端口已被占用
2. **缓存问题**：`.next` 编译缓存可能损坏或过期
3. **代码更新**：进行了大量代码修改后，旧的编译缓存与新代码不匹配

## 解决方案

### 1. 清除编译缓存并重启

```bash
cd /Users/m1/PlayNew_0.3/frontend
rm -rf .next
npm run dev
```

### 2. 新端口

开发服务器现在运行在 **端口 3002**：

- 快讯页面: http://localhost:3002/news
- 只看标题: http://localhost:3002/news?headlines=true
- 重要快讯: http://localhost:3002/news?important=true
- 首页: http://localhost:3002

## 预防措施

### 1. 定期清理缓存

当遇到奇怪的编译或运行时错误时：

```bash
# 清理 Next.js 缓存
rm -rf .next

# 清理 node_modules（如果需要）
rm -rf node_modules
npm install
```

### 2. 检查端口占用

```bash
# 查看端口占用
lsof -i :3000
lsof -i :3001
lsof -i :3002

# 杀死占用端口的进程（如果需要）
kill -9 <PID>
```

### 3. 重启开发服务器

修改了以下文件类型后，建议重启：
- `next.config.js`
- `.env` 文件
- `package.json`
- TypeScript 配置文件

## 当前状态

✅ **已修复**：开发服务器运行在 http://localhost:3002
✅ **页面正常**：快讯页面已成功加载
✅ **功能完整**：所有功能正常工作

## 访问地址更新

| 功能 | 旧地址 (3000) | 新地址 (3002) |
|------|--------------|--------------|
| 首页 | http://localhost:3000 | http://localhost:3002 |
| 快讯 | http://localhost:3000/news | http://localhost:3002/news |
| 玩法库 | http://localhost:3000/strategies | http://localhost:3002/strategies |
| 只看标题 | http://localhost:3000/news?headlines=true | http://localhost:3002/news?headlines=true |
| 重要快讯 | http://localhost:3000/news?important=true | http://localhost:3002/news?important=true |

---

**修复时间**: 2025-10-21
**状态**: ✅ 已解决
