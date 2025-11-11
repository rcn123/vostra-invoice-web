 
  What's Already Deployed:

  - ✅ https://vostra.ai/ (landing page)
  - ✅ https://vostra.ai/vostra-invoice/ (invoice app)
  - ✅ SSL certificate (auto-renews)
  - ✅ Kubernetes with 2 replicas each
  - ✅ Traefik ingress with path-based routing

  From Your Local Computer:

  The files are staged but not committed (server doesn't have git user configured). Pull and commit from your local computer:

  # On your local computer
  cd /path/to/vostra-invoice-web
  git pull origin main

  # Review the changes
  git status
  git diff --cached

  # Commit with your identity
  git commit -m "Deploy to Kubernetes with HTTPS and automated CI/CD"

  # Push to trigger auto-deployment
  git push origin main

  Auto-Deployment Setup (One-Time):

  1. Go to: https://github.com/rcn123/vostra-invoice-web/settings/secrets/actions
  2. Add these 3 secrets (if not already added):
    - HETZNER_HOST: 65.21.145.222
    - HETZNER_USER: root
    - HETZNER_SSH_KEY: (your private SSH key from ~/.ssh/id_rsa)
