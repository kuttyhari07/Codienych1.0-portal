const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const {
  sendOrganizerNewRegistrationAlert,
  sendRegistrationConfirmation,
} = require('../services/emailService');

const runFullTest = async () => {
  console.log('--- 1. Testing Registration Alert to Admin ---');
  const alertSent = await sendOrganizerNewRegistrationAlert({
    teamName: 'CyberKnights (Test)',
    registrationId: 'CODIENYCH-2026-TEST01',
    teamSize: 4,
    expectedAmount: 2100,
    transactionId: 'TEST-UTR-987654321',
    leaderName: 'Hariharan G',
    leaderEmail: 'hariharangmhk0429@gmail.com',
    leaderPhone: '+91 9876543210',
    college: 'Erode Sengunthar Engineering College',
    department: 'Information Technology',
  });
  console.log('Result for Admin Alert Email:', alertSent ? '✅ SUCCESS' : '❌ FAILED');

  console.log('\n--- 2. Testing Confirmation Email to Team Leader ---');
  const confirmSent = await sendRegistrationConfirmation({
    leaderEmail: 'hariharangmhk0429@gmail.com',
    leaderName: 'Hariharan G',
    teamName: 'CyberKnights (Test)',
    registrationId: 'CODIENYCH-2026-TEST01',
    teamSize: 4,
  });
  console.log('Result for Leader Confirmation Email:', confirmSent ? '✅ SUCCESS' : '❌ FAILED');

  if (alertSent && confirmSent) {
    console.log('\n🎉 ALL EMAILS SENT SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\n❌ ONE OR MORE EMAILS FAILED.');
    process.exit(1);
  }
};

runFullTest();
