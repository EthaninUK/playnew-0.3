#!/bin/bash

###############################################################################
# PlayPass Directus 完整配置脚本
#
# 功能:
# 1. 检查 Directus 是否运行
# 2. 配置 PlayPass 集合（字段、界面）
# 3. 配置权限（Public 只读）
# 4. 验证配置
#
# 使用方法:
#   chmod +x setup-playpass-directus-complete.sh
#   ./setup-playpass-directus-complete.sh
###############################################################################

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印分隔线
print_separator() {
    echo -e "${BLUE}============================================================${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message "$RED" "❌ 错误: $1 未安装"
        exit 1
    fi
}

# 检查 Directus 是否运行
check_directus() {
    print_message "$BLUE" "\n🔍 检查 Directus 服务状态..."

    if curl -s http://localhost:8055/server/health > /dev/null 2>&1; then
        print_message "$GREEN" "✅ Directus 正在运行"
        return 0
    else
        print_message "$RED" "❌ Directus 未运行"
        print_message "$YELLOW" "\n请先启动 Directus:"
        print_message "$CYAN" "  docker-compose up -d directus"
        exit 1
    fi
}

# 检查数据库表是否存在
check_tables() {
    print_message "$BLUE" "\n🔍 检查 PlayPass 表是否存在..."

    # 使用 Directus API 检查集合
    local token=$(curl -s -X POST http://localhost:8055/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
        | grep -o '"access_token":"[^"]*"' \
        | cut -d'"' -f4)

    if [ -z "$token" ]; then
        print_message "$RED" "❌ 无法登录 Directus"
        exit 1
    fi

    local tables=("playpass_pricing_config" "playpass_reward_config" "playpass_membership_config")
    local all_exist=true

    for table in "${tables[@]}"; do
        if curl -s -H "Authorization: Bearer $token" \
            "http://localhost:8055/collections/$table" | grep -q "\"collection\":\"$table\""; then
            print_message "$GREEN" "  ✅ $table 存在"
        else
            print_message "$YELLOW" "  ⚠️  $table 不存在"
            all_exist=false
        fi
    done

    if [ "$all_exist" = false ]; then
        print_message "$YELLOW" "\n⚠️  警告: 部分表不存在"
        print_message "$CYAN" "  请确保已执行 SQL 脚本创建表:"
        print_message "$CYAN" "  - sql/01_create_playpass_tables.sql"
        print_message "$CYAN" "  - sql/02_insert_sample_data.sql"
        read -p "是否继续配置? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 主函数
main() {
    print_separator
    print_message "$CYAN" "🚀 PlayPass Directus 完整配置"
    print_separator

    # 1. 检查依赖
    print_message "$BLUE" "\n📋 步骤 1/4: 检查依赖..."
    check_command "node"
    check_command "npm"
    check_command "curl"
    print_message "$GREEN" "✅ 所有依赖已安装"

    # 2. 检查 Directus
    print_message "$BLUE" "\n📋 步骤 2/4: 检查 Directus 服务..."
    check_directus

    # 3. 检查表
    print_message "$BLUE" "\n📋 步骤 3/4: 检查数据库表..."
    check_tables

    # 4. 配置集合
    print_message "$BLUE" "\n📋 步骤 4/4: 配置 Directus 集合..."
    print_separator

    print_message "$CYAN" "\n▶️  配置集合字段和界面..."
    if node setup-playpass-directus-collections.js; then
        print_message "$GREEN" "✅ 集合配置成功"
    else
        print_message "$RED" "❌ 集合配置失败"
        exit 1
    fi

    # 5. 验证权限
    print_message "$CYAN" "\n▶️  验证集合访问权限..."
    if node setup-playpass-directus-permissions-fixed.js; then
        print_message "$GREEN" "✅ 权限验证成功"
    else
        print_message "$YELLOW" "⚠️  权限验证失败（这不影响使用）"
        print_message "$CYAN" "  管理员仍可在 Directus 中管理配置"
    fi

    # 完成
    print_separator
    print_message "$GREEN" "✅ PlayPass Directus 配置完成！"
    print_separator

    print_message "$CYAN" "\n📝 下一步操作:"
    print_message "$CYAN" "  1. 访问 Directus 后台: http://localhost:8055"
    print_message "$CYAN" "  2. 登录:"
    print_message "$CYAN" "     邮箱: the_uk1@outlook.com"
    print_message "$CYAN" "     密码: Mygcdjmyxzg2026!"
    print_message "$CYAN" "  3. 在左侧导航找到 PlayPass 相关集合:"
    print_message "$CYAN" "     📦 PlayPass 定价配置"
    print_message "$CYAN" "     🎁 PlayPass 奖励配置"
    print_message "$CYAN" "     👑 PlayPass 会员配置"
    print_message "$CYAN" "  4. 开始管理 PlayPass 配置！"

    print_message "$YELLOW" "\n💡 提示:"
    print_message "$YELLOW" "  - 配置修改会立即生效（无需重启）"
    print_message "$YELLOW" "  - API 会自动读取最新配置"
    print_message "$YELLOW" "  - 可以在 Directus 中查看用户余额和交易记录"

    echo ""
}

# 运行主函数
main
