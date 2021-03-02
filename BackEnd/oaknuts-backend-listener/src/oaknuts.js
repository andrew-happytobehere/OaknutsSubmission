const solanaWeb3 = '@solana/web3.js';
const sendAndConfirmTransaction = solanaWeb3.sendAndConfirmTransaction;
const SystemProgram = solanaWeb3.SystemProgram;

// Inspiried by https://github.com/solana-labs/example-messagefeed/blob/v1.1/src/programs/message-feed.js
class Oaknuts {
	postMessage(connection, payerAccount, userAccount, text, previousMessage, userToBan) {
	  const messageData = readMessage(connection, previousMessage);
	  const messageAccount = new Account();
	  return postMessageWithProgramId(
	    connection,
	    messageData.programId,
	    payerAccount,
	    userAccount,
	    messageAccount,
	    text,
	    previousMessage,
	    userToBan,
	  );
	}


	async postMessageWithProgramId(connection, programId, payerAccount, userAccountArg, messageAccount, text, previousMessagePublicKey, userToBan) {
	  const transaction = new Transaction();
	  const textBuffer = Buffer.from(text);

	  // Allocate the message account
	  transaction.add(
	    SystemProgram.createAccount({
	      fromPubkey: payerAccount.publicKey,
	      newAccountPubkey: messageAccount.publicKey,
	      lamports: await connection.getMinimumBalanceForRentExemption(dataSize),
	      space: dataSize,
	      programId,
	    }),
	  );

	  let userAccount = userAccountArg;
	  if (userAccount === null) {
	    userAccount = await createUserAccount(
	      connection,
	      programId,
	      payerAccount,
	      messageAccount,
	      transaction,
	    );
	  }

	  // The second instruction in the transaction posts the message, optionally
	  // links it to the previous message and optionally bans another user
	  const keys = [
	    {pubkey: userAccount.publicKey, isSigner: true, isWritable: false},
	    {pubkey: messageAccount.publicKey, isSigner: true, isWritable: false},
	  ];
	  if (previousMessagePublicKey) {
	    keys.push({
	      pubkey: previousMessagePublicKey,
	      isSigner: false,
	      isWritable: true,
	    });

	    if (userToBan) {
	      keys.push({pubkey: userToBan, isSigner: false, isWritable: true});
	    }
	  }
	  transaction.add({
	    keys,
	    programId,
	    data: textBuffer,
	  });

	  return await sendAndConfirmTransaction(connection, transaction, payerAccount, userAccount, messageAccount);
	}
}

module.exports = {
	oaknuts: new Oaknuts()
}
