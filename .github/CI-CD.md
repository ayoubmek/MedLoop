# CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

## Pipeline Overview

The CI/CD pipeline automatically runs on:
- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop` branches

## Pipeline Jobs

### 1. Frontend Build ✅
- Installs Node.js dependencies
- Builds the Angular frontend
- Runs ESLint code quality checks

### 2. Backend Build ✅
- Compiles Java microservices
- Admin Microservice
- Hospital Service

### 3. Docker Build ✅
- Builds Docker images for services
- Creates container images ready for deployment

### 4. Code Quality ✅
- Runs linting checks
- Ensures code standards

## Status

![CI/CD](https://github.com/yourusername/medloop/actions/workflows/ci-cd.yml/badge.svg)

## Local Testing

To test the pipeline locally before pushing:

```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd services/admin-microservice
./mvnw clean package

cd ../HospitalService
./mvnw clean package
```

## View Pipeline Results

Check the [Actions](../../actions) tab to see:
- Build status
- Test results
- Deployment logs
