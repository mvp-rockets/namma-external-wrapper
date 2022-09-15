const Result = require('folktale/result');
const retry = require('async-retry');
const axios = require('axios');
const R = require('ramda');
const rateLimit = require('axios-rate-limit');

const makeCall = async (client, config, retryOptions) => retry(async () => {
	const res = await client(config);
	return res.data;
}, {
	retries: retryOptions.retries,
	factor: retryOptions.factor,
	minTimeout: retryOptions.minTimeout,
	maxTimeout: retryOptions.maxTimeout
});

module.exports = class ExternalWrapper {
	constructor(retryOptions = {}, rateLimitOptions = {}) {
		this.retryOptions = {
			retries: 5,
			factor: 2,
			minTimeout: 1000
		};
		if (retryOptions.retries) {
			this.retryOptions.retries = retryOptions.retries;
		}
		if (retryOptions.factor) {
			this.retryOptions.factor = retryOptions.factor;
		}
		if (retryOptions.minTimeout) {
			this.retryOptions.minTimeout = retryOptions.minTimeout;
		}
		if (retryOptions.maxTimeout) {
			this.retryOptions.maxTimeout = retryOptions.maxTimeout;
		}
		if (!R.isEmpty(rateLimitOptions)) {
			this.rateLimitOptions = rateLimitOptions;
		}
	}

	getClient() {
		if (!R.isEmpty(this.rateLimitOptions) && !R.isNil(this.rateLimitOptions)) {
			return rateLimit(axios.create(), this.rateLimitOptions);
		}
		return axios;
	}

	perform(config) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve) => {
			try {
				const client = this.getClient();
				const data = await makeCall(client, config, this.retryOptions);
				resolve(Result.Ok(data));
			} catch (ex) {
				resolve(Result.Error(ex));
			}
		});
	}
};
