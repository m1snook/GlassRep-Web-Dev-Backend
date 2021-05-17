const express = require('express');
const { protectRoutes, restrictTo } = require('../controllers/authController');
const router = express.Router();
const OrderCtrl = require('../controllers/orderController');

// get all the current orders
router.route('/')
    .get(OrderCtrl.getAllOrders)
    .post(protectRoutes, restrictTo('customer'), OrderCtrl.newOrder)
;

router.route('/:oid')
    .get(OrderCtrl.getOrderById)
;

module.exports = router;
