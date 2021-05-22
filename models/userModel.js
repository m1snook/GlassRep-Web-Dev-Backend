const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	_id: {
		type: String,
	},
	role: {
		type: String,
		enum: ['admin', 'customer'],
		default: 'customer',
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: [true, 'user with this email already exists'],
		required: [true, 'user must provide their email id'],
		validate: [validator.isEmail, 'please provide a valid email id'],
	},
	shippingAddress: {
		address: {
			type: String,
		},
		city: {
			type: String,
		},
		postalCode: {
			type: Number,
		},
	},
	cart: {
		type: [
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
		default: [],
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
