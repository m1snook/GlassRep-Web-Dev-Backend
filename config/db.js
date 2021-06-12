const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const mongoose = require('mongoose');

// production database URI
const DB_URI_PROD =
	`mongodb+srv://<DB_USER>:<DB_PASSWORD>@cluster0.wo5lz.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`
		.replace('<DB_USER>', process.env.DB_USER)
		.replace('<DB_PASSWORD>', process.env.DB_PASSWORD)
		.replace('<DB_NAME>', process.env.DB_NAME);

// development database URI
const DB_URI_DEV = `mongodb+srv://majjikishore007:Majji007@cluster0.2t0sf.mongodb.net/glassrep`

// Select current DB URI
const DB_URI =  process.env.NODE_ENV === 'production' ? DB_URI_PROD : DB_URI_DEV;

exports.initDb = async () => {
	await mongoose.connect(DB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,	
		useUnifiedTopology: true,
	});

	console.log('connected to MongoDB..');

	if (process.env.NODE_ENV === 'development') {
		mongoose.set('debug', true);
	}
};
