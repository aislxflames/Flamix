#!/bin/bash
set -e

echo "🔄 Flamix Auto-Update Starting..."

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Backup .env files
echo "💾 Backing up .env files..."
cp /opt/flamix/backend/.env /tmp/backend.env.backup 2>/dev/null || true
cp /opt/flamix/flamix-frontend/.env /tmp/frontend.env.backup 2>/dev/null || true

# Pull latest code
echo "📥 Pulling latest code..."
cd /opt/flamix
git fetch origin main
git reset --hard origin/main

# Restore .env files
echo "♻️ Restoring .env files..."
cp /tmp/backend.env.backup /opt/flamix/backend/.env 2>/dev/null || true
cp /tmp/frontend.env.backup /opt/flamix/flamix-frontend/.env 2>/dev/null || true

# Build backend
echo "📦 Building backend..."
cd /opt/flamix/backend
pnpm install
pnpm build
pnpm prune --prod

# Build frontend
echo "🎨 Building frontend..."
cd /opt/flamix/flamix-frontend
pnpm install
pnpm build
pnpm prune --prod

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart flamix-daemon
sudo systemctl restart flamix-app

echo "✅ Update complete!"
echo ""
echo "Services status:"
sudo systemctl status flamix-daemon --no-pager -l
sudo systemctl status flamix-app --no-pager -l
