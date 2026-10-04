const fs = require('fs');
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const Payment = require('../models/Payment');
const config = require('../config/env');
const { uploadFile } = require('../services/storageService');
const {
  sendOrganizerNewRegistrationAlert,
  sendRegistrationReceivedToLeader,
} = require('../services/emailService');

const cleanUpTempFiles = (files) => {
  if (!files) return;
  try {
    const allFiles = [
      ...(files['paymentScreenshot'] || []),
      ...(files['idCards'] || []),
    ];
    allFiles.forEach((f) => {
      if (f && f.path && fs.existsSync(f.path)) {
        try {
          fs.unlinkSync(f.path);
        } catch (e) {}
      }
    });
  } catch (e) {}
};

/**
 * Generate sequential Registration ID starting from 0001
 * Format: CODIENYCH-2026-0001, CODIENYCH-2026-0002...
 */
const generateRegistrationId = async () => {
  const currentYear = new Date().getFullYear();
  // Find the highest existing registrationId to guarantee sequential ordering
  const latest = await Registration.findOne({
    registrationId: new RegExp(`^CODIENYCH-${currentYear}-`),
  })
    .sort({ registrationId: -1 })
    .select('registrationId')
    .lean();

  let nextSeq = 1;
  if (latest && latest.registrationId) {
    const parts = latest.registrationId.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  let unique = false;
  let regId = '';
  let attempts = 0;
  while (!unique && attempts < 50) {
    const formattedNum = String(nextSeq).padStart(4, '0');
    regId = `CODIENYCH-${currentYear}-${formattedNum}`;
    const existing = await Registration.findOne({ registrationId: regId }).select('_id').lean();
    if (!existing) {
      unique = true;
    } else {
      nextSeq += 1;
      attempts += 1;
    }
  }
  return regId;
};

/**
 * Public Endpoint: Register Team
 * POST /api/registrations
 */
const registerTeam = async (req, res) => {
  try {
    // Enforce strict 10:30 PM Registration Deadline
    const deadline = new Date(config.REGISTRATION_DEADLINE || '2026-10-04T22:30:00+05:30').getTime();
    if (Date.now() >= deadline) {
      cleanUpTempFiles(req.files);
      return res.status(403).json({
        success: false,
        message: 'Registration is officially closed. The 10:30 PM deadline has passed. No further registrations can be accepted.',
      });
    }

    const { teamName, teamSize, domain, transactionId, participants } = req.body;

    if (!domain || !domain.trim()) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({ success: false, message: 'Please select one hackathon domain for your team.' });
    }

    // Parsed JSON if sent as multipart payload string
    let parsedParticipants = [];
    try {
      parsedParticipants = typeof participants === 'string' ? JSON.parse(participants) : participants;
    } catch (e) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({ success: false, message: 'Invalid participants payload format.' });
    }

    const numTeamSize = parseInt(teamSize, 10);
    if (![3, 4, 5, 6].includes(numTeamSize)) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({ success: false, message: 'Team size must be 3, 4, 5, or 6 members.' });
    }

    if (!parsedParticipants || parsedParticipants.length !== numTeamSize) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: `Expected ${numTeamSize} participants details, but received ${parsedParticipants ? parsedParticipants.length : 0}.`,
      });
    }

    if (!transactionId || !transactionId.trim()) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({ success: false, message: 'UPI Transaction ID / UTR number is required.' });
    }

    const trimmedTxId = transactionId.trim();

    // 1. Check duplicate Transaction ID early before processing uploads
    const existingPayment = await Payment.findOne({ transactionId: trimmedTxId }).select('_id').lean();
    if (existingPayment) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: 'This transaction ID / UTR number has already been submitted for another registration.',
      });
    }

    // 2. Validate internal team payload for duplicates
    const internalEmails = new Set();
    const internalStudentIds = new Set();
    for (let i = 0; i < parsedParticipants.length; i++) {
      const p = parsedParticipants[i];
      const normEmail = (p.email || '').toLowerCase().trim();
      const normStudentId = (p.studentId || '').trim();

      if (!normEmail || !normStudentId || !p.fullName || !p.phone || !p.college || !p.department || !p.year) {
        cleanUpTempFiles(req.files);
        return res.status(400).json({
          success: false,
          message: `All required participant details must be filled for participant #${i + 1}.`,
        });
      }

      if (internalEmails.has(normEmail)) {
        cleanUpTempFiles(req.files);
        return res.status(400).json({
          success: false,
          message: `Duplicate email address '${normEmail}' found inside the team registration payload.`,
        });
      }
      if (internalStudentIds.has(normStudentId)) {
        cleanUpTempFiles(req.files);
        return res.status(400).json({
          success: false,
          message: `Duplicate student ID '${normStudentId}' found inside the team registration payload.`,
        });
      }
      internalEmails.add(normEmail);
      internalStudentIds.add(normStudentId);
    }

    // 3. Check database for existing emails or student IDs across ALL teams
    const existingParticipants = await Participant.find({
      $or: [
        { email: { $in: Array.from(internalEmails) } },
        { studentId: { $in: Array.from(internalStudentIds) } },
      ],
    }).select('fullName studentId email').lean();

    if (existingParticipants.length > 0) {
      cleanUpTempFiles(req.files);
      const dup = existingParticipants[0];
      return res.status(400).json({
        success: false,
        message: `This student (${dup.fullName} - ${dup.studentId} / ${dup.email}) is already registered for CODIENYCH 1.0 in another team.`,
      });
    }

    // 4. File uploads validation
    if (!req.files) {
      return res.status(400).json({ success: false, message: 'ID card photos and payment screenshot are required.' });
    }

    const screenshotFile = req.files['paymentScreenshot'] ? req.files['paymentScreenshot'][0] : null;
    if (!screenshotFile) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({ success: false, message: 'Payment screenshot upload is mandatory.' });
    }

    // Match ID card files per participant
    const idCardFiles = req.files['idCards'] || [];
    if (idCardFiles.length !== numTeamSize) {
      cleanUpTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: `Each participant must upload an individual ID card photo. Received ${idCardFiles.length} files for ${numTeamSize} participants.`,
      });
    }

    // 5. Calculate Fee server-side independently (Strictly ₹350 per member: 3 -> 1050, 4 -> 1400, 5 -> 1750, 6 -> 2100)
    const feePerMember = (config.REGISTRATION_FEE && config.REGISTRATION_FEE !== 525 && config.REGISTRATION_FEE !== 567)
      ? config.REGISTRATION_FEE
      : 350;
    const expectedAmount = numTeamSize * feePerMember;

    // Parallel Concurrent Uploads (Payment Screenshot + All ID Cards concurrently)
    const [screenshotUrl, ...idCardUrls] = await Promise.all([
      uploadFile(screenshotFile, 'payments'),
      ...idCardFiles.map((file) => uploadFile(file, 'idcards')),
    ]);

    // Create Registration with concurrency-resilient sequential ID assignment
    let registration;
    let registrationId;
    let retries = 0;

    while (!registration && retries < 5) {
      try {
        registrationId = await generateRegistrationId();
        registration = await Registration.create({
          registrationId,
          teamName: teamName.trim(),
          teamSize: numTeamSize,
          domain: domain.trim(),
          status: 'PENDING',
          registrationDate: new Date(),
        });
      } catch (insertErr) {
        if (insertErr.code === 11000 && insertErr.keyPattern && insertErr.keyPattern.registrationId) {
          retries += 1;
          await new Promise((resolve) => setTimeout(resolve, 50 * retries));
        } else {
          throw insertErr;
        }
      }
    }

    if (!registration) {
      throw new Error('Could not allocate unique registration ID. Please try again.');
    }

    const participantDocs = parsedParticipants.map((p, i) => ({
      registration: registration._id,
      role: i === 0 ? 'LEADER' : 'MEMBER',
      fullName: p.fullName.trim(),
      email: p.email.toLowerCase().trim(),
      phone: p.phone.trim(),
      college: p.college.trim(),
      department: p.department.trim(),
      year: p.year.toString().trim(),
      studentId: p.studentId.trim(),
      idCardUrl: idCardUrls[i],
      verificationStatus: 'PENDING',
    }));

    await Promise.all([
      Payment.create({
        registration: registration._id,
        expectedAmount,
        paymentMethod: 'UPI',
        upiId: config.UPI_ID,
        transactionId: trimmedTxId,
        screenshotUrl,
        status: 'PENDING',
      }),
      Participant.insertMany(participantDocs),
    ]);

    // Instant response return - do not block user registration on SMTP network latency
    const leaderDoc = participantDocs[0];
    if (leaderDoc) {
      // Detached safe background email execution
      setImmediate(async () => {
        try {
          await Promise.allSettled([
            sendOrganizerNewRegistrationAlert({
              teamName: registration.teamName,
              registrationId,
              teamSize: registration.teamSize,
              domain: registration.domain,
              expectedAmount,
              transactionId: trimmedTxId,
              leaderName: leaderDoc.fullName,
              leaderEmail: leaderDoc.email,
              leaderPhone: leaderDoc.phone,
              college: leaderDoc.college,
              department: leaderDoc.department,
            }),
            sendRegistrationReceivedToLeader({
              leaderEmail: leaderDoc.email,
              leaderName: leaderDoc.fullName,
              teamName: registration.teamName,
              registrationId,
              teamSize: registration.teamSize,
              domain: registration.domain,
              expectedAmount,
              transactionId: trimmedTxId,
            }),
          ]);
          console.log(`[Registration Background Emails] Delivered for ${registration.teamName} (${registrationId})`);
        } catch (emailErr) {
          console.error('[Registration Email Error]', emailErr.message);
        }
      });
    }

    // Return instant response (<1s)
    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Waiting for admin verification.',
      data: {
        registrationId,
        teamName: registration.teamName,
        teamSize: registration.teamSize,
        domain: registration.domain,
        expectedAmount,
        transactionId: trimmedTxId,
        status: registration.status,
      },
    });
  } catch (error) {
    cleanUpTempFiles(req.files);
    console.error('[Registration Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during team registration.',
    });
  }
};

