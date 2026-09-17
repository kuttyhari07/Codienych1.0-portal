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
 * Common HTML wrapper with Pirates of the Caribbean Aztec Gold & Caribbean Ocean styling
 */
const wrapEmailTemplate = (title, badgeText, contentHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #020508; font-family: 'Cinzel', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Georgia, serif; color: #f4e6c3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #08121a; border: 1px solid #6b5321; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
    <tr>
      <td style="background: #140e06; padding: 28px 25px; border-bottom: 2px solid #ffd700; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; color: #ffd700; letter-spacing: 3px; text-transform: uppercase; font-weight: 900; text-shadow: 0 0 12px rgba(255,215,0,0.4);">⚔️ CODIENYCH 1.0 ⚔️</h1>
        <p style="margin: 6px 0 0; color: #cfb07a; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; font-weight: bold;">24-Hour Caribbean Hackathon Expedition</p>
        <div style="display: inline-block; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 12px; background: rgba(255,215,0,0.12); color: #ffd700; border: 1px solid #ffd700; text-transform: uppercase; letter-spacing: 1px;">
          ${badgeText.text}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 25px; color: #f4e6c3; font-size: 14px; line-height: 1.7;">
        ${contentHtml}
      </td>
    </tr>
    <tr>
      <td style="background: #04080e; padding: 18px 25px; border-top: 1px solid #3b2b19; text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0 0 5px 0; color: #cfb07a;">Department of Information Technology, Erode Sengunthar Engineering College</p>
        <p style="margin: 0;">Port Comms? Email <a href="mailto:${config.ORGANIZER_EMAIL}" style="color: #ffd700; text-decoration: none; font-weight: bold;">${config.ORGANIZER_EMAIL}</a></p>
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
  domain,
  expectedAmount,
  transactionId,
  leaderName,
  leaderEmail,
  leaderPhone,
  college,
  department,
}) => {
  const domainText = domain || 'Not Specified';
  const contentHtml = `
    <h2 style="color: #ffd700; margin-top: 0; font-size: 20px;">⚡ New Crew Enlistment Submitted</h2>
    <p>A new pirate crew has enlisted for CODIENYCH 1.0 and is awaiting admiralty payment & ID verification.</p>
    
    <div style="background: #0d1a24; border: 1px solid #6b5321; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Registration ID:</span> <span style="color:#ffd700; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Domain / Track:</span> <span style="color: #ffd700; font-weight: bold;">${domainText}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Size:</span> <span style="color: #fff;">${teamSize} Pirates</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Expected Fee:</span> <span style="color: #ffd700; font-weight: bold;">₹${expectedAmount}</span></div>
      <div><span style="color: #cfb07a; font-size: 13px;">UPI UTR / Tx ID:</span> <span style="color: #00e5ff; font-weight: bold;">${transactionId}</span></div>
    </div>

    <h3 style="color: #00e5ff; margin-bottom: 8px; font-size: 15px;">Captain Contact Details:</h3>
    <div style="background: #0d1a24; border: 1px solid #6b5321; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Captain Name:</span> <span style="color: #fff;">${leaderName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Email:</span> <span style="color: #ffd700;">${leaderEmail}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Phone:</span> <span style="color: #fff;">${leaderPhone}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">College:</span> <span style="color: #fff;">${college}</span></div>
      <div><span style="color: #cfb07a; font-size: 13px;">Department:</span> <span style="color: #fff;">${department}</span></div>
    </div>

    <p style="margin-top: 20px;">Please login to the Admiralty Dashboard to verify payment receipt and student ID credentials.</p>
  `;

  const html = wrapEmailTemplate(
    'New Registration Received',
    { text: 'NEW CREW ENLISTMENT ALERT', type: 'badge-info' },
    contentHtml
  );

  const text = `
⚡ NEW CREW ENLISTMENT SUBMITTED - CODIENYCH 1.0

Registration ID: ${registrationId}
Crew Name: ${teamName}
Domain / Track: ${domainText}
Crew Size: ${teamSize} Pirates
Expected Fee: ₹${expectedAmount}
UPI UTR / Tx ID: ${transactionId}

Captain Contact:
Name: ${leaderName}
Email: ${leaderEmail}
Phone: ${leaderPhone}
College: ${college}
Department: ${department}

Please login to Admiralty Dashboard to review ID cards & payment proof.
  `.trim();

  const adminAlertEmail = (process.env.ADMIN_EMAIL || config.ADMIN_EMAIL || config.ORGANIZER_EMAIL || 'codienych@gmail.com').trim();
  return await sendUniversalMail({
    to: adminAlertEmail,
    replyTo: leaderEmail,
    subject: `[NEW ENLISTMENT] Crew ${teamName} (${domainText}) - CODIENYCH 1.0`,
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
  domain,
  expectedAmount,
  transactionId,
}) => {
  const domainText = domain || 'Not Specified';
  const contentHtml = `
    <h2 style="color: #ffd700; margin-top: 0; font-size: 20px;">Crew Manifest Received 📜</h2>
    <p>Ahoy <strong>Captain ${leaderName}</strong>,</p>
    <p>Thank you for enlisting <strong>Crew ${teamName}</strong> for <strong>CODIENYCH 1.0</strong>! Your crew details and bounty payment proof have been received aboard.</p>
    
    <div style="background: #0d1a24; border: 1px solid #6b5321; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Registration ID:</span> <span style="color:#ffd700; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Domain / Track:</span> <span style="color: #ffd700; font-weight: bold;">${domainText}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Size:</span> <span style="color: #fff;">${teamSize} Pirates</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Amount Paid:</span> <span style="color: #ffd700; font-weight: bold;">₹${expectedAmount}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Transaction ID:</span> <span style="color: #fff;">${transactionId}</span></div>
      <div><span style="color: #cfb07a; font-size: 13px;">Current Status:</span> <span style="color:#00e5ff; font-weight: bold;">PENDING ADMIRALTY VERIFICATION</span></div>
    </div>

    <p><strong>Next Steps on the Horizon:</strong></p>
    <ul style="padding-left: 20px; color: #cbd5e1;">
      <li>Our port admiralty team is currently verifying your payment UTR and student ID cards.</li>
      <li>Once verified, you will receive an official <strong>Registration Confirmation</strong> dispatch.</li>
      <li>You can also track your live voyage status anytime on our portal using Registration ID: <strong style="color:#ffd700;">${registrationId}</strong>.</li>
    </ul>

    <p style="margin-top: 25px; color: #ffd700; font-weight: bold;">Fair winds and good luck to your crew!</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Received',
    { text: 'MANIFEST RECEIVED - PENDING REVIEW', type: 'badge-info' },
    contentHtml
  );

  const text = `
Registration Received - CODIENYCH 1.0

Ahoy Captain ${leaderName},
Thank you for enlisting Crew ${teamName} for CODIENYCH 1.0!

Registration ID: ${registrationId}
Crew Name: ${teamName}
Domain / Track: ${domainText}
Crew Size: ${teamSize} Pirates
Amount: ₹${expectedAmount}
Transaction ID: ${transactionId}
Status: PENDING VERIFICATION

Our team is currently verifying your payment UTR and student ID cards.
Track your status on our portal anytime using Registration ID: ${registrationId}.
  `.trim();

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Manifest Received - Crew ${teamName} (${registrationId})`,
    text,
    html,
  });
};

