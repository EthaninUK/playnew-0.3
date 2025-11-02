#!/bin/bash

# ============================================================================
# Docker-based Setup for Directus + Meilisearch
# This is simpler and more reliable than npm install
# ============================================================================

set -e

echo "================================================"
echo "Docker-based Backend Setup"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo ""
    echo "Please install Docker Desktop:"
    echo "  macOS: https://docs.docker.com/desktop/install/mac-install/"
    echo "  Linux: https://docs.docker.com/engine/install/"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

echo "✓ Docker is installed and running"
echo "  Version: $(docker --version)"
echo ""

# Generate random keys
echo "Generating secure random keys..."
KEY=$(openssl rand -base64 32)
SECRET=$(openssl rand -base64 32)
MEILI_KEY=$(openssl rand -base64 32)

echo "✓ Keys generated"
echo ""

# Create directories
echo "Creating data directories..."
mkdir -p directus/uploads
mkdir -p directus/extensions
mkdir -p meilisearch/data

echo "✓ Directories created"
echo ""

# Update docker-compose.yml with generated keys
echo "Updating docker-compose.yml with generated keys..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|KEY: 'replace-with-random-key-min-32-chars'|KEY: '$KEY'|" docker-compose.yml
    sed -i '' "s|SECRET: 'replace-with-random-secret-min-32-chars'|SECRET: '$SECRET'|" docker-compose.yml
    sed -i '' "s|MEILI_MASTER_KEY: 'replace-with-random-master-key-min-32-chars'|MEILI_MASTER_KEY: '$MEILI_KEY'|" docker-compose.yml
else
    # Linux
    sed -i "s|KEY: 'replace-with-random-key-min-32-chars'|KEY: '$KEY'|" docker-compose.yml
    sed -i "s|SECRET: 'replace-with-random-secret-min-32-chars'|SECRET: '$SECRET'|" docker-compose.yml
    sed -i "s|MEILI_MASTER_KEY: 'replace-with-random-master-key-min-32-chars'|MEILI_MASTER_KEY: '$MEILI_KEY'|" docker-compose.yml
fi

echo "✓ Keys updated in docker-compose.yml"
echo ""

# Create .env file for reference
cat > .env << EOF
# Generated Keys (already in docker-compose.yml)
DIRECTUS_KEY=$KEY
DIRECTUS_SECRET=$SECRET
MEILISEARCH_MASTER_KEY=$MEILI_KEY

# Update these in docker-compose.yml:
# - DB_HOST: your-project.supabase.co
# - DB_PASSWORD: your-supabase-password
# - ADMIN_EMAIL: your@email.com
# - ADMIN_PASSWORD: secure-password
EOF

echo "✓ Created .env file with generated keys"
echo ""

echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Supabase connection in docker-compose.yml:"
echo "   - DB_HOST: your-project.supabase.co"
echo "   - DB_PASSWORD: your-supabase-password"
echo "   - ADMIN_EMAIL: your@email.com"
echo "   - ADMIN_PASSWORD: secure-password"
echo ""
echo "2. Start the services:"
echo "   docker-compose up -d"
echo ""
echo "3. Check logs:"
echo "   docker-compose logs -f directus"
echo "   docker-compose logs -f meilisearch"
echo ""
echo "4. Access services:"
echo "   Directus Admin: http://localhost:8055"
echo "   Meilisearch:    http://localhost:7700"
echo ""
echo "5. Stop services:"
echo "   docker-compose down"
echo ""
echo "📝 Your generated keys are saved in .env"
echo ""
