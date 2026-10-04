const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const Participant = require('../models/Participant');

  const fixList = [
    { old: 'saravanankarthiga87@gmail,com', fixed: 'saravanankarthiga87@gmail.com' },
    { old: 'suloraja69@gmail. com', fixed: 'suloraja69@gmail.com' },
    { old: 'dhineskumar1012 @gmail.com', fixed: 'dhineskumar1012@gmail.com' },
    { old: 'vvijiyakumar084@gmail.com  11', fixed: 'vvijiyakumar084@gmail.com' },
  ];

  for (const item of fixList) {
    const res = await Participant.updateOne({ email: item.old }, { $set: { email: item.fixed } });
    console.log(`Fixed "${item.old}" -> "${item.fixed}" (modified: ${res.modifiedCount})`);
  }

  await mongoose.disconnect();
}

fix().catch(console.error);
