apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: vostra-invoice-web
type: Opaque
stringData:
  postgres-password: "${DB_PASSWORD}"
  database-url: "${DATABASE_URL}"
  openai-api-key: "${OPENAI_API_KEY}"
