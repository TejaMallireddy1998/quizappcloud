# 🎯 Quizzr — Microservices Quiz Application with JWT Authentication

This project is a full-stack quiz application built using Spring Boot microservices, Eureka service discovery, Spring Cloud Gateway and a React frontend with Framer Motion animations.

The application allows users to register, take timed quizzes, and review per-question results. Administrators can create quizzes and manage questions through a role-protected admin panel.

The system is deployed using Docker Compose, with each service running as an independent container communicating over a shared Docker network. Authentication is centralized at the API Gateway using JWT, while role-based access is enforced inside each microservice.

## 🚀 Key Features

- JWT-based authentication issued by a dedicated auth service
- Role-based access control (USER and ADMIN)
- Centralized JWT validation at the API Gateway
- Service discovery using Netflix Eureka
- Inter-service communication via OpenFeign
- Per-question result breakdown with correct answers
- Quiz attempt history persisted per user
- Editorial-style React UI with Framer Motion animations
- Dockerized multi-container deployment
- Single command startup with Docker Compose

## 🏗️ Architecture Overview

```
Browser (React + nginx)
        ↓
API Gateway (Spring Cloud Gateway)
        ↓  validates JWT, forwards X-User-Id & X-User-Roles
        ↓
   ┌────┼─────────────────┐
   ↓    ↓                 ↓
auth-service  quiz-service  question-service
   ↓              ↓              ↓
 authdb         quizdb       questiondb
  (Postgres)   (Postgres)     (Postgres)

         ↑
Eureka Service Registry (port 8761)
All services register and discover each other here

```

## Application Flow

1. User registers and logs in through the React frontend.
2. auth-service verifies credentials and returns a signed JWT.
3. Subsequent requests carry the token in the Authorization header.
4. API Gateway validates the token, extracts user identity, and forwards it as headers to downstream services.
5. quiz-service calls question-service over Feign to fetch and score questions.
6. Quiz attempts are saved to quizdb tied to the user's ID.

## 🛠️ Technologies Used

- Java 21
- Spring Boot
- Spring Cloud Gateway
- Spring Cloud Netflix Eureka
- Spring Cloud OpenFeign
- Spring Data JPA
- PostgreSQL 16
- JJWT (JSON Web Tokens)
- BCrypt
- Lombok
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- nginx
- Docker
- Docker Compose
- Maven

##  📦 Prerequisites
Before running the application, ensure you have:

- Docker installed
- Docker Compose installed

## ▶️ Running the Application

### Step 1: Clone the Repository

```
https://github.com/TejaMallireddy1998/quizapp.git
cd quizapp
```

### Step 2: Create the Environment File

Create a .env file in the project root with these values:

```

POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
JWT_SECRET=change-me-to-something-long-and-random-at-least-256-bits

```

### Step 3: Start the Containers

```
docker compose up --build

```

This will:

- Build all 5 Spring Boot services
- Build the React frontend
- Start PostgreSQL with three databases (authdb, questiondb, quizdb)
- Start Eureka for service discovery
- Enable inter-container communication

### Step 4: Access the Application

Open your browser and visit:

http://localhost:8080

You can now register, log in, and take quizzes through the UI.

### Step 5: Create an Admin Account

Register a user through the UI, then promote them to admin:

```
docker exec -i quizapp-postgres psql -U postgres -d authdb -c "INSERT INTO user_role (user_id, role) VALUES ((SELECT id FROM app_user WHERE username='YOUR_USERNAME'), 'ADMIN');"
```

Logout and log back in. The Admin panel will appear in the header.


## 📡 API Endpoints

### Auth Service (Public)

| Method | Endpoint                      | Description                         |
| ------ | ----------------------------- | ----------------------------------- |
| POST   | `/auth-service/auth/register` | Create a new user account           |
| POST   | `/auth-service/auth/login`    | Authenticate user and receive a JWT |

### Quiz Service (Authenticated)

| Method | Endpoint                         | Description                            |
| ------ | -------------------------------- | -------------------------------------- |
| GET    | `/quiz-service/quiz/list`        | List all available quizzes             |
| GET    | `/quiz-service/quiz/get/{id}`    | Fetch questions for a specific quiz    |
| POST   | `/quiz-service/quiz/submit/{id}` | Submit answers and get score breakdown |
| GET    | `/quiz-service/quiz/attempts`    | Get the current user's attempt history |
| POST   | `/quiz-service/quiz/create`      | Create a new quiz (ADMIN only)         |
| DELETE | `/quiz-service/quiz/delete/{id}` | Delete a quiz (ADMIN only)             |

### Question Service

| Method | Endpoint                                         | Description                              |
| ------ | ------------------------------------------------ | ---------------------------------------- |
| GET    | `/question-service/question/allQuestions`        | List all questions                       |
| GET    | `/question-service/question/category/{category}` | List questions by category               |
| POST   | `/question-service/question/add`                 | Add a new question (ADMIN only)          |
| PUT    | `/question-service/question/update/{id}`         | Update an existing question (ADMIN only) |
| DELETE | `/question-service/question/{id}`                | Delete a question (ADMIN only)           |

All endpoints except register and login require Authorization: Bearer <JWT> header.

## 🔒 Authentication & Security

- Passwords are hashed with BCrypt before storage.
- JWT tokens are signed with HMAC-SHA256 using a shared secret.
- The API Gateway is the only public entry point — services are not exposed directly.
- The Gateway validates every token and rejects unauthorized requests with 401.
- Role checks are enforced in downstream services via the X-User-Roles header.
- Admin role can only be granted via direct database insert. The registration endpoint always assigns the USER role.
- Login responses return a generic error to prevent username enumeration.

## 🧠 Microservices Design Notes

- Each service owns its own database. There are no cross-database foreign keys; quiz_attempt.user_id is just an integer that references a user in authdb.
- The Gateway is the single source of authentication. Downstream services trust the headers it forwards.
- quiz-service delegates scoring to question-service via OpenFeign so it never sees correct answers from its own database.
- Question option text (not IDs) is used as the answer value to match the existing data model.

## 🚀 Future Improvements

- Refresh tokens to extend session beyond 24 hours
- Email verification on registration
- Password reset flow
- Rate limiting on login to prevent brute force
- Automated test coverage
- Cloud deployment with HTTPS
- Categories endpoint for admin dropdown
- Leaderboards per quiz













