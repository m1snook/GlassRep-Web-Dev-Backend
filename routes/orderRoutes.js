const express = require('express');
const { protectRoutes, restrictTo } = require('../controllers/authController');
const router = express.Router();
const OrderCtrl = require('../controllers/orderController');

// get all the current orders
/**
 * @swagger
 * /api/orders:
 *     get:
 *         summary: Retrieve all the orders
 *         description: fetches all the orders made by the user 
 *         responses:
 *             200:
 *                 description: A list of oreders
 */
router
	.route('/')
	.get(OrderCtrl.getAllOrders)
	.post(protectRoutes, OrderCtrl.newOrder);

/**
 * @swagger
 * /api/order/orderId:
 *     get:
 *         summary: Retrieves the order with the specified orderId
 *         description: Fetches the order with the specified orderId
 *         parameters:
 *             - in: query
 *               name: oderId
 *               type: integer
 *               description: The orderId to fetch the order with
 *         responses:
 *             200:
 *                 description: returns the order with the specified orderId
 */
router.route('/:oid').get(protectRoutes, OrderCtrl.getOrderById);

module.exports = router;
