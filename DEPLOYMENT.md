# Deployment Guide - Kubernetes Setup

## Overview

VostraInvoice Web is deployed on Hetzner using Kubernetes (k3s) with:
- **Traefik** as ingress controller (built into k3s)
- **cert-manager** for automatic SSL certificate management
- **Let's Encrypt** for free, trusted SSL certificates
- **GitHub Actions** for automated deployments

**Flow:** Push to main → GitHub Actions → SSH to Hetzner → Build & Deploy to k8s

---

## Current Production Setup

### Live URLs
- **Landing Page**: https://vostra.ai/
- **Invoice App**: https://vostra.ai/vostra-invoice/
- **Server**: Hetzner (65.21.145.222)

### Infrastructure
- **Kubernetes**: k3s (lightweight Kubernetes)
- **Namespace**: `vostra`
- **Deployments**:
  - `vostra-landing` (2 replicas)
  - `vostra-invoice` (2 replicas)
- **SSL**: Let's Encrypt via cert-manager (auto-renewal)
- **Ingress**: Traefik with path-based routing

---

## Automated Deployment (Recommended)

### One-Time Setup: GitHub Secrets

1. Go to: https://github.com/rcn123/vostra-invoice-web/settings/secrets/actions
2. Click "New repository secret" and add these three:

**HETZNER_HOST**
```
65.21.145.222
```

**HETZNER_USER**
```
root
```

**HETZNER_SSH_KEY**
```
<your-private-ssh-key>
```

To get your SSH private key from your **local computer**:

**Windows (PowerShell):**
```powershell
Get-Content $env:USERPROFILE\.ssh\id_rsa
```

**Linux/Mac/WSL:**
```bash
cat ~/.ssh/id_rsa
```

Copy the **entire output** including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the key content
- `-----END OPENSSH PRIVATE KEY-----`

### Deploy Automatically

From your **local computer**:

```bash
# Make your changes
git add .
git commit -m "your message"
git push origin main
```

GitHub Actions will automatically:
1. ✅ Pull latest code on server
2. ✅ Build Docker images (landing + invoice)
3. ✅ Import images to k3s
4. ✅ Apply any Kubernetes manifest changes
5. ✅ Restart deployments with new images
6. ✅ Wait for rollout to complete
7. ✅ Show deployment status

**Monitor deployment:**
- Go to: https://github.com/rcn123/vostra-invoice-web/actions
- Click on the latest workflow run to see live logs

---

## Manual Deployment

If you need to deploy manually from the server:

### SSH to Server

```bash
ssh root@65.21.145.222
```

### Full Rebuild and Deploy

```bash
cd /var/www/vostra-invoice-web

# Pull latest changes
git pull origin main

# Build Docker images
docker build -t vostra-landing:v1 ./landing
docker build -t vostra-invoice-frontend:v1 ./frontend

# Import images to k3s
docker save vostra-landing:v1 | sudo k3s ctr images import -
docker save vostra-invoice-frontend:v1 | sudo k3s ctr images import -

# Restart deployments
kubectl rollout restart deployment/vostra-landing -n vostra
kubectl rollout restart deployment/vostra-invoice -n vostra

# Verify
kubectl get pods -n vostra
```

---

## Initial Server Setup (Already Complete)

This was the one-time setup. **You don't need to do this again.**

### 1. Server Requirements

✅ **Already installed:**
- Docker 28.5.1
- k3s (Kubernetes)
- kubectl
- Git

### 2. Repository Setup

✅ **Already done:**
```bash
sudo mkdir -p /var/www/vostra-invoice-web
sudo chown -R root:root /var/www/vostra-invoice-web
cd /var/www
git clone https://github.com/rcn123/vostra-invoice-web
```

### 3. cert-manager Installation

✅ **Already installed:**
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=120s
```

### 4. Let's Encrypt Configuration

✅ **Already configured:**
- ClusterIssuer created: `letsencrypt-prod`
- Email: `support@vostra.ai`
- Server: `https://acme-v02.api.letsencrypt.org/directory`

