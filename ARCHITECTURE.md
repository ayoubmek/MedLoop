# MedLoop Fullstack Monorepo Architecture

## Project Structure

This repository follows a **Fullstack Monorepo** architecture, separating the backend microservices from the frontend applications.

```
MedLoop/
├── backend/
│   ├── Microservices/
│   │   ├── patient-service       # Patient Management & Logic
│   │   ├── appointment-service   # Appointment Scheduling (formerly DoctorWeb)
│   │   └── auth-service          # Authentication & User Management (formerly user-service)
│   ├── gateway/                  # API Gateway (Spring Cloud Gateway)
│   ├── keycloak/                 # Identity Provider Config
│   ├── config-server/            # Centralized Configuration
│   └── discovery/                # Service Discovery (Eureka)
│
├── frontend/
│   ├── web/
│   │   └── appointment-web/      # Doctor/Appointment Web App (Angular)
│   └── mobile/                   # Mobile Application (React Native/Expo)
│
├── infrastructure/               # Docker & CI/CD
│   └── docker-compose.yml        # Main Composition
└── README.md
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Layers                               │
│  ┌──────────────────────┐             ┌──────────────────────────┐  │
│  │   Web App (React)    │             │   Mobile App (React N)   │  │
│  └──────────┬───────────┘             └─────────────┬────────────┘  │
└─────────────┼───────────────────────────────────────┼───────────────┘
              │                                       │
              │ REST / GraphQL                        │
              │                                       │
   ┌──────────▼───────────────BACKEND─────────────────▼─────────────┐
   │                                                                │
   │                    ┌────────────────────┐                      │
   │                    │    API Gateway     │                      │
   │                    │      (8080)        │                      │
   │                    └─────────┬──────────┘                      │
   │                              │                                 │
   │          ┌───────────────────┼────────────────────┐            │
   │          │                   │                    │            │
   │ ┌────────▼────────┐ ┌────────▼─────────┐ ┌────────▼─────────┐  │
   │ │  Auth Service   │ │ Patient Service  │ │ Appointment Svc  │  │
   │ │     (8082)      │ │     (8081)       │ │     (8083)       │  │
   │ └─────────────────┘ └──────────────────┘ └──────────────────┘  │
   │                                                                │
   │          ┌────────────────────────────────────────┐            │
   │          │           Infrastructure               │            │
   │          │  [Eureka] [Config Server] [Keycloak]   │            │
   │          └────────────────────────────────────────┘            │
   └────────────────────────────────────────────────────────────────┘
```

## Service Details

### Backend
- **Auth Service**: Manages users, roles, and security tokens.
- **Patient Service**: Handles patient records and medical history.
- **Appointment Service**: Manages doctor schedules and bookings.
- **Gateway**: The single entry point, handling routing and rate limiting.

### Frontend
- **Web**: Admin and Doctor portals.
- **Mobile**: Patient interaction interface.

## Technology Stack

- **Backend**: Spring Boot 3.2, Spring Cloud, Keycloak
- **Frontend**: React, React Native, TypeScript
- **Database**: Oracle / MySQL
- **Containerization**: Docker, Docker Compose
