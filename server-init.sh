#!/bin/bash

# ============================================================================
# PlayNew 0.3 - 服务器初始化脚本
# ============================================================================
# 在 AWS Lightsail Ubuntu 服务器上运行此脚本
# 用法: sudo bash server-init.sh
# ============================================================================

set -e

echo "========================================="
echo "PlayNew 0.3 - 服务器初始化"
echo "========================================="
echo ""

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
   echo "请使用 sudo 运行此脚本"
   exit 1
fi

echo "1. 更新系统..."
apt update
apt upgrade -y

echo ""
echo "2. 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu
    echo "✓ Docker 安装完成"
else
    echo "✓ Docker 已安装"
fi

echo ""
echo "3. 安装 Docker Compose..."
if ! docker compose version &> /dev/null; then
    apt install docker-compose-plugin -y
    echo "✓ Docker Compose 安装完成"
else
    echo "✓ Docker Compose 已安装"
fi

echo ""
echo "4. 安装 Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl start nginx
    systemctl enable nginx
    echo "✓ Nginx 安装完成"
else
    echo "✓ Nginx 已安装"
fi

echo ""
echo "5. 安装其他工具..."
apt install git curl wget htop -y
echo "✓ 工具安装完成"

echo ""
echo "6. 配置防火墙..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Frontend
ufw allow 8055/tcp  # Directus
ufw allow 7700/tcp  # Meilisearch
ufw allow 5678/tcp  # n8n
echo "✓ 防火墙规则已配置"

echo ""
echo "7. 优化系统..."
# 创建 swap (如果不存在)
if [ ! -f /swapfile ]; then
    echo "创建 2GB swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✓ Swap 已创建"
else
    echo "✓ Swap 已存在"
fi

# 增加文件描述符限制
echo "fs.file-max = 65536" >> /etc/sysctl.conf
sysctl -p

echo ""
echo "========================================="
echo "✅ 服务器初始化完成!"
echo "========================================="
echo ""
echo "下一步:"
echo "1. 退出当前 SSH 会话并重新登录 (使 Docker 权限生效)"
echo "2. 配置 GitHub SSH key:"
echo "   ssh-keygen -t ed25519 -C 'server@playnew.ai'"
echo "   cat ~/.ssh/id_ed25519.pub"
echo "3. 克隆代码仓库到 /var/www/playnew"
echo ""
echo "详细步骤请查看 QUICKSTART.md"
echo ""
