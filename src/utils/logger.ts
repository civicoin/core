import pino from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

const logger = pino({
	level: process.env.LOG_LEVEL || 'info',
	transport: isDevelopment
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'SYS:standard',
					ignore: 'pid,hostname'
				}
		  }
		: undefined
})

export const getLogger = (moduleName: string) => logger.child({ module: moduleName })

export default logger
