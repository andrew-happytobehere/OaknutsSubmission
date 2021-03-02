const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const solanaWeb3 = require('@solana/web3.js');
const oaknuts = require('./oaknuts.js')

let OaknutsPublicKey = '';
let ProviderURL = '';

let transactionMethods = {
	SendEthTransactions: 'sendEthTransaction',
	GetAllEthAddresses: 'getAllEthAddresses'
}


// Inspiried from https://github.com/project-serum/sol-wallet-adapter/blob/master/src/index.js
class SolanaListener {
	constructor(provider, network) {
		if (isInjectedProvider(provider)) {
			this._injectedProvider = provider;
		} else if (isString(provider)) {
			this._providerUrl = new URL(provider);
			this._providerUrl.hash = new URLSearchParams({
				origin: window.location.origin,
				network,
			}).toString();
		} else {
			throw new Error(
				'provider parameter must be an injected provider or a URL string.',
			);
		}

		this._network = network;
		this._publicKey = null;
		this._autoApprove = false;
		this._popup = null;
		this._handlerAdded = false;
		this._nextRequestId = 1;
		this._responsePromises = new Map();
	}

	signTransaction(transaction) {
	    const response = this._sendRequest('signTransaction', {
	      message: bs58.encode(transaction.serializeMessage()),
	    });

	    const signature = bs58.decode(response.signature);
	    const publicKey = new PublicKey(response.publicKey);
	    transaction.addSignature(publicKey, signature);
	    return transaction;
	}

	sendRequest(method, params) {
		if (method !== 'connect' && !this.connected) {
		  throw new Error('Wallet not connected');
		}
		const requestId = this._nextRequestId;
		++this._nextRequestId;
		return new Promise((resolve, reject) => {
			this._responsePromises.set(requestId, [resolve, reject]);
			this._injectedProvider.postMessage(...{
				jsonrpc: '2.0',
				id: requestId,
				method,
				params: {
					network: this._network,
					...params,
				},
			});
		});
	};
}

function isString(a) {
  return typeof a === 'string';
}

function isInjectedProvider(a) {
  return isObject(a) && isFunction(a.postMessage);
}

function isObject(a) {
  return typeof a === 'object' && a !== null;
}

function isFunction(a) {
  return typeof a === 'function';
}

module.exports = {
	solanaListener: new SolanaListener(oaknuts.oaknuts)
}