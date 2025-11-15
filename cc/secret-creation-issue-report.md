# Secret Creation Issue Report

**Date:** 2025-11-15
**Status:** Secrets not being created during GitHub Actions deployment
**Impact:** Backend pods (postgres, vostra-api, vostra-ai-extractor) fail to start with `CreateContainerConfigError`

---

## Problem Statement

The GitHub Actions deployment workflow is **not creating the `backend-secrets` secret** in the `vostra-invoice-web` namespace, causing all backend pods to fail on startup.

### Evidence

```bash
kubectl get secret backend-secrets -n vostra-invoice-web
# Error from server (NotFound): secrets "backend-secrets" not found

kubectl get pods -n vostra-invoice-web
# postgres-xxx: CreateContainerConfigError (45 minutes)
# vostra-api-xxx: Pending
# vostra-ai-extractor-xxx: Pending
```

### Manual Fix Worked

Creating the secret manually on the server succeeded:
```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: vostra-invoice-web
type: Opaque
stringData:
  postgres-password: "test123"
  database-url: "postgresql://vostra:test123@postgres:5432/vostra-invoice-web"
  openai-api-key: "sk-test"
EOF
```

This proves:
- ✅ Namespace exists
- ✅ Permissions are correct
- ✅ YAML syntax is valid
- ❌ GitHub Actions workflow is failing to execute this command

---

## Root Cause Analysis

### Current Workflow Code (.github/workflows/deploy.yml)

```yaml
- name: Deploy to Hetzner Kubernetes
  uses: appleboy/ssh-action@v1.0.3
  env:
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  with:
    host: ${{ secrets.HETZNER_HOST }}
    username: ${{ secrets.HETZNER_USER }}
    key: ${{ secrets.HETZNER_SSH_KEY }}
    envs: DB_PASSWORD,OPENAI_API_KEY
    script: |
      cd /var/www/vostra-invoice-web
      git pull origin main

      # Create namespace first
      kubectl apply -f k8s/namespace.yaml

      # Create/Update Kubernetes secrets using kubectl apply (idempotent, fail-fast)
      cat <<EOF | kubectl apply -f -
      apiVersion: v1
      kind: Secret
      metadata:
        name: backend-secrets
        namespace: vostra-invoice-web
      type: Opaque
      stringData:
        postgres-password: "${DB_PASSWORD}"
        database-url: "postgresql://vostra:${DB_PASSWORD}@postgres:5432/vostra-invoice-web"
        openai-api-key: "${OPENAI_API_KEY}"
      EOF

      # ... rest of deployment
```

### Issues Identified

1. **Nested Heredoc Problem**
   - The `appleboy/ssh-action` uses a script block (which is itself like a heredoc)
   - Inside this, we're using `cat <<EOF`
   - Bash may be getting confused about which `EOF` closes which heredoc
   - This is a **common bash parsing issue** with nested heredocs

2. **Silent Failure**
   - The workflow appears to succeed (GitHub Actions shows green)
   - But the secret creation silently fails
   - No error is logged or reported
   - Violates our core-rule: "Absolutely no silent failures -> fail fast and log"

3. **Variable Expansion Uncertainty**
   - With nested heredocs, it's unclear when `${DB_PASSWORD}` gets expanded
   - Could be expanded locally (wrong - exposes in GitHub Actions logs)
   - Could fail to expand at all (wrong - literal string saved)
   - Should expand remotely after SSH connection (correct)

---

## Proposed Solutions

### Option 1: Use Different Heredoc Delimiter (Simplest)

Change the inner heredoc to use a unique delimiter:

```yaml
cat << 'SECRETEOF' | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: vostra-invoice-web
type: Opaque
stringData:
  postgres-password: "${DB_PASSWORD}"
  database-url: "postgresql://vostra:${DB_PASSWORD}@postgres:5432/vostra-invoice-web"
  openai-api-key: "${OPENAI_API_KEY}"
SECRETEOF
```

**Pros:**
- Minimal change
- Standard bash practice for nested heredocs
- Single quotes around delimiter prevent local expansion
- Variables expand on remote server (correct)

**Cons:**
- Still uses nested heredoc approach

---

### Option 2: Use kubectl create secret (Imperative)

```yaml
kubectl create secret generic backend-secrets \
  --from-literal=postgres-password="${DB_PASSWORD}" \
  --from-literal=database-url="postgresql://vostra:${DB_PASSWORD}@postgres:5432/vostra-invoice-web" \
  --from-literal=openai-api-key="${OPENAI_API_KEY}" \
  --namespace=vostra-invoice-web \
  --dry-run=client -o yaml | kubectl apply -f -
```

