# Online Event & Ticket Booking System (Backend)

Backend implementation of an online event and ticket booking platform (similar to BookMyShow) built with Spring Boot, PostgreSQL, Redis, Kafka, JWT security, and Docker.

## Features

- User registration and login with BCrypt password hashing
- JWT-based authentication (stateless, Bearer tokens)
- Role support (`USER` now; `ADMIN` ready via roles)
- Event management (create, list, filter by city)
- Show model with capacity and booking engine (prevents overbooking by seat count)
- Kafka publisher that emits `BookingConfirmed` events after successful booking
- Redis wired for caching (ready for extension)
- Docker Compose stack: API, PostgreSQL, Redis, ZooKeeper, Kafka
  
## Tech Stack

- Java 17
- Spring Boot 3.2.x (Web, Security, Data JPA, Validation, Data Redis, Kafka)
- PostgreSQL
- Redis
- Kafka (Confluent images)
- JWT (jjwt)
- Maven
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Java 17
- Maven
- Docker & Docker Compose
- Postman or any HTTP client

### Option 1: Run everything with Docker Compose

From the project root (where `docker-compose.yml` is):

docker-compose down
docker-compose up -d --build


This starts:

- `booking-postgres` (PostgreSQL)
- `booking-redis` (Redis)
- `booking-zookeeper` (ZooKeeper)
- `booking-kafka` (Kafka)
- `booking-api` (Spring Boot app exposed on `http://localhost:8080`)

Check logs if needed:

`docker logs booking-api --tail=50`


### Option 2: Run infra in Docker, app from IDE

1. Comment/remove the `api` service in `docker-compose.yml`.
2. Run:

- CMD  `docker-compose up -d`

3. Open the project in IntelliJ and run `Task1Application` (Spring Boot main class).
4. The app will connect to `localhost` Postgres/Redis/Kafka.

-------------------------------------------------------------------------------------------------------------------------------------------------

    
