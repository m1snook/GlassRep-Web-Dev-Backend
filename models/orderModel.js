const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	products: [
		{
			product: {
				name: String,
				description: String,
				price: Number,
				id: mongoose.Schema.Types.ObjectId
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
		enum: ['Complete', 'Ongoing', 'Cancelled', 'Refunded'],
		default: 'Ongoing',
	},
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
