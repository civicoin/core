import { sendMemberTransaction } from '../models/transaction'

export type SendTxMessage = {
	action: 'send'
	systemId: string
	senderId: string
	receiverId: string
	amount: string
	signature: string
}

export const sendTxController = async (msg: SendTxMessage) => {
	const { systemId, senderId, receiverId, amount, signature } = msg

	try {
		await sendMemberTransaction(systemId, senderId, receiverId, amount, signature)
	} catch (err) {
		console.error(`Failed to send transaction: ${err}`)
	}
}
