const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { uuid } = require('@mvp-rockets/namma-lib/utilities');

app.get('/test', (req, res) => {
	res.json({
		status: true,
		message: 'Successfully got get request',
		entity: {
			isWorking: true
		}
	});
});

app.post('/test', (req, res) => {
	const { name } = req.body;
	res.json({
		status: true,
		message: 'Successfully add test user',
		entity: {
			id: uuid.v4(),
			name
		}
	});
});

// PORT
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`External Server is running on PORT: ${PORT}`);
});
