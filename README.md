# The centralized Core

The service works with transactions. All the coin transfers, holds and liabilities (as well as the accounts statements and balances) are processed here

> The Gateway uses several centralized cores: there are rules of the services partitioning by the systems (civilizations), because they are fully independent

-   **Stack:** Node, Prisma
-   **DB:** PostgreSQL
-   Communication with gRPC (sync) and RabbitMQ (async)

### Key Components

-   Models: The data structure and methods for interacting with the DB
-   Controllers: Business logic and interactions between models and services
-   Services: gRPC methods that handle incoming requests and delegate tasks to the appropriate controllers
-   Workers: Listen for messages from RabbitMQ and process background tasks

# Setup

1. Install dependencies — `npm i`
2. Generate the Protobuf protos — `npm run proto:generate`
