const dns = require('dns');
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const config = require('../config/env');

const resendApiKey = (process.env.RESEND_API_KEY || config.RESEND_API_KEY || 're_TBxxbbbu_Jngpv56yDyzcXr9PDo6pwoYM').trim();
let resendClient = null;
if (resendApiKey) {
  try {
    resendClient = new Resend(resendApiKey);
  } catch (e) {
    console.error('[Resend Init Error]', e.message);
  }
}

const https = require('https');
const BREVO_API_KEY = (process.env.BREVO_API_KEY || config.BREVO_API_KEY || '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').trim();

const sendViaResend = async ({ to, subject, html, text, replyTo, fromName }) => {
  if (!resendClient) return false;
  try {
    const recipientList = Array.isArray(to) ? to : [to];
    const defaultSender = (process.env.RESEND_FROM_EMAIL || config.RESEND_FROM_EMAIL || 'CODIENYCH 1.0 <onboarding@resend.dev>').trim();
    const fromAddress = defaultSender.includes('<') ? defaultSender : `${fromName || 'CODIENYCH 1.0'} <${defaultSender}>`;

    const response = await resendClient.emails.send({
      from: fromAddress,
      to: recipientList,
      reply_to: replyTo || 'codienych@gmail.com',
      subject,
      html,
      text,
    });

    if (response && (response.data?.id || response.id)) {
      console.log(`[Resend API Success] Email delivered to ${JSON.stringify(to)}. MessageId: ${response.data?.id || response.id}`);
      return true;
    } else if (response && response.error) {
      console.warn(`[Resend API Notice]: ${response.error.message || JSON.stringify(response.error)}`);
      return false;
    }
    return true;
  } catch (resendErr) {
    console.warn(`[Resend API Exception]: ${resendErr.message}`);
    return false;
  }
};

