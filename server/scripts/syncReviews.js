const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const ReviewSchedule = require('../models/ReviewSchedule');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    // Round 1: Coding Sprint: 01:30 PM to 04:30 PM, Review 1: 04:30 PM to 05:30 PM
    const r1Start = new Date('2026-10-08T13:30:00+05:30');
    const r1End = new Date('2026-10-08T16:30:00+05:30');
    const r1RevStart = new Date('2026-10-08T16:30:00+05:30');
    const r1RevEnd = new Date('2026-10-08T17:30:00+05:30');

    await ReviewSchedule.updateOne(
      { roundNumber: 1 },
      {
        $set: {
          title: 'Task 1: Ideation & Architecture (Review - 1)',
          startTime: r1Start,
          endTime: r1End,
          reviewStartTime: r1RevStart,
          reviewEndTime: r1RevEnd,
          status: 'ACTIVE',
          isCurrent: true,
          description: 'Task 1 Coding Window: 01:30 PM to 04:30 PM (3 Hours). Review - 1 Jury Evaluation follows at 04:30 PM to 05:30 PM. Criteria: Problem Statement clarity, Architecture diagram, and UI/UX wireframe prototypes.',
          announcement: 'Task 1 in progress! Coding sprint runs until 04:30 PM followed immediately by Review - 1 at 04:30 PM.',
        },
      }
    );

    // Round 2: Coding Sprint: 05:30 PM to 09:30 PM, Review 2: 09:30 PM to 10:30 PM
    const r2Start = new Date('2026-10-08T17:30:00+05:30');
    const r2End = new Date('2026-10-08T21:30:00+05:30');
    const r2RevStart = new Date('2026-10-08T21:30:00+05:30');
    const r2RevEnd = new Date('2026-10-08T22:30:00+05:30');

    await ReviewSchedule.updateOne(
      { roundNumber: 2 },
      {
        $set: {
          title: 'Task 2: Core Prototype & APIs (Review - 2)',
          startTime: r2Start,
          endTime: r2End,
          reviewStartTime: r2RevStart,
          reviewEndTime: r2RevEnd,
          status: 'UPCOMING',
          isCurrent: false,
          description: 'Task 2 Coding Window: 05:30 PM to 09:30 PM (4 Hours, Dinner: 07:30 PM - 08:30 PM). Review - 2 Jury Evaluation follows at 09:30 PM to 10:30 PM. Criteria: Working prototype, database schema setup, backend API integration, and key feature progress.',
        },
      }
    );

    const updated = await ReviewSchedule.find().sort({ order: 1 });
    console.log('SYNC SUCCESSFUL. CURRENT REVIEWS:');
    updated.forEach((u) => {
      console.log(`[Round ${u.roundNumber}] ${u.title}`);
      console.log(`  Task Start: ${u.startTime.toISOString()} (${new Date(u.startTime).toLocaleTimeString()})`);
      console.log(`  Task End / Rev Start: ${u.endTime.toISOString()} (${new Date(u.endTime).toLocaleTimeString()})`);
      console.log(`  Rev End: ${u.reviewEndTime ? u.reviewEndTime.toISOString() : 'N/A'} (${u.reviewEndTime ? new Date(u.reviewEndTime).toLocaleTimeString() : 'N/A'})`);
      console.log(`  Status: ${u.status}, isCurrent: ${u.isCurrent}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('SYNC ERROR:', err);
    process.exit(1);
  }
}

run();
