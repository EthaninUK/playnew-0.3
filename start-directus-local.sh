#!/bin/bash

# ============================================================================
# Start Directus Locally (without Docker)
# Uses npx to run Directus with proper Node version
# ============================================================================

set -e

echo "================================================"
echo "Starting Directus Locally"
echo "================================================"
echo ""

# Create directus directory if not exists
if [ ! -d "directus-local" ]; then
    echo "Creating directus-local directory..."
    mkdir -p directus-local
    cd directus-local

    # Initialize npm project
    npm init -y

    # Install Directus
    echo "Installing Directus..."
    npm install directus@latest

    cd ..
fi

cd directus-local

# Create .env file
cat > .env << 'EOF'
# Directus Configuration
PORT=8055
PUBLIC_URL=http://localhost:8055

# Security Keys
KEY=lrd+RVDVhDaVvi/iZCX8mA5qcgWomEIP6okFq6zndy0=
SECRET=T9ftVLXv6CMLqoUV9ZEMktNrzPoX+S795NMLyJm7Rg0=

# Database (Supabase PostgreSQL)
DB_CLIENT=pg
DB_CONNECTION_STRING=postgresql://postgres:bi3d8FpBFTUWuwOb@db.cujpgrzjmmttysphjknu.supabase.co:5432/postgres

# Admin Account
ADMIN_EMAIL=the_uk1@outlook.com
ADMIN_PASSWORD=Mygcdjmyxzg2026!

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMITER_ENABLED=true
RATE_LIMITER_POINTS=50
RATE_LIMITER_DURATION=1

# File Storage
STORAGE_LOCATIONS=local
STORAGE_LOCAL_ROOT=./uploads

# Cache
CACHE_ENABLED=true
CACHE_STORE=memory

# Assets
ASSETS_CACHE_TTL=30m

# Logging
LOG_LEVEL=info
LOG_STYLE=pretty

# Telemetry
TELEMETRY=false

# Disable SSL verification for Supabase
NODE_TLS_REJECT_UNAUTHORIZED=0
EOF

echo "✓ Configuration created"
echo ""

# Bootstrap Directus (first time only)
if [ ! -f ".bootstrapped" ]; then
    echo "Bootstrapping Directus..."
    npx directus bootstrap
    touch .bootstrapped
    echo "✓ Bootstrap complete"
    echo ""
fi

echo "Starting Directus server..."
echo ""
echo "================================================"
echo "Directus Admin Panel:"
echo "  URL: http://localhost:8055"
echo "  Email: the_uk1@outlook.com"
echo "  Password: Mygcdjmyxzg2026!"
echo "================================================"
echo ""

# Start Directus
npx directus start
EOF

chmod +x start-directus-local.sh

echo "✓ Script created"
echo ""
echo "To start Directus, run:"
echo "  ./start-directus-local.sh"
