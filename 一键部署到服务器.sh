#!/bin/bash
# ============================================================================
# PlayNew 0.3 - 一键部署到服务器
# ============================================================================

set -e

KEY_FILE="/Users/m1/PlayNew_0.3/LightsailDefaultKey-ap-northeast-1 (2).pem"
SERVER_IP="13.158.222.72"
SERVER_USER="ubuntu"
GITHUB_REPO="https://github.com/EthaninUK/playnew-0.3.git"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 PlayNew 0.3 - 一键部署"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 第 1 步: 推送代码到 GitHub
print_info "第 1 步: 推送代码到 GitHub..."
echo ""
echo "请确认:"
echo "  1. GitHub 仓库已创建: https://github.com/EthaninUK/playnew-0.3"
echo "  2. 你有 GitHub Personal Access Token"
echo ""
read -p "是否继续推送代码? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "正在推送代码..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        print_success "代码推送成功!"
    else
        print_error "代码推送失败,请检查 GitHub Token"
        exit 1
    fi
else
    print_info "跳过推送代码,假设代码已在 GitHub"
fi

echo ""

# 第 2 步: 上传 setup-server.sh 到服务器
print_info "第 2 步: 上传初始化脚本到服务器..."
scp -i "$KEY_FILE" setup-server.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
print_success "脚本上传成功"

echo ""

# 第 3 步: 运行服务器初始化
print_info "第 3 步: 初始化服务器 (安装 Docker, Nginx 等)..."
ssh -i "$KEY_FILE" ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    echo "开始服务器初始化..."
    sudo bash /tmp/setup-server.sh
ENDSSH

if [ $? -eq 0 ]; then
    print_success "服务器初始化完成"
else
    print_error "服务器初始化失败"
    exit 1
fi

echo ""

# 第 4 步: 克隆代码到服务器
print_info "第 4 步: 克隆代码到服务器..."
ssh -i "$KEY_FILE" ${SERVER_USER}@${SERVER_IP} << ENDSSH
    echo "克隆代码..."
    sudo mkdir -p /var/www
    cd /var/www

    # 如果目录已存在,先删除
    if [ -d "playnew" ]; then
        echo "目录已存在,更新代码..."
        cd playnew
        sudo git pull
    else
        echo "克隆新代码..."
        sudo git clone $GITHUB_REPO playnew
    fi

    sudo chown -R ubuntu:ubuntu /var/www/playnew
    echo "代码克隆完成"
ENDSSH

print_success "代码部署到服务器完成"

echo ""

# 第 5 步: 配置环境变量提示
print_info "第 5 步: 配置环境变量 (需要手动操作)"
echo ""
echo "⚠️  接下来需要登录服务器手动配置环境变量:"
echo ""
echo "1. 连接服务器:"
echo "   ./connect-server.sh"
echo ""
echo "2. 生成密钥:"
echo "   cd /var/www/playnew"
echo "   openssl rand -base64 32  # DIRECTUS_KEY"
echo "   openssl rand -base64 32  # DIRECTUS_SECRET"
echo "   openssl rand -base64 32  # MEILISEARCH_MASTER_KEY"
echo ""
echo "3. 配置环境变量:"
echo "   cp .env.production.example .env.production"
echo "   nano .env.production"
echo "   # 填入密钥"
echo ""
echo "   cp frontend/.env.production.example frontend/.env.production"
echo "   nano frontend/.env.production"
echo "   # 更新配置 (特别是 Stripe 生产密钥!)"
echo ""
echo "4. 获取 SSL 证书:"
echo "   sudo systemctl stop nginx"
echo "   sudo certbot certonly --standalone -d playnew.ai -d www.playnew.ai"
echo "   sudo certbot certonly --standalone -d api.playnew.ai"
echo "   sudo certbot certonly --standalone -d search.playnew.ai"
echo "   sudo certbot certonly --standalone -d n8n.playnew.ai"
echo ""
echo "5. 配置 Nginx:"
echo "   sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t"
echo "   sudo systemctl start nginx"
echo ""
echo "6. 部署应用:"
echo "   ./deploy.sh"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "自动化部分完成!"
echo ""
print_info "详细文档: DEPLOYMENT.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
