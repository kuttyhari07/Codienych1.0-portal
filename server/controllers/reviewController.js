const ReviewSchedule = require('../models/ReviewSchedule');

// Default initial seeds for CODIENYCH 1.0 Hackathon
const getDefaultReviewSeeds = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // Review 1: Today 11:30 AM - 01:30 PM
  const r1Start = new Date(year, month, date, 11, 30, 0);
  const r1End = new Date(year, month, date, 13, 30, 0);

  // Review 2: Today 08:00 PM - 10:30 PM
  const r2Start = new Date(year, month, date, 20, 0, 0);
  const r2End = new Date(year, month, date, 22, 30, 0);

  // Review 3: Tomorrow 03:30 AM - 05:30 AM
  const r3Start = new Date(year, month, date + 1, 3, 30, 0);
  const r3End = new Date(year, month, date + 1, 5, 30, 0);

  // Final Review: Tomorrow 09:00 AM - 11:30 AM
  const r4Start = new Date(year, month, date + 1, 9, 0, 0);
  const r4End = new Date(year, month, date + 1, 11, 30, 0);

  return [
    {
      title: 'Review 1: Ideation, Architecture & Problem Statement',
      roundNumber: 1,
      order: 1,
      startTime: r1Start,
      endTime: r1End,
      status: 'ACTIVE',
      isCurrent: true,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Evaluation criteria: Clarity of problem statement, architecture flow diagram, tech stack feasibility, and UI/UX wireframe prototypes. 5 mins presentation + 3 mins Q&A.',
      announcement: 'Review 1 is live! Keep your architecture diagrams and slides ready for jury evaluation.',
      extendedMinutes: 0,
    },
    {
      title: 'Review 2: Midway Prototype & API Implementation',
      roundNumber: 2,
      order: 2,
      startTime: r2Start,
      endTime: r2End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Evaluation criteria: Working prototype, database schema setup, backend API integration, and key feature implementation progress.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Review 3: Code Freeze, Security & Cloud Deployment',
      roundNumber: 3,
      order: 3,
      startTime: r3Start,
      endTime: r3End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Evaluation criteria: Live hosted web application, edge cases testing, GitHub commit activity, and code quality inspection.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Final Review: Grand Jury Presentation & Live Pitch',
      roundNumber: 4,
      order: 4,
      startTime: r4Start,
      endTime: r4End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Main Auditorium Stage',
      description: 'Grand evaluation before industry jury panel. 7 mins live pitch + 3 mins live demo + 2 mins jury interrogation.',
      announcement: '',
      extendedMinutes: 0,
    },
  ];
};

// Auto seed default reviews if none exist in the database
const seedDefaultReviewsIfEmpty = async () => {
  try {
    const count = await ReviewSchedule.countDocuments();
    if (count === 0) {
      const seeds = getDefaultReviewSeeds();
      await ReviewSchedule.insertMany(seeds);
      console.log('[Review Schedule] Initialized default hackathon review rounds.');
    }
  } catch (err) {
    console.warn('[Review Schedule Seed Warning]', err.message);
  }
};

/**
 * Public: Get Currently Active Review & Full Review Schedule
 * GET /api/reviews/active
 */
const getActiveReview = async (req, res) => {
  try {
    await seedDefaultReviewsIfEmpty();

    const allReviews = await ReviewSchedule.find().sort({ order: 1, startTime: 1 });

    if (!allReviews || allReviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          activeReview: null,
          allReviews: [],
          serverTime: new Date().toISOString(),
        },
      });
    }

    // 1. Look for explicitly flagged current review
    let activeReview = allReviews.find((r) => r.isCurrent);

    // 2. If none marked current, find the one with status 'ACTIVE'
    if (!activeReview) {
      activeReview = allReviews.find((r) => r.status === 'ACTIVE');
    }

    // 3. Fallback: Find next upcoming review where endTime > now
    const now = new Date();
    if (!activeReview) {
      activeReview = allReviews.find((r) => new Date(r.endTime) > now && r.status !== 'COMPLETED');
    }

    // 4. Fallback: first review
    if (!activeReview && allReviews.length > 0) {
      activeReview = allReviews[0];
    }

    return res.status(200).json({
      success: true,
      data: {
        activeReview,
        allReviews,
        serverTime: new Date().toISOString(),
        totalReviews: allReviews.length,
        completedReviews: allReviews.filter((r) => r.status === 'COMPLETED').length,
      },
    });
  } catch (error) {
    console.error('[Get Active Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active review countdown information.',
      error: error.message,
    });
  }
};

/**
 * Public: Get All Scheduled Reviews
 * GET /api/reviews
 */
const getAllReviews = async (req, res) => {
  try {
    await seedDefaultReviewsIfEmpty();
    const reviews = await ReviewSchedule.find().sort({ order: 1, startTime: 1 });
    return res.status(200).json({
      success: true,
      data: reviews,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Get All Reviews Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch review schedule.',
      error: error.message,
    });
  }
};

/**
 * Admin: Create New Review
 * POST /api/admin/reviews
 */
