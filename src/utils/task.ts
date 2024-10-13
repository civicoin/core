import amqplib from 'amqplib'
import { getMessageWithHMAC, safeJsonParse, verifyMessageWithHMAC } from 'civi'

import logger from '../utils/logger'

const key = process.env.HMAC_SECRET || '123'

export enum RabbitMQQueue {
	tx = 'tx'
}

export async function publishTask(
	channel: amqplib.Channel,
	queue: RabbitMQQueue,
	message: object
): Promise<void> {
	try {
		await channel.assertQueue(queue, { durable: true })

		const messageWithHMAC = getMessageWithHMAC(message, key)
		const sent = channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageWithHMAC)), {
			persistent: true
		})

		if (sent) {
			logger.info(`Task published to queue ${queue}`)
		} else {
			logger.warn(`Failed to publish task to queue ${queue}`)
		}
	} catch (error) {
		logger.error(`Error publishing task to queue ${queue}: ${error}`)
		throw error
	}
}

export const consumeTask = async <T extends object>(
	channel: amqplib.Channel,
	queue: RabbitMQQueue,
	handler: (msg: T) => Promise<void>
): Promise<void> => {
	try {
		await channel.assertQueue(queue, { durable: true })

		channel.consume(
			queue,
			async msg => {
				if (msg === null) {
					logger.warn(`Empty message received from queue ${queue}`)
					return
				}

				const parsedMessage = safeJsonParse(msg.content.toString(), message => {
					logger.error(`Failed to parse JSON at ${queue}: ${message}`)
				}) // make safeJsonParse check type
				if (Object.keys(parsedMessage).length === 0) {
					logger.error(`Invalid JSON, rejecting message from queue ${queue}`)
					channel.nack(msg, false, false)
					return
				}

				if (verifyMessageWithHMAC(parsedMessage, key)) {
					await handler(parsedMessage as T)

					channel.ack(msg)
					logger.info(`Processed task from queue ${queue}`)
				} else {
					logger.error(`Invalid HMAC, rejecting message from queue ${queue}`)
					channel.nack(msg, false, false)
				}
			},
			{ noAck: false }
		)
	} catch (error) {
		logger.error(`Error consuming task from queue ${queue}: ${error}`)
		throw error
	}
}
