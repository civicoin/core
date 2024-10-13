import BigNumber from 'bignumber.js'
import { Transaction } from '@prisma/client'

import prisma from '../utils/prisma'

const sumTransactionsAmounts = (transactions: Transaction[]): BigNumber =>
	transactions.reduce((acc, transaction) => {
		return acc.plus(transaction.amount)
	}, new BigNumber(0))

export async function getMemberBalance(memberId: string): Promise<string> {
	const incomeTransactions = await prisma.transaction.findMany({
		where: {
			receiverId: memberId
		}
	})

	const expenseTransactions = await prisma.transaction.findMany({
		where: {
			senderId: memberId
		}
	})

	const income = sumTransactionsAmounts(incomeTransactions)
	const expense = sumTransactionsAmounts(expenseTransactions)

	return income.minus(expense).toString()
}
