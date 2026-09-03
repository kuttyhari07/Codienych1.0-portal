const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      unique: true,
    },
    expectedAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
    },
    upiId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: [true, 'UPI Transaction ID / UTR Number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    screenshotUrl: {
      type: String,
      required: [true, 'Payment screenshot is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
