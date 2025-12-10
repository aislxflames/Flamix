# Flamix Auto-Update

Flamix includes an automatic update system that checks for new code every 5 minutes and automatically deploys it.

## How It Works

1. **Timer**: Runs every 5 minutes checking for updates
2. **Update Script**: Pulls latest code from GitHub
3. **Preserves .env**: Your environment files are backed up and restored
4. **Auto-rebuild**: Rebuilds both backend and frontend
5. **Auto-restart**: Restarts services automatically

## Manual Update

To manually trigger an update:

```bash
sudo /opt/flamix/update.sh
```

## Service Management

```bash
# Check auto-update timer status
sudo systemctl status flamix-autoupdate.timer

# View update logs
sudo journalctl -u flamix-autoupdate.service -f

# Disable auto-update
sudo systemctl stop flamix-autoupdate.timer
sudo systemctl disable flamix-autoupdate.timer

# Enable auto-update
sudo systemctl enable --now flamix-autoupdate.timer
```

## What Gets Updated

- ✅ Backend code
- ✅ Frontend code
- ✅ Dependencies (package.json)
- ✅ Configuration files
- ❌ .env files (preserved)

## Update Frequency

Default: Every 5 minutes

To change frequency, edit `/etc/systemd/system/flamix-autoupdate.timer`:
```ini
[Timer]
OnUnitActiveSec=5min  # Change this value
```

Then reload:
```bash
sudo systemctl daemon-reload
sudo systemctl restart flamix-autoupdate.timer
```
