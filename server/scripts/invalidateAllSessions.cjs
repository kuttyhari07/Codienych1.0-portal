const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config/env');

const invalidateAllSessions = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    const db = mongoose.connection.db;

    // Check counts before
    const bPart = await db.collection('participants').countDocuments();
    const bReg = await db.collection('registrations').countDocuments();
    const bPay = await db.collection('payments').countDocuments();

    // Increment / set tokenVersion to 1 for all admins
    const res = await Admin.updateMany({}, { $set: { tokenVersion: 1 } });
    console.log('Admins tokenVersion updated:', res);

    const admins = await Admin.find({}, 'name email role tokenVersion');
    console.log('Current Admins:', admins);

    // Check counts after
    const aPart = await db.collection('participants').countDocuments();
    const aReg = await db.collection('registrations').countDocuments();
    const aPay = await db.collection('payments').countDocuments();

    if (bPart === aPart && bReg === aReg && bPay === aPay) {
      console.log('Data completely intact! Participants:', aPart, 'Registrations:', aReg, 'Payments:', aPay);
    } else {
      console.error('Data mismatch!');
    }

    process.exit(0);
  } catch (err) {
    console.error('[Error]', err);
    process.exit(1);
  }
};

invalidateAllSessions();
