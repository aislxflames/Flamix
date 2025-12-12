#!/bin/bash
set -e

echo "🚀 Flamix VPS Deployment Starting..."

# --- Step 0: Ask user to fill required envs for frontend ---
# Determine frontend directory (prefer /opt/flamix if present)
# if [ -d /opt/flamix/flamix-frontend ]; then
#   FRONTEND_DIR=/opt/flamix/flamix-frontend
# else
#   FRONTEND_DIR="$(pwd)/flamix-frontend"
# fi

# TEMPLATE="$FRONTEND_DIR/.env"
# mkdir -p "$(dirname "$TEMPLATE")"
# cat > "$TEMPLATE" <<'EOF'
# NEXT_PUBLIC_BACKEND_API=
# NEXT_PUBLIC_BACKEND_URL=

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=
# NEXT_PUBLIC_CLERK_SIGN_IN_URL=
# NEXT_PUBLIC_CLERK_SIGN_UP_URL=
# EOF

# echo "Please paste your frontend env values. The file will open in your editor."
# ${EDITOR:-nano} "$TEMPLATE"

# --- Helper: run a command quietly and show a spinner until it finishes ---


# --- Install NVM (quiet) and load it ---
curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash >/dev/null 2>&1 || true
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 and pnpm (do not show logs)
nvm install 20 >/dev/null 2>&1 || true
nvm use 20 >/dev/null 2>&1 || true
npm install -g pnpm >/dev/null 2>&1 || true

# Resolve absolute pnpm and node paths
NODE_PATH=$(which node || echo "/usr/bin/node")
PNPM_PATH=$(which pnpm || echo "/usr/bin/pnpm")

cd /opt/flamix/backend && $PNPM_PATH install && $PNPM_PATH build && $PNPM_PATH prune --prod && cd /opt/flamix/flamix-frontend && $PNPM_PATH install && $PNPM_PATH build && $PNPM_PATH prune --prod


# If build succeeded, continue with service setup and installation (kept visible)

echo "🔒 Configuring firewall..."
if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp 2>/dev/null || true
  sudo ufw allow 3000/tcp 2>/dev/null || true
  sudo ufw allow 5000/tcp 2>/dev/null || true
  sudo ufw --force enable 2>/dev/null || echo "UFW not available, skipping firewall config"
else
  echo "UFW not installed, skipping firewall config"
fi

# Create systemd services
echo "⚙️ Creating systemd services..."

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

sudo chmod +x /opt/flamix/backend/dist/server.js || true
sudo systemctl daemon-reload

echo "🔧 Installing flamix CLI..."
sudo cp /opt/flamix/scripts/flamix /usr/local/bin/flamix || true
sudo chmod +x /usr/local/bin/flamix || true

# echo "🔄 Installing auto-update service..."
# sudo cp /opt/flamix/flamix-autoupdate.service /etc/systemd/system/ || true
# sudo cp /opt/flamix/flamix-autoupdate.timer /etc/systemd/system/ || true
# sudo systemctl daemon-reload || true
# sudo systemctl enable flamix-autoupdate.timer || true

echo "✅ Deployment complete!"
echo "To start services, run:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
echo "sudo systemctl start flamix-autoupdate.timer"
