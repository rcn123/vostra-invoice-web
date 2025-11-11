#!/bin/bash
set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Stop and remove old containers
docker compose down

# Build and start new containers
docker compose build --no-cache
docker compose up -d

# Clean up old images
docker image prune -f

echo "Deployment complete!"
docker compose ps
