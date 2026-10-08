const ReviewSchedule = require('../models/ReviewSchedule');

// Official ESEC Department of Information Technology CODIENYCH 1.0 Agenda Timings (8.10.2026):
const getDefaultReviewSeeds = () => {
  // Round 1: Task 1 Coding Sprint: Today 01:30 PM to 04:30 PM IST (8 Oct 2026) -> Students coding window
  // Review - 1 Evaluation follows: 04:30 PM to 05:30 PM IST
  const r1Start = new Date('2026-10-08T13:30:00+05:30');
  const r1End = new Date('2026-10-08T16:30:00+05:30');
  const r1RevStart = new Date('2026-10-08T16:30:00+05:30');
  const r1RevEnd = new Date('2026-10-08T17:30:00+05:30');

  // Round 2: Task 2 Coding Sprint: Today 05:30 PM to 10:00 PM IST (8 Oct 2026) -> Students coding window (Dinner: 7:30 - 8:30 PM)
  // Review - 2 Evaluation follows: 10:00 PM to 11:00 PM IST (Round 2 ends sharp at 23:00 / 11:00 PM)
  const r2Start = new Date('2026-10-08T17:30:00+05:30');
  const r2End = new Date('2026-10-08T22:00:00+05:30');
  const r2RevStart = new Date('2026-10-08T22:00:00+05:30');
  const r2RevEnd = new Date('2026-10-08T23:00:00+05:30');

  // Round 3: Task 3 Midnight Coding Sprint: Tonight 11:00 PM to 12:30 AM IST (8-9 Oct 2026) -> Midnight coding window (Snacks: 11:30 PM)
  // Review - 3 Evaluation follows: 12:30 AM to 01:30 AM IST
  const r3Start = new Date('2026-10-08T23:00:00+05:30');
  const r3End = new Date('2026-10-09T00:30:00+05:30');
  const r3RevStart = new Date('2026-10-09T00:30:00+05:30');
  const r3RevEnd = new Date('2026-10-09T01:30:00+05:30');

  // Round 4: Task 4 Final Sprint to Code Freeze: Tomorrow 01:30 AM to 09:30 AM IST (9 Oct 2026) -> Overnight sprint (Breakfast: 8:00 - 9:00 AM)
  // Review - 4 Final Jury Evaluation follows: 09:30 AM to 11:30 AM IST
  const r4Start = new Date('2026-10-09T01:30:00+05:30');
  const r4End = new Date('2026-10-09T09:30:00+05:30');
  const r4RevStart = new Date('2026-10-09T09:30:00+05:30');
  const r4RevEnd = new Date('2026-10-09T11:30:00+05:30');

  return [
    {
      title: 'Task 1: Ideation & Architecture (Review - 1)',
      roundNumber: 1,
      order: 1,
      startTime: r1Start,
      endTime: r1End,
      reviewStartTime: r1RevStart,
      reviewEndTime: r1RevEnd,
      status: 'UPCOMING',
      isCurrent: true,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Task 1 Coding Window: 01:30 PM to 04:30 PM (3 Hours). Review - 1 Jury Evaluation follows at 04:30 PM to 05:30 PM. Criteria: Problem Statement clarity, Architecture diagram, and UI/UX wireframe prototypes.',
      announcement: 'Task 1 in progress! Coding sprint runs until 04:30 PM followed immediately by Review - 1 at 04:30 PM.',
      extendedMinutes: 0,
    },
    {
      title: 'Task 2: Core Prototype & APIs (Review - 2)',
      roundNumber: 2,
      order: 2,
      startTime: r2Start,
      endTime: r2End,
      reviewStartTime: r2RevStart,
      reviewEndTime: r2RevEnd,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Task 2 Coding Window: 05:30 PM to 10:00 PM (4.5 Hours, Dinner: 07:30 PM - 08:30 PM). Review - 2 Jury Evaluation follows at 10:00 PM to 11:00 PM (Round 2 concludes at 11:00 PM / 23:00). Criteria: Working prototype, database schema setup, backend API integration, and key feature progress.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Task 3: Midnight Sprint & Hardening (Review - 3)',
      roundNumber: 3,
      order: 3,
      startTime: r3Start,
      endTime: r3End,
      reviewStartTime: r3RevStart,
      reviewEndTime: r3RevEnd,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Respective Team Bays / Software Labs',
      description: 'Task 3 Midnight Coding Window: 11:00 PM to 12:30 AM (1.5 Hours, Refreshment-3 at 11:30 PM). Review - 3 Jury Evaluation follows at 12:30 AM to 01:30 AM. Criteria: Midnight code audit, edge cases, cloud deployment readiness, and code quality.',
      announcement: '',
      extendedMinutes: 0,
    },
    {
      title: 'Task 4: Final Sprint & Code Freeze (Review - 4)',
      roundNumber: 4,
      order: 4,
      startTime: r4Start,
      endTime: r4End,
      reviewStartTime: r4RevStart,
      reviewEndTime: r4RevEnd,
      status: 'UPCOMING',
      isCurrent: false,
      venue: 'Main Fleet Stage / Auditorium',
      description: 'Task 4 Overnight Coding Window: 01:30 AM to 09:30 AM (8 Hours, Breakfast: 08:00 AM - 09:00 AM). Review - 4 Final Jury Evaluation follows at 09:30 AM to 11:30 AM. Final code freeze, pitch deck presentation before jury, and live demo.',
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
              reviewStartTime: seed.reviewStartTime,
              reviewEndTime: seed.reviewEndTime,
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
      const revEnd = new Date(r.reviewEndTime || r.endTime);

      if (now < s) {
        // Has NOT started yet! Must be UPCOMING (Standby). Cannot be ACTIVE.
        if (r.status !== 'UPCOMING') {
          r.status = 'UPCOMING';
          await r.save();
        }
      } else if (now >= s && now < revEnd) {
        // Current real time falls strictly within this round's window! Must be ACTIVE
        if (r.status !== 'ACTIVE' && r.status !== 'PAUSED') {
          r.status = 'ACTIVE';
          await r.save();
        }
      } else if (now >= revEnd) {
        // Round window has closed! Must be COMPLETED
        if (r.status !== 'COMPLETED') {
          r.status = 'COMPLETED';
          await r.save();
        }
      }
    }

    // 2. Select the single active review to feature:
    // First priority: A review whose window is currently live (now >= s && now < revEnd)
    let activeReview = allReviews.find((r) => {
      const s = new Date(r.startTime);
      const revEnd = new Date(r.reviewEndTime || r.endTime);
      return now >= s && now < revEnd && r.status !== 'COMPLETED';
    });

    // If none is currently live (e.g. before Task 1, or during break gaps), pick the next upcoming review
    if (!activeReview) {
      activeReview = allReviews.find((r) => new Date(r.reviewEndTime || r.endTime) > now && r.status !== 'COMPLETED');
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
      reviewStartTime,
      reviewEndTime,
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
      reviewStartTime: reviewStartTime ? new Date(reviewStartTime) : end,
      reviewEndTime: reviewEndTime ? new Date(reviewEndTime) : end,
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
      reviewStartTime,
      reviewEndTime,
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

    if (reviewStartTime !== undefined) {
      review.reviewStartTime = reviewStartTime ? new Date(reviewStartTime) : review.endTime;
    }

    if (reviewEndTime !== undefined) {
      review.reviewEndTime = reviewEndTime ? new Date(reviewEndTime) : review.endTime;
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
