# Deployment Guide

## Overview

This project uses GitHub Actions to automatically deploy to Hetzner on every push to `main`.

**Flow:** Push to main → GitHub Actions → SSH to Hetzner → Pull & rebuild Docker containers

---

## Initial Server Setup

### 1. Prepare Hetzner Server

SSH into your Hetzner box and run:

```bash
# Install Docker if not already installed
sudo apt update
sudo apt install -y docker.io docker-compose git

# Enable Docker to start on boot
sudo systemctl enable docker
sudo systemctl start docker

# Add user to docker group (replace 'username' with your user)
sudo usermod -aG docker username

# Log out and back in for group changes to take effect
```

### 2. Clone Repository on Server

```bash
# Create directory
sudo mkdir -p /var/www/vostra-invoice-web
sudo chown -R $USER:$USER /var/www/vostra-invoice-web

# Clone repo
cd /var/www
git clone <your-repo-url> vostra-invoice-web
cd vostra-invoice-web
```

### 3. Initial Manual Deploy

Test deployment manually first:

```bash
cd /var/www/vostra-invoice-web
chmod +x deploy.sh
./deploy.sh
```

Verify it's running:
```bash
docker-compose ps
curl http://localhost
```

---

## GitHub Secrets Setup

### 1. Extract Your SSH Private Key

From your local machine:

```powershell
# Windows (PowerShell)
Get-Content C:\Users\<your-user>\.ssh\<your-key-file>
```

Or from WSL/Linux:
```bash
cat ~/.ssh/<your-key-file>
```

Copy the entire private key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

### 2. Add Secrets to GitHub

Go to your repository on GitHub:
1. Settings → Secrets and variables → Actions → New repository secret

Add these three secrets:

- **HETZNER_HOST**: Your Hetzner server IP or hostname
- **HETZNER_USER**: SSH username (usually `root` or your user)
- **HETZNER_SSH_KEY**: The private key you copied above

### 3. Test Deployment

Push to main branch:
```bash
git add .
git commit -m "test: verify deployment"
git push origin main
```

Check GitHub Actions tab to see deployment progress.

---

## Manual Deployment

If you need to deploy manually:

```bash
# SSH to server
ssh <your-profile-name>

# Navigate to project
cd /var/www/vostra-invoice-web

# Run deploy script
./deploy.sh
```

---

## Troubleshooting

### Check logs
```bash
docker-compose logs -f
```

### Restart containers
```bash
docker-compose restart
```

### Full rebuild
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Check nginx config
```bash
docker exec vostra-frontend nginx -t
```

---

## Next Steps

- [ ] Configure domain/DNS to point to Hetzner IP
- [ ] Setup SSL/TLS with Let's Encrypt
- [ ] Add backend service to docker-compose.yml
- [ ] Setup environment variables for production
