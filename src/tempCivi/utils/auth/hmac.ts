import crypto from 'crypto'

export const hmac = (message: object, key: string) =>
	crypto.createHmac('sha256', key).update(JSON.stringify(message)).digest('hex')

export const getMessageWithHMAC = (message: object, key: string) => ({
	hmac: hmac(message, key),
	...message
})

export const verifyMessageWithHMAC = (message: { hmac?: string }, key: string) => {
	if (!message.hmac) return false
	const { hmac: messageHMAC, ...rest } = message
	return messageHMAC === hmac(rest, key)
}
