const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const Payment = require('../models/Payment');
const { sendRegistrationConfirmation } = require('../services/emailService');

/**
 * Helper function to evaluate and update overall Registration status
 */
const updateOverallRegistrationStatus = async (registrationId) => {
  const registration = await Registration.findById(registrationId);
  if (!registration) return;

  const payment = await Payment.findOne({ registration: registrationId });
  const participants = await Participant.find({ registration: registrationId });

  if (!payment) return;

  const allParticipantsVerified = participants.length > 0 && participants.every((p) => p.verificationStatus === 'VERIFIED');
  const anyParticipantRejected = participants.some((p) => p.verificationStatus === 'REJECTED');

  if (payment.status === 'REJECTED' || anyParticipantRejected) {
    registration.status = 'REJECTED';
    await registration.save();
    return;
  }

  if (payment.status === 'VERIFIED' && allParticipantsVerified) {
    const wasAlreadyConfirmed = registration.status === 'REGISTRATION CONFIRMED';
    registration.status = 'REGISTRATION CONFIRMED';
    await registration.save();

    // Trigger confirmation email if transitioned to CONFIRMED
    if (!wasAlreadyConfirmed) {
      const leader = participants.find((p) => p.role === 'LEADER') || participants[0];
      if (leader) {
        await sendRegistrationConfirmation({
          leaderEmail: leader.email,
          leaderName: leader.fullName,
          teamName: registration.teamName,
          registrationId: registration.registrationId,
          teamSize: registration.teamSize,
        });
      }
    }
  } else {
    registration.status = 'PENDING';
    await registration.save();
  }
};

/**
 * POST /api/admin/login
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
    }

    const token = admin.getSignedJwtToken();

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/admin/logout
 */
