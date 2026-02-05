-- Initialize MedLoop Database
-- This script runs when PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medloop_db TO medloop;

-- Create hospital database for Hospital Service
CREATE DATABASE hospital;

-- Grant privileges on hospital database
GRANT ALL PRIVILEGES ON DATABASE hospital TO medloop;

-- If you want to use the postgres user as specified in your docker-compose
-- You can also grant to the default postgres superuser
-- (Note: postgres superuser already has all privileges by default)