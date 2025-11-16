# Production TODO & Future Improvements

**Created:** 2025-11-14
**Purpose:** Track production hardening and future enhancements

---

## Security Enhancements

### 🔐 Secret Management

**Current:** GitHub Secrets (Security: 7/10)
- Secrets stored in GitHub (encrypted)
- Deployed via GitHub Actions
- Good for MVP and initial production

**Future:** Migrate to HashiCorp Vault or Cloud Secret Manager (Security: 10/10)

**Why Vault?**
- Centralized secret management across all services
- Automatic secret rotation
- Detailed audit trails
- Fine-grained access control
- Secret versioning
- Dynamic secrets (generate DB credentials on-demand)

**Migration Plan:**
1. Set up Vault server (can run in k8s)
2. Configure Vault Kubernetes authentication
3. Use Vault Agent Injector to inject secrets into pods
4. Remove secrets from GitHub
5. Implement secret rotation policies

**Resources:**
- [Vault on Kubernetes](https://www.vaultproject.io/docs/platform/k8s)
- [Vault Agent Injector](https://www.vaultproject.io/docs/platform/k8s/injector)

**Estimated Effort:** 1-2 days
**Priority:** Medium (after MVP launch)

---

## Infrastructure

### Load Balancing & High Availability
- [ ] Multi-replica PostgreSQL with replication
- [ ] PostgreSQL backup strategy (automated daily backups)
- [ ] Redis for session/cache management
- [ ] Horizontal pod autoscaling based on CPU/memory

### Monitoring & Observability
- [ ] Prometheus + Grafana for metrics
- [ ] Loki for log aggregation
- [ ] AlertManager for alerting
- [ ] APM (Application Performance Monitoring)

### Security Hardening
- [ ] Network policies in k8s
- [ ] Pod security policies
- [ ] Regular security scanning (Trivy, OWASP ZAP)
- [ ] Rate limiting on API endpoints
- [ ] WAF (Web Application Firewall)

---

## Application Features

### AI/ML Improvements
- [ ] Migrate from GPT-4 to local LLM (Donut/LayoutLMv3)
- [ ] Fine-tune model on Swedish invoices
- [ ] Active learning pipeline (use user corrections to improve model)
- [ ] Confidence threshold tuning
- [ ] Multi-language support

### Data & Analytics
- [ ] Analytics dashboard (extraction accuracy, processing times)
- [ ] Export to accounting systems (Fortnox, Visma, etc.)
- [ ] Batch processing for multiple invoices
- [ ] Invoice search and filtering

### User Experience
- [ ] User authentication & authorization
- [ ] Multi-tenant support (different municipalities)
- [ ] Email notifications
- [ ] Webhook integrations

---

## Database

### Performance
- [ ] Database query optimization
- [ ] Indexing strategy review
- [ ] Partitioning for large tables
- [ ] Read replicas for reporting

### Backup & Recovery
- [ ] Automated daily backups to S3/Backblaze
- [ ] Point-in-time recovery
- [ ] Disaster recovery plan
- [ ] Backup restoration testing

---

## CI/CD

### Pipeline Improvements
- [ ] Multi-environment deployments (dev, staging, prod)
- [ ] Canary deployments
- [ ] Automated rollback on failure
- [ ] Infrastructure as Code (Terraform/Pulumi)

### Testing
- [ ] Automated E2E tests in CI
- [ ] Load testing in staging
- [ ] Security scanning in pipeline
- [ ] Code coverage enforcement
- [ ] Automate TypeScript type generation from OpenAPI (currently manual: `npm run generate-types`)

---

## Compliance & Legal

### GDPR & Data Protection
- [ ] Data retention policies
- [ ] Right to erasure implementation
- [ ] Data export functionality
- [ ] Privacy policy updates

### Audit & Logging
- [ ] Immutable audit logs
- [ ] User action tracking
- [ ] Data access logs
- [ ] Compliance reporting

---

## Cost Optimization

### Infrastructure
- [ ] Resource usage analysis
- [ ] Right-sizing pods and volumes
- [ ] Spot instances for non-critical workloads
- [ ] Cold storage for old invoices

### AI/ML
- [ ] Local LLM to reduce OpenAI costs
- [ ] Batch processing to optimize API calls
- [ ] Caching of extraction results

---

## Documentation

### Internal
- [ ] Architecture decision records (ADR)
- [ ] Runbooks for common operations
- [ ] Incident response playbook
- [ ] Onboarding guide for new developers

### External
- [ ] API documentation (OpenAPI/Swagger)
- [ ] User guides (Swedish)
- [ ] Integration guides for municipalities
- [ ] FAQ and troubleshooting

---

## Notes

- Review this list quarterly
- Prioritize based on user feedback and business needs
- Update as new requirements emerge
- Track completed items with dates