/**
 * 3. Send Registration Confirmation / Approval to Team Leader
 */
const sendRegistrationConfirmation = async ({ leaderEmail, leaderName, teamName, registrationId, teamSize, domain }) => {
  const domainText = domain || 'Not Specified';
  const contentHtml = `
    <h2 style="color: #ffd700; margin-top: 0; font-size: 22px;">🎉 CREW ENLISTMENT CONFIRMED!</h2>
    <p>Ahoy <strong>Captain ${leaderName}</strong>,</p>
    <p>Congratulations! Your crew payment and student credentials for <strong>${teamName}</strong> have been <strong>verified and approved</strong> by the CODIENYCH 1.0 Admiralty!</p>
    
    <div style="background: #0d1a24; border: 2px solid #ffd700; border-radius: 10px; padding: 18px; margin: 20px 0; box-shadow: 0 0 20px rgba(255,215,0,0.15);">
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Registration ID:</span> <span style="color:#ffd700; font-size: 16px; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Domain / Track:</span> <span style="color: #ffd700; font-weight: bold;">${domainText}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Size:</span> <span style="color: #fff;">${teamSize} Pirates</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Status:</span> <span style="color:#ffd700; font-weight: bold;">CONFIRMED & CABIN RESERVED ⚓</span></div>
      <div><span style="color: #cfb07a; font-size: 13px;">Port Venue:</span> <span style="color: #fff; font-weight: bold;">${config.VENUE}</span></div>
    </div>

    <p><strong>Crucial Voyage Directives:</strong></p>
    <ul style="padding-left: 20px; color: #cbd5e1;">
      <li>Please bring your original physical College ID cards on the embarkation day.</li>
      <li>Carry your laptops, extension cables, and necessary hardware tools.</li>
      <li>Join the Official WhatsApp Fleet via the Voyage Status page for real-time announcements.</li>
    </ul>

    <p style="margin-top: 25px; color: #ffd700; font-weight: bold;">Prepare for 24 hours of non-stop coding on the high seas!</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Confirmed',
    { text: 'VERIFIED & VOYAGE CONFIRMED', type: 'badge-success' },
    contentHtml
  );

  const text = `
🎉 REGISTRATION CONFIRMED - CODIENYCH 1.0

Ahoy Captain ${leaderName},
Congratulations! Your crew payment and student credentials for ${teamName} have been verified and approved.

Registration ID: ${registrationId}
Crew Name: ${teamName}
Domain / Track: ${domainText}
Crew Size: ${teamSize} Pirates
Status: CONFIRMED & CABIN RESERVED
Venue: ${config.VENUE}

Please bring physical College ID cards and laptops on the event day.
  `.trim();

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Voyage Approved & Confirmed! - ${registrationId}`,
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
    <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">Manifest Update: Action Required ⚠️</h2>
    <p>Ahoy <strong>Captain ${leaderName}</strong>,</p>
    <p>We are contacting you regarding the crew registration for <strong>${teamName}</strong> (ID: <strong style="color: #ef4444;">${registrationId}</strong>) for CODIENYCH 1.0.</p>
    <p>During admiralty verification, an issue was identified with your <strong>${rejectionType}</strong> and the status has been marked as <strong>REJECTED</strong>.</p>
    
    <div style="background: #190c10; border: 1px solid #ef4444; border-radius: 10px; padding: 18px; margin: 20px 0;">
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Registration ID:</span> <span style="color: #fff; font-weight: bold;">${registrationId}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Crew Name:</span> <span style="color: #fff; font-weight: bold;">${teamName}</span></div>
      <div style="margin-bottom: 8px;"><span style="color: #cfb07a; font-size: 13px;">Rejected Item:</span> <span style="color: #f87171; font-weight: bold;">${rejectionType}</span></div>
      <div style="margin-top: 10px; padding: 12px; background: rgba(239,68,68,0.12); border-left: 3px solid #ef4444; border-radius: 4px;">
        <span style="color: #fca5a5; display: block; margin-bottom: 4px; font-size: 12px; font-weight: bold;">Reason:</span>
        <span style="color: #ffffff; font-weight: bold;">${reason || 'Verification criteria not met.'}</span>
      </div>
    </div>

    <p>If you believe this is an error or need assistance, contact the Admiralty at <a href="mailto:${config.ORGANIZER_EMAIL}" style="color: #ffd700; font-weight: bold;">${config.ORGANIZER_EMAIL}</a>.</p>
  `;

  const html = wrapEmailTemplate(
    'Registration Rejected',
    { text: 'VERIFICATION REJECTED', type: 'badge-danger' },
    contentHtml
  );

  const text = `
Registration Update: Action Required - CODIENYCH 1.0

Ahoy Captain ${leaderName},
We are contacting you regarding the crew registration for ${teamName} (ID: ${registrationId}).
Your ${rejectionType} has been marked as REJECTED.

Reason: ${reason || 'Verification criteria not met.'}

Please contact the organizing team at ${config.ORGANIZER_EMAIL} for assistance.
  `.trim();

  return await sendUniversalMail({
    to: leaderEmail,
    replyTo: (process.env.ORGANIZER_EMAIL || config.ORGANIZER_EMAIL || 'codienych1.0@gmail.com').trim(),
    subject: `[CODIENYCH 1.0] Manifest Issue / Rejection Notice - ${registrationId}`,
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

