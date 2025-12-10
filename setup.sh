#!/bin/bash
set -e

echo "🔧 Flamix VPS Setup Starting..."

# Install git if not present
sudo apt update && sudo apt install -y git

# Clone repository to /opt/flamix
echo "📥 Cloning Flamix repository..."
sudo rm -rf /opt/flamix
sudo git clone https://github.com/aislxflames/Flamix /opt/flamix

# Copy only required directories
echo "📁 Setting up project structure..."
sudo mkdir -p /tmp/flamix-build
sudo cp -r /opt/flamix/flamix-frontend /tmp/flamix-build/
sudo cp -r /opt/flamix/backend /tmp/flamix-build/
sudo cp /opt/flamix/deploy.sh /tmp/flamix-build/

# Replace /opt/flamix with clean structure
sudo rm -rf /opt/flamix
sudo mv /tmp/flamix-build /opt/flamix
sudo chmod +x /opt/flamix/deploy.sh

# Run deployment
echo "🚀 Running deployment..."
cd /opt/flamix && sudo ./deploy.sh

echo ""
echo "🎉 Setup complete! Start services with:"
echo "sudo systemctl enable --now flamix-daemon"
echo "sudo systemctl enable --now flamix-app"
