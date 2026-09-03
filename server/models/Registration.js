const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      enum: [4, 5, 6],
    },
    status: {
      type: String,
      enum: ['PENDING', 'REGISTRATION CONFIRMED', 'REJECTED'],
      default: 'PENDING',
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
