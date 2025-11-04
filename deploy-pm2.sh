#!/bin/bash
# ============================================================================
# PlayNew 0.3 - PM2 Deployment Script
# ============================================================================
# This script deploys the application with PM2 for frontend
# Usage: ./deploy-pm2.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

echo ""
print_step "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_step "  PlayNew 0.3 - Deployment Starting"
print_step "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Pull latest code
print_step "Step 1: Pulling latest code from Git..."
git fetch origin
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Current branch: $CURRENT_BRANCH"
git pull origin $CURRENT_BRANCH
print_success "Code updated to latest commit: $(git rev-parse --short HEAD)"
echo ""

# 2. Check environment files
print_step "Step 2: Checking environment files..."
if [ ! -f ".env.production" ]; then
    print_error ".env.production not found!"
    exit 1
fi
if [ ! -f "frontend/.env.production" ]; then
    print_error "frontend/.env.production not found!"
    exit 1
fi
print_success "Environment files present"
echo ""

# 3. Create necessary directories with correct permissions
print_step "Step 3: Creating data directories..."
mkdir -p directus/uploads directus/extensions
mkdir -p meilisearch/data
mkdir -p n8n/data n8n/workflows
sudo chown -R 1000:1000 n8n 2>/dev/null || true
print_success "Directories created"
echo ""

# 4. Backend Services (Docker)
print_step "Step 4: Managing backend services (Docker)..."
print_info "Restarting backend containers (Directus, Meilisearch, n8n)..."
sudo docker-compose -f docker-compose.prod.yml up -d directus meilisearch n8n
sleep 5
print_success "Backend services restarted"
echo ""

# 5. Frontend Deployment (PM2)
print_step "Step 5: Deploying frontend with PM2..."

cd frontend

# Install dependencies if package.json changed
if git diff HEAD~1 HEAD --name-only | grep -q "frontend/package.json"; then
    print_info "package.json changed, installing dependencies..."
    npm install --legacy-peer-deps
    print_success "Dependencies installed"
fi

# Build Next.js application
print_info "Building Next.js application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build successful"
else
    print_error "Build failed!"
    exit 1
fi

# Reload PM2 process
print_info "Reloading PM2 process..."
pm2 reload playnew-frontend --update-env || pm2 start npm --name "playnew-frontend" -- start
pm2 save
print_success "Frontend deployed with PM2"

cd ..
echo ""

# 6. Wait and check services
print_step "Step 6: Health checks..."

# Check Directus
print_info "Checking Directus..."
for i in {1..10}; do
    if curl -s http://localhost:8055/server/health > /dev/null; then
        print_success "Directus is healthy"
        break
    fi
    [ $i -eq 10 ] && print_error "Directus health check failed" && exit 1
    sleep 2
done

# Check Meilisearch
print_info "Checking Meilisearch..."
for i in {1..10}; do
    if curl -s http://localhost:7700/health > /dev/null; then
        print_success "Meilisearch is healthy"
        break
    fi
    [ $i -eq 10 ] && print_error "Meilisearch health check failed" && exit 1
    sleep 2
done

# Check n8n
print_info "Checking n8n..."
for i in {1..10}; do
    if curl -s http://localhost:5678 > /dev/null; then
        print_success "n8n is healthy"
        break
    fi
    [ $i -eq 10 ] && print_error "n8n health check failed" && exit 1
    sleep 2
done

# Check Frontend
print_info "Checking Frontend..."
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Frontend is healthy"
        break
    fi
    [ $i -eq 15 ] && print_error "Frontend health check failed" && exit 1
    sleep 2
done

echo ""

# 7. Show status
print_step "Step 7: Service Status"
echo ""
print_info "Docker Containers:"
sudo docker-compose -f docker-compose.prod.yml ps
echo ""
print_info "PM2 Processes:"
pm2 list
echo ""

# 8. Final message
print_step "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "🎉 Deployment Completed Successfully!"
print_step "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📍 Services are running at:${NC}"
echo "  🌐 Main site:  https://www.playnew.ai"
echo "  🔌 API:        https://api.playnew.ai"
echo "  🔍 Search:     https://search.playnew.ai"
echo "  🤖 n8n:        https://n8n.playnew.ai"
echo ""
echo -e "${BLUE}📊 Useful commands:${NC}"
echo "  • View frontend logs:  pm2 logs playnew-frontend"
echo "  • View backend logs:   docker-compose -f docker-compose.prod.yml logs -f"
echo "  • Restart frontend:    pm2 reload playnew-frontend"
echo "  • Restart backend:     docker-compose -f docker-compose.prod.yml restart"
echo "  • Service status:      pm2 status && docker-compose -f docker-compose.prod.yml ps"
echo ""
print_info "Deployment time: $(date '+%Y-%m-%d %H:%M:%S')"
print_info "Git commit: $(git rev-parse --short HEAD) - $(git log -1 --pretty=%B | head -1)"
echo ""
