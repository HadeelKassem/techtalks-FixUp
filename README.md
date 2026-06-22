# FixUp
# Description 
FixUp is a platform that connects clients with service providers , such as plumbers ,electricians ,
blacksmiths and carpenters ,and other similar professionals . The main goal is to make finding trusted 
worker easier and faster  . 
# The Problem it solve
Finding a trusted , qualified service providers is not easy , and gaining new customers is neither too . 
FixUp help fill this gap by  connecting the client searching for a maintenance to the worker reaching 
for a new customer in a centralized workspace for both sides . 

# Main features
-User registration and authentication
-Service Providers Profiles
-Service Search and filtering
-Rating , reviews, and reports 
-Job posting, booking system
-real-time notifications

# Future improvement 
-Tracking locations
-Live chat 
-recommendations

# Tech Stach 
Frontend  : React 18
Backend   : Spring Boot 3 + Spring Security
Auth      : JWT (JJWT library)
Database  : PostgreSQL + JPA / Hibernate
Real-time : WebSocket (STOMP / SockJS

# Folders Structure
techtalks-FixUp/

├── fixup-backend/          # Spring Boot REST API

│   ├── src/main/java/com/fixup/

│   │   ├── controller/     # REST endpoints

│   │   ├── service/        # Business logic

│   │   ├── repository/     # Database queries

│   │   ├── model/          # JPA entities (DB tables)

│   │   ├── dto/            # Data Transfer Objects

│   │   ├── config/         # CORS, Security config

│   │   └── security/       # JWT filter, auth logic

│   └── src/main/resources/

│       ├── application.properties.example  # Copy this!

│       └── data.sql        # Initial category data

│

└── fixup-frontend/         # React + Vite frontend

└── src/

├── pages/

│   ├── auth/       # Login, Register pages

│   ├── client/     # Client dashboard pages

│   ├── provider/   # Provider dashboard pages

│   └── admin/      # Admin dashboard pages

├── components/     # Reusable UI components

├── services/       # Axios API calls (api.js)

├── context/        # React context (auth state)

└── assets/         # Images, icons


##  Local Setup

### Prerequisites — install these first:
- Java JDK 17 → [adoptium.net](https://adoptium.net)
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- PostgreSQL 16 → [postgresql.org](https://postgresql.org)
### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/HadeelKassem/techtalks-FixUp.git
cd techtalks-FixUp/fixup-backend

# 2. Set up your database
# Open psql and run:
# CREATE DATABASE fixup_db;

# 3. Configure application.properties
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties
# Then open application.properties and set your DB password

# 4. Run the backend
./mvnw spring-boot:run

# Backend runs on http://localhost:8080


### Frontend Setup

```bash
# 1. Navigate to frontend
cd techtalks-FixUp/fixup-frontend

# 2. Install dependencies
npm install

# 3. Run the frontend
npm run dev

# Frontend runs on http://localhost:5173


##  Branching Strategy
main              ← production ready only

dev               ← integration branch, merge features 

feature/auth      ← authentication

feature/profile   ← profile

feature/booking   ← booking

feature/search-rate ←  search/rate


## Database Schema

| Table | Description |
|-------|-------------|
| `users` | All users (clients, providers, admins) |
| `provider_profiles` | Provider bio, skills, service area |
| `service_requests` | Booking requests from clients |
| `categories` | Service categories (plumbing, electrical...) |
| `reviews` | Ratings and reviews after job completion |
| `reports` | Client reports against providers |

## API Base URL
http://localhost:8080

All protected endpoints require:
Authorization: Bearer <JWT_TOKEN>

## Postman
Import the shared Postman workspace: **FixUp API**
- Ask the tech lead for the workspace invite link
- Set environment to: `FixUp Local`
- Variables: `base_url` = `http://localhost:8080`

