const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    amount: { type: Number, required: true },
    validate: {
      validator: (v) => v.length === 3,
      message: (props) => `${props.value} is not a valid currency code!`,
    },
    receipt: { type: String, required: true },
    notes: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
