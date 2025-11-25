#!/bin/bash

# 清除可能冲突的环境变量
unset MEILISEARCH_API_KEY

# 设置正确的环境变量
export MEILISEARCH_MASTER_KEY="3JxRTswA7fhGinzFd9BL5DBXdUhOktwPqzapMDL5GDc="

# 进入frontend目录
cd /Users/m1/PlayNew_0.3/frontend

# 杀掉占用3000端口的进程
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 清理缓存
rm -rf .next

# 启动开发服务器
npm run dev
