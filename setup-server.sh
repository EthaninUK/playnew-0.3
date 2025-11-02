#!/bin/bash
# ============================================================================
# PlayNew 0.3 - Server Setup Script
# ============================================================================
# Run this script ONCE on your AWS server to set up the environment
# Usage: bash setup-server.sh
# ============================================================================

set -e

# Colors
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

print_info "Starting server setup for PlayNew 0.3..."

# 1. Update system
print_info "Updating system packages..."
apt-get update
apt-get upgrade -y
print_success "System updated"

# 2. Install essential packages
print_info "Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    certbot \
    python3-certbot-nginx \
    software-properties-common
print_success "Essential packages installed"

# 3. Install Docker
print_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# 4. Install Docker Compose
print_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# 5. Install Nginx
print_info "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# 6. Configure firewall
print_info "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw status
print_success "Firewall configured"

# 7. Optimize for 2GB RAM
print_info "Optimizing system for 2GB RAM..."

# Create swap file (2GB)
if [ ! -f /swapfile ]; then
    print_info "Creating swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    print_success "Swap file created (2GB)"
else
    print_success "Swap file already exists"
fi

# Adjust swappiness
sysctl vm.swappiness=10
echo 'vm.swappiness=10' >> /etc/sysctl.conf

# Increase file limits
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
EOF

print_success "System optimizations applied"

# 8. Create deployment directory
print_info "Creating deployment directory..."
mkdir -p /var/www/playnew
print_success "Directory created"

# 9. Install Node.js (for npm scripts if needed)
print_info "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    print_success "Node.js installed"
else
    print_success "Node.js already installed"
fi

# 10. Show versions
echo ""
print_info "Installed versions:"
echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker-compose --version)"
echo "  Nginx: $(nginx -v 2>&1)"
echo "  Node.js: $(node --version)"
echo "  Git: $(git --version)"
echo ""

print_success "Server setup completed!"
echo ""
print_info "Next steps:"
echo "  1. Clone your repository to /var/www/playnew"
echo "  2. Copy Nginx config: sudo cp nginx/playnew.ai.conf /etc/nginx/sites-available/"
echo "  3. Enable site: sudo ln -s /etc/nginx/sites-available/playnew.ai.conf /etc/nginx/sites-enabled/"
echo "  4. Test Nginx: sudo nginx -t"
echo "  5. Get SSL certificates (see DEPLOYMENT.md)"
echo "  6. Run deploy.sh"
