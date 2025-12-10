# Flamix

## Quick Install on Ubuntu VPS

Run this single command to install and deploy Flamix:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/aislxflames/Flamix/refs/heads/main/setup.sh)
```

After installation completes, start the services:

```bash
sudo systemctl enable --now flamix-daemon
sudo systemctl enable --now flamix-app
sudo systemctl start flamix-autoupdate.timer
```

## Services

- **Frontend**: Port 3000 (public)
- **Backend**: Port 5000 (public)

## Flamix CLI

After installation, use the `flamix` command to manage your deployment:

```bash
# Update to latest code and restart
flamix update

# Restart services
flamix restart

# Start services
flamix start

# Stop services
flamix stop

# Check status
flamix status

# View logs
flamix logs daemon   # Backend logs
flamix logs app      # Frontend logs
```

## Manage Services (Alternative)

```bash
# Check status
sudo systemctl status flamix-daemon flamix-app

# View logs
sudo journalctl -u flamix-daemon -f
sudo journalctl -u flamix-app -f

# Restart
sudo systemctl restart flamix-daemon flamix-app
```

## Auto-Update

Flamix automatically checks for updates every 5 minutes. See [AUTO-UPDATE.md](AUTO-UPDATE.md) for details.
