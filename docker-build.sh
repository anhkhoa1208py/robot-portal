#!/bin/bash

# Face Recognition Portal - Docker Build Script
# This script builds the production Docker image

set -e

echo "🚀 Building Face Recognition Portal for production..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✅ Loaded production environment variables"
else
    echo "❌ .env.production file not found. Please copy from .env.example"
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t face-recognition-portal:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "📦 Image name: face-recognition-portal:latest"
echo ""
echo "🚀 To run the container:"
echo "   docker run -p 3000:3000 --env-file .env.production face-recognition-portal:latest"
echo ""
echo "🐳 Or use docker-compose:"
echo "   docker-compose up -d" 