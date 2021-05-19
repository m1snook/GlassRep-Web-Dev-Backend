const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const mongoose = require('mongoose');

const DB_URI =
	`mongodb+srv://<DB_USER>:<DB_PASSWORD>@cluster0.wo5lz.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`
		.replace('<DB_USER>', process.env.DB_USER)
		.replace('<DB_PASSWORD>', process.env.DB_PASSWORD)
		.replace('<DB_NAME>', process.env.DB_NAME);

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
