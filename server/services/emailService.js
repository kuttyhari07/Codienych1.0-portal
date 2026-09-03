const nodemailer = require('nodemailer');
const config = require('../config/env');

const createTransporter = () => {
  if (!config.ENABLE_EMAIL || !config.SMTP_USER) {
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

const sendRegistrationConfirmation = async ({ leaderEmail, leaderName, teamName, registrationId, teamSize }) => {
  console.log(`[Email Service] Confirmation Triggered for Team: ${teamName} (${registrationId}) -> ${leaderEmail}`);

  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Email sending skipped (SMTP not configured or ENABLE_EMAIL=false).');
    return false;
  }

  const html = `
    <div style="background-color: #050b07; color: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; border: 1px solid #10b981; border-radius: 8px;">
      <h1 style="color: #10b981; text-transform: uppercase; margin-bottom: 5px;">CODIENYCH 1.0</h1>
      <p style="color: #a7f3d0; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; margin-top: 0;">24-Hour Software Hackathon</p>

      <hr style="border-color: #1f2937; margin: 20px 0;" />

      <h2 style="color: #ffffff;">REGISTRATION CONFIRMED 🎉</h2>
      <p>Hello <strong>${leaderName}</strong>,</p>
      <p>Great news! Your team payment and student ID verification for <strong>${teamName}</strong> have been officially verified by the CODIENYCH 1.0 organizing committee.</p>

      <div style="background-color: #0f1e14; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 5px 0;"><strong>Registration ID:</strong> <span style="color: #10b981; font-weight: bold;">${registrationId}</span></p>
        <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
        <p style="margin: 5px 0;"><strong>Team Size:</strong> ${teamSize} Members</p>
        <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: #10b981; font-weight: bold;">VERIFIED</span></p>
      </div>

      <p>Prepare your team for 24 hours of non-stop coding, innovation, and futuristic problem solving!</p>

      <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
        This is an automated operational dispatch from CODIENYCH 1.0 Control Center.<br />
        If you have any questions, please contact ${config.ORGANIZER_EMAIL}.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: leaderEmail,
      subject: `[CODIENYCH 1.0] Registration Confirmed - ${registrationId}`,
      html,
    });
    console.log(`[Email Service] Confirmation email sent successfully to ${leaderEmail}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email:`, error.message);
    return false;
  }
};

module.exports = { sendRegistrationConfirmation };
