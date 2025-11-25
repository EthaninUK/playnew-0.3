#!/bin/bash

# ============================================
# Web3 支付系统 - 数据库迁移执行脚本
# ============================================

echo "🚀 开始执行 Web3 支付系统数据库迁移..."
echo ""

# 数据库连接信息
DB_HOST="aws-1-ap-northeast-1.pooler.supabase.com"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres.cujpgrzjmmttysphjknu"
DB_PASSWORD="bi3d8FpBFTUWuwOb"

# SQL 脚本路径
SQL_FILE="/Users/m1/PlayNew_0.3/sql/000_web3_payment_system_complete.sql"

echo "📋 执行信息:"
echo "  数据库: $DB_HOST:$DB_PORT/$DB_NAME"
echo "  脚本: $SQL_FILE"
echo ""

# 检查 psql 是否安装
if ! command -v psql &> /dev/null; then
    echo "❌ 错误: 未找到 psql 命令"
    echo "   请安装 PostgreSQL 客户端:"
    echo "   brew install postgresql"
    exit 1
fi

# 检查 SQL 文件是否存在
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ 错误: SQL 文件不存在: $SQL_FILE"
    exit 1
fi

# 执行 SQL 脚本
echo "⏳ 正在执行 SQL 脚本..."
echo ""

PGPASSWORD=$DB_PASSWORD psql \
  -h $DB_HOST \
  -p $DB_PORT \
  -U $DB_USER \
  -d $DB_NAME \
  -f $SQL_FILE

# 检查执行结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 数据库迁移执行成功!"
    echo ""
    echo "📋 下一步操作:"
    echo "1. 访问 Directus 后台: http://localhost:8055/admin"
    echo "2. 登录账号: the_uk1@outlook.com"
    echo "3. 进入 Content > Web3 System Config"
    echo "4. 更新各链的钱包地址 (platform_wallet_address)"
    echo ""
    echo "5. 或者使用以下命令验证:"
    echo "   curl -s 'http://localhost:8055/items/web3_system_config' | jq"
    echo ""
else
    echo ""
    echo "❌ 数据库迁移执行失败!"
    echo "请检查错误信息并重试"
    exit 1
fi
