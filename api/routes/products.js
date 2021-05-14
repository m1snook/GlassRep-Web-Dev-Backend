const express = require('express')
const router = express.Router();
const ProductCtrl = require('../controllers/products');

// get the list of all the products
router.route('/')
    .get(ProductCtrl.getAll)
    .post(ProductCtrl.addProduct)
;

// get info about a specific product
router.route('/:pid')
    .get(ProductCtrl.getProductById)
;

module.exports = router;