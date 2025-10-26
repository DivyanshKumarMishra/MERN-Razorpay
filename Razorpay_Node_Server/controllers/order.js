const Razorpay = require('razorpay');
const Order = require('../models/order');

async function createOrder(req, res, next) {
  const { amount, currency, receipt, description, items } = req.body;
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
        description,
      },
    });

    if (response.error) {
      return res.status(500).json({
        message: 'Failed to create order',
        details: response.error,
      });
    }

    const order = await Order.create({
      amount,
      currency,
      receipt,
      items,
      razorpay_order_id: response.id,
      notes: response.notes,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return await res.status(500).json({
      message: 'Failed to create order',
      details: error.message,
    });
  }
}

module.exports = {
  createOrder,
};
