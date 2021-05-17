const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: String,
	description: String,
	price: Number,
	ratings: [
		{
			rating: Number,
			ratedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			review: {
				type: String,
				maxlength: 200,
			},
		},
	],
	rating: {
		type: Number,
		default: 4.0,
		min: 1.0,
		max: 5.0,
	},
	timeStampAdded: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