const createReview = async (req, res) => {
  try {
    const {
      title,
      roundNumber,
      startTime,
      endTime,
      venue,
      description,
      announcement,
      status,
      isCurrent,
      order,
    } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required.',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start time or end time format.',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.',
      });
    }

    // If marked current, unset current on all other reviews
    if (isCurrent) {
      await ReviewSchedule.updateMany({}, { isCurrent: false });
    }

    const newReview = await ReviewSchedule.create({
      title: title.trim(),
      roundNumber: roundNumber ? parseInt(roundNumber, 10) : 1,
      startTime: start,
      endTime: end,
      venue: venue?.trim() || 'Main Hackathon Bay / Labs',
      description: description?.trim() || '',
      announcement: announcement?.trim() || '',
      status: status || 'UPCOMING',
      isCurrent: !!isCurrent,
      order: order ? parseInt(order, 10) : 1,
      extendedMinutes: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Review schedule milestone created successfully.',
      data: newReview,
    });
  } catch (error) {
    console.error('[Create Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create review schedule.',
      error: error.message,
    });
  }
};

/**
 * Admin: Update Review
 * PUT /api/admin/reviews/:id
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      roundNumber,
      startTime,
      endTime,
      venue,
      description,
      announcement,
      status,
      isCurrent,
      order,
    } = req.body;

    const review = await ReviewSchedule.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review schedule not found.',
      });
    }

    if (title) review.title = title.trim();
    if (roundNumber !== undefined) review.roundNumber = parseInt(roundNumber, 10);
    if (order !== undefined) review.order = parseInt(order, 10);
    if (venue !== undefined) review.venue = venue.trim();
    if (description !== undefined) review.description = description.trim();
    if (announcement !== undefined) review.announcement = announcement.trim();
    if (status) review.status = status;

    if (startTime) {
      const parsedStart = new Date(startTime);
      if (!isNaN(parsedStart.getTime())) review.startTime = parsedStart;
    }

    if (endTime) {
      const parsedEnd = new Date(endTime);
      if (!isNaN(parsedEnd.getTime())) review.endTime = parsedEnd;
    }

    if (review.endTime <= review.startTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.',
      });
    }

    if (isCurrent !== undefined) {
      if (isCurrent) {
        await ReviewSchedule.updateMany({ _id: { $ne: id } }, { isCurrent: false });
        review.isCurrent = true;
      } else {
        review.isCurrent = false;
      }
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Review schedule updated successfully.',
      data: review,
    });
  } catch (error) {
    console.error('[Update Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update review.',
      error: error.message,
    });
  }
};

/**
 * Admin: Set a Review as Currently Active / Live
 * POST /api/admin/reviews/:id/set-active
 */
const setActiveReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Reset current on all reviews
    await ReviewSchedule.updateMany({}, { isCurrent: false });

    const review = await ReviewSchedule.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    review.isCurrent = true;
    review.status = 'ACTIVE';

    // If current time is past endTime, optionally adjust or let admin control
    await review.save();

    return res.status(200).json({
      success: true,
      message: `"${review.title}" is now the active live review.`,
      data: review,
    });
  } catch (error) {
    console.error('[Set Active Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set active review.',
      error: error.message,
    });
  }
};

/**
 * Admin: Quick Time Extension (+5, +10, +15, +30 mins)
 * POST /api/admin/reviews/:id/extend
 */
const extendReviewTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { minutes } = req.body;

    const extensionMins = parseInt(minutes, 10);
    if (isNaN(extensionMins) || extensionMins <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid positive minutes required for extension.',
      });
    }

    const review = await ReviewSchedule.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    const currentEnd = new Date(review.endTime);
    const newEnd = new Date(currentEnd.getTime() + extensionMins * 60 * 1000);

    review.endTime = newEnd;
    review.extendedMinutes = (review.extendedMinutes || 0) + extensionMins;
    if (review.status === 'COMPLETED') {
      review.status = 'ACTIVE';
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: `Extended review by ${extensionMins} minutes. New end time: ${newEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      data: review,
    });
  } catch (error) {
    console.error('[Extend Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to extend review duration.',
      error: error.message,
    });
  }
};

/**
 * Admin: Update Status (UPCOMING, ACTIVE, PAUSED, COMPLETED)
 * PATCH /api/admin/reviews/:id/status
 */
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['UPCOMING', 'ACTIVE', 'PAUSED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`,
      });
    }

    const review = await ReviewSchedule.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    review.status = status;
    if (status === 'ACTIVE') {
      await ReviewSchedule.updateMany({ _id: { $ne: id } }, { isCurrent: false });
      review.isCurrent = true;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review status updated to ${status}.`,
      data: review,
    });
  } catch (error) {
    console.error('[Update Review Status Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update review status.',
      error: error.message,
    });
  }
};

/**
 * Admin: Delete Review
 * DELETE /api/admin/reviews/:id
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewSchedule.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review removed from schedule.',
      data: review,
    });
  } catch (error) {
    console.error('[Delete Review Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review.',
      error: error.message,
    });
  }
};

/**
 * Admin: Reset / Reseed Default Hackathon Reviews
 * POST /api/admin/reviews/reset-defaults
 */
const resetDefaultReviews = async (req, res) => {
  try {
    await ReviewSchedule.deleteMany({});
    const seeds = getDefaultReviewSeeds();
    const inserted = await ReviewSchedule.insertMany(seeds);

    return res.status(200).json({
      success: true,
      message: 'Default hackathon review milestones restored.',
      data: inserted,
    });
  } catch (error) {
    console.error('[Reset Default Reviews Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restore default reviews.',
      error: error.message,
    });
  }
};

module.exports = {
  seedDefaultReviewsIfEmpty,
  getActiveReview,
  getAllReviews,
  createReview,
  updateReview,
  setActiveReview,
  extendReviewTime,
  updateReviewStatus,
  deleteReview,
  resetDefaultReviews,
};
