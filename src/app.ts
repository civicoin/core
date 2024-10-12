import * as grpc from '@grpc/grpc-js'

import { BalanceService } from './generated/balance_grpc_pb'

import logger from './utils/logger'
import { balanceServiceHandler } from './services'

async function main() {
	const server = new grpc.Server()

	server.addService(BalanceService, balanceServiceHandler)

	const port = process.env.GRPC_PORT || '50051'
	server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), async () => {
		logger.info(`gRPC server running at http://127.0.0.1:${port}`)
		server.start()
	})
}

main().catch(error => {
	logger.error('Error starting the server:', error)
})

process.on('uncaughtException', error => {
	logger.fatal(`Uncaught Exception: ${error.message}`)
	process.exit(1)
})

process.on('unhandledRejection', reason => {
	logger.fatal(`Unhandled Rejection: ${reason}`)
	process.exit(1)
})
