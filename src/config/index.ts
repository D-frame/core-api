import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
	throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

if (!process.env.NODE_ENV) {
	throw new Error('NODE_ENV must be defined');
}

const nodeEnv = process.env.NODE_ENV;

if (nodeEnv === 'development') {
	if (!process.env.DEV_PORT) {
		throw new Error('Development Server Port must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!process.env.DEV_MONGOOSE_URI_DB) {
		throw new Error('Development DB Name must be defined');
	}

	if (!process.env.MONGOOSE_URI_USERNAME) {
		throw new Error('Development DB Username must be defined');
	}

	if (!process.env.MONGOOSE_URI_PASSWORD) {
		throw new Error('Development DB Password must be defined');
	}

	/* Similarly can check for env variables */
}

const development = {
	port: process.env.DEV_PORT,
	databaseURI: `mongodb+srv://${process.env.MONGOOSE_URI_USERNAME}:${process.env.MONGOOSE_URI_PASSWORD}@${process.env.MONGO_URI}/${process.env.DEV_MONGOOSE_URI_DB}?retryWrites=true`,
};

const test = {
	port: process.env.DEV_PORT,
};

const production = {
	port: process.env.DEV_PORT,
};

const config: any = {
	development,
	production,
	test,
};

export default config[nodeEnv];