import { processIssueTransaction, processSendTransaction } from '../models/transaction'

type TxCommonMessage = {
	systemId: string
	receiverId: string
	amount: string
	signature: string
}

export type SendTxMessage = {
	action: 'send'
	senderId: string
} & TxCommonMessage

export const sendTxController = async (msg: SendTxMessage) => {
	const { systemId, senderId, receiverId, amount, signature } = msg

	await processSendTransaction(systemId, senderId, receiverId, amount, signature)
}

export type IssueTxMessage = {
	action: 'issue'
} & TxCommonMessage

export const issueTxController = async (msg: IssueTxMessage) => {
	const { systemId, receiverId, amount, signature } = msg

	await processIssueTransaction(systemId, receiverId, amount, signature)
}
