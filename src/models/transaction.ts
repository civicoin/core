import BigNumber from 'bignumber.js'
import { Transaction } from '@prisma/client'

import prisma from '../utils/prisma'

const sumTransactionsAmounts = (transactions: Pick<Transaction, 'amount'>[]): BigNumber =>
	transactions.reduce((acc, transaction) => {
		return acc.plus(transaction.amount)
	}, new BigNumber(0))

export const getMemberBalance = async (systemId: string, memberId: string): Promise<string> => {
	// in future there will be the account statements, and we will need to sum only the transactions after them

	const incomeTransactions = await prisma.transaction.findMany({
		select: {
			amount: true
		},
		where: {
			systemId,
			receiverId: memberId
		}
	})

	const expenseTransactions = await prisma.transaction.findMany({
		select: {
			amount: true
		},
		where: {
			systemId,
			senderId: memberId
		}
	})

	const income = sumTransactionsAmounts(incomeTransactions)
	const expense = sumTransactionsAmounts(expenseTransactions)

	return income.minus(expense).toString()
}

export const sendMemberTransaction = async (
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

	let failedTxReason: string | null = null
	try {
		const successfullTx = await prisma.$transaction(async prisma => {
			const optimisticTx = await prisma.transaction.create({ data: txData })

			const currentBalance = await getMemberBalance(systemId, senderId)

			if (new BigNumber(currentBalance).minus(amount).lessThan(0)) {
				failedTxReason = 'INSUFFICIENT_BALANCE'
				throw new Error('Insufficient balance')
			}

			return optimisticTx
		})

		console.log('Transaction has been sent succesfully', successfullTx.id)
	} catch (err) {
		console.error(`Failed to send transaction (reason=${failedTxReason}): ${err}`)
		// todo: create failed tx to another table
	}
}
