# VostraInvoice Web

Public marketing website and demo for VostraInvoice - AI-powered invoice processing for Swedish municipalities and organizations.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python FastAPI (planned)
- **Deployment**: Hetzner with Docker + GitHub Actions

## Project Structure

```
vostra-invoice-web/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app with routing
├── cc/                # Planning and notes
└── core-rules.md      # Development guidelines
```

## Getting Started

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173/`

### Routes

- `/` - Public landing page
- `/demo` - Demo placeholder

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick start:**
- Push to `main` branch → auto-deploys to Hetzner via GitHub Actions
- Manual deploy: SSH to server and run `./deploy.sh`

## Project Planning

See `cc/project-plan.md` for full project roadmap.