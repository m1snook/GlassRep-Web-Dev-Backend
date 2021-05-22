const express = require('express');
const { protectRoutes, restrictTo } = require('../controllers/authController');
const router = express.Router();
const OrderCtrl = require('../controllers/orderController');

// get all the current orders
router
	.route('/')
	.get(OrderCtrl.getAllOrders)
	.post(protectRoutes, OrderCtrl.newOrder);

router.route('/:oid').get(protectRoutes, OrderCtrl.getOrderById);

module.exports = router;
