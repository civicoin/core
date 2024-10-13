import amqplib from 'amqplib'

import logger from '../utils/logger'
import { consumeTask, RabbitMQQueue } from '../utils/task'

const queue = RabbitMQQueue.tx

const startTxWorker = async (channel: amqplib.Channel) => {
	try {
		await consumeTask(channel, queue, async msg => {
			console.log(msg)
		})

		logger.info('Transaction worker started, waiting for messages...')
	} catch (err) {
		logger.error(`Failed to start transaction worker: ${err}`)
		throw err
	}
}

export default startTxWorker