**Pros:**
- No heredoc nesting issues
- `--dry-run=client -o yaml | kubectl apply` makes it idempotent
- Single command, easier to debug

**Cons:**
- Exposes secrets in process list (`ps aux` shows command args)
- Saved in shell history
- Not declarative (goes against IaC best practices)
- Security researchers warn against this approach

---

### Option 3: Create Secret Manifest File (Most Production-Ready)

Create `k8s/backend-secrets.yaml.template`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: vostra-invoice-web
type: Opaque
stringData:
  postgres-password: "PLACEHOLDER_DB_PASSWORD"
  database-url: "PLACEHOLDER_DATABASE_URL"
  openai-api-key: "PLACEHOLDER_OPENAI_API_KEY"
```

Then in workflow:

```yaml
# Replace placeholders with actual secrets
sed -e "s|PLACEHOLDER_DB_PASSWORD|${DB_PASSWORD}|g" \
    -e "s|PLACEHOLDER_DATABASE_URL|postgresql://vostra:${DB_PASSWORD}@postgres:5432/vostra-invoice-web|g" \
    -e "s|PLACEHOLDER_OPENAI_API_KEY|${OPENAI_API_KEY}|g" \
    k8s/backend-secrets.yaml.template | kubectl apply -f -
```

**Pros:**
- Fully declarative (IaC best practice)
- Template is version-controlled
- No heredoc issues
- Clear separation of structure vs secrets
- Industry standard approach

**Cons:**
- Adds another file to repository
- Template file shows secret structure (minor security consideration)
- More complex setup

---

### Option 4: Use Sealed Secrets (Future Production Solution)

Use Bitnami Sealed Secrets or External Secrets Operator.

**Pros:**
- Production-grade secret management
- Secrets encrypted in git
- No manual secret handling in workflows
- Industry best practice for Kubernetes

**Cons:**
- Requires additional setup (sealed-secrets controller)
- More complex infrastructure
- Overkill for current MVP stage

---

## Recommendation

**Short-term (Now):** Use **Option 1** (Different Heredoc Delimiter)
- Minimal risk
- Proven solution for nested heredocs
- Fixes immediate problem
- 5-minute implementation

**Medium-term (After MVP):** Migrate to **Option 3** (Secret Manifest Template)
- Industry standard
- Better maintainability
- Cleaner separation of concerns

**Long-term (Production):** Implement **Option 4** (Sealed Secrets)
- Production-grade security
- No secrets in CI/CD logs
- Audit trail
- Rotation support

---

## Testing Plan

After implementing fix:

1. **Trigger deployment:**
   ```bash
   git push origin main
   ```

2. **Verify secret creation:**
   ```bash
   kubectl get secret backend-secrets -n vostra-invoice-web
   kubectl describe secret backend-secrets -n vostra-invoice-web
   ```

3. **Verify pods start:**
   ```bash
   kubectl get pods -n vostra-invoice-web
   # All pods should be Running
   ```

4. **Test API:**
   ```bash
   curl https://vostra.ai/api/health
   ```

---

## Additional Context

### Why This Matters

This is a **critical blocker** for the deployment:
- ❌ Backend completely non-functional in production
- ❌ Cannot test invoice upload flow
- ❌ Cannot proceed to Phase 4 (additional endpoints)
- ✅ Frontend works (but isolated from backend)

### Core Rules Violated

From `cc/core-rules.md`:
- **"Absolutely no silent failures -> fail fast and log"**
  - Current workflow fails silently
  - No error indication in GitHub Actions
  - Violates fail-fast principle

### Related Files

- `.github/workflows/deploy.yml` - Deployment workflow
- `k8s/postgres-deployment.yaml` - References backend-secrets
- `k8s/api-deployment.yaml` - References backend-secrets
- `k8s/ai-extractor-deployment.yaml` - References backend-secrets

---

## Decision Required

Which solution should we implement?

1. ⚡ **Quick fix:** Option 1 (different delimiter) - 5 minutes
2. 🏗️ **Better fix:** Option 3 (template file) - 15 minutes
3. 🔮 **Future fix:** Option 4 (sealed secrets) - Phase 6

**Recommendation:** Start with Option 1 now, plan Option 3 for next week.
