# How to Re-Import AI2 Database

File: `backend/data/ai2_export_postgresql.sql` (gitignored)

## Local (Docker Compose)

**Replace data**:
```bash
# 1. Replace SQL file
gunzip new_export.sql.gz
mv new_export.sql backend/data/ai2_export_postgresql.sql

# 2. Drop & recreate schema
docker exec vostra-invoice-ai2-postgres-dev psql -U vostra -d ai2 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 3. Import
docker exec -i vostra-invoice-ai2-postgres-dev psql -U vostra -d ai2 < backend/data/ai2_export_postgresql.sql

# 4. Verify
docker exec vostra-invoice-ai2-postgres-dev psql -U vostra -d ai2 -c "SELECT COUNT(*) FROM suppliers;"
```

**Connection**: `postgresql://vostra:dev_password@localhost:5433/ai2`

## Production (Kubernetes)

**Replace data**:
```bash
# 1. SSH and replace file
ssh root@65.21.145.222
cd /var/www/vostra-invoice-web/backend/data
gunzip new_export.sql.gz
mv new_export.sql ai2_export_postgresql.sql

# 2. Drop & recreate schema
kubectl exec -n vostra-invoice-web deployment/postgres-ai2 -- \
  psql -U vostra -d ai2 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 3. Import
kubectl exec -n vostra-invoice-web deployment/postgres-ai2 -- \
  psql -U vostra -d ai2 -f /imports/ai2_export_postgresql.sql

# 4. Verify
kubectl exec -n vostra-invoice-web deployment/postgres-ai2 -- \
  psql -U vostra -d ai2 -c "SELECT COUNT(*) FROM suppliers;"
```

**Connection from pods**: `postgresql://vostra:${DB_PASSWORD}@postgres-ai2:5432/ai2`

## Tables

- `suppliers` (lev_nr, namn, org_nr, SNI codes, jurform)
- `transactions` (fakturanr, konto, kst, projekt, belopp, ver_datum)
