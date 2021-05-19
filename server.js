const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('./config/passport');
const cookieSession = require('cookie-session');

const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');

const errorController = require('./controllers/errorController');

// env config
dotenv.config({ path: `${__dirname}/.env` });

const DB_URI =
	`mongodb+srv://<DB_USER>:<DB_PASSWORD>@cluster0.wo5lz.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`
		.replace('<DB_USER>', process.env.DB_USER)
		.replace('<DB_PASSWORD>', process.env.DB_PASSWORD)
		.replace('<DB_NAME>', process.env.DB_NAME);

(async () => {
	try {
		await mongoose.connect(DB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		});

		console.log('connected to DB..');

		const app = express();

		// cors
		app.use(
			cors({
				credentials: true,
				origin: ['http://localhost:3000'],
			})
		);

		// session cookie for oauth cookies
		app.use(
			cookieSession({
				httpOnly: true,
				keys: ['glassRep-outh'],
				sameSite: 'lax',
				maxAge: 1000 * 60 * 60 * 24 * 3,
			})
		);

		// data parsers
		app.use(cookieParser());
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		// logger
		if (process.env.NODE_ENV === 'development') {
			mongoose.set('debug', true);
			app.use(morgan('dev'));
		}

		// passport js for G-oauth
		app.use(passport.initialize());
		app.use(passport.session({ saveUninitialized: false, resave: false }));

		// Api routes
		app.use('/api/products', productRouter);
		app.use('/api/orders', orderRouter);
		app.use('/api/users', userRouter);

		// Global error Handler
		app.use(errorController);

		app.listen(process.env.PORT, () => {
			console.log(`App running on port ${process.env.PORT}`);
		});

		// For Unhandeled Rejections
		process.on('unhandledRejection', (err) => {
			console.log('UNHANDLED REJECTION, SHUTTING DOWN......');
			console.log(err);
			server.close(async () => {
				await mongoose.disconnect();
				process.exit(1);
			});
		});
	} catch (err) {
		process.exit(1);
	}
})();
