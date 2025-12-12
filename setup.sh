#!/bin/bash
set -e

echo "🔧 Flamix VPS Setup Starting..."

# Install git if not present
sudo apt update && sudo apt install -y git

# Clone repository to /opt/flamix
echo "📥 Cloning Flamix repository..."
sudo rm -rf /opt/flamix
sudo git clone https://github.com/aislxflames/Flamix /tmp/flamix

# Copy only required files
echo "📁 Setting up project structure..."
cp -r /tmp/flamix/backend /opt/flamix/backend
cp -r /tmp/flamix/flamix-frontend /opt/flamix/flamix-frontend
cp -r /tmp/flamix/scripts /opt/flamix/scripts
cp -r /tmp/flamix/.git /opt/flamix/.git

# Run deployment
echo "🚀 Running deployment..."
cd /opt/flamix/scripts && sudo ./deploy.sh

echo ""
echo "🎉 Setup complete! Start services with:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
echo "sudo systemctl start flamix-autoupdate.timer"
