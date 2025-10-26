const express = require('express');
const { verifyPaymentSignature, updatePaymentStatus } = require('../controllers/payment');
const paymentRouter = express.Router();

paymentRouter.post('/verify-payment-signature', verifyPaymentSignature)
paymentRouter.post('/update-payment-status', updatePaymentStatus)

module.exports = paymentRouter