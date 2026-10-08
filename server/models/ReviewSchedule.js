const mongoose = require('mongoose');

const ReviewScheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
    },
    roundNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'PAUSED', 'COMPLETED'],
      default: 'UPCOMING',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    venue: {
      type: String,
      default: 'Main Hackathon Bay / Department Labs',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    announcement: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    extendedMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReviewSchedule', ReviewScheduleSchema);
