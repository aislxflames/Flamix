#!/bin/bash
set -e

echo "🚀 Flamix VPS Deployment Starting..."

# Install NVM
echo "📥 Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 using NVM
echo "📦 Installing Node.js 20 via NVM..."
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm

# Build backend
echo "📦 Building backend..."
cd /opt/flamix/backend
pnpm install
pnpm build
pnpm prune --prod
cd /opt/flamix

# Build frontend
echo "🎨 Building frontend..."
cd /opt/flamix/flamix-frontend
pnpm install
pnpm build
pnpm prune --prod
cd /opt/flamix

# Configure firewall
echo "🔒 Configuring firewall..."
if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp 2>/dev/null || true
  sudo ufw allow 3000/tcp 2>/dev/null || true
  sudo ufw allow 5000/tcp 2>/dev/null || true
  sudo ufw --force enable 2>/dev/null || echo "UFW not available, skipping firewall config"
else
  echo "UFW not installed, skipping firewall config"
fi

# Get Node path from NVM
NODE_PATH=$(which node)
PNPM_PATH=$(which pnpm)

# Create systemd services
echo "⚙️ Creating systemd services..."

# Backend service (publicly accessible)
sudo tee /etc/systemd/system/flamix-daemon.service > /dev/null <<EOF
[Unit]
Description=Flamix Backend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/flamix/backend
Environment=NODE_ENV=production
Environment=HOST=0.0.0.0
Environment=PORT=5000
ExecStart=$NODE_PATH dist/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
sudo tee /etc/systemd/system/flamix-app.service > /dev/null <<EOF
[Unit]
Description=Flamix Frontend Service
After=network.target flamix-daemon.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/flamix/flamix-frontend
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=$PNPM_PATH start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
sudo chmod +x /opt/flamix/backend/dist/server.js

# Reload systemd
sudo systemctl daemon-reload

# Install flamix CLI command
echo "🔧 Installing flamix CLI..."
sudo cp /opt/flamix/flamix /usr/local/bin/flamix
sudo chmod +x /usr/local/bin/flamix

# Install auto-update service
echo "🔄 Installing auto-update service..."
sudo cp /opt/flamix/flamix-autoupdate.service /etc/systemd/system/
sudo cp /opt/flamix/flamix-autoupdate.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable flamix-autoupdate.timer

echo "✅ Deployment complete!"
echo ""
echo "🌐 Backend accessible on port 5000"
echo "🌐 Frontend accessible on port 3000"
echo "🔄 Auto-update enabled (checks every 5 minutes)"
echo "🔧 CLI installed: run 'flamix' for commands"
echo ""
echo "To start services, run:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
echo "sudo systemctl start flamix-autoupdate.timer"
