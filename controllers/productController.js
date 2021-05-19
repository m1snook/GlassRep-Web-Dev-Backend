const Product = require('../models/productModel');
const AppError = require('../utils/AppError');

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const products = await Product.find({});
			res.status(200).json({ products });
		} catch (error) {
			next(error);
		}
	},
	addProduct: async (req, res, next) => {
		try {
			const { name, price, description } = req.body;

			if (!name || !description) {
				throw new AppError('Enter all the details', 400);
			}

			if (!price) {
				throw new AppError('Please enter the price', 400);
			}

			const newProduct = new Product({
				name,
				price,
				description,
			});
			await newProduct.save();

			res.status(201).json({ newProduct });
		} catch (error) {
			next(error);
		}
	},
	getProductById: async (req, res, next) => {
		try {
			const id = req.params.id;
			const product = await Product.findById(id);
			res.status(200).json({ product });
		} catch (error) {
			next(error);
		}
	},
};
