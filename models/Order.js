import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `ORD-${Date.now()}${Math.random().toString(36).substr(2, 4)}`
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  subtotal: Number,
  shippingFee: Number,
  tax: Number,
  paymentMethod: {
    type: String,
    enum: ['COD', 'sadapay', 'jazzcash', 'card'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date
}, {
  timestamps: true
});

OrderSchema.pre('save', function(next) {
  // Auto-set payment status based on payment method
  if (['sadapay', 'jazzcash', 'card'].includes(this.paymentMethod)) {
    this.paymentStatus = 'paid';
  } else {
    this.paymentStatus = 'pending';
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);