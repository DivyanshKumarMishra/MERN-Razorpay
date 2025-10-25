const Razorpay = require('razorpay');

async function createOrder(req, res, next) {
  const { amount, currency, receipt, description } = req.body;
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const response = await instance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes: {
        description
      }
    });

    if (response.error) {
      return res.status(500).json({
        message: 'Failed to create order',
        detail: response.error,
      });
    }

    return res.status(201).json({ data: response });
  } catch (error) {
    return await res.status(500).json({
      message: 'Failed to create order',
      detail: error.message,
    });
  }
}

module.exports = {
  createOrder,
};
