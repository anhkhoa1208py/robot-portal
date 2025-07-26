# Environment Configuration Added

The API base URL is now configured via environment variables.
Copy .env.example to .env.local and update the values:

```bash
cp .env.example .env.local
```

## 🐳 Docker Production Deployment

The application is fully containerized for production deployment using Docker.

### Prerequisites

- Docker and Docker Compose installed
- `.env.production` file configured

### Quick Start

```bash
# 1. Set up production environment
cp .env.example .env.production
# Edit .env.production with your production values

# 2. Build and deploy
./docker-deploy.sh up
```

### Build Options

#### Option 1: Using Scripts (Recommended)
```bash
# Build Docker image
./docker-build.sh

# Deploy with docker-compose
./docker-deploy.sh up
```

#### Option 2: Using npm scripts
```bash
npm run docker:build
npm run docker:up
```

#### Option 3: Manual Docker commands
```bash
# Build image
docker build -t face-recognition-portal:latest .

# Run container
docker run -d -p 3000:3000 --env-file .env.production face-recognition-portal:latest
```

### Management Commands

```bash
# Start application
./docker-deploy.sh up

# Stop application  
./docker-deploy.sh down

# View logs
./docker-deploy.sh logs

# Restart application
./docker-deploy.sh restart

# Rebuild and start
./docker-deploy.sh build

# Check status
./docker-deploy.sh status

# Clean up
./docker-deploy.sh clean
```

### Environment Configuration

Create `.env.production` with your production settings:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://your-api-server.com:20003

# Application Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Server Configuration
PORT=3000
HOSTNAME=0.0.0.0
```

### Production Features

- ✅ **Multi-stage build** for optimized image size
- ✅ **Non-root user** for security
- ✅ **Health checks** for container monitoring
- ✅ **Standalone output** for minimal runtime
- ✅ **Environment-based configuration**
- ✅ **Production optimizations** enabled

### Monitoring

The container includes health checks:
```bash
# Check container health
docker-compose ps
```

Application will be available at `http://localhost:3000`
