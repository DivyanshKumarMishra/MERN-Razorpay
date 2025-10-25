const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
