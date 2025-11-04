#!/bin/bash

# Deploy ChainCatcher scraper to production server
# Usage: ./deploy-scraper.sh

set -e

SERVER="ubuntu@13.158.222.72"
PROJECT_DIR="/var/www/playnew"
SSH_KEY="$HOME/.ssh/LightsailDefaultKey-ap-northeast-1.pem"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"

echo "🚀 Deploying ChainCatcher scraper to production..."
echo ""

# 1. Copy scraper script
echo "📦 Copying scraper script..."
scp $SSH_OPTS scrape-chaincatcher-simple.js $SERVER:$PROJECT_DIR/

# 2. Copy updated API route
echo "📦 Copying updated API route..."
scp $SSH_OPTS frontend/app/api/scrape/chaincatcher/route.ts $SERVER:$PROJECT_DIR/frontend/app/api/scrape/chaincatcher/

# 3. Set environment variables on server
echo "⚙️  Setting environment variables..."
ssh $SSH_OPTS $SERVER << 'ENDSSH'
cd /var/www/playnew

# Add environment variables to .env if not already present
if ! grep -q "DIRECTUS_URL" .env 2>/dev/null; then
    echo "" >> .env
    echo "# Directus Configuration for Scraper" >> .env
    echo "DIRECTUS_URL=http://localhost:8055" >> .env
    echo "DIRECTUS_EMAIL=the_uk1@outlook.com" >> .env
    echo "DIRECTUS_PASSWORD=Mygcdjmyxzg2026!" >> .env
fi

# Install axios if not already installed (needed by scraper)
cd /var/www/playnew
if ! npm list axios >/dev/null 2>&1; then
    echo "📦 Installing axios..."
    npm install axios
fi

echo "✅ Environment configured"
ENDSSH

# 4. Rebuild Next.js application
echo "🔨 Rebuilding application..."
ssh $SSH_OPTS $SERVER << 'ENDSSH'
cd /var/www/playnew/frontend
npm run build
pm2 restart playnew-frontend
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Test the API: curl -X POST https://www.playnew.ai/api/scrape/chaincatcher"
echo "2. Update n8n workflow URL to: https://www.playnew.ai/api/scrape/chaincatcher"
echo ""
