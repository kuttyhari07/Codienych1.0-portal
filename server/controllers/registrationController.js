const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const Payment = require('../models/Payment');
const config = require('../config/env');
const { uploadFile } = require('../services/storageService');
const {
  sendOrganizerNewRegistrationAlert,
  sendRegistrationReceivedToLeader,
} = require('../services/emailService');

/**
 * Generate sequential Registration ID starting from 0001
 * Format: CODIENYCH-2026-0001, CODIENYCH-2026-0002...
 */
const generateRegistrationId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Registration.countDocuments();
  let nextSeq = count + 1;
  let unique = false;
  let regId = '';

  while (!unique) {
    const formattedNum = String(nextSeq).padStart(4, '0');
    regId = `CODIENYCH-${currentYear}-${formattedNum}`;
    const existing = await Registration.findOne({ registrationId: regId });
    if (!existing) {
      unique = true;
    } else {
      nextSeq += 1;
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
    const { teamName, teamSize, transactionId, participants } = req.body;

    // Parsed JSON if sent as multipart payload string
    let parsedParticipants = [];
    try {
      parsedParticipants = typeof participants === 'string' ? JSON.parse(participants) : participants;
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid participants payload format.' });
    }

    const numTeamSize = parseInt(teamSize, 10);
    if (![4, 5, 6].includes(numTeamSize)) {
      return res.status(400).json({ success: false, message: 'Team size must be 4, 5, or 6 members.' });
    }

    if (!parsedParticipants || parsedParticipants.length !== numTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Expected ${numTeamSize} participants details, but received ${parsedParticipants ? parsedParticipants.length : 0}.`,
      });
    }

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({ success: false, message: 'UPI Transaction ID / UTR number is required.' });
    }

    const trimmedTxId = transactionId.trim();

    // 1. Check duplicate Transaction ID
    const existingPayment = await Payment.findOne({ transactionId: trimmedTxId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'This transaction ID / UTR number has already been submitted.',
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
        return res.status(400).json({
          success: false,
          message: `All required participant details must be filled for participant #${i + 1}.`,
        });
      }

      if (internalEmails.has(normEmail)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate email address '${normEmail}' found inside the team registration payload.`,
        });
      }
      if (internalStudentIds.has(normStudentId)) {
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
    });

    if (existingParticipants.length > 0) {
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
      return res.status(400).json({ success: false, message: 'Payment screenshot upload is mandatory.' });
    }

    // Match ID card files per participant
    const idCardFiles = req.files['idCards'] || [];
    if (idCardFiles.length !== numTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Each participant must upload an individual ID card photo. Received ${idCardFiles.length} files for ${numTeamSize} participants.`,
      });
    }

    // 5. Calculate Fee server-side independently
    const expectedAmount = numTeamSize * config.REGISTRATION_FEE;

    // Parallel Concurrent Uploads (Payment Screenshot + All ID Cards concurrently in 1-2 seconds)
    const [screenshotUrl, ...idCardUrls] = await Promise.all([
      uploadFile(screenshotFile, 'payments'),
      ...idCardFiles.map((file) => uploadFile(file, 'idcards')),
    ]);

    // Generate unique Registration ID
    const registrationId = await generateRegistrationId();

    // Create Registration, Payment, and Participants concurrently
    const registration = await Registration.create({
      registrationId,
      teamName: teamName.trim(),
      teamSize: numTeamSize,
      status: 'PENDING',
      registrationDate: new Date(),
    });

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

    // Email Dispatch (Awaited with try/catch to ensure completion before response lifecycle closes)
    let emailStatus = { adminAlertSent: false, leaderAckSent: false };
    const leaderDoc = participantDocs[0];
    if (leaderDoc) {
      try {
        const [adminResult, leaderResult] = await Promise.allSettled([
          sendOrganizerNewRegistrationAlert({
            teamName: registration.teamName,
            registrationId,
            teamSize: registration.teamSize,
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
            expectedAmount,
            transactionId: trimmedTxId,
          }),
        ]);

        emailStatus.adminAlertSent = adminResult.status === 'fulfilled' && adminResult.value === true;
        emailStatus.leaderAckSent = leaderResult.status === 'fulfilled' && leaderResult.value === true;

        console.log(`[Registration Emails] Admin Alert: ${emailStatus.adminAlertSent}, Leader Ack: ${emailStatus.leaderAckSent}`);
      } catch (emailErr) {
        console.error('[Registration Email Error]', emailErr.message);
      }
    }

    // Return response with actual email status
    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Waiting for admin verification.',
      data: {
        registrationId,
        teamName: registration.teamName,
        teamSize: registration.teamSize,
        expectedAmount,
        transactionId: trimmedTxId,
        status: registration.status,
        emailStatus,
      },
    });
  } catch (error) {
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

module.exports = {
  registerTeam,
  getPublicStatus,
};
