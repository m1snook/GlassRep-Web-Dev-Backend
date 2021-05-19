const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

// configs
const { initDb } = require('./config/db');
require('./config/firebase');

// Routes
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

// env
dotenv.config({ path: `${__dirname}/.env` });

const errorController = require('./controllers/errorController');
const { protectRoutes } = require('./controllers/authController');

(async () => {
	try {
		await initDb();

		const app = express();

		// cors
		app.use(
			cors({
				credentials: true,
				origin: 'http://localhost:3000',
			})
		);

		// data parsers
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		// logger
		if (process.env.NODE_ENV === 'development') {
			app.use(morgan('dev'));
		}

		// Api routes
		app.use('/api/users', protectRoutes);
		app.use('/api/products', productRouter);
		app.use('/api/orders', orderRouter);

		// Global error Handler
		app.use(errorController);

		app.listen(process.env.PORT, () => {
			console.log(`App running on port ${process.env.PORT}`);
		});

		// For Unhandeled Rejections
		process.on('unhandledRejection', (err) => {
			console.log('UNHANDLED REJECTION, SHUTTING DOWN......');
			console.log(err);
		});
	} catch (err) {
		process.exit(1);
	}
})();