/**
 * Public Endpoint: Search Safe Status by Registration ID
 * GET /api/registrations/:registrationId
 */
const getPublicStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await Registration.findOne({
      registrationId: registrationId.trim().toUpperCase(),
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found. Please check your Registration ID.',
      });
    }

    const payment = await Payment.findOne({ registration: registration._id });
    const participants = await Participant.find({ registration: registration._id }).select('role verificationStatus');

    const totalParticipants = participants.length;
    const verifiedParticipantsCount = participants.filter((p) => p.verificationStatus === 'VERIFIED').length;

    // Mask sensitive details - returning only safe info
    return res.status(200).json({
      success: true,
      data: {
        registrationId: registration.registrationId,
        teamName: registration.teamName,
        teamSize: registration.teamSize,
        domain: registration.domain || 'Not Specified',
        registrationDate: registration.registrationDate,
        registrationStatus: registration.status,
        paymentStatus: payment ? payment.status : 'PENDING',
        participantVerificationProgress: `${verifiedParticipantsCount}/${totalParticipants} ID Cards Verified`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving status information.',
    });
  }
};

/**
 * Public Endpoint: Check Deadline Status
 * GET /api/registrations/deadline-status
 */
const checkDeadlineStatus = async (req, res) => {
  try {
    const deadline = new Date(config.REGISTRATION_DEADLINE || '2026-10-04T22:30:00+05:30').getTime();
    const now = Date.now();
    const isClosed = now >= deadline;

    return res.status(200).json({
      success: true,
      isClosed,
      deadline: config.REGISTRATION_DEADLINE,
      serverTime: new Date().toISOString(),
      remainingMs: Math.max(0, deadline - now),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking deadline status' });
  }
};

module.exports = {
  registerTeam,
  getPublicStatus,
  checkDeadlineStatus,
};
