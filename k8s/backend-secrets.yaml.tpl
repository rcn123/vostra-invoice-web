apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: vostra-invoice-web
type: Opaque
data:
  postgres-password: ${DB_PASSWORD_B64}
  database-url: ${DATABASE_URL_B64}
  ai2-database-url: ${AI2_DATABASE_URL_B64}
  openai-api-key: ${OPENAI_API_KEY_B64}
