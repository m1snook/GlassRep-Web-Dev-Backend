const express = require('express');
const router = express.Router();
const OrderCtrl = require('../controllers/orderController');

// get all the current orders
router.route('/').get(OrderCtrl.getAllOrders).post(OrderCtrl.newOrder);

router.route('/:oid').get(OrderCtrl.getOrderById);

module.exports = router;
