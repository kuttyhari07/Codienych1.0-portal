const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const nodemailer = require('nodemailer');
const config = require('../config/env');

const testEmail = async () => {
  console.log('Testing Email Configuration...');
  console.log('SMTP_USER:', config.SMTP_USER);
  console.log('SMTP_PASS length:', config.SMTP_PASS ? config.SMTP_PASS.length : 0);
  console.log('ADMIN_EMAIL:', config.ADMIN_EMAIL);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  try {
    console.log('Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter connection verified successfully!');

    // 1. Send test mail to admin
    console.log(`Sending test email to Admin (${config.ADMIN_EMAIL})...`);
    const adminInfo = await transporter.sendMail({
      from: `"CODIENYCH 1.0 Control Center" <${config.SMTP_USER}>`,
      to: config.ADMIN_EMAIL,
      subject: '⚡ [TEST] CODIENYCH 1.0 Admin Email Test',
      html: '<h3>CODIENYCH 1.0 Email Alert System is Working Perfectly! 🚀</h3><p>This is a test notification for the organizer.</p>',
    });
    console.log('✅ Admin Test Email Sent! Message ID:', adminInfo.messageId);

    // 2. Send test mail to registered leader (testing with admin email as recipient)
    console.log(`Sending test acknowledgement email to Participant Leader (${config.ADMIN_EMAIL})...`);
    const leaderInfo = await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: config.ADMIN_EMAIL,
      subject: '[CODIENYCH 1.0] Registration Received - Test Team (CODIENYCH-2026-TEST)',
      html: '<h3>Registration Received - Test Team</h3><p>Your test team registration acknowledgement is received successfully.</p>',
    });
    console.log('✅ Participant Leader Test Email Sent! Message ID:', leaderInfo.messageId);

    console.log('🎉 ALL EMAIL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Email Test Failed:', error);
    process.exit(1);
  }
};

testEmail();
