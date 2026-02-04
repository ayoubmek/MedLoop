# MedLoop - Setup Guide

## Project Overview

MedLoop is a hospital management system with the following components:
- **Admin Microservice** (Spring Boot 3.2.2) - Backend API on port 8081
- **Frontend** (Angular 20) - Web UI on port 4200
- **Keycloak** - Identity Provider on port 8080
- **PostgreSQL** - Database on port 5432

## Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Maven 3.9+ (for local development)
- Node.js 18+ & npm (for frontend)

---

## Quick Start with Docker

### Step 1: Start All Services

```bash
cd "C:\Users\skander\pds master\MedLoop"
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Keycloak (port 8080)
- Admin Microservice (port 8081)

### Step 2: Wait for Services to be Ready

```bash
# Check service health
docker-compose ps

# View logs
docker-compose logs -f
```

Wait until all services show as "healthy".

### Step 3: Access Keycloak Admin Console

1. Open: http://localhost:8080
2. Click "Administration Console"
3. Login with:
   - Username: `admin`
   - Password: `admin123`

### Step 4: Start Frontend

```bash
cd frontend
npm install
npm start
```

Access the application at: http://localhost:4200

---

## Test Users (Pre-configured in Keycloak)

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | Admin@123 | ADMIN | Full system access |
| doctor1 | Doctor@123 | DOCTOR | Medical staff access |
| gestionnaire1 | Manager@123 | GESTIONNAIRE | Service manager access |
| security1 | Security@123 | RESPONSABLE_SECURITE | Security officer access |

---

## Local Development (Without Docker)

### Step 1: Start PostgreSQL and Keycloak with Docker

```bash
# Start only PostgreSQL and Keycloak
docker-compose up -d postgres keycloak
```

### Step 2: Run Admin Microservice Locally

```bash
cd services/admin-microservice

# Using Maven
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Or on Windows
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## API Documentation

Once the admin microservice is running, access Swagger UI:
- Swagger UI: http://localhost:8081/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/api-docs

---

## API Endpoints

### Hospitals
- `GET /api/hospitals` - List all hospitals
- `GET /api/hospitals/{id}` - Get hospital by ID
- `POST /api/hospitals` - Create hospital (ADMIN only)
- `PUT /api/hospitals/{id}` - Update hospital (ADMIN only)
- `DELETE /api/hospitals/{id}` - Delete hospital (ADMIN only)

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create doctor (ADMIN only)
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor (ADMIN only)
- `POST /api/doctors/{id}/assign-hospital/{hospitalId}` - Assign to hospital

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient (ADMIN only)
- `POST /api/patients/{id}/assign-doctor/{doctorId}` - Assign to doctor

### Statistics
- `GET /api/statistics` - Get system statistics (ADMIN/GESTIONNAIRE)

### Audit
- `GET /api/audit` - Get audit logs (ADMIN/RESPONSABLE_SECURITE)
- `GET /api/audit/failed` - Get failed operations

---

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| ADMIN | Full access to all endpoints |
| DOCTOR | Read all, Create/Update patients, View own patients |
| GESTIONNAIRE | Read all, View statistics |
| RESPONSABLE_SECURITE | Read audit logs, Security features |
| PATIENT | View own records (limited) |

---

## Keycloak Configuration

The realm is automatically imported with:
- Realm: `medloop`
- Client: `admin-service`
- Pre-configured roles and users

### Manual Keycloak Setup (if auto-import fails)

1. Login to Keycloak Admin Console
2. Create realm named `medloop`
3. Create client `admin-service`:
   - Client Protocol: openid-connect
   - Access Type: public
   - Valid Redirect URIs: http://localhost:4200/*
   - Web Origins: http://localhost:4200
4. Create realm roles: ADMIN, DOCTOR, GESTIONNAIRE, RESPONSABLE_SECURITE, PATIENT
5. Create users and assign roles

---

## Troubleshooting

### Keycloak not starting
```bash
docker-compose logs keycloak
```
Wait for PostgreSQL to be ready first.

### Database connection issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Connect to PostgreSQL
docker exec -it medloop-postgres psql -U medloop -d medloop_db
```

### JWT validation errors
- Ensure Keycloak is running and accessible at http://localhost:8080
- Verify the realm `medloop` exists
- Check if the client `admin-service` is properly configured

### CORS errors
- Verify frontend is running on http://localhost:4200
- Check application.yml for correct CORS configuration

---

## Stopping Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

---

## Project Structure

```
MedLoop/
├── docker-compose.yml          # Docker orchestration
├── init-db.sql                 # Database initialization
├── keycloak/
│   └── realm-export.json       # Keycloak realm configuration
├── frontend/                   # Angular 20 frontend
│   └── src/
│       ├── app/
│       │   ├── services/       # API services
│       │   ├── models/         # TypeScript interfaces
│       │   └── pages/          # Feature modules
│       └── ...
└── services/
    └── admin-microservice/     # Spring Boot backend
        └── src/main/java/com/medloop/admin/
            ├── config/         # Security & OpenAPI config
            ├── controller/     # REST controllers
            ├── dto/            # Data Transfer Objects
            ├── entity/         # JPA entities
            ├── exception/      # Exception handling
            ├── repository/     # Spring Data repositories
            └── service/        # Business logic
```
