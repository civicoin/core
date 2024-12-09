# The centralized Core

The service works with transactions. All the coin transfers, holds and liabilities (as well as the accounts statements and balances) are processed here

> The Gateway uses several centralized cores: there are rules of the services partitioning by the systems (civilizations), because they are fully independent

-   **Stack:** Node, Prisma
-   **DB:** PostgreSQL
-   Communication with gRPC (sync) and RabbitMQ (async)

### Key Components

-   Models: The data structure and methods for interacting with the DB
-   Controllers: Business logic and interactions between models and services
-   Workers: Listen for messages from RabbitMQ and process background tasks

## Setup

1. Install dependencies — `npm i`
2. Generate the Protobuf protos — `npm run proto:generate`

## Transactions and issuance

-   The system can't issue more then (10^12 - 1) coins (the max amount of decimals — 6, but there is no information about them in the Core)
