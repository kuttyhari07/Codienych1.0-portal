const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  EVENT_NAME: process.env.EVENT_NAME || 'CODIENYCH 1.0',
  EVENT_TYPE: process.env.EVENT_TYPE || '24-HOUR SOFTWARE HACKATHON',
  REGISTRATION_DEADLINE: process.env.REGISTRATION_DEADLINE || '2026-10-04',
  HACKATHON_START_DATE: process.env.HACKATHON_START_DATE || '2026-10-08T09:00:00',
  REGISTRATION_FEE: parseInt(process.env.REGISTRATION_FEE, 10) || 567,

  UPI_ID: process.env.UPI_ID || '',
  UPI_MERCHANT_NAME: process.env.UPI_MERCHANT_NAME || 'CODIENYCH 1.0 Hackathon',

  COLLEGE_NAME: process.env.COLLEGE_NAME || '[COLLEGE NAME PLACEHOLDER]',
  VENUE: process.env.VENUE || '[VENUE PLACEHOLDER]',
  ORGANIZER_EMAIL: process.env.ORGANIZER_EMAIL || 'codienych1.0@gmail.com',
  PHONE_NUMBER: process.env.PHONE_NUMBER || '+91 9876543210',

  USE_CLOUDINARY: process.env.USE_CLOUDINARY === 'true',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  ENABLE_EMAIL: process.env.ENABLE_EMAIL !== 'false',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || process.env.ORGANIZER_EMAIL || 'codienych1.0@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'jvllycpzzheoymoo',
  EMAIL_FROM: process.env.EMAIL_FROM || '"CODIENYCH 1.0 Team" <codienych1.0@gmail.com>',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'hariharangmhk0429@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
};
