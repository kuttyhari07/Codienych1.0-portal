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

    const now = new Date();

    // Round 1: Coding Sprint: 01:30 PM to 04:30 PM, Review 1: 04:30 PM to 05:30 PM
    const r1Start = new Date('2026-10-08T13:30:00+05:30');
    const r1End = new Date('2026-10-08T16:30:00+05:30');
    const r1RevStart = new Date('2026-10-08T16:30:00+05:30');
    const r1RevEnd = new Date('2026-10-08T17:30:00+05:30');

    const r1Status = now >= r1RevEnd ? 'COMPLETED' : 'ACTIVE';
    const r1IsCurrent = now < r1RevEnd;

    await ReviewSchedule.updateOne(
      { roundNumber: 1 },
      {
        $set: {
          title: 'Task 1: Ideation & Architecture (Review - 1)',
          startTime: r1Start,
          endTime: r1End,
          reviewStartTime: r1RevStart,
          reviewEndTime: r1RevEnd,
          status: r1Status,
          isCurrent: r1IsCurrent,
          description: 'Task 1 Coding Window: 01:30 PM to 04:30 PM (3 Hours). Review - 1 Jury Evaluation follows at 04:30 PM to 05:30 PM. Criteria: Problem Statement clarity, Architecture diagram, and UI/UX wireframe prototypes.',
          announcement: 'Task 1 in progress! Coding sprint runs until 04:30 PM followed immediately by Review - 1 at 04:30 PM.',
        },
      }
    );

    // Round 2: Coding Sprint: 05:30 PM (17:30) to 11:00 PM (23:00), Review 2: 11:00 PM to 12:00 AM (00:00)
    const r2Start = new Date('2026-10-08T17:30:00+05:30');
    const r2End = new Date('2026-10-08T23:00:00+05:30');
    const r2RevStart = new Date('2026-10-08T23:00:00+05:30');
    const r2RevEnd = new Date('2026-10-09T00:00:00+05:30');

    const r2Status = now < r2Start ? 'UPCOMING' : now < r2RevEnd ? 'ACTIVE' : 'COMPLETED';
    const r2IsCurrent = now >= r1RevEnd && now < r2RevEnd;

    await ReviewSchedule.updateOne(
      { roundNumber: 2 },
      {
        $set: {
          title: 'Task 2: Core Prototype & APIs (Review - 2)',
          startTime: r2Start,
          endTime: r2End,
          reviewStartTime: r2RevStart,
          reviewEndTime: r2RevEnd,
          status: r2Status,
          isCurrent: r2IsCurrent,
          description: 'Task 2 Coding Window: 05:30 PM to 11:00 PM (5.5 Hours, Dinner: 07:30 PM - 08:30 PM). Review - 2 Jury Evaluation follows at 11:00 PM to 12:00 AM (Review 2 starts at 11:00 PM sharp). Criteria: Working prototype, database schema setup, backend API integration, and key feature progress.',
          announcement: 'Task 2 coding sprint in progress until 11:00 PM! Review - 2 evaluation commences sharp at 11:00 PM.',
        },
      }
    );

    // Round 3: Midnight Coding Sprint: 12:00 AM (00:00) to 01:30 AM, Review 3: 01:30 AM to 02:30 AM
    const r3Start = new Date('2026-10-09T00:00:00+05:30');
    const r3End = new Date('2026-10-09T01:30:00+05:30');
    const r3RevStart = new Date('2026-10-09T01:30:00+05:30');
    const r3RevEnd = new Date('2026-10-09T02:30:00+05:30');

    await ReviewSchedule.updateOne(
      { roundNumber: 3 },
      {
        $set: {
          title: 'Task 3: Midnight Sprint & Hardening (Review - 3)',
          startTime: r3Start,
          endTime: r3End,
          reviewStartTime: r3RevStart,
          reviewEndTime: r3RevEnd,
          status: 'UPCOMING',
          isCurrent: false,
          description: 'Task 3 Midnight Coding Window: 12:00 AM to 01:30 AM (1.5 Hours). Review - 3 Jury Evaluation follows at 01:30 AM to 02:30 AM. Criteria: Midnight code audit, edge cases, cloud deployment readiness, and code quality.',
        },
      }
    );

    const updated = await ReviewSchedule.find().sort({ order: 1 });
    console.log('SYNC SUCCESSFUL. CURRENT REVIEWS IN DB:');
    updated.forEach((u) => {
      console.log(`[Round ${u.roundNumber}] ${u.title}`);
      console.log(`  Task Start: ${u.startTime.toISOString()} (${new Date(u.startTime).toLocaleTimeString()})`);
      console.log(`  Task End:   ${u.endTime.toISOString()} (${new Date(u.endTime).toLocaleTimeString()})`);
      console.log(`  Rev End:    ${u.reviewEndTime ? u.reviewEndTime.toISOString() : 'N/A'} (${u.reviewEndTime ? new Date(u.reviewEndTime).toLocaleTimeString() : 'N/A'})`);
      console.log(`  Status:     ${u.status}, isCurrent: ${u.isCurrent}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('SYNC ERROR:', err);
    process.exit(1);
  }
}

run();
