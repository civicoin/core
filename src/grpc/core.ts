import amqplib from 'amqplib'

import logger from '../utils/logger'
import { getMemberBalance } from '../models/transaction'

import { ICoreServer } from '../generated/core_grpc_pb'
import { GetBalanceResponse } from '../generated/core_pb'

const getCoreServiceHandler = (channel: amqplib.Channel): ICoreServer => ({
	getBalance: async (call, callback) => {
		const req = call.request

		const [systemId, memberId] = [req.getSystemid(), req.getMemberid()]

		if (systemId === '' || memberId === '') {
			logger.error('Invalid request to get balance')
			return callback(new Error('Invalid request'))
		}

		const balance = await getMemberBalance(systemId, memberId)

		const res = new GetBalanceResponse()
		res.setBalance(balance)

		logger.info(`Processed request to get balance for system=${systemId}, member=${memberId}`)
		return callback(null, res)
	}
})

export default getCoreServiceHandler
