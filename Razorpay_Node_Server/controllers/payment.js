const crypto = require('crypto');

const verifyPaymentSignature = async (req, res, next) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expectedSignature = generatePaymentSignature(
      order_id,
      razorpay_payment_id
    );
    if (!expectedSignature === razorpay_signature)
      return res
        .status(400)
        .json({ success: false, message: 'Payment verification failed' });

    return res
      .status(200)
      .json({ success: true, message: 'Payment verification successful' });
  } catch (error) {
    return res.status(500).json({
      message: 'Payment Verification failed',
      detail: error.message,
    });
  }
};

function generatePaymentSignature(order_id, razorpay_payment_id) {
  const body = `${order_id}|${razorpay_payment_id}`;
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return signature;
}

module.exports = { verifyPaymentSignature };
