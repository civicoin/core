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
