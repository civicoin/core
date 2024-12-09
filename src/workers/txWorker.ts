import amqplib from 'amqplib'

import logger from '../utils/logger'
import { consumeTask, RabbitMQQueue } from '../utils/task'
import {
	issueTxController,
	IssueTxMessage,
	sendTxController,
	SendTxMessage
} from '../controllers/tx.controller'

const queue = RabbitMQQueue.tx

const tasksController = {
	send: sendTxController,
	issue: issueTxController
}

const startTxWorker = async (channel: amqplib.Channel) => {
	try {
		await consumeTask(channel, queue, async (msg: SendTxMessage | IssueTxMessage) => {
			const contorller = tasksController[msg.action] as (
				msg: SendTxMessage | IssueTxMessage
			) => Promise<void>
			await contorller(msg)
		})

		logger.info('Transaction worker started, waiting for messages...')
	} catch (err) {
		logger.error(`Failed to start transaction worker: ${err}`)
		throw err
	}
}

export default startTxWorker
