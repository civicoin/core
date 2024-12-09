import BigNumber from 'bignumber.js'
import { TransactionType } from '@prisma/client'

import prisma from '../utils/prisma'

import { getMemberBalance } from './balance'

type TxCommonData = {
	systemId: string
	receiverId: string
	amount: string
	signature: string
}

const processTransaction = async <T extends TxCommonData>(
	txType: TransactionType,
	txData: T,
	processChecks?: (txData?: T) => Promise<string | undefined>
) => {
	let failedTxReason: string | null = null
	try {
		const successfullTx = await prisma.$transaction(async prisma => {
			const optimisticTx = await prisma.transaction.create({
				data: {
					...txData,
					type: txType
				} as T & { type: TransactionType }
			})

			const error = processChecks ? await processChecks(txData) : undefined
			if (error) {
				failedTxReason = error
				throw new Error(error)
			}

			return optimisticTx
		})

		console.log(`${txType} transaction has been processed succesfully`, successfullTx.id)
	} catch (err) {
		console.error(`Failed to process ${txType} transaction (reason=${failedTxReason}): ${err}`)
		// todo: create failed tx to another table
	}
}

export const processSendTransaction = async (
	systemId: string,
	senderId: string,
	receiverId: string,
	amount: string,
	signature: string
) => {
	const txData = {
		systemId,
		senderId,
		receiverId,
		amount,
		signature
	}

	await processTransaction<TxCommonData & { senderId: string }>(
		TransactionType.SEND,
		txData,
		async () => {
			const currentBalance = await getMemberBalance(systemId, senderId)

			if (new BigNumber(currentBalance).minus(amount).lessThan(0)) {
				return 'INSUFFICIENT_BALANCE'
			}
		}
	)
}

export const processIssueTransaction = async (
	systemId: string,
	receiverId: string,
	amount: string,
	signature: string
) => {
	const txData = {
		systemId,
		receiverId,
		amount,
		signature
	}

	// todo: additional issue checks
	await processTransaction<TxCommonData>(TransactionType.ISSUE, txData)
}
