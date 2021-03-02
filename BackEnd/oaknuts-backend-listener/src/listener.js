const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const Dagger = require('@maticnetwork/dagger');
const constants = require('./constants.js');
const logger = require('./logger.js');

const MAX_LISTENERS = 10000

AWS.config.update({
	region: 'us-east-1',
	accessKeyId: constants.awsAccessId,
	secretAccessKey: constants.awsSecretAccessId
});

const daggerOnEventTriggerEnum = {
	confirmed: 'confirmed',
	latest: 'latest'
}

const daggerTransactionTypeEnum = {
	inAndOut: '',
	in: 'in',
	out: 'out'
}

const ANY_ADDRESS_WILDCARD = '+'

class Listener {
	constructor() {
		this.dagger = new Dagger("wss://mainnet.dagger.matic.network");
		this.addressSet = new Set();
		this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
	}

	addListenerAddress(address, onEventTrigger, transactionType) {
		if (this.addressSet.has(address) ||
			this.addressSet.length > MAX_LISTENERS) { return; }

		this.dagger.on(this._createDaggerListenerFormat(address, onEventTrigger, transactionType), (transaction) => { this.daggerTransmitter(transaction, this) });
		this.addressSet.add(address);
	}

	removeListenerAddress(address) {
		this.dagger.off(this._createDaggerListenerFormat(address));
		this.addressSet.delete(address)
	}

	/**
	{
	  blockHash: '0xc79208ae952da2ee0026d344d00fe67d2b3965ba6715af6ffe1e5f3d2640ca1a',
	  blockNumber: 11877721,
	  from: '0xDE139153A4F2903114E1A331E89749a32E23126a',
	  gas: 22000,
	  gasPrice: '550000000000',
	  hash: '0x4332e2191b9f7f103279a80fa7c6d8c31708b2e3a5a2d08db3ec44d7a06c81a4',
	  input: '0x',
	  nonce: 8814,
	  r: '0x82c397089bc6bfb55b48623fa7728f0fe6b69a280a3ac6898b1e198406b8abd9',
	  s: '0x4ad82553f928fdaa152c2131f74861708b8e1add393be6541722478d4e069c11',
	  to: '0xDE139153A4F2903114E1A331E89749a32E23126a',
	  transactionIndex: 0,
	  v: '0x26',
	  value: '0',
	  receipt: {
	    blockHash: '0xc79208ae952da2ee0026d344d00fe67d2b3965ba6715af6ffe1e5f3d2640ca1a',
	    blockNumber: 11877721,
	    contractAddress: null,
	    cumulativeGasUsed: 21000,
	    from: '0xde139153a4f2903114e1a331e89749a32e23126a',
	    gasUsed: 21000,
	    logs: [],
	    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	    status: true,
	    to: '0xde139153a4f2903114e1a331e89749a32e23126a',
	    transactionHash: '0x4332e2191b9f7f103279a80fa7c6d8c31708b2e3a5a2d08db3ec44d7a06c81a4',
	    transactionIndex: 0
	  }
	}

	*/


	makeSQSParams(transaction) {
		var tmp = {
			QueueUrl: constants.queueUrl,
			DelaySeconds: 0,
			MessageBody: "New Transaction",
			MessageAttributes: {
				"Sender": {
					DataType: "String",
					StringValue: transaction.receipt.from
				},
				"Receiver": {
					DataType: "String",
					StringValue: transaction.receipt.to
				},
				"To": {
					DataType: "String",
					StringValue: transaction.receipt.transactionHash
				},
				"GasPrice": {
					DataType: "String",
					StringValue: `${transaction.receipt.gasUsed}`
				}
			},
			MessageGroupId: uuidv4(),
			MessageDeduplicationId: uuidv4()
		}
		return tmp
	}

	daggerTransmitter(transaction, root) {
		// Listen for new dagger transactions
		root.sqs.sendMessage(root.makeSQSParams(transaction), 
			function(err, data) {
			if (err) {
				logger.logError(err, "Error in sending SQS");
			} else {
				logger.logWarning(data);
			}
		});
	}

	sqsListener() {
		// Listen for SQS events for new addresses to listen to
	}

	_createDaggerListenerFormat(address, onEventTrigger, transactionType) {
		const listenerFormat = onEventTrigger != '' ? 
				`${transactionType}:addr/${address}/tx/${onEventTrigger}` : 
				`${transactionType}:addr/${address}/tx`;
		logger.logWarning(listenerFormat);
		return listenerFormat;
	}
}

module.exports = {
	daggerListener: new Listener(),
	daggerTransactionTypeEnum: daggerTransactionTypeEnum,
	daggerOnEventTriggerEnum: daggerOnEventTriggerEnum
}
