const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config/env');

const NEW_PASSWORD = config.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
if (!NEW_PASSWORD) {
  throw new Error('ADMIN_PASSWORD must be configured in environment or .env file');
}

const updateAdminPassword = async () => {
  try {
    const mongoUri = config.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing');
    }

    console.log('[Update Admin] Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('[Update Admin] Connected successfully.');

    const db = mongoose.connection.db;
    const beforeStats = {
      participants: await db.collection('participants').countDocuments(),
      registrations: await db.collection('registrations').countDocuments(),
      payments: await db.collection('payments').countDocuments(),
      admins: await db.collection('admins').countDocuments(),
    };
    console.log('[Update Admin] Initial collection counts:', beforeStats);

    // Fetch all admin accounts
    const admins = await Admin.find({});
    console.log(`[Update Admin] Found ${admins.length} admin account(s).`);

    for (const admin of admins) {
      console.log(`[Update Admin] Updating password for: ${admin.email}...`);
      admin.password = NEW_PASSWORD;
      await admin.save();

      // Verify the password using matchPassword method
      const reloadedAdmin = await Admin.findById(admin._id).select('+password');
      const isMatch = await reloadedAdmin.matchPassword(NEW_PASSWORD);
      if (isMatch) {
        console.log(`[Update Admin] ✅ Password successfully updated & verified for: ${admin.email}`);
      } else {
        throw new Error(`Password verification failed for ${admin.email}`);
      }
    }

    const afterStats = {
      participants: await db.collection('participants').countDocuments(),
      registrations: await db.collection('registrations').countDocuments(),
      payments: await db.collection('payments').countDocuments(),
      admins: await db.collection('admins').countDocuments(),
    };
    console.log('[Update Admin] Post-update collection counts:', afterStats);

    const countsIntact = (
      beforeStats.participants === afterStats.participants &&
      beforeStats.registrations === afterStats.registrations &&
      beforeStats.payments === afterStats.payments &&
      beforeStats.admins === afterStats.admins
    );

    if (countsIntact) {
      console.log('[Update Admin] 🔒 Data integrity confirmed: No participant/registration data was modified.');
      console.log('[Update Admin] 🎉 Admin password successfully updated.');
    } else {
      console.warn('[Update Admin] ⚠️ Warning: Collection counts discrepancy detected!');
    }

    process.exit(0);
  } catch (error) {
    console.error('[Update Admin Error]', error.message);
    process.exit(1);
  }
};

updateAdminPassword();
