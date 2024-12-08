import amqplib from 'amqplib'
import * as grpc from '@grpc/grpc-js'

import { CoreService } from './generated/core_grpc_pb'

import logger from './utils/logger'
import startTxWorker from './workers/txWorker'
import { getCoreServiceHandler } from './grpc'

import dotenv from 'dotenv'

dotenv.config()

const setupRabbitMQ = async (): Promise<[amqplib.Connection, amqplib.Channel]> => {
	const connection = await amqplib.connect('amqp://localhost')
	const channel = await connection.createChannel()

	await startTxWorker(channel)

	return [connection, channel]
}

const setupGrpcServer = async (channel: amqplib.Channel) => {
	const server = new grpc.Server()

	server.addService(CoreService, getCoreServiceHandler(channel))

	const grpcPort = process.env.GRPC_PORT || '50051'
	server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), () => {
		logger.info(`gRPC server running at ${grpcPort}`)
	})
}

const main = async () => {
	try {
		const [connection, channel] = await setupRabbitMQ()
		await setupGrpcServer(channel)

		process.on('SIGINT', async () => {
			logger.info('Received SIGINT. Shutting down gracefully....')
			try {
				await channel.close()
				await connection.close()
				logger.info('RabbitMQ connection closed')
				process.exit(0)
			} catch (err) {
				logger.error(`Error during shutdown: ${err}`)
				process.exit(1)
			}
		})
	} catch (err) {
		logger.fatal(`Error starting the server: ${err}`)
	}
}

process.on('uncaughtException', error => {
	logger.fatal(`Uncaught Exception: ${error.message}`)
	process.exit(1)
})

process.on('unhandledRejection', reason => {
	logger.fatal(`Unhandled Rejection: ${reason}`)
	process.exit(1)
})

main()