const logoutAdmin = async (req, res) => {
  res.clearCookie('adminToken');
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

/**
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalTeams = await Registration.countDocuments();
    const totalParticipants = await Participant.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'PENDING' });
    const verifiedPayments = await Payment.countDocuments({ status: 'VERIFIED' });
    const rejectedPayments = await Payment.countDocuments({ status: 'REJECTED' });
    const pendingIdVerifications = await Participant.countDocuments({ verificationStatus: 'PENDING' });

    // Calculate total verified collection
    const verifiedPaymentsList = await Payment.find({ status: 'VERIFIED' }).select('expectedAmount');
    const totalCollection = verifiedPaymentsList.reduce((acc, p) => acc + (p.expectedAmount || 0), 0);

    let recentRegistrations = await Registration.find()
      .sort({ registrationId: 1 })
      .limit(10);

    // Natural alphanumeric ascending sort safeguard
    recentRegistrations.sort((a, b) => (a.registrationId || '').localeCompare(b.registrationId || '', undefined, { numeric: true, sensitivity: 'base' }));

    return res.status(200).json({
      success: true,
      data: {
        totalTeams,
        totalParticipants,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        totalCollection,
        pendingIdVerifications,
        recentRegistrations,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/registrations
 */
const getRegistrations = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    let registrations = await Registration.find(query).sort({ registrationId: 1 });
    registrations.sort((a, b) => (a.registrationId || '').localeCompare(b.registrationId || '', undefined, { numeric: true, sensitivity: 'base' }));

    // Enrich with leader & payment info
    const enrichedList = await Promise.all(
      registrations.map(async (reg) => {
        const leader = await Participant.findOne({ registration: reg._id, role: 'LEADER' });
        const payment = await Payment.findOne({ registration: reg._id });
        const participantCount = await Participant.countDocuments({ registration: reg._id });
        const verifiedIdsCount = await Participant.countDocuments({ registration: reg._id, verificationStatus: 'VERIFIED' });

        return {
          id: reg._id,
          registrationId: reg.registrationId,
          teamName: reg.teamName,
          teamSize: reg.teamSize,
          teamLeader: leader ? leader.fullName : 'N/A',
          leaderEmail: leader ? leader.email : 'N/A',
          leaderPhone: leader ? leader.phone : 'N/A',
          college: leader ? leader.college : 'N/A',
          registrationStatus: reg.status,
          paymentStatus: payment ? payment.status : 'N/A',
          transactionId: payment ? payment.transactionId : 'N/A',
          idVerificationProgress: `${verifiedIdsCount}/${participantCount}`,
          createdAt: reg.createdAt,
        };
      })
    );

    // Apply Client Search Filter if present
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      const filtered = enrichedList.filter(
        (item) =>
          item.registrationId.toLowerCase().includes(term) ||
          item.teamName.toLowerCase().includes(term) ||
          item.teamLeader.toLowerCase().includes(term) ||
          item.leaderEmail.toLowerCase().includes(term) ||
          item.college.toLowerCase().includes(term) ||
          item.transactionId.toLowerCase().includes(term)
      );
      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }

    return res.status(200).json({ success: true, count: enrichedList.length, data: enrichedList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/registrations/:id
 */
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found.' });
    }

    const participants = await Participant.find({ registration: registration._id });
    const payment = await Payment.findOne({ registration: registration._id });

    return res.status(200).json({
      success: true,
      data: {
        registration,
        participants,
        payment,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/payments
 */
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('registration').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/admin/payments/:id/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    payment.status = 'VERIFIED';
    payment.verifiedAt = new Date();
    payment.rejectionReason = '';
    await payment.save();

    await updateOverallRegistrationStatus(payment.registration);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/admin/payments/:id/reject
 */
const rejectPayment = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is mandatory.' });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    payment.status = 'REJECTED';
    payment.rejectionReason = rejectionReason.trim();
    await payment.save();

    await updateOverallRegistrationStatus(payment.registration);

    return res.status(200).json({
      success: true,
      message: 'Payment rejected.',
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/participants
 */
const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find().populate('registration').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: participants.length, data: participants });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/admin/participants/:id/verify
 */
const verifyParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant record not found.' });
    }

    participant.verificationStatus = 'VERIFIED';
    participant.rejectionReason = '';
    await participant.save();

    await updateOverallRegistrationStatus(participant.registration);

    return res.status(200).json({
      success: true,
      message: 'Participant ID card verified successfully.',
      data: participant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/admin/participants/:id/reject
 */
const rejectParticipant = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({ success: false, message: 'Rejection reason is mandatory.' });
    }

    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant record not found.' });
    }

    participant.verificationStatus = 'REJECTED';
    participant.rejectionReason = rejectionReason.trim();
    await participant.save();

    await updateOverallRegistrationStatus(participant.registration);

    return res.status(200).json({
      success: true,
      message: 'Participant ID card rejected.',
      data: participant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/export-report
 * Exports registrations so that 1 team is presented in 1 single row with essential info
 */
const exportReport = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registrationId: 1 });
    registrations.sort((a, b) => (a.registrationId || '').localeCompare(b.registrationId || '', undefined, { numeric: true, sensitivity: 'base' }));

    const rows = [];
    let sNo = 1;

    for (const reg of registrations) {
      const participants = await Participant.find({ registration: reg._id });
      const payment = await Payment.findOne({ registration: reg._id });

      const leader = participants.find((p) => p.role === 'LEADER') || participants[0];
      const members = participants.filter((p) => p.role !== 'LEADER');
      const memberNames = members.map((m) => m.fullName).filter(Boolean).join(', ') || 'None';

      rows.push({
        sNo: sNo++,
        registrationId: reg.registrationId,
        teamName: reg.teamName,
        teamSize: reg.teamSize,
        teamLeader: leader ? leader.fullName : 'N/A',
        leaderEmail: leader ? leader.email : 'N/A',
        leaderPhone: leader ? leader.phone : 'N/A',
        college: leader ? leader.college : 'N/A',
        memberNames: memberNames,
        transactionId: payment ? payment.transactionId : 'N/A',
        amount: payment ? `₹${payment.expectedAmount}` : 'N/A',
        paymentStatus: payment ? payment.status : 'N/A',
        registrationStatus: reg.status,
        registeredAt: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : 'N/A',
      });
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CODIENYCH 1.0 - Team Master Sheet</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 12px;
      color: #000;
      background: #fff;
    }
    .header-box {
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    h2 {
      margin: 0 0 4px 0;
      font-size: 15px;
      letter-spacing: 0.5px;
    }
    p {
      margin: 0;
      font-size: 11px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5px;
      table-layout: auto;
    }
    th, td {
      border: 1px solid #000;
      padding: 4px 6px;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }
    th {
      background-color: #f2f2f2;
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 9px;
      white-space: nowrap;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    .text-center {
      text-align: center;
    }
    .nowrap {
      white-space: nowrap;
    }
    @media print {
      @page {
        size: landscape;
        margin: 8mm;
      }
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <h2>CODIENYCH 1.0 - TEAM REGISTRATION & PAYMENT MASTER SHEET</h2>
    <p><strong>Generated On:</strong> ${new Date().toLocaleString()} | <strong>Total Teams:</strong> ${rows.length}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th>Reg ID</th>
        <th>Team Name</th>
        <th class="text-center">Size</th>
        <th>Leader</th>
        <th>Email</th>
        <th>Phone</th>
        <th>College</th>
        <th>Members</th>
        <th>UTR / Tx ID</th>
        <th class="text-center">Fee</th>
        <th class="text-center">Payment</th>
        <th class="text-center">Status</th>
        <th class="text-center">Date</th>
      </tr>
    </thead>
    <tbody>
      ${
        rows.length === 0
          ? '<tr><td colspan="14" class="text-center" style="padding: 20px;">No registered teams found.</td></tr>'
          : rows
              .map(
                (r) => `
        <tr>
          <td class="text-center">${r.sNo}</td>
          <td class="nowrap"><strong>${r.registrationId}</strong></td>
          <td><strong>${r.teamName}</strong></td>
          <td class="text-center">${r.teamSize}</td>
          <td>${r.teamLeader}</td>
          <td>${r.leaderEmail}</td>
          <td class="nowrap">${r.leaderPhone}</td>
          <td>${r.college}</td>
          <td>${r.memberNames}</td>
          <td class="nowrap"><strong>${r.transactionId}</strong></td>
          <td class="text-center nowrap">${r.amount}</td>
          <td class="text-center nowrap">${r.paymentStatus}</td>
          <td class="text-center nowrap"><strong>${r.registrationStatus}</strong></td>
          <td class="text-center nowrap">${r.registeredAt}</td>
        </tr>`
              )
              .join('')
      }
    </tbody>
  </table>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="CODIENYCH_1.0_Teams_${Date.now()}.html"`);
    return res.status(200).send(htmlContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getDashboardStats,
  getRegistrations,
  getRegistrationById,
  getPayments,
  verifyPayment,
  rejectPayment,
  getParticipants,
  verifyParticipant,
  rejectParticipant,
  exportReport,
};

