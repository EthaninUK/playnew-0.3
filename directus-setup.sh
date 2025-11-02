#!/bin/bash

# ============================================================================
# Directus Backend Setup Script
# This script initializes a Directus project connected to Supabase
# ============================================================================

set -e

echo "================================================"
echo "Directus Backend Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Create directus-backend directory
if [ -d "directus-backend" ]; then
    echo "⚠️  directus-backend directory already exists."
    read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf directus-backend
        echo "✓ Removed existing directus-backend directory"
    else
        echo "❌ Exiting. Please remove directus-backend manually or choose a different location."
        exit 1
    fi
fi

echo ""
echo "Creating Directus backend directory..."
echo ""

# Create directory
mkdir -p directus-backend
cd directus-backend

echo "Initializing npm project..."
npm init -y

echo ""
echo "Installing Directus and dependencies..."
npm install directus dotenv pg

echo ""
echo "✓ Dependencies installed"
echo ""

# Create .env file
cat > .env << 'EOF'
# ============================================================================
# Directus Configuration
# ============================================================================

# Database Connection (Supabase PostgreSQL)
DB_CLIENT=postgres
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Directus Configuration
PORT=8055
PUBLIC_URL=http://localhost:8055

# Security
KEY=replace-with-random-key-min-32-chars
SECRET=replace-with-random-secret-min-32-chars

# Admin Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-secure-password

# CORS (for Next.js frontend)
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMITER_ENABLED=true
RATE_LIMITER_POINTS=50
RATE_LIMITER_DURATION=1

# File Storage (local for development)
STORAGE_LOCATIONS=local
STORAGE_LOCAL_ROOT=./uploads

# Email (optional - for user invites)
# EMAIL_FROM=noreply@example.com
# EMAIL_TRANSPORT=smtp
# EMAIL_SMTP_HOST=smtp.example.com
# EMAIL_SMTP_PORT=587
# EMAIL_SMTP_USER=
# EMAIL_SMTP_PASSWORD=

# Cache
CACHE_ENABLED=true
CACHE_STORE=memory

# Assets
ASSETS_CACHE_TTL=30m
ASSETS_TRANSFORM_MAX_CONCURRENT=4

# Authentication
AUTH_PROVIDERS=default

# Telemetry (disable for privacy)
TELEMETRY=false

# Logging
LOG_LEVEL=info
LOG_STYLE=pretty
EOF

echo "✓ Created .env configuration file"
echo ""

# Create .env.example
cp .env .env.example
sed -i.bak 's/DB_HOST=.*/DB_HOST=your-supabase-host.supabase.co/' .env.example
sed -i.bak 's/DB_PASSWORD=.*/DB_PASSWORD=your-supabase-password/' .env.example
sed -i.bak 's/KEY=.*/KEY=replace-with-random-key-min-32-chars/' .env.example
sed -i.bak 's/SECRET=.*/SECRET=replace-with-random-secret-min-32-chars/' .env.example
sed -i.bak 's/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=change-this-secure-password/' .env.example
rm .env.example.bak

echo "✓ Created .env.example template"
echo ""

# Generate random keys
echo "Generating secure random keys..."
KEY=$(openssl rand -base64 32)
SECRET=$(openssl rand -base64 32)

# Update .env with generated keys
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|KEY=replace-with-random-key-min-32-chars|KEY=$KEY|" .env
    sed -i '' "s|SECRET=replace-with-random-secret-min-32-chars|SECRET=$SECRET|" .env
else
    # Linux
    sed -i "s|KEY=replace-with-random-key-min-32-chars|KEY=$KEY|" .env
    sed -i "s|SECRET=replace-with-random-secret-min-32-chars|SECRET=$SECRET|" .env
fi

echo "✓ Generated secure keys"
echo ""

# Create gitignore
cat > .gitignore << 'EOF'
# Directus
.env
uploads/
extensions/*/dist/
node_modules/

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF

echo "✓ Created .gitignore"
echo ""

# Create README
cat > README.md << 'EOF'
# Directus Backend

Directus headless CMS backend for 币圈玩法收集录 (Crypto Plays Collection).

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase)

## Setup

1. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. Update database connection in `.env`:
   - `DB_HOST`: Your Supabase host (from Supabase dashboard)
   - `DB_PASSWORD`: Your Supabase password
   - `ADMIN_EMAIL`: Admin email for Directus
   - `ADMIN_PASSWORD`: Secure admin password

3. Bootstrap Directus (creates admin user and system tables):
   ```bash
   npx directus bootstrap
   ```

4. Start Directus:
   ```bash
   npm start
   ```

5. Access Directus Admin:
   - URL: http://localhost:8055
   - Login with credentials from `.env`

## Collections

The following collections map to your Supabase tables:

### Content Collections
- `strategies` - 玩法库
- `news` - 资讯
- `service_providers` - 服务商

### User Collections
- `users` - 用户
- `user_profiles` - 用户资料
- `user_interactions` - 用户交互
- `comments` - 评论

### Base Data
- `categories` - 分类
- `tags` - 标签
- `chains` - 区块链
- `protocols` - 协议

## API Endpoints

Once Directus is running, you can access:

- REST API: `http://localhost:8055/items/{collection}`
- GraphQL: `http://localhost:8055/graphql`
- Admin Panel: `http://localhost:8055/admin`

## Configuration Tasks

After setup, configure in Directus Admin Panel:

1. **Collections**: Map to existing Supabase tables
2. **Fields**: Set display names, validation, interfaces
3. **Permissions**: Configure read/write access for public/authenticated
4. **Flows**: Set up automation workflows (optional)
5. **Presets**: Create saved filters and layouts

## Development

```bash
# Start development server
npm start

# Apply database migrations
npx directus database migrate:latest

# Create a new admin user
npx directus users create --email admin@example.com --password password --role administrator
```

## Production

For production deployment:

1. Set secure environment variables
2. Use PostgreSQL connection pooling
3. Configure Redis for caching
4. Set up CDN for assets
5. Enable HTTPS

## Documentation

- [Directus Docs](https://docs.directus.io)
- [API Reference](https://docs.directus.io/reference/introduction)
- [Configuration Options](https://docs.directus.io/self-hosted/config-options)
EOF

echo "✓ Created README.md"
echo ""

# Create package.json scripts
npm pkg set scripts.dev="directus start"
npm pkg set scripts.start="directus start"
npm pkg set scripts.bootstrap="directus bootstrap"
npm pkg set scripts.migrate="directus database migrate:latest"

echo "✓ Updated package.json scripts"
echo ""

echo "================================================"
echo "✅ Directus Setup Complete!"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure your Supabase credentials:"
echo "   cd directus-backend"
echo "   nano .env  # or use your preferred editor"
echo ""
echo "   Update these values:"
echo "   - DB_HOST=your-project.supabase.co"
echo "   - DB_PASSWORD=your-password"
echo "   - ADMIN_EMAIL=your@email.com"
echo "   - ADMIN_PASSWORD=secure-password"
echo ""
echo "2. Bootstrap Directus (creates admin user):"
echo "   npx directus bootstrap"
echo ""
echo "3. Start Directus:"
echo "   npm start"
echo ""
echo "4. Access admin panel:"
echo "   http://localhost:8055"
echo ""
echo "5. Configure collections (see DIRECTUS_CONFIG.md)"
echo ""
