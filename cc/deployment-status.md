
# Deployment Status & Plan for vostra-invoice-web

**Server:** Hetzner box at `/var/www/vostra-invoice-web`
**Date:** 2025-11-11
**Repository:** https://github.com/rcn123/vostra-invoice-web
**User:** root (in docker group ✓)

---

## Current Server Status ✓

### Docker Environment
- **Docker Version:** 28.5.1
- **Docker Service:** Active and running (enabled for auto-start)
- **User:** root (already in docker group - good!)
- **Existing Containers:**
  - registry:2 (running on port 5000)
  - coturn (running)
  - hello-world (exited - test container)

### Repository
- **Location:** `/var/www/vostra-invoice-web`
- **Remote:** https://github.com/rcn123/vostra-invoice-web
- **Git Status:** Properly configured

### Project Files
- ✓ `docker-compose.yml` - Frontend service configured (port 80)
- ✓ `deploy.sh` - Deployment script ready (needs execute permission)
- ✓ `DEPLOYMENT.md` - Complete deployment guide
- ✓ `frontend/` - Frontend application directory

---

## Deployment Plan

### Phase 1: Initial Manual Deployment (Test)

**Purpose:** Verify everything works before setting up automated deployments

```bash
# 1. Make deploy script executable
chmod +x deploy.sh

# 2. Run initial deployment
./deploy.sh

# 3. Verify deployment
docker-compose ps
curl http://localhost

# 4. Check logs if issues
docker-compose logs -f
```

**Expected Result:** Frontend running on port 80, accessible via `http://localhost`

---

### Phase 2: GitHub Actions Setup (Automated Deployments)

**Goal:** Auto-deploy on every push to main branch

#### Step 1: Check for Workflow File
Need to verify if `.github/workflows/deploy.yml` exists:
```bash
ls -la .github/workflows/
```

#### Step 2: Get SSH Private Key (From Home Computer)

**On Windows (PowerShell):**
```powershell
Get-Content C:\Users\<your-user>\.ssh\<your-key-file>
```

**On WSL/Linux:**
```bash
cat ~/.ssh/<your-key-file>
```

Copy the entire key including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- `-----END OPENSSH PRIVATE KEY-----`

#### Step 3: Add GitHub Secrets

Go to: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these 3 secrets:

1. **HETZNER_HOST**
   - Value: Your Hetzner server IP or hostname

2. **HETZNER_USER**
   - Value: `root` (or your SSH username)

3. **HETZNER_SSH_KEY**
   - Value: Your private SSH key (from Step 2)

#### Step 4: Test Automated Deployment

```bash
# From your home computer
git add .
git commit -m "test: verify deployment"
git push origin main
```

Then check GitHub Actions tab for deployment progress.

---

## Questions to Answer Before Proceeding

1. **GitHub Actions Workflow:**
   - Does `.github/workflows/` have a deploy workflow file?
   - Need to check this first

2. **Port 80 Usage:**
   - Frontend will run on port 80
   - Is this okay, or need different port?

3. **SSH Key:**
   - Which SSH key are you using from home computer?
   - Need the private key file path

4. **Domain/DNS:**
   - Do you have a domain pointing to this server?
   - Or accessing via IP for now?

5. **Server IP:**
   - What's the Hetzner server IP/hostname for HETZNER_HOST secret?

---

## Next Steps After Return

1. Check if `.github/workflows/deploy.yml` exists
2. Decide on port configuration (80 or different?)
3. Get SSH key details from home computer
4. Run initial manual deployment test
5. Set up GitHub secrets
6. Test automated deployment

---

## Useful Commands Reference

### Docker Management
```bash
# View running containers
docker-compose ps
docker ps -a

# View logs
docker-compose logs -f
docker-compose logs frontend

# Restart containers
docker-compose restart

# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Clean up unused images
docker image prune -f
```

### Deployment
```bash
# Manual deploy
./deploy.sh

# Check nginx config
docker exec vostra-frontend nginx -t
```

### Git
```bash
# Pull latest changes
git pull origin main

# Check remote
git remote -v

# Check status
git status
```

---

## Port Mappings

- **Port 80:** vostra-frontend (planned)
- **Port 5000:** registry (currently in use)

---

## Future Considerations (from DEPLOYMENT.md)

- [ ] Configure domain/DNS to point to Hetzner IP
- [ ] Setup SSL/TLS with Let's Encrypt
- [ ] Add backend service to docker-compose.yml
- [ ] Setup environment variables for production

---

**Notes:**
- Server already has Docker properly configured ✓
- Repository properly cloned ✓
- Ready for initial deployment test
- Need to verify GitHub Actions workflow exists
