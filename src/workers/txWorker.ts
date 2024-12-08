import amqplib from 'amqplib'

import logger from '../utils/logger'
import { consumeTask, RabbitMQQueue } from '../utils/task'
import { sendTxController, SendTxMessage } from '../controllers/tx.controller'

const queue = RabbitMQQueue.tx

const tasksController = {
	send: sendTxController
}

const startTxWorker = async (channel: amqplib.Channel) => {
	try {
		await consumeTask(channel, queue, async (msg: SendTxMessage) => {
			const contorller = tasksController[msg.action]
			await contorller(msg)
		})

		logger.info('Transaction worker started, waiting for messages...')
	} catch (err) {
		logger.error(`Failed to start transaction worker: ${err}`)
		throw err
	}
}

export default startTxWorker
