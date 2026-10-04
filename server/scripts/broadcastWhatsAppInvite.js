const dns = require('dns');
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const config = require('../config/env');

const {
  getBroadcastStatus,
  executeBroadcast,
  checkBrevoCredits,
} = require('../services/whatsappBroadcastService');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    target: 'all', // 'all', 'members', 'leaders'
    limit: null,
    delayMs: 350,
  };

  args.forEach(arg => {
    if (arg === '--dry-run') options.dryRun = true;
    if (arg.startsWith('--target=')) options.target = arg.split('=')[1].toLowerCase();
    if (arg.startsWith('--limit=')) options.limit = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--delay=')) options.delayMs = parseInt(arg.split('=')[1], 10);
  });

  return options;
};

async function main() {
  const options = parseArgs();

  console.log('\n=============================================================');
  console.log('🏴‍☠️  CODIENYCH 1.0 - OFFICIAL WHATSAPP FLEET BROADCAST ENGINE  🏴‍☠️');
  console.log('=============================================================');
  console.log(`Mode:    ${options.dryRun ? '🔍 DRY RUN (NO EMAILS WILL BE SENT)' : '🚀 LIVE BROADCAST'}`);
  console.log(`Target:  ${options.target.toUpperCase()} (LEADERS + MEMBERS)`);
  if (options.limit) console.log(`Limit:   Max ${options.limit} emails in this run`);
  console.log(`Delay:   ${options.delayMs}ms between dispatches\n`);

  console.log('--- 1. Connecting to Database ---');
  await mongoose.connect(process.env.MONGO_URI || config.MONGODB_URI);
  console.log('Connected to MongoDB.\n');

  console.log('--- 2. Fetching Current Fleet Status ---');
  const status = await getBroadcastStatus();
  console.log(`Total Database Participants: ${status.totalParticipants} (${status.totalLeaders} Leaders, ${status.totalMembers} Members)`);
  console.log(`Already Dispatched in Past:   ${status.sentCount}`);
  console.log(`Pending Delivery Total:       ${status.pendingTotal} (${status.pendingMembers} Members, ${status.pendingLeaders} Leaders)`);
  console.log(`Brevo Account (${status.brevoEmail}): ${status.brevoCredits} credits available today\n`);

  if (status.pendingTotal === 0) {
    console.log('🎉 All participants have already received the WhatsApp Fleet invitation!');
    await mongoose.disconnect();
    return;
  }

  if (options.dryRun) {
    console.log('--- 3. DRY RUN Complete ---');
    console.log(`If run live, ${options.limit ? Math.min(options.limit, status.pendingTotal) : status.pendingTotal} emails will be dispatched.`);
    console.log('To start live dispatch, execute without --dry-run:');
    console.log('  node server/scripts/broadcastWhatsAppInvite.js');
    console.log('Or to send to only members (priority):');
    console.log('  node server/scripts/broadcastWhatsAppInvite.js --target=members');
    console.log('=============================================================\n');
    await mongoose.disconnect();
    return;
  }

  console.log('--- 3. Beginning Live Dispatch ---');
  const result = await executeBroadcast({
    target: options.target,
    limit: options.limit,
    delayMs: options.delayMs,
    onProgress: ({ index, total, item, success, error }) => {
      const statusIcon = success ? '✅ SENT' : (error ? `❌ ERROR: ${error}` : '❌ FAILED');
      console.log(`[${index}/${total}] [${item.role}] ${item.fullName} <${item.email}> (Crew: ${item.teamName}) -> ${statusIcon}`);
    },
  });

  console.log('\n=============================================================');
  console.log('📊 DISPATCH SUMMARY');
  console.log('=============================================================');
  console.log(`Attempted in this run: ${result.totalAttempted}`);
  console.log(`Successfully sent:     ${result.sentCount} ✅`);
  console.log(`Failed / Skipped:      ${result.failedCount} ❌`);
  console.log(`Cumulative total sent: ${result.totalSentCumulative} participants`);
  console.log(`Remaining pending:     ${result.totalRemaining} participants`);
  if (result.quotaHit) {
    console.log('\n⚠️ Notice: Brevo daily free limit (300 emails/day) reached for today.');
    console.log('Quota resets at 00:00 UTC (~5:30 AM IST). You can run this command again tomorrow to finish the remaining participants without any duplicates!');
  }
  console.log('=============================================================\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal broadcast error:', err);
  process.exit(1);
});
