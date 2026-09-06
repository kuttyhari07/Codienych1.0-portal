const nodemailer = require('nodemailer');
const config = require('../config/env');

const createTransporter = () => {
  if (!config.ENABLE_EMAIL || !config.SMTP_USER || !config.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

/**
 * Common HTML wrapper with premium cyberpunk/dark theme
 */
const wrapEmailTemplate = (title, badgeText, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 20px auto; background: #0b0f19; border: 1px solid #1f293d; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #09131f 0%, #030712 100%); padding: 30px; border-bottom: 1px solid #1e293b; text-align: center; }
    .header h1 { margin: 0; font-size: 26px; color: #00ff66; letter-spacing: 2px; text-transform: uppercase; font-weight: 800; text-shadow: 0 0 10px rgba(0,255,102,0.3); }
    .header p { margin: 5px 0 0; color: #94a3b8; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
    .badge-success { background: rgba(0, 255, 102, 0.1); color: #00ff66; border: 1px solid #00ff66; }
    .badge-info { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid #38bdf8; }
    .badge-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid #ef4444; }
    .content { padding: 30px; color: #e2e8f0; line-height: 1.6; font-size: 15px; }
    .card { background: #131b2e; border: 1px solid #23304b; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .label { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #f8fafc; font-weight: 600; font-family: monospace; font-size: 14px; }
    .footer { background: #060a12; padding: 20px 30px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px; }
    .footer a { color: #00ff66; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CODIENYCH 1.0</h1>
      <p>24-Hour Software Hackathon</p>
      <div class="badge ${badgeText.type}">${badgeText.text}</div>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Organized by Department of Information Technology, Erode Sengunthar Engineering College</p>
      <p style="margin: 0;">For queries, contact <a href="mailto:${config.ORGANIZER_EMAIL}">${config.ORGANIZER_EMAIL}</a></p>
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. Notify Organizer when a new team registers
 */
const sendOrganizerNewRegistrationAlert = async ({
  teamName,
  registrationId,
  teamSize,
  expectedAmount,
  transactionId,
  leaderName,
  leaderEmail,
  leaderPhone,
  college,
  department,
}) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Email skipped (SMTP not configured).');
    return false;
  }

  const contentHtml = `
    <h2 style="color: #ffffff; margin-top: 0;">⚡ New Team Registration Submitted</h2>
    <p>A new team has registered for CODIENYCH 1.0 and is awaiting admin payment & ID verification.</p>
    
    <div class="card">
      <div style="margin-bottom: 8px;"><span class="label">Registration ID:</span> <span class="value" style="color:#00ff66;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Name:</span> <span class="value">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Size:</span> <span class="value">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Expected Fee:</span> <span class="value">₹${expectedAmount}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">UPI UTR / Tx ID:</span> <span class="value">${transactionId}</span></div>
    </div>

    <h3 style="color: #38bdf8; margin-bottom: 8px; font-size: 15px;">Team Leader Contact Details:</h3>
    <div class="card">
      <div style="margin-bottom: 8px;"><span class="label">Name:</span> <span class="value">${leaderName}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Email:</span> <span class="value">${leaderEmail}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Phone:</span> <span class="value">${leaderPhone}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">College:</span> <span class="value">${college}</span></div>
      <div><span class="label">Department:</span> <span class="value">${department}</span></div>
    </div>

    <p style="margin-top: 20px;">Please login to the Admin Dashboard to verify payment receipt and student ID credentials.</p>
  `;

  const html = wrapEmailTemplate(
    'New Registration Received',
    { text: 'NEW REGISTRATION ALERT', type: 'badge-info' },
    contentHtml
  );

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: config.ORGANIZER_EMAIL,
      subject: `[NEW REGISTRATION] Team ${teamName} (${registrationId}) - CODIENYCH 1.0`,
      html,
    });
    console.log(`[Email Service] Organizer alert sent successfully to ${config.ORGANIZER_EMAIL}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send organizer alert:`, error.message);
    return false;
  }
};

/**
 * 2. Send Registration Acknowledgement to Team Leader
 */
const sendRegistrationReceivedToLeader = async ({
  leaderEmail,
  leaderName,
  teamName,
  registrationId,
  teamSize,
  expectedAmount,
  transactionId,
}) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Email skipped (SMTP not configured).');
    return false;
  }

  const contentHtml = `
    <h2 style="color: #ffffff; margin-top: 0;">Registration Received 📥</h2>
    <p>Hello <strong>${leaderName}</strong>,</p>
    <p>Thank you for registering <strong>Team ${teamName}</strong> for <strong>CODIENYCH 1.0</strong>! Your registration details and payment proof have been received successfully.</p>
    
    <div class="card">
      <div style="margin-bottom: 8px;"><span class="label">Registration ID:</span> <span class="value" style="color:#00ff66;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Name:</span> <span class="value">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Size:</span> <span class="value">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Amount Paid:</span> <span class="value">₹${expectedAmount}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Transaction ID:</span> <span class="value">${transactionId}</span></div>
      <div><span class="label">Current Status:</span> <span class="value" style="color:#38bdf8;">PENDING VERIFICATION</span></div>
    </div>

    <p><strong>Next Steps:</strong></p>
    <ul style="padding-left: 20px; color: #cbd5e1;">
      <li>Our organizing team is currently verifying your payment UTR and student ID cards.</li>
      <li>Once verified, you will receive an official <strong>Registration Confirmation</strong> email.</li>
      <li>You can also track your live registration status anytime on our portal using your Registration ID: <strong style="color:#00ff66;">${registrationId}</strong>.</li>
    </ul>

    <p style="margin-top: 25px;">Good luck to your team!</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Received',
    { text: 'SUBMISSION RECEIVED - PENDING REVIEW', type: 'badge-info' },
    contentHtml
  );

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      subject: `[CODIENYCH 1.0] Registration Received - ${teamName} (${registrationId})`,
      html,
    });
    console.log(`[Email Service] Registration acknowledgement sent to leader: ${leaderEmail}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send leader ack:`, error.message);
    return false;
  }
};

/**
 * 3. Send Registration Confirmation / Approval to Team Leader
 */
const sendRegistrationConfirmation = async ({ leaderEmail, leaderName, teamName, registrationId, teamSize }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Email skipped (SMTP not configured).');
    return false;
  }

  const contentHtml = `
    <h2 style="color: #00ff66; margin-top: 0;">🎉 REGISTRATION CONFIRMED!</h2>
    <p>Hello <strong>${leaderName}</strong>,</p>
    <p>Congratulations! Your team payment and student credentials for <strong>${teamName}</strong> have been <strong>verified and approved</strong> by the CODIENYCH 1.0 organizing committee.</p>
    
    <div class="card" style="border-color: #00ff66;">
      <div style="margin-bottom: 8px;"><span class="label">Registration ID:</span> <span class="value" style="color:#00ff66; font-size: 16px;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Name:</span> <span class="value">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Size:</span> <span class="value">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Status:</span> <span class="value" style="color:#00ff66;">CONFIRMED & SEAT RESERVED</span></div>
      <div><span class="label">Venue:</span> <span class="value">${config.VENUE}</span></div>
    </div>

    <p><strong>Important Instructions:</strong></p>
    <ul style="padding-left: 20px; color: #cbd5e1;">
      <li>Please bring your original physical College ID cards on the event day.</li>
      <li>Carry your laptops, extension cords, and necessary hardware components.</li>
      <li>Stay tuned to official announcements and WhatsApp group updates.</li>
    </ul>

    <p style="margin-top: 25px;">Get ready for 24 hours of non-stop coding, innovation, and intense competition!</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Confirmed',
    { text: 'VERIFIED & CONFIRMED', type: 'badge-success' },
    contentHtml
  );

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      subject: `[CODIENYCH 1.0] Registration Approved & Confirmed! - ${registrationId}`,
      html,
    });
    console.log(`[Email Service] Confirmation email sent successfully to leader: ${leaderEmail}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send confirmation email:`, error.message);
    return false;
  }
};

