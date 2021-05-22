const express = require('express');
const router = express.Router();
const ProductCtrl = require('../controllers/productController');
const { protectRoutes } = require('../controllers/authController');

// get the list of all the products
router
	.route('/')
	.get(ProductCtrl.getAll)
	.post(protectRoutes, ProductCtrl.addProduct);

// get info about a specific product
router.route('/:pid').get(ProductCtrl.getProductById);

module.exports = router;
