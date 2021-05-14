const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    auth: {
        username: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            unique: true
        }
    },
    cart: {
        type: [
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
        default: []
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;