### 5. DNS Configuration

✅ **Already done at one.com:**
```
Type: A
Host: @
Points to: 65.21.145.222

Type: A
Host: www
Points to: 65.21.145.222
```

### 6. Initial Deployment

✅ **Already deployed:**
- Namespace: `vostra`
- Landing page deployment + service
- Invoice app deployment + service
- Ingress with SSL
- SSL certificate issued

---

## Kubernetes Management

### View Status

```bash
# All resources
kubectl get all -n vostra

# Pods
kubectl get pods -n vostra

# Deployments
kubectl get deployments -n vostra

# Services
kubectl get svc -n vostra

# Ingress
kubectl get ingress -n vostra

# SSL Certificate
kubectl get certificate -n vostra
```

### View Logs

```bash
# Landing page logs
kubectl logs -n vostra -l app=vostra-landing

# Invoice app logs
kubectl logs -n vostra -l app=vostra-invoice

# Follow logs (real-time)
kubectl logs -n vostra -l app=vostra-invoice -f

# Specific pod
kubectl logs <pod-name> -n vostra
```

### Scale Deployments

```bash
# Scale up to 3 replicas
kubectl scale deployment/vostra-invoice --replicas=3 -n vostra

# Scale down to 1 replica
kubectl scale deployment/vostra-landing --replicas=1 -n vostra

# Check status
kubectl get pods -n vostra
```

### Restart Deployments

```bash
# Restart invoice app
kubectl rollout restart deployment/vostra-invoice -n vostra

# Restart landing page
kubectl rollout restart deployment/vostra-landing -n vostra

# Watch rollout status
kubectl rollout status deployment/vostra-invoice -n vostra
```

### Describe Resources

```bash
# Detailed pod info
kubectl describe pod <pod-name> -n vostra

# Deployment info
kubectl describe deployment vostra-invoice -n vostra

# Ingress info
kubectl describe ingress vostra-ingress -n vostra
```

---

## SSL Certificate Management

### Check Certificate Status

```bash
# View certificate
kubectl get certificate -n vostra

# Should show:
# NAME         READY   SECRET       AGE
# vostra-tls   True    vostra-tls   XXm

# Detailed certificate info
kubectl describe certificate vostra-tls -n vostra
```

### Certificate Auto-Renewal

cert-manager automatically renews certificates **30 days before expiry**.

**No manual action needed!**

### Force Certificate Renewal

If needed:

```bash
# Delete certificate (it will be recreated)
kubectl delete certificate vostra-tls -n vostra

# Watch new certificate being created
kubectl get certificate -n vostra -w

# Check challenges (only during issuance)
kubectl get challenges -n vostra
```

### Check cert-manager Logs

```bash
kubectl logs -n cert-manager -l app=cert-manager
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n vostra

# If status is ImagePullBackOff or ErrImagePull:
# Rebuild and import images
cd /var/www/vostra-invoice-web
docker build -t vostra-invoice-frontend:v1 ./frontend
docker save vostra-invoice-frontend:v1 | sudo k3s ctr images import -
kubectl rollout restart deployment/vostra-invoice -n vostra

# Check pod events
kubectl describe pod <pod-name> -n vostra

# Check logs
kubectl logs <pod-name> -n vostra
```

### SSL Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n vostra

# If READY is False, check description
kubectl describe certificate vostra-tls -n vostra

# Check ACME challenges
kubectl get challenges -n vostra

# If challenges are pending, check:
kubectl describe challenge <challenge-name> -n vostra

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

### Site Not Accessible

```bash
# Check if pods are running
kubectl get pods -n vostra

# Check ingress
kubectl get ingress -n vostra
kubectl describe ingress vostra-ingress -n vostra

# Test from server
curl -I https://vostra.ai/
curl -I https://vostra.ai/vostra-invoice/

# Check DNS
nslookup vostra.ai 8.8.8.8
```

### GitHub Actions Failed

