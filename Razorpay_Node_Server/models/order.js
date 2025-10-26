const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    amount: { type: Number, required: true },
    receipt: { type: String, required: true },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      validate: {
        validator: (v) => /^[A-Z]{3}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid 3-letter currency code`,
      },
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'failed'],
      default: 'pending',
    },
    notes: { type: Object },
    items: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
