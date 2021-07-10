const express = require('express');
var router = express.Router();
const { protectRoutes } = require('../controllers/authController');
const { processPayment, getToken } = require('../controllers/payment');


router.get('/payment/gettoken', protectRoutes, getToken);
router.post('/payment/braintree', protectRoutes, processPayment);

module.exports = router;
