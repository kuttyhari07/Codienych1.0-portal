const fs = require('fs');
const path = require('path');
const https = require('https');
const config = require('../config/env');
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const { sendWhatsAppFleetInvitation } = require('./emailService');

const DATA_DIR = path.join(__dirname, '../data');
const SENT_TRACKER_FILE = path.join(DATA_DIR, 'whatsapp_broadcast_sent.json');

const getSentTracker = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SENT_TRACKER_FILE)) {
      const data = fs.readFileSync(SENT_TRACKER_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Broadcast Tracker] Could not read file, initializing new tracker:', err.message);
  }
  return { sentEmails: {}, totalSentCount: 0, lastRun: null };
};

const saveSentTracker = (tracker) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SENT_TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf8');
  } catch (err) {
    console.error('[Broadcast Tracker] Error saving tracker:', err.message);
  }
};

const sanitizeEmail = (raw) => {
  if (!raw) return '';
  let email = raw.trim();
  email = email.replace(/\s+\d+$/, '');
  email = email.replace(/\s+/g, '');
  email = email.replace(/@([^@,]+),([a-zA-Z]{2,})$/, '@$1.$2');
  return email.toLowerCase();
};

const checkBrevoCredits = (apiKey) => {
  return new Promise((resolve) => {
    if (!apiKey) return resolve({ ok: false, credits: 0, reason: 'No API key provided' });
    const req = https.request({
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/account',
      method: 'GET',
      headers: { 'api-key': apiKey.trim() },
      timeout: 5000,
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            const plan = data.plan?.find(p => p.type === 'free' || p.creditsType === 'sendLimit') || data.plan?.[0];
            const credits = plan?.credits ?? 0;
            return resolve({ ok: true, email: data.email, credits, plan });
          } catch (e) {
            return resolve({ ok: true, credits: 300 });
          }
        }
        return resolve({ ok: false, credits: 0, reason: `HTTP ${res.statusCode}: ${body}` });
      });
    });
    req.on('error', (e) => resolve({ ok: false, credits: 0, reason: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, credits: 0, reason: 'Timeout' });
    });
    req.end();
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getBroadcastStatus = async () => {
  const tracker = getSentTracker();
  const sentSet = new Set(Object.keys(tracker.sentEmails || {}));

  const allParticipants = await Participant.find({
    verificationStatus: { $ne: 'REJECTED' },
  }).populate('registration').lean();

  const totalParticipants = allParticipants.length;
  const totalLeaders = allParticipants.filter(p => p.role === 'LEADER').length;
  const totalMembers = allParticipants.filter(p => p.role === 'MEMBER').length;

  let pendingMembers = 0;
  let pendingLeaders = 0;

  for (const p of allParticipants) {
    const cleanEmail = sanitizeEmail(p.email);
    if (!cleanEmail || sentSet.has(cleanEmail)) continue;
    if (p.role === 'LEADER') pendingLeaders++;
    else pendingMembers++;
  }

  const primaryKey = (process.env.BREVO_API_KEY || config.BREVO_API_KEY || '').trim();
  const brevoInfo = await checkBrevoCredits(primaryKey);

  return {
    totalParticipants,
    totalLeaders,
    totalMembers,
    sentCount: sentSet.size,
    pendingTotal: pendingMembers + pendingLeaders,
    pendingMembers,
    pendingLeaders,
    brevoCredits: brevoInfo.credits || 0,
    brevoEmail: brevoInfo.email || 'codienych@gmail.com',
    lastRun: tracker.lastRun,
  };
};

const executeBroadcast = async ({ target = 'all', limit = null, delayMs = 350, onProgress = null }) => {
  const tracker = getSentTracker();
  const sentSet = new Set(Object.keys(tracker.sentEmails || {}));

  let roleFilter = {};
  if (target === 'members') roleFilter = { role: 'MEMBER' };
  if (target === 'leaders') roleFilter = { role: 'LEADER' };

  const participants = await Participant.find({
    verificationStatus: { $ne: 'REJECTED' },
    ...roleFilter,
  }).populate('registration').lean();

  // Sort members first so members who never got the link receive it with highest priority
  participants.sort((a, b) => {
    if (a.role === 'MEMBER' && b.role === 'LEADER') return -1;
    if (a.role === 'LEADER' && b.role === 'MEMBER') return 1;
    return 0;
  });

  const pendingList = [];
  const seenInRun = new Set();

  for (const p of participants) {
    const cleanEmail = sanitizeEmail(p.email);
    if (!cleanEmail || !cleanEmail.includes('@')) continue;
    if (seenInRun.has(cleanEmail)) continue;
    seenInRun.add(cleanEmail);

    if (sentSet.has(cleanEmail)) continue;

    const team = p.registration || {};
    pendingList.push({
      email: cleanEmail,
      fullName: p.fullName || 'Pirate Crew Mate',
      role: p.role || 'MEMBER',
      teamName: team.teamName || 'Hackathon Crew',
      registrationId: team.registrationId || 'CODIENYCH-2026',
      college: p.college || 'Engineering College',
    });
  }

  const toSendList = limit ? pendingList.slice(0, limit) : pendingList;
  let sentCount = 0;
  let failedCount = 0;
  let quotaHit = false;

  for (let i = 0; i < toSendList.length; i++) {
    const item = toSendList[i];

    try {
      const delivered = await sendWhatsAppFleetInvitation({
        email: item.email,
        fullName: item.fullName,
        role: item.role,
        teamName: item.teamName,
        registrationId: item.registrationId,
        college: item.college,
      });

      if (delivered) {
        sentCount++;
        tracker.sentEmails[item.email] = {
          sentAt: new Date().toISOString(),
          fullName: item.fullName,
          role: item.role,
          teamName: item.teamName,
          registrationId: item.registrationId,
        };
        tracker.totalSentCount = Object.keys(tracker.sentEmails).length;
        tracker.lastRun = new Date().toISOString();
        saveSentTracker(tracker);
        if (onProgress) onProgress({ index: i + 1, total: toSendList.length, item, success: true });
      } else {
        failedCount++;
        if (onProgress) onProgress({ index: i + 1, total: toSendList.length, item, success: false });

        const primaryKey = (process.env.BREVO_API_KEY || config.BREVO_API_KEY || '').trim();
        const check = await checkBrevoCredits(primaryKey);
        if (check.ok && check.credits === 0) {
          quotaHit = true;
          break;
        }
      }
    } catch (err) {
      failedCount++;
      if (onProgress) onProgress({ index: i + 1, total: toSendList.length, item, success: false, error: err.message });
    }

    if (i < toSendList.length - 1 && !quotaHit) {
      await sleep(delayMs);
    }
  }

  return {
    totalAttempted: toSendList.length,
    sentCount,
    failedCount,
    quotaHit,
    totalRemaining: pendingList.length - sentCount,
    totalSentCumulative: tracker.totalSentCount,
  };
};

module.exports = {
  getSentTracker,
  saveSentTracker,
  sanitizeEmail,
  checkBrevoCredits,
  getBroadcastStatus,
  executeBroadcast,
};
