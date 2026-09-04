const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config/env');

const seedAdmin = async () => {
  try {
    if (!config.MONGODB_URI || !config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
      throw new Error('MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured before seeding.');
    }
    await mongoose.connect(config.MONGODB_URI);
    console.log('[Seed Admin] Connected to database.');

    const existingAdmin = await Admin.findOne({ email: config.ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`[Seed Admin] Admin already exists: ${existingAdmin.email}`);
    } else {
      const admin = await Admin.create({
        name: 'CODIENYCH Super Admin',
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        role: 'SUPER_ADMIN',
      });
      console.log(`[Seed Admin] Admin account created successfully!`);
      console.log(`Email: ${admin.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seed Admin Error]', error.message);
    process.exit(1);
  }
};

seedAdmin();
