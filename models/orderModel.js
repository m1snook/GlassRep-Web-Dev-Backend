const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	products: [
		{
			pid: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
			qty: {
				type: Number,
				min: 1,
			},
		},
	],
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	paymentCash: {
		type: Number,
	},
	orderStatus: {
		type: String,
		enum: ['Complete', 'Ongoing'],
		default: 'Ongoing',
	},
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
