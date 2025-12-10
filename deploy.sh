#!/bin/bash
set -e

echo "🚀 Flamix VPS Deployment Starting..."

# Install dependencies
sudo apt update && sudo apt install -y nodejs npm

# Install pnpm globally
sudo npm install -g pnpm

# Build backend
echo "📦 Building backend..."
cd /opt/flamix/backend
pnpm install --prod
pnpm build
cd /opt/flamix

# Build frontend
echo "🎨 Building frontend..."
cd /opt/flamix/flamix-frontend
pnpm install --prod
pnpm build
cd /opt/flamix

# Configure firewall - block backend port from external access
echo "🔒 Configuring firewall..."
if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp 2>/dev/null || true
  sudo ufw allow 3000/tcp 2>/dev/null || true
  sudo ufw deny 5000/tcp 2>/dev/null || true
  sudo ufw --force enable 2>/dev/null || echo "UFW not available, skipping firewall config"
else
  echo "UFW not installed, skipping firewall config"
fi

# Create systemd services
echo "⚙️ Creating systemd services..."

# Backend service (localhost only)
sudo tee /etc/systemd/system/flamix-daemon.service > /dev/null <<EOF
[Unit]
Description=Flamix Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/flamix/backend
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=5000
ExecStart=/usr/bin/node dist/index.js
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
User=www-data
WorkingDirectory=/opt/flamix/flamix-frontend
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
sudo chown -R www-data:www-data /opt/flamix
sudo chmod +x /opt/flamix/backend/dist/index.js

# Reload systemd
sudo systemctl daemon-reload

echo "✅ Deployment complete!"
echo ""
echo "🔒 Backend secured on localhost:5000 (not accessible externally)"
echo "🌐 Frontend accessible on port 3000"
echo ""
echo "To start services, run:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
