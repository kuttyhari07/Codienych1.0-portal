const ReviewSchedule = require('../models/ReviewSchedule');

// Official ESEC Department of Information Technology CODIENYCH 1.0 Agenda Timings (8.10.2026):
const getDefaultReviewSeeds = () => {
  // Review - 1: Today 03:30 PM to 04:30 PM IST (8 Oct 2026)
  const r1Start = new Date('2026-10-08T15:30:00+05:30');
  const r1End = new Date('2026-10-08T16:30:00+05:30');

  // Review - 2: Today 09:30 PM to 10:30 PM IST (8 Oct 2026)
  const r2Start = new Date('2026-10-08T21:30:00+05:30');
  const r2End = new Date('2026-10-08T22:30:00+05:30');

  // Review - 3: Tonight / Midnight 12:30 AM to 01:30 AM IST (9 Oct 2026)
  const r3Start = new Date('2026-10-09T00:30:00+05:30');
  const r3End = new Date('2026-10-09T01:30:00+05:30');

  // Review - 4: Tomorrow 09:30 AM to 11:30 AM IST (9 Oct 2026)
  const r4Start = new Date('2026-10-09T09:30:00+05:30');
  const r4End = new Date('2026-10-09T11:30:00+05:30');

  return [
    {
      title: 'Review - 1',
      roundNumber: 1,
      order: 1,
      startTime: r1Start,
      endTime: r1End,
      status: 'UPCOMING',
      isCurrent: true,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Official Review 1 (03:30 PM - 04:30 PM). Evaluation criteria: Clarity of problem statement, architecture flow diagram, tech stack feasibility, and UI/UX wireframe prototypes. 5 mins presentation + 3 mins Q&A.',
      announcement: 'Review - 1 is scheduled from 03:30 PM to 04:30 PM! Prepare your architecture diagrams and slides.',
      extendedMinutes: 0,
    },
    {
      title: 'Review - 2',
      roundNumber: 2,
      order: 2,
      startTime: r2Start,
      endTime: r2End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Official Review 2 (09:30 PM - 10:30 PM). Evaluation criteria: Working prototype, database schema setup, backend API integration, and key feature implementation progress.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Review - 3',
      roundNumber: 3,
      order: 3,
      startTime: r3Start,
      endTime: r3End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Official Review 3 (12:30 AM - 01:30 AM). Evaluation criteria: Midnight coding scrutiny, edge cases, cloud deployment readiness, and code quality inspection.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Review - 4',
      roundNumber: 4,
      order: 4,
      startTime: r4Start,
      endTime: r4End,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Main Fleet Stage / Auditorium',
      description: 'Official Final Review 4 (09:30 AM - 11:30 AM). Grand evaluation before industry jury panel. Live project demonstration, business viability, and final code freeze.',
      announcement: '',
      extendedMinutes: 0,
    },
  ];
};

// Auto seed or sync official agenda reviews in the database
const seedDefaultReviewsIfEmpty = async () => {
  try {
    const seeds = getDefaultReviewSeeds();
    const count = await ReviewSchedule.countDocuments();
    if (count === 0) {
      await ReviewSchedule.insertMany(seeds);
      console.log('[Review Schedule] Initialized official ESEC agenda review rounds.');
    } else {
      // Sync official timings across the rounds
      for (const seed of seeds) {
        await ReviewSchedule.updateOne(
          { roundNumber: seed.roundNumber },
          {
            $set: {
              title: seed.title,
              startTime: seed.startTime,
              endTime: seed.endTime,
              venue: seed.venue,
              description: seed.description,
            },
          }
        );
      }
      console.log('[Review Schedule] Synchronized official agenda review timings.');
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

    const now = new Date();

    // 1. Strict time-based status reconciliation for EVERY review:
    for (const r of allReviews) {
      const s = new Date(r.startTime);
      const e = new Date(r.endTime);

      if (now < s) {
        // Has NOT started yet! Must be UPCOMING (Standby). Cannot be ACTIVE.
        if (r.status !== 'UPCOMING') {
          r.status = 'UPCOMING';
          await r.save();
        }
      } else if (now >= s && now < e) {
        // Current real time falls strictly within this review window! Must be ACTIVE
        if (r.status !== 'ACTIVE' && r.status !== 'PAUSED') {
          r.status = 'ACTIVE';
          await r.save();
        }
      } else if (now >= e) {
        // Review window has closed! Must be COMPLETED
        if (r.status !== 'COMPLETED') {
          r.status = 'COMPLETED';
          await r.save();
        }
      }
    }

    // 2. Select the single active review to feature:
    // First priority: A review whose window is currently live (now >= s && now < e)
    let activeReview = allReviews.find((r) => {
      const s = new Date(r.startTime);
      const e = new Date(r.endTime);
      return now >= s && now < e && r.status !== 'COMPLETED';
    });

    // If none is currently live (e.g. before Review 1, or during break gaps), pick the next upcoming review
    if (!activeReview) {
      activeReview = allReviews.find((r) => new Date(r.endTime) > now && r.status !== 'COMPLETED');
    }

    // Fallback: If all reviews have ended, pick the last review
    if (!activeReview && allReviews.length > 0) {
      activeReview = allReviews[allReviews.length - 1];
    }

    // 3. Ensure isCurrent is true ONLY on activeReview, and false on all others
    if (activeReview) {
      for (const r of allReviews) {
        const shouldBeCurrent = r._id.toString() === activeReview._id.toString();
        if (r.isCurrent !== shouldBeCurrent) {
          r.isCurrent = shouldBeCurrent;
          await r.save();
        }
      }
    }

    // Re-fetch clean synchronized list
    const refreshedReviews = await ReviewSchedule.find().sort({ order: 1, startTime: 1 });
    const syncedActiveReview = refreshedReviews.find((r) => r.isCurrent) || activeReview;

    return res.status(200).json({
      success: true,
      data: {
        activeReview: syncedActiveReview,
        allReviews: refreshedReviews,
        serverTime: new Date().toISOString(),
        totalReviews: refreshedReviews.length,
        completedReviews: refreshedReviews.filter((r) => r.status === 'COMPLETED').length,
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

    const now = new Date();
    const durationMs = Math.max(15 * 60 * 1000, new Date(review.endTime).getTime() - new Date(review.startTime).getTime());
    review.startTime = now;
    review.endTime = new Date(now.getTime() + durationMs);
    review.isCurrent = true;
    review.status = 'ACTIVE';

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
