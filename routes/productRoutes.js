const express = require('express');
const router = express.Router();
const ProductCtrl = require('../controllers/productController');
const { protectRoutes } = require('../controllers/authController');

// get the list of all the products
/**
 * @swagger
 * /api/products:
 *     get:
 *         summary: Retrieve all the products
 *         description: fetches all the products avilable 
 *         responses:
 *             200:
 *                 description: A list of products objects
 */
router
	.route('/')
	.get(ProductCtrl.getAll)
	.post(protectRoutes, ProductCtrl.addProduct);

// get info about a specific product

/**
 * @swagger
 * /api/product/productId:
 *     get:
 *         summary: Retrieves the product with the specified productId
 *         description: Fetches the product with the specified productId
 *         parameters:
 *             - in: query
 *               name: productId
 *               type: integer
 *               description: The productId to fetch the order with
 *         responses:
 *             200:
 *                 description: returns the product object with the specified productId
 */
router.route('/:pid').get(ProductCtrl.getProductById);

module.exports = router;
