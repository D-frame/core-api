import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';

import {errorHandler, NotFoundError, currentUser, logRequest} from './common';

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('trust proxy', true);
app.use(
	helmet({
		frameguard: {
			action: 'deny',
		},
		hidePoweredBy: true,
		xssFilter: true,
		noSniff: true,
		ieNoOpen: true,
		hsts: {
			maxAge: 7776000,
			force: true,
		},
	}),
);
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	next();
});
app.use('/healthcheck', (req, res) => {
	res.status(200).json();
});
app.use(logRequest);
app.use(currentUser);

app.all('*', async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export {app};