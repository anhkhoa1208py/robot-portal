#!/bin/bash

# Face Recognition Portal - Docker Deployment Script
# This script manages the production deployment

set -e

ACTION=${1:-"up"}

echo "🐳 Face Recognition Portal - Docker Deployment"
echo "================================================"

case $ACTION in
  "up"|"start")
    echo "🚀 Starting Face Recognition Portal..."
    docker-compose up -d
    echo ""
    echo "✅ Application started successfully!"
    echo "📱 Access the app at: http://localhost:3000"
    echo ""
    echo "📊 To view logs: docker-compose logs -f"
    echo "⏹️  To stop: ./docker-deploy.sh stop"
    ;;
  
  "down"|"stop")
    echo "⏹️  Stopping Face Recognition Portal..."
    docker-compose down
    echo "✅ Application stopped successfully!"
    ;;
  
  "restart")
    echo "🔄 Restarting Face Recognition Portal..."
    docker-compose restart
    echo "✅ Application restarted successfully!"
    ;;
  
  "logs")
    echo "📋 Showing logs..."
    docker-compose logs -f
    ;;
  
  "build")
    echo "🔨 Building and starting..."
    docker-compose up -d --build
    echo "✅ Build and deployment completed!"
    ;;
  
  "status")
    echo "📊 Container status:"
    docker-compose ps
    ;;
  
  "clean")
    echo "🧹 Cleaning up..."
    docker-compose down
    docker system prune -f
    echo "✅ Cleanup completed!"
    ;;
  
  *)
    echo "❌ Unknown action: $ACTION"
    echo ""
    echo "Usage: $0 [action]"
    echo "Actions:"
    echo "  up|start    - Start the application (default)"
    echo "  down|stop   - Stop the application"
    echo "  restart     - Restart the application"
    echo "  logs        - Show application logs"
    echo "  build       - Build and start"
    echo "  status      - Show container status"
    echo "  clean       - Stop and clean up"
    exit 1
    ;;
esac 