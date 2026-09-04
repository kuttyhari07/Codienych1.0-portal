const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI must be configured.');
    }
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
