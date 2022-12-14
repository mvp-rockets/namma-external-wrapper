const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { whenResult } = require('@mvp-rockets/namma-lib/utilities');
const ExternalWrapper = require('./external-wrapper');

app.get('/', async (req, res) => {
	const externalWrapper = new ExternalWrapper({ retries: 2, minTimeout: 5000 });
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test'
	});
	whenResult(
		(result) => {
			res.send(result);
		},
		(ex) => {
			res.send(ex);
		}
	)(resultFromWrapper);
});

app.get('/with-rate-limit', async (req, res) => {
	const externalWrapper = new ExternalWrapper(
		{ retries: 2, minTimeout: 5000 },
		{
			maxRequests: 1,
			perMilliseconds: 10000,
			maxRPS: 1
		}
	);
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test'
	});
	whenResult(
		(result) => {
			res.send(result);
		},
		(ex) => {
			res.send(ex);
		}
	)(resultFromWrapper);
});

app.post('/', async (req, res) => {
	const { name } = req.body;
	const externalWrapper = new ExternalWrapper({ retries: 2, minTimeout: 5000 });
	const resultFromWrapper = await externalWrapper.perform({
		url: 'http://localhost:3000/test',
		method: 'post',
		data: {
			name
		}
	});
	whenResult(
		(result) => {
			res.send(result);
		},
		(ex) => {
			res.send(ex);
		}
	)(resultFromWrapper);
});

app.get('/raw', async (req, res) => {
	try {
		const externalWrapper = new ExternalWrapper({ retries: 2, minTimeout: 5000 });
		const resultFromWrapper = await externalWrapper.perform({ url: 'http://localhost:3000/test' }, true);
		res.send(resultFromWrapper);
	} catch (error) {
		res.send(error);
	}
});

// PORT
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Internal Server is running on PORT: ${PORT}`);
});
