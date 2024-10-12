import { IBalanceServer } from '../generated/balance_grpc_pb'
import { GetBalanceResponse } from '../generated/balance_pb'

const balanceServiceHandler: IBalanceServer = {
	getBalance: (call, callback) => {
		const req = call.request

		const res = new GetBalanceResponse()
		res.setBalance(0)

		return callback(null, res)
	}
}

export default balanceServiceHandler
