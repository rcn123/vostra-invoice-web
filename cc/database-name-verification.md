# Database Name Verification

**Database Name:** `vostra-invoice-web` (CONSISTENT EVERYWHERE ✅)

**Last Verified:** 2025-11-14

---

## Local Development

| File | Line | Value |
|------|------|-------|
| `backend/docker-compose.dev.yml` | 8 | ✅ `POSTGRES_DB: vostra-invoice-web` |
| `backend/api/.env.example` | 2 | ✅ `postgresql://vostra:dev_password@localhost:5432/vostra-invoice-web` |
| `backend/api/app/config.py` | 9 | ✅ `postgresql://vostra:dev_password@localhost:5432/vostra-invoice-web` |
| `backend/api/alembic.ini` | 55 | ✅ `postgresql://vostra:dev_password@localhost:5432/vostra-invoice-web` |

---

## Production (Kubernetes)

| File | Line | Value |
|------|------|-------|
| `cc/invoice-upload-implementation-plan.md` | 599 | ✅ `POSTGRES_DB: vostra-invoice-web` |
| `.github/workflows/deploy.yml` | 37 | ✅ `postgresql://vostra:${{ secrets.DB_PASSWORD }}@postgres:5432/vostra-invoice-web` |

---

## Connection String Format

### Local Development:
```
postgresql://vostra:dev_password@localhost:5432/vostra-invoice-web
```

### Production:
```
postgresql://vostra:{DB_PASSWORD}@postgres:5432/vostra-invoice-web
```

Where `{DB_PASSWORD}` comes from GitHub Secrets.

---

## Fixed Issues

- ❌ **Was:** `POSTGRES_DB: vostra_invoices` (in implementation plan)
- ✅ **Now:** `POSTGRES_DB: vostra-invoice-web` (everywhere)

---

## Verification Commands

### Check all references:
```bash
# Search for database name
grep -r "vostra-invoice-web" backend/ cc/ .github/ --include="*.py" --include="*.yml" --include="*.yaml" --include="*.ini" --include=".env.example" | grep -i "postgres\|database"

# Search for old name (should return nothing)
grep -r "vostra_invoices" backend/ cc/ .github/
```

### Expected result:
- All references to database should be `vostra-invoice-web`
- No references to `vostra_invoices` should exist

---

## Notes

- Database name uses hyphens (`-`) not underscores (`_`)
- Name matches the project/repository name
- Consistent across all environments (dev/prod)
- Username is always `vostra`
- Host is `localhost:5432` (dev) or `postgres:5432` (prod k8s service)
