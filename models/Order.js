const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    products: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            qty: {
                type: Number,
                min: 1
            }
        }
    ],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    paymentCash: {
        type: Number
    },
    orderStatus: {
        type: String,
        enum: ['Complete', 'Ongoing'],
        default: 'Ongoing'
    }
})

const Order = mongoose.model('order', orderSchema);
module.exports = Order;