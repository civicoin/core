import amqplib from 'amqplib'

import logger from '../utils/logger'
import { getMemberBalance } from '../models/balance'

import { CoreServer } from '../generated/core'

const getCoreServiceHandler = (channel: amqplib.Channel): CoreServer => ({
	getBalance: async (call, callback) => {
		const req = call.request
		const [systemId, memberId] = [req.systemId, req.memberId]

		if (systemId === '' || memberId === '') {
			logger.error('Invalid request to get balance')
			return callback(new Error('Invalid request'))
		}

		const balance = await getMemberBalance(systemId, memberId)

		logger.info(`Processed request to get balance for system=${systemId}, member=${memberId}`)
		return callback(null, { balance })
	}
})

export default getCoreServiceHandler
