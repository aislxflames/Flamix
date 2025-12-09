#!/bin/bash

# Flamix VPS Deployment Script (No Nginx Version)
set -e

# Configuration
PROJECT_NAME="flamix"
DOMAIN="${DOMAIN:-your-domain.com}"  
DB_NAME="${DB_NAME:-flamix_db}"
DB_USER="${DB_USER:-flamix_user}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 32)}"
MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/$DB_NAME}"

echo "🚀 Starting Flamix VPS Deployment (NO NGINX)..."

# Update system
echo "📦 Updating system..."
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

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Create project directory
echo "📁 Setting up project directory..."
sudo mkdir -p /opt/$PROJECT_NAME
sudo chown -R $USER:$USER /opt/$PROJECT_NAME
cd /opt/$PROJECT_NAME

# Clone / copy project
if [ -d "/tmp/flamix-source" ]; then
    echo "📋 Copying project files..."
    cp -r /tmp/flamix-source/* .
else
    echo "⚠️ Upload your project to /tmp/flamix-source"
    exit 1
fi

# Install dependencies (ROOT)
echo "📦 Installing root dependencies..."
pnpm install

# Build frontend
echo "🏗️ Building frontend..."
cd flamix-frontend
pnpm install
pnpm build
cd ..

# Build backend
echo "🏗️ Building backend..."
cd backend
pnpm install
pnpm run build
cd ..

# Create .env files
echo "⚙️ Creating environment files..."

# Backend .env
cat > backend/.env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=$MONGO_URI
CORS_ORIGIN=http://$DOMAIN:3000
EOF

# Frontend .env
cat > flamix-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://$DOMAIN:5000/api
NODE_ENV=production
EOF

# PM2 config
echo "⚙️ Creating PM2 ecosystem file..."
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
        PORT: 5000
      }
    }
  ]
};
EOF

# Start PM2 apps
echo "🚀 Starting PM2 apps..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
sudo ufw --force enable

# Backup script
echo "📝 Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/flamix"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db flamix_db --out $BACKUP_DIR/mongo_$DATE

# Backup application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /opt/flamix --exclude=node_modules --exclude=.next

# Remove old (7 days)
find $BACKUP_DIR -name "mongo_*" -mtime +7 -delete
find $BACKUP_DIR -name "app_*" -mtime +7 -delete

echo "✅ Backup done: $BACKUP_DIR"
EOF

chmod +x backup.sh

# Update script
echo "📝 Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating Flamix..."
cd /opt/flamix

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

pm2 restart all

echo "Deployment Update complete!"
EOF

chmod +x update.sh

# Cron (backup)
echo "⏰ Setting backup cron..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/flamix/backup.sh") | crontab -

echo ""
echo "🎉 Deployment complete (NO NGINX!)"
echo "Frontend running at: http://your-server-ip:3000"
echo "Backend running at:  http://your-server-ip:5000"
echo ""
echo "Use pm2 monit / pm2 logs to monitor."