const sendViaBrevo = ({ to, subject, html, text, replyTo, fromName, organizerEmail }) => {
  return new Promise((resolve) => {
    if (!BREVO_API_KEY) return resolve(false);
    try {
      const recipientList = (Array.isArray(to) ? to : [to]).map(addr => ({ email: addr }));
      const payload = JSON.stringify({
        sender: { name: fromName || 'CODIENYCH 1.0 Hackathon', email: organizerEmail || 'codienych@gmail.com' },
        to: recipientList,
        replyTo: { email: replyTo || organizerEmail || 'codienych@gmail.com' },
        subject,
        htmlContent: html,
        textContent: text,
      });

      const req = https.request({
        hostname: 'api.brevo.com',
        port: 443,
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 6000,
      }, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Brevo HTTPS API Success] Email delivered to ${JSON.stringify(to)}. Code: ${res.statusCode}`);
            resolve(true);
          } else {
            console.warn(`[Brevo HTTPS API Notice] Failed with status ${res.statusCode}:`, responseBody);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        console.error('[Brevo HTTPS Error]', err.message);
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        console.warn('[Brevo Timeout] Request timed out');
        resolve(false);
      });

      req.write(payload);
      req.end();
    } catch (e) {
      console.error('[Brevo Exception]', e.message);
      resolve(false);
    }
  });
};

const sendUniversalMail = async ({ to, subject, html, text, replyTo }) => {
  const fromName = 'CODIENYCH 1.0 Hackathon';
  const organizerEmail = (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych@gmail.com').trim();
  const activeReplyTo = replyTo || organizerEmail;

  // 1. Primary Method: Resend API (HTTP REST - No App Password required)
  if (resendClient) {
    const resendSuccess = await sendViaResend({
      to,
      subject,
      html,
      text,
      replyTo: activeReplyTo,
      fromName,
    });
    if (resendSuccess) return true;
  }

  // 2. Secondary Method: Brevo HTTPS REST API (Zero port block / Port 443 - No App Password required)
  if (BREVO_API_KEY) {
    const brevoSuccess = await sendViaBrevo({
      to,
      subject,
      html,
      text,
      replyTo: activeReplyTo,
      fromName,
      organizerEmail,
    });
    if (brevoSuccess) return true;
  }

  // 3. Fallback: Direct SMTP (Only if SMTP user & pass are explicitly supplied)
  const smtpUser = (process.env.SMTP_USER || config.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || config.SMTP_PASS || '').replace(/\s+/g, '').trim();
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });
      const info = await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to,
        replyTo: activeReplyTo,
        subject,
        text,
        html,
      });
      console.log(`[SMTP Fallback Success] Email delivered to ${to}. MessageId: ${info.messageId}`);
      return true;
    } catch (smtpErr) {
      console.error(`[SMTP Fallback Error] ${smtpErr.message}`);
    }
  }

  return false;
};

const createTransporter = () => {
  const smtpUser = (process.env.SMTP_USER || config.SMTP_USER || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim();
  const smtpPass = (process.env.SMTP_PASS || config.SMTP_PASS || 'jvllycpzzheoymoo').replace(/\s+/g, '').trim();

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
      family: 4,
      tls: { rejectUnauthorized: false },
    });

    return transporter;
  } catch (err) {
    console.error('[Email Service] Failed to create transporter:', err.message);
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
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">24-Hour Hackathon</p>
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
  const contentHtml = `
    <h2 style="color: #ffffff; margin-top: 0;">⚡ New Team Registration Submitted</h2>
    <p>A new team has registered for CODIENYCH 1.0 and is awaiting admin payment & ID verification.</p>
    
    <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Registration ID:</span> <span style="color:#00ff66; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Size:</span> <span style="color: #fff;">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Expected Fee:</span> <span style="color: #fff; font-weight: bold;">₹${expectedAmount}</span></div>
      <div><span style="color: #94a3b8; font-size: 13px;">UPI UTR / Tx ID:</span> <span style="color: #38bdf8; font-weight: bold;">${transactionId}</span></div>
    </div>

    <h3 style="color: #38bdf8; margin-bottom: 8px; font-size: 15px;">Team Leader Contact Details:</h3>
    <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Name:</span> <span style="color: #fff;">${leaderName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Email:</span> <span style="color: #00ff66;">${leaderEmail}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Phone:</span> <span style="color: #fff;">${leaderPhone}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">College:</span> <span style="color: #fff;">${college}</span></div>
      <div><span style="color: #94a3b8; font-size: 13px;">Department:</span> <span style="color: #fff;">${department}</span></div>
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

  const adminAlertEmail = (process.env.ADMIN_EMAIL || config.ADMIN_EMAIL || config.ORGANIZER_EMAIL || 'codienych@gmail.com').trim();
  return await sendUniversalMail({
    to: adminAlertEmail,
    replyTo: leaderEmail,
    subject: `[NEW REGISTRATION] Team ${teamName} (${registrationId}) - CODIENYCH 1.0`,
    text,
    html,
  });
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
  const contentHtml = `
    <h2 style="color: #ffffff; margin-top: 0;">Registration Received 📥</h2>
    <p>Hello <strong>${leaderName}</strong>,</p>
    <p>Thank you for registering <strong>Team ${teamName}</strong> for <strong>CODIENYCH 1.0</strong>! Your registration details and payment proof have been received successfully.</p>
    
    <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Registration ID:</span> <span style="color:#00ff66; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Team Size:</span> <span style="color: #fff;">${teamSize} Members</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Amount Paid:</span> <span style="color: #00ff66; font-weight: bold;">₹${expectedAmount}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Transaction ID:</span> <span style="color: #fff;">${transactionId}</span></div>
      <div><span style="color: #94a3b8; font-size: 13px;">Current Status:</span> <span style="color:#38bdf8; font-weight: bold;">PENDING VERIFICATION</span></div>
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

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Registration Received - ${teamName} (${registrationId})`,
    text,
    html,
  });
};

/**
 * 3. Send Registration Confirmation / Approval to Team Leader
 */
const sendRegistrationConfirmation = async ({ leaderEmail, leaderName, teamName, registrationId, teamSize }) => {
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

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Registration Approved & Confirmed! - ${registrationId}`,
    text,
    html,
  });
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

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Registration Issue / Rejection Notice - ${registrationId}`,
    text,
    html,
  });
};

module.exports = {
  sendOrganizerNewRegistrationAlert,
  sendRegistrationReceivedToLeader,
  sendRegistrationConfirmation,
  sendRegistrationRejection,
};

