const logger = require('./logger.js');
const model = require('./models.js');
const Listener = require('./listener.js');
const solanaListener = require('./solanalistener.js');

listener = Listener.daggerListener
listener.addListenerAddress('+', 
	Listener.daggerTransactionTypeEnum.inAndOut,
	Listener.daggerOnEventTriggerEnum.confirmed)