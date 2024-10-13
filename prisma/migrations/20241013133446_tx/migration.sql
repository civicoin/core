-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER', 'ISSUE');

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "system_id" UUID NOT NULL,
    "sender_id" UUID,
    "receiver_id" UUID NOT NULL,
    "amount" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signature" VARCHAR(255) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
