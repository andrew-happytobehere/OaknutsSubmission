class Logger {
	constructor() {

	}

	logError(ex, description) {
		console.error(ex, description);
	}

	logMetric(metricName, metricCount) {

	}

	logWarning(description) {
		console.log(description);
	}
}

module.exports = new Logger();