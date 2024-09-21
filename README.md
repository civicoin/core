# The centralized Core

The service works with transactions. All the coin transfers, holds and liabilities (as well as the accounts statements and balances) are processed here

> The Gateway uses several centralized cores: there are rules of the services partitioning by the systems (civilizations), because they are fully independent

- **Stack:** Node, Prisma
- **DB:** PostgreSQL
- Communication with gRPC (sync) and RabbitMQ (async)

### Key Components

- Models: Define the data structure and provide methods for interacting with the database (e.g., creating transactions, fetching user data)
- Controllers: Implement business logic and orchestrate interactions between models and services
- Services: Expose gRPC methods that handle incoming requests and delegate tasks to the appropriate controllers
- Workers: Listen for messages from RabbitMQ and process background tasks
