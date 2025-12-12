#!/bin/bash
set -e

echo "🔧 Flamix VPS Setup Starting..."

# Install git if not present
sudo apt update && sudo apt install -y git

# Clone repository to /opt/flamix
echo "📥 Cloning Flamix repository..."
sudo rm -rf /tmp/flamix
sudo git clone https://github.com/aislxflames/Flamix /tmp/flamix

# Copy only required files
echo "📁 Setting up project structure..."

mkdir -p /opt/flamix

cp -r /tmp/flamix/backend /opt/flamix
cp -r /tmp/flamix/flamix-frontend /opt/flamix
cp -r /tmp/flamix/scripts /opt/flamix
cp -r /tmp/flamix/.git /opt/flamix

# Run deployment
echo "🚀 Running deployment..."
chmod +x /opt/flamix/scripts/deploy.sh
cd /opt/flamix/scripts && sudo ./deploy.sh

echo ""
echo "🎉 Setup complete! Start services with:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
