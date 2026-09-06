const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const Payment = require('../models/Payment');
const config = require('../config/env');

const clearRegistrations = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI must be configured in environment.');
    }

    console.log('[Clear Data] Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI);
    console.log('[Clear Data] Connected to database.');

    // Count before delete
    const regCount = await Registration.countDocuments();
    const partCount = await Participant.countDocuments();
    const payCount = await Payment.countDocuments();

    console.log(`[Clear Data] Found: ${regCount} Registrations, ${partCount} Participants, ${payCount} Payments.`);

    // Delete records
    const delParticipants = await Participant.deleteMany({});
    const delPayments = await Payment.deleteMany({});
    const delRegistrations = await Registration.deleteMany({});

    console.log(`[Clear Data] Deleted ${delParticipants.deletedCount} participants.`);
    console.log(`[Clear Data] Deleted ${delPayments.deletedCount} payments.`);
    console.log(`[Clear Data] Deleted ${delRegistrations.deletedCount} registrations.`);

    // Clean up local uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let deletedFiles = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          const filePath = path.join(uploadsDir, file);
          if (fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            deletedFiles++;
          }
        }
      }
      console.log(`[Clear Data] Cleaned up ${deletedFiles} local upload file(s) from uploads folder.`);
    }

    console.log('[Clear Data] ✅ All registration data successfully deleted! Admin accounts were preserved.');
    process.exit(0);
  } catch (error) {
    console.error('[Clear Data Error]', error.message);
    process.exit(1);
  }
};

clearRegistrations();
