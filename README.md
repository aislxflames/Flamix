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
```

## Services

- **Frontend**: Port 3000 (public)
- **Backend**: Port 5000 (localhost only, secured)

## Manage Services

```bash
# Check status
sudo systemctl status flamix-daemon flamix-app

# View logs
sudo journalctl -u flamix-daemon -f
sudo journalctl -u flamix-app -f

# Restart
sudo systemctl restart flamix-daemon flamix-app
```
