const crypto = require('crypto');
const Payment = require('../models/payment');

const verifyPaymentSignature = async (req, res, next) => {
  try {
    const {
      order,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id,
    } = req.body;
    const expectedSignature = generatePaymentSignature(
      razorpay_order_id,
      razorpay_payment_id
    );

    const isVerified = expectedSignature === razorpay_signature;
    let payment = {
      order,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    payment.status = isVerified ? 'pending' : 'failed';
    let paymentDoc = await Payment.create(payment);
    paymentDoc = await paymentDoc.populate('order');

    if (!isVerified) {
      return res.status(400).json(paymentDoc);
    }

    return res.status(201).json(paymentDoc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Payment Verification failed',
      detail: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res, next) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const webhook_body_string = JSON.stringify(req.body);

  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(webhook_body_string)
    .digest('hex');

  if (generatedSignature !== signature) {
    console.error('⚠️ Webhook signature verification failed');
    return res.status(400).send('Invalid signature');
  }

  const webhook_body = JSON.parse(webhook_body_string);
  const frontendURL = process.env.ORIGIN;

  if (webhook_body.event === 'payment.captured') {
    const paymentId = webhook_body?.payload?.payment.entity?.id;
  }

  const redirectURL = `${frontendURL}/payment-status?reference={paymentId}`;
  res.redirect(redirectURL);
};

function generatePaymentSignature(razorpay_order_id, razorpay_payment_id) {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return signature;
}

module.exports = { verifyPaymentSignature, updatePaymentStatus };