1. Go to: https://github.com/rcn123/vostra-invoice-web/actions
2. Click on failed workflow
3. Check error logs
4. Common issues:
   - SSH key incorrect → Update `HETZNER_SSH_KEY` secret
   - Server unreachable → Check server is running
   - Git pull failed → Check repository access
   - Build failed → Check Docker build locally first

---

## File Structure

```
/var/www/vostra-invoice-web/
├── frontend/                    # Invoice app (React)
│   ├── src/                    # Source code
│   ├── vite.config.js         # base: '/vostra-invoice/'
│   ├── Dockerfile             # Multi-stage build
│   └── nginx.conf             # Nginx config
├── landing/                    # Landing page
│   ├── index.html             # Simple HTML page
│   ├── Dockerfile             # Nginx Alpine
│   └── nginx.conf             # Nginx config
├── k8s/                        # Kubernetes manifests
│   ├── cluster-issuer.yaml    # Let's Encrypt issuer
│   ├── namespace.yaml         # vostra namespace
│   ├── landing-deployment.yaml
│   ├── landing-service.yaml
│   ├── invoice-deployment.yaml
│   ├── invoice-service.yaml
│   └── ingress.yaml           # SSL + routing
├── .github/workflows/          # CI/CD
│   └── deploy.yml             # Auto-deploy to k8s
├── README.md                   # Main documentation
└── DEPLOYMENT.md              # This file
```

---

## Architecture

### Request Flow

```
User (Browser)
    ↓
DNS: vostra.ai → 65.21.145.222
    ↓
Traefik Ingress (port 443)
    ↓
SSL Termination (Let's Encrypt)
    ↓
Path-Based Routing:
    ├── /                → vostra-landing service → landing pods (2x)
    └── /vostra-invoice/ → vostra-invoice service → invoice pods (2x)
```

### Path-Based Routing

| URL | Service | Pods | Description |
|-----|---------|------|-------------|
| `https://vostra.ai/` | vostra-landing | 2 | Simple landing page |
| `https://vostra.ai/vostra-invoice/` | vostra-invoice | 2 | React app |

### Port Configuration

| Port | Service | Description |
|------|---------|-------------|
| 80 | Traefik (web) | HTTP traffic (redirects to HTTPS) |
| 443 | Traefik (websecure) | HTTPS traffic with SSL |
| 8081 | google-eshop | Other project (Traefik web) |
| 8082 | google-eshop | Other project (default namespace) |
| 8083 | google-eshop | Other project (google-eshop namespace) |

---

## Local Development vs Production

### Path Differences

**Local Development:**
```bash
cd frontend
npm run dev
# Runs at: http://localhost:5173/
# Routes: / and /demo
```

**Production:**
```bash
# Deployed at: https://vostra.ai/vostra-invoice/
# Routes: /vostra-invoice/ and /vostra-invoice/demo
```

### Configuration for Production

These files enable the `/vostra-invoice/` subpath:

1. **frontend/vite.config.js**
   ```js
   export default defineConfig({
     base: '/vostra-invoice/',  // ← Added this
     plugins: [react()],
   })
   ```

2. **frontend/src/App.jsx**
   ```jsx
   <Router basename="/vostra-invoice">  {/* ← Added this */}
     <Routes>
       <Route path="/" element={<LandingPage />} />
       <Route path="/demo" element={<DemoPage />} />
     </Routes>
   </Router>
   ```

---

## Next Steps (Optional)

- [ ] Add backend API (FastAPI)
- [ ] Add database (PostgreSQL)
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Add logging aggregation (Loki)
- [ ] Configure backup strategy
- [ ] Add staging environment
- [ ] Set up CDN (CloudFlare)

---

## Support

**Check deployment status:**
```bash
kubectl get all -n vostra
```

**View recent logs:**
```bash
kubectl logs -n vostra -l app=vostra-invoice --tail=50
```

**Check certificate:**
```bash
kubectl describe certificate vostra-tls -n vostra
```

**GitHub Actions:**
https://github.com/rcn123/vostra-invoice-web/actions