/**
 * 4. Send Registration Rejection with Reason to Team Leader
 */
const sendRegistrationRejection = async ({
  leaderEmail,
  leaderName,
  teamName,
  registrationId,
  rejectionType,
  reason,
}) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Email skipped (SMTP not configured).');
    return false;
  }

  const contentHtml = `
    <h2 style="color: #ef4444; margin-top: 0;">Registration Update: Action Required ⚠️</h2>
    <p>Hello <strong>${leaderName}</strong>,</p>
    <p>We are contacting you regarding the registration for <strong>Team ${teamName}</strong> (ID: <strong style="color: #ef4444;">${registrationId}</strong>) for CODIENYCH 1.0.</p>
    <p>During the verification process by our review committee, an issue was detected with your <strong>${rejectionType}</strong> and the status has been marked as <strong>REJECTED</strong>.</p>
    
    <div class="card" style="border-color: #ef4444; background: #1c1117;">
      <div style="margin-bottom: 8px;"><span class="label">Registration ID:</span> <span class="value">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Team Name:</span> <span class="value">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span class="label">Rejected Component:</span> <span class="value" style="color: #f87171;">${rejectionType}</span></div>
      <div style="margin-top: 12px; padding: 10px; background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; border-radius: 4px;">
        <span class="label" style="color: #fca5a5; display: block; margin-bottom: 4px;">Reason for Rejection:</span>
        <span style="color: #ffffff; font-weight: 500;">${reason || 'Verification criteria not met. Please contact support.'}</span>
      </div>
    </div>

    <p><strong>What should you do next?</strong></p>
    <p>If you believe this is a mistake or if you need to submit corrected proof/documents, please reach out to the organizing team immediately at <a href="mailto:${config.ORGANIZER_EMAIL}" style="color: #00ff66;">${config.ORGANIZER_EMAIL}</a> or contact the student coordinators with your Registration ID.</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Rejected',
    { text: 'VERIFICATION REJECTED', type: 'badge-danger' },
    contentHtml
  );

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      subject: `[CODIENYCH 1.0] Registration Issue / Rejection Notice - ${registrationId}`,
      html,
    });
    console.log(`[Email Service] Rejection notification sent to leader: ${leaderEmail}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send rejection email:`, error.message);
    return false;
  }
};

module.exports = {
  sendOrganizerNewRegistrationAlert,
  sendRegistrationReceivedToLeader,
  sendRegistrationConfirmation,
  sendRegistrationRejection,
};
