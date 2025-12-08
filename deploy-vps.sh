#!/bin/bash

# Flamix VPS Deployment Script
# This script sets up and deploys the Flamix project on a VPS

set -e  # Exit on any error

# Configuration
PROJECT_NAME="flamix"
DOMAIN="${DOMAIN:-your-domain.com}"  # Set via environment variable
DB_NAME="${DB_NAME:-flamix_db}"
DB_USER="${DB_USER:-flamix_user}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 32)}"
MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/$DB_NAME}"

echo "🚀 Starting Flamix VPS Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Create project directory
echo "📁 Setting up project directory..."
sudo mkdir -p /opt/$PROJECT_NAME
sudo chown -R $USER:$USER /opt/$PROJECT_NAME
cd /opt/$PROJECT_NAME

# Clone or copy project (assuming project files are already on server)
if [ -d "/tmp/flamix-source" ]; then
    echo "📋 Copying project files..."
    cp -r /tmp/flamix-source/* .
else
    echo "⚠️  Please upload your project files to /opt/$PROJECT_NAME"
    echo "   You can use: scp -r ./Flamix user@your-server:/tmp/flamix-source"
    exit 1
fi

# Install dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Build frontend
echo "🏗️  Building frontend..."
cd flamix-frontend
pnpm install
pnpm build
cd ..

# Build backend
echo "🏗️  Building backend..."
cd backend
pnpm install
pnpm run build
cd ..

# Create environment files
echo "⚙️  Creating environment files..."

# Backend .env
cat > backend/.env << EOF
NODE_ENV=production
PORT=3001
MONGODB_URI=$MONGO_URI
CORS_ORIGIN=https://$DOMAIN
EOF

# Frontend .env
cat > flamix-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NODE_ENV=production
EOF

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'flamix-frontend',
      cwd: './flamix-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'flamix-backend',
      cwd: './backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
EOF

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Create update script
echo "📝 Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating Flamix..."
cd /opt/flamix

# Pull latest changes (if using git)
# git pull origin main

# Update dependencies
pnpm install

# Build frontend
cd flamix-frontend
pnpm install
pnpm build
cd ..

# Build backend
cd backend
pnpm install
pnpm run build
cd ..

# Restart applications
pm2 restart all

echo "✅ Update complete!"
EOF

chmod +x update.sh

# Create backup script
echo "📝 Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/flamix"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db flamix_db --out $BACKUP_DIR/mongo_$DATE

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/flamix --exclude=node_modules --exclude=.next

# Keep only last 7 backups
find $BACKUP_DIR -name "mongo_*" -mtime +7 -delete
find $BACKUP_DIR -name "app_*" -mtime +7 -delete

echo "✅ Backup completed: $BACKUP_DIR"
EOF

chmod +x backup.sh

# Setup daily backup cron
echo "⏰ Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/$PROJECT_NAME/backup.sh") | crontab -

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is now running at: https://$DOMAIN"
echo "📊 Monitor with: pm2 monit"
echo "📝 Logs: pm2 logs"
echo "🔄 Update: ./update.sh"
echo "💾 Backup: ./backup.sh"
echo ""
echo "📋 Database Details:"
echo "   MongoDB URI: $MONGO_URI"
echo "   Database: $DB_NAME"
echo ""
echo "🔧 Useful Commands:"
echo "   pm2 restart all    - Restart all services"
echo "   pm2 stop all       - Stop all services"
echo "   pm2 logs           - View logs"
echo "   sudo nginx -t      - Test nginx config"
echo "   sudo systemctl reload nginx - Reload nginx"
