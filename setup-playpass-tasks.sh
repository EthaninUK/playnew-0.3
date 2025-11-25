#!/bin/bash

###############################################################################
# PlayPass 任务系统数据库配置脚本
#
# 功能:
# 1. 执行 SQL 创建任务相关表
# 2. 初始化任务模板数据
# 3. 验证配置
#
# 使用方法:
#   chmod +x setup-playpass-tasks.sh
#   ./setup-playpass-tasks.sh
###############################################################################

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 数据库连接信息（从环境变量或使用默认值）
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-directus_play}"
DB_USER="${DB_USER:-directus}"
DB_PASSWORD="${DB_PASSWORD:-Mygcdjmyxzg2026!}"

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

# 执行 SQL 文件
execute_sql() {
    local sql_file=$1
    print_message "$CYAN" "▶️  执行 SQL: $sql_file"

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$sql_file"

    if [ $? -eq 0 ]; then
        print_message "$GREEN" "✅ SQL 执行成功"
        return 0
    else
        print_message "$RED" "❌ SQL 执行失败"
        return 1
    fi
}

# 验证表是否创建成功
verify_tables() {
    print_message "$CYAN" "\n▶️  验证表创建..."

    local tables=("playpass_task_templates" "playpass_user_tasks" "playpass_task_completions")

    for table in "${tables[@]}"; do
        local count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '$table';")

        if [ "$count" -eq 1 ]; then
            print_message "$GREEN" "  ✅ $table 存在"
        else
            print_message "$RED" "  ❌ $table 不存在"
            return 1
        fi
    done

    return 0
}

# 查看任务模板数量
show_task_count() {
    print_message "$CYAN" "\n▶️  查看任务模板..."

    local daily_count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM playpass_task_templates WHERE task_type = 'daily';")
    local weekly_count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM playpass_task_templates WHERE task_type = 'weekly';")
    local achievement_count=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM playpass_task_templates WHERE task_type = 'achievement';")

    print_message "$GREEN" "  📅 每日任务: $daily_count 个"
    print_message "$GREEN" "  📆 每周任务: $weekly_count 个"
    print_message "$GREEN" "  🏆 成就任务: $achievement_count 个"
}

# 主函数
main() {
    print_separator
    print_message "$CYAN" "🚀 PlayPass 任务系统数据库配置"
    print_separator

    # 检查 psql 是否可用
    if ! command -v psql &> /dev/null; then
        print_message "$RED" "❌ 错误: psql 未安装"
        print_message "$YELLOW" "请安装 PostgreSQL 客户端工具"
        exit 1
    fi

    # 检查 SQL 文件是否存在
    if [ ! -f "sql/03_create_playpass_tasks.sql" ]; then
        print_message "$RED" "❌ 错误: SQL 文件不存在"
        print_message "$YELLOW" "请确保 sql/03_create_playpass_tasks.sql 文件存在"
        exit 1
    fi

    # 1. 执行 SQL
    print_message "$BLUE" "\n📋 步骤 1/3: 执行 SQL 脚本..."
    if ! execute_sql "sql/03_create_playpass_tasks.sql"; then
        print_message "$RED" "\n❌ 配置失败"
        exit 1
    fi

    # 2. 验证表
    print_message "$BLUE" "\n📋 步骤 2/3: 验证表创建..."
    if ! verify_tables; then
        print_message "$RED" "\n❌ 验证失败"
        exit 1
    fi

    # 3. 显示统计
    print_message "$BLUE" "\n📋 步骤 3/3: 显示统计信息..."
    show_task_count

    # 完成
    print_separator
    print_message "$GREEN" "✅ PlayPass 任务系统配置完成！"
    print_separator

    print_message "$CYAN" "\n📝 下一步操作:"
    print_message "$CYAN" "  1. 开发任务中心 API 端点"
    print_message "$CYAN" "  2. 集成到会员中心前端"
    print_message "$CYAN" "  3. 测试任务功能"

    print_message "$YELLOW" "\n💡 提示:"
    print_message "$YELLOW" "  - 任务会自动为用户初始化"
    print_message "$YELLOW" "  - 每日任务会在每天 00:00 重置"
    print_message "$YELLOW" "  - 每周任务会在每周一 00:00 重置"
    print_message "$YELLOW" "  - 成就任务只能完成一次"

    echo ""
}

# 运行主函数
main
