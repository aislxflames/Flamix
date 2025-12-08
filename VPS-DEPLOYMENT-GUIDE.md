# Flamix VPS Deployment Guide

This guide will help you deploy your Flamix project on a VPS (Virtual Private Server).

## Prerequisites

- Ubuntu 20.04+ VPS with root access
- Domain name pointed to your VPS IP
- At least 2GB RAM and 20GB storage

## Quick Deployment

### 1. Upload Project Files

```bash
# On your local machine
scp -r ./Flamix root@your-server-ip:/tmp/flamix-source
```

### 2. Run Deployment Script

```bash
# On your VPS
ssh root@your-server-ip

# Set your domain
export DOMAIN="your-domain.com"

# Download and run deployment script
cd /tmp/flamix-source
chmod +x deploy-vps.sh
./deploy-vps.sh
```

## Manual Deployment Steps

If you prefer manual setup:

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2
```

### 2. Database Setup

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Web Server Setup

```bash
# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. Project Setup

```bash
# Create project directory
sudo mkdir -p /var/www/flamix
sudo chown -R $USER:$USER /var/www/flamix
cd /var/www/flamix

# Copy your project files here
# Install dependencies
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
```

### 5. Environment Configuration

Create backend environment file:
```bash
# backend/.env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/flamix_db
CORS_ORIGIN=https://your-domain.com
```

Create frontend environment file:
```bash
# flamix-frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
```

### 6. Process Management

Create PM2 ecosystem file:
```javascript
// ecosystem.config.js
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
```

Start applications:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Nginx Configuration

```nginx
# /etc/nginx/sites-available/flamix
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/flamix /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 9. Firewall Setup

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Management Commands

### Application Management
```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart applications
pm2 restart all

# Stop applications
pm2 stop all

# Monitor applications
pm2 monit
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# Backup database
mongodump --db flamix_db --out /backup/mongo_$(date +%Y%m%d)

# Restore database
mongorestore --db flamix_db /backup/mongo_20231208/flamix_db/
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :3001
   kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /var/www/flamix
   ```

3. **MongoDB connection failed**
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

### Log Locations
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- MongoDB logs: `/var/log/mongodb/mongod.log`

## Security Best Practices

1. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Firewall Configuration**
   ```bash
   sudo ufw status
   ```

3. **MongoDB Security**
   ```bash
   # Enable authentication
   sudo nano /etc/mongod.conf
   # Add: security.authorization: enabled
   ```

4. **Backup Strategy**
   - Set up automated daily backups
   - Store backups in a separate location
   - Test restore procedures regularly

## Performance Optimization

1. **Enable Gzip in Nginx**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **PM2 Cluster Mode**
   ```javascript
   // For CPU-intensive applications
   instances: 'max',
   exec_mode: 'cluster'
   ```

3. **MongoDB Indexing**
   ```javascript
   // Create indexes for frequently queried fields
   db.projects.createIndex({ "projectName": 1 })
   ```

## Monitoring

Set up monitoring with:
- PM2 monitoring: `pm2 monit`
- System monitoring: `htop`, `iotop`
- Log monitoring: `tail -f /var/log/nginx/access.log`

## Support

If you encounter issues:
1. Check the logs: `pm2 logs`
2. Verify services: `sudo systemctl status nginx mongod`
3. Test connectivity: `curl localhost:3000`
4. Check firewall: `sudo ufw status`
