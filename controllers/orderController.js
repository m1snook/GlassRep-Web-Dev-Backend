const Order = require('../models/orderModel');
const User = require('../models/userModel');

module.exports = {
	getAllOrders: async (req, res, next) => {
		try {
			const orders = await Order.find({});
			res.status(200).json({ orders });
		} catch (error) {
			next(error);
		}
	},
	newOrder: async (req, res, next) => {
		try {
			// products is an array of objects => { pid, qty }
			const user = await User.findById(req.user.id).populate({
				path: 'cart.pid',
			});

			// get the items from the users cart and calculate price for it
			const payment = user.cart.reduce(
				(sum, { pid: product, qty }) => sum + product.price * qty
			);

			const order = new Order({
				products: user.cart.map(product => ({ name: product.name, description: product.description, price: product.price, id: product._id })),
				customer: user._id,
				paymentCash: payment,
			});

			await order.save();

			res.status(200).json({ order });
		} catch (error) {
			next(error);
		}
	},
	getOrderById: async (req, res, next) => {
		try {
			const id = req.params.oid;
			const order = await Order.findById(id);
			res.status(200).json({ order });
		} catch (error) {
			next(error);
		}
	},
};
