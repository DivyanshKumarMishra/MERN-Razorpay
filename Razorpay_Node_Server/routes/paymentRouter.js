const express = require('express');
const { verifyPaymentSignature } = require('../controllers/payment');
const paymentRouter = express.Router();

paymentRouter.post('/verify-payment-signature', verifyPaymentSignature)

module.exports = paymentRouter