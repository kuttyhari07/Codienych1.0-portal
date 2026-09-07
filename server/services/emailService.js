const nodemailer = require('nodemailer');
const config = require('../config/env');

let cachedTransporter = null;

const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const smtpUser = (config.SMTP_USER || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim();
  const smtpPass = (config.SMTP_PASS || 'jvllycpzzheoymoo').trim();

  if (!smtpUser || !smtpPass) {
    console.warn(`[Email Service Warning] Transporter cannot be created. smtpUser: ${smtpUser}, smtpPass present: ${Boolean(smtpPass)}`);
    return null;
  }

  try {
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Prevents certificate / SSL handshake failures on cloud servers like Render
      },
      pool: true,
      maxConnections: 3,
      rateDelta: 1000,
      rateLimit: 3,
    });

    return cachedTransporter;
  } catch (err) {
    console.error('[Email Service] Failed to initialize transporter:', err.message);
    return null;
  }
};

/**
 * Common HTML wrapper with clean email-client compatible styling (avoiding spam triggers)
 */
const wrapEmailTemplate = (title, badgeText, contentHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #0b0f19; border: 1px solid #1f293d; border-radius: 12px; overflow: hidden;">
    <tr>
      <td style="background: #09131f; padding: 25px; border-bottom: 1px solid #1e293b; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; color: #00ff66; letter-spacing: 2px; text-transform: uppercase;">CODIENYCH 1.0</h1>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">24-Hour Software Hackathon</p>
        <div style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: bold; margin-top: 10px; background: rgba(0,255,102,0.1); color: #00ff66; border: 1px solid #00ff66;">
          ${badgeText.text}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px; color: #e2e8f0; font-size: 14px; line-height: 1.6;">
        ${contentHtml}
      </td>
    </tr>
    <tr>
      <td style="background: #060a12; padding: 15px 25px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 11px;">
        <p style="margin: 0 0 4px 0;">Department of Information Technology, Erode Sengunthar Engineering College</p>
        <p style="margin: 0;">Need help? Email <a href="mailto:${config.ORGANIZER_EMAIL}" style="color: #00ff66; text-decoration: none;">${config.ORGANIZER_EMAIL}</a></p>
      </td>
    </tr>
  </table>
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

  const text = `
⚡ NEW TEAM REGISTRATION SUBMITTED - CODIENYCH 1.0

Registration ID: ${registrationId}
Team Name: ${teamName}
Team Size: ${teamSize} Members
Expected Fee: ₹${expectedAmount}
UPI UTR / Tx ID: ${transactionId}

Team Leader Contact:
Name: ${leaderName}
Email: ${leaderEmail}
Phone: ${leaderPhone}
College: ${college}
Department: ${department}

Please login to Admin Dashboard to review ID cards & payment proof.
  `.trim();

  try {
    const adminAlertEmail = config.ADMIN_EMAIL || 'hariharangmhk0429@gmail.com';
    await transporter.sendMail({
      from: `"CODIENYCH 1.0 Control Center" <${config.SMTP_USER || 'codienych1.0@gmail.com'}>`,
      to: adminAlertEmail,
      replyTo: leaderEmail,
      subject: `[NEW REGISTRATION] Team ${teamName} (${registrationId}) - CODIENYCH 1.0`,
      text,
      html,
    });
    console.log(`[Email Service] Organizer registration alert sent successfully to ${adminAlertEmail}`);
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

  const text = `
Registration Received - CODIENYCH 1.0

Hello ${leaderName},
Thank you for registering Team ${teamName} for CODIENYCH 1.0!

Registration ID: ${registrationId}
Team Name: ${teamName}
Team Size: ${teamSize} Members
Amount: ₹${expectedAmount}
Transaction ID: ${transactionId}
Status: PENDING VERIFICATION

Our team is currently verifying your payment UTR and student ID cards.
Track your status on our portal anytime using Registration ID: ${registrationId}.
  `.trim();

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      replyTo: config.ORGANIZER_EMAIL,
      subject: `[CODIENYCH 1.0] Registration Received - ${teamName} (${registrationId})`,
      text,
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
    
    <div style="background: #131b2e; border: 1px solid #00ff66; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Registration ID:</span> <span style="color:#00ff66; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Size:</span> <span style="color: #fff; font-weight: bold;">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Status:</span> <span style="color:#00ff66; font-weight: bold;">CONFIRMED & SEAT RESERVED</span></div>
      <div><span style="color: #94a3b8; font-size: 13px;">Venue:</span> <span style="color: #fff; font-weight: bold;">${config.VENUE}</span></div>
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

  const text = `
🎉 REGISTRATION CONFIRMED - CODIENYCH 1.0

Hello ${leaderName},
Congratulations! Your team payment and student credentials for ${teamName} have been verified and approved.

Registration ID: ${registrationId}
Team Name: ${teamName}
Team Size: ${teamSize} Members
Status: CONFIRMED & SEAT RESERVED
Venue: ${config.VENUE}

Please bring physical College ID cards and laptops on the event day.
  `.trim();

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      replyTo: config.ORGANIZER_EMAIL,
      subject: `[CODIENYCH 1.0] Registration Approved & Confirmed! - ${registrationId}`,
      text,
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
    <p>During verification, an issue was found with your <strong>${rejectionType}</strong> and the status has been marked as <strong>REJECTED</strong>.</p>
    
    <div style="background: #1c1117; border: 1px solid #ef4444; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Registration ID:</span> <span style="color: #fff; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Rejected Item:</span> <span style="color: #f87171; font-weight: bold;">${rejectionType}</span></div>
      <div style="margin-top: 10px; padding: 10px; background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; border-radius: 4px;">
        <span style="color: #fca5a5; display: block; margin-bottom: 4px; font-size: 12px;">Reason:</span>
        <span style="color: #ffffff; font-weight: bold;">${reason || 'Verification criteria not met.'}</span>
      </div>
    </div>

    <p>If you believe this is a mistake, contact us at <a href="mailto:${config.ORGANIZER_EMAIL}" style="color: #00ff66;">${config.ORGANIZER_EMAIL}</a>.</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Rejected',
    { text: 'VERIFICATION REJECTED', type: 'badge-danger' },
    contentHtml
  );

  const text = `
Registration Update: Action Required - CODIENYCH 1.0

Hello ${leaderName},
We are contacting you regarding the registration for Team ${teamName} (ID: ${registrationId}).
Your ${rejectionType} has been marked as REJECTED.

Reason: ${reason || 'Verification criteria not met.'}

Please contact the organizing team at ${config.ORGANIZER_EMAIL} for assistance.
  `.trim();

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      replyTo: config.ORGANIZER_EMAIL,
      subject: `[CODIENYCH 1.0] Registration Issue / Rejection Notice - ${registrationId}`,
      text,
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

