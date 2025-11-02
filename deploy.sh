#!/bin/bash
# ============================================================================
# PlayNew 0.3 - Deployment Script
# ============================================================================
# This script deploys the application to production
# Usage: ./deploy.sh
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

print_info "Starting deployment process..."

# 1. Pull latest code
print_info "Pulling latest code from Git..."
git pull origin main
print_success "Code updated"

# 2. Check environment files
print_info "Checking environment files..."
if [ ! -f ".env.production" ]; then
    print_error ".env.production not found!"
    print_info "Please copy .env.production.example to .env.production and fill in values"
    exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
    print_error "frontend/.env.production not found!"
    print_info "Please copy frontend/.env.production.example to frontend/.env.production"
    exit 1
fi
print_success "Environment files present"

# 3. Create necessary directories
print_info "Creating data directories..."
mkdir -p directus/uploads directus/extensions
mkdir -p meilisearch/data
mkdir -p n8n/data n8n/workflows
print_success "Directories created"

# 4. Stop existing containers
print_info "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true
print_success "Containers stopped"

# 5. Build and start containers
print_info "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build
print_success "Containers started"

# 6. Wait for services to be healthy
print_info "Waiting for services to be healthy (this may take 1-2 minutes)..."
sleep 10

# Check Directus
for i in {1..30}; do
    if docker exec playnew-directus wget -q --spider http://localhost:8055/server/health; then
        print_success "Directus is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Directus failed to start"
        docker-compose -f docker-compose.prod.yml logs directus
        exit 1
    fi
    sleep 2
done

# Check Meilisearch
for i in {1..20}; do
    if docker exec playnew-meilisearch wget -q --spider http://localhost:7700/health; then
        print_success "Meilisearch is healthy"
        break
    fi
    if [ $i -eq 20 ]; then
        print_error "Meilisearch failed to start"
        docker-compose -f docker-compose.prod.yml logs meilisearch
        exit 1
    fi
    sleep 2
done

# Check Frontend
for i in {1..30}; do
    if docker exec playnew-frontend wget -q --spider http://localhost:3000; then
        print_success "Frontend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Frontend failed to start"
        docker-compose -f docker-compose.prod.yml logs frontend
        exit 1
    fi
    sleep 2
done

# 7. Show container status
print_info "Container status:"
docker-compose -f docker-compose.prod.yml ps

# 8. Final message
echo ""
print_success "Deployment completed successfully!"
echo ""
print_info "Services are running at:"
echo "  - Main site: https://playnew.ai"
echo "  - API: https://api.playnew.ai"
echo "  - Search: https://search.playnew.ai"
echo "  - n8n: https://n8n.playnew.ai"
echo ""
print_info "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
print_info "To stop: docker-compose -f docker-compose.prod.yml down"
