const Order = require("../../models/Order");
const User = require("../../models/User");

module.exports = {
    getAllOrders: async (req,res) => {
        try {
            const orders = await Order.find({});
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    newOrder: async (req,res) => {
        try {
            // products is an array of objects => { pid, qty }
            const user = await User.findById(req.user.id).populate({ path: 'cart.pid' });

            // get the items from the users cart and calculate price for it
            const payment = user.cart.reduce((sum, { pid: product, qty }) => sum + product.price * qty);
            
            const order = new Order({
                products: user.cart,
                customer: user._id,
                paymentCash: payment
            });

            await order.save();

            res.status(200).json({ order });

        } catch (error) {
            res.status(500).json({ error });
        }
    },
    getOrderById: async (req,res) => {
        try {
            const id = req.params.oid;
            const order = await Order.findById(id);
            res.status(200).json({ order });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}