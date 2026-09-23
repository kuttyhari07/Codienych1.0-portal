const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updatePayments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const Payment = mongoose.model('Payment', new mongoose.Schema({}, { strict: false }));
    const Registration = mongoose.model('Registration', new mongoose.Schema({}, { strict: false }));

    console.log('\n--- BEFORE UPDATE ---');
    const beforePayments = await Payment.find();
    for (const p of beforePayments) {
      const reg = await Registration.findById(p.registration);
      console.log(`Team: "${reg ? reg.teamName : 'Unknown'}" | Size: ${reg ? reg.teamSize : 'N/A'} | expectedAmount: ₹${p.expectedAmount} | Tx: ${p.transactionId}`);
    }

    // Update expectedAmount for 4-member teams to 1400 (4 * 350)
    const updateResult = await Payment.updateMany(
      { expectedAmount: 2100 },
      { $set: { expectedAmount: 1400 } }
    );
    console.log(`\nUpdated ${updateResult.modifiedCount} payment record(s).`);

    console.log('\n--- AFTER UPDATE ---');
    const afterPayments = await Payment.find();
    for (const p of afterPayments) {
      const reg = await Registration.findById(p.registration);
      console.log(`Team: "${reg ? reg.teamName : 'Unknown'}" | Size: ${reg ? reg.teamSize : 'N/A'} | expectedAmount: ₹${p.expectedAmount} | Tx: ${p.transactionId}`);
    }

    const totalCollection = afterPayments
      .filter((p) => p.status === 'VERIFIED')
      .reduce((acc, p) => acc + (p.expectedAmount || 0), 0);
    console.log(`\nVerified Total Collection: ₹${totalCollection}`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Error updating payments:', err);
    process.exit(1);
  }
}

updatePayments();
