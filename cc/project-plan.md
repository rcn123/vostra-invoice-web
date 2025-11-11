# Vostra Invoice Web - Project Plan

## Overview
Public marketing website + demo application for Vostra Invoice product.

**Tech Stack:**
- Frontend: React + Tailwind CSS
- Backend: Python FastAPI (containerized)
- Deployment: Hetzner server with k3s (Kubernetes)

---

## Phase 1: Frontend Foundation

### 1.1 Project Setup
- [ ] Initialize React project (Vite recommended for speed)
- [ ] Configure Tailwind CSS
- [ ] Setup project structure following modular principles
- [ ] Configure ESLint/Prettier
- [ ] Create .gitignore

### 1.2 Public Landing Page
- [ ] Hero section with value proposition
- [ ] Benefits/features section
- [ ] Product overview
- [ ] Pricing (if applicable)
- [ ] "Try it out" CTA button (prominent placement)
- [ ] Footer with links

### 1.3 Demo Section
- [ ] Separate route for demo (`/demo`)
- [ ] Demo UI implementation
- [ ] Connect demo to backend API
- [ ] Error handling (fail fast, log errors)

---

## Phase 2: Backend Development

### 2.1 FastAPI Setup
- [ ] Initialize FastAPI project
- [ ] Setup project structure (modular, testable)
- [ ] Configure logging (no silent failures)
- [ ] API endpoints for demo functionality
- [ ] Input validation
- [ ] Error handling (fail fast)

### 2.2 Containerization
- [ ] Create Dockerfile for FastAPI
- [ ] Docker compose for local development
- [ ] Environment configuration
- [ ] Health check endpoints

---

## Phase 3: Deployment

### 3.1 Hetzner Setup
- [ ] Verify k3s cluster is running
- [ ] Configure kubectl access
- [ ] Setup namespaces

### 3.2 Frontend Deployment
- [ ] Create Dockerfile for React app (nginx)
- [ ] Kubernetes manifests (deployment, service, ingress)
- [ ] Configure domain/DNS
- [ ] SSL/TLS certificates (Let's Encrypt)

### 3.3 Backend Deployment
- [ ] Kubernetes manifests for FastAPI
- [ ] Service configuration
- [ ] Internal networking between frontend/backend
- [ ] Environment variables/secrets management

### 3.4 Infrastructure
- [ ] Setup CI/CD pipeline (optional)
- [ ] Configure logging/monitoring
- [ ] Backup strategy
- [ ] Health checks

---

## File Structure (Proposed)

```
vostra-invoice-web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   └── demo/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── k8s/
│   ├── frontend/
│   └── backend/
├── cc/
│   ├── project-plan.md
│   └── paste.txt
├── core-rules.md
└── README.md
```

---

## Next Steps

**Immediate actions:**
1. Clarify product details for landing page content
2. Define demo functionality scope
3. Initialize frontend project
4. Create basic landing page structure

**Questions to address:**
- What specific features should the demo showcase?
- What are the key benefits to highlight on landing page?
- Do you have branding assets (logo, colors, fonts)?
- What invoice functionality should demo include?
