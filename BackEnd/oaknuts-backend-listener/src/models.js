class Transaction {
	tableName = 'Transaction'
	propagatedToSolana = 'PropagatedToSolana'

	constructor(fromId, toId, txId, gasFee) {
		this.fromId = fromId
		this.toId = toId
		this.txId = txId
		this.gasFee = gasFee
	}

	insertSQLStatement() {
		return `INSERT INTO ${this.tableName} (fromId, toId, txId, gasFee) VALUES \
		(${this.fromId}, ${this.toId}, ${this.txId}, ${this.gasFee});`
	}

	markTransmitted(solanaWallet) {
		return `INSERT INTO ${this.transmittedTransaction} (fromId, toSolanaWallet, gasFee) VALUES \
		(${this.fromId}, ${solanaWallet}, ${this.gasFee});`
	}
}

class EthereumAddresses {
	tableName = 'SolanaEthereumMapping'

	constructor(ethAddress, solanaWallet) {
		this.ethAddress = ethAddress
		this.solanaWallet = solanaWallet
	}

	insertSQLStatement() {
		return `INSERT INTO ${this.tableName} (etherAddress, solanaWallet) VALUES \
		(${this.ethAddress}, ${this.solanaWallet});`
	}
}

class SolanaRPCCall {
	getRpcCall(methodName) {
		return {
			"jsonrpc": "2.0",
			"id": 1,
			"method": methodName,
			"params": JSON.stringify([
				solanaId
			])
		}
	}
}


module.exports = {
	transaction: Transaction,
	etherAddress: EthereumAddresses,
	solanaRPCCall: SolanaRPCCall
}