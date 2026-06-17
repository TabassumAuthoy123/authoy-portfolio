const nodemailer = require('nodemailer');

// ═══════════════════════════════════════
//   GMAIL TRANSPORTER
// ═══════════════════════════════════════
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASS in .env to enable notifications.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
    },
  });

  return transporter;
}

// ═══════════════════════════════════════
//   SEND CONTACT NOTIFICATION
// ═══════════════════════════════════════
async function sendContactNotification({ name, email, message }) {
  const transport = getTransporter();
  if (!transport) return; // Email not configured — silently skip

  const isBooking = message?.includes('[Consultation Booking Request]');
  const subject = isBooking
    ? `📅 New Booking Request from ${name}`
    : `📬 New Contact Message from ${name}`;

  const toEmail = process.env.NOTIFICATION_EMAIL || 'tabassumauthoy12@gmail.com';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: Inter, -apple-system, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0d9488, #06b6d4); padding: 32px 40px; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px 40px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 6px; }
    .field .value { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
    .cta { display: inline-block; margin-top: 8px; background: linear-gradient(135deg, #0d9488, #06b6d4); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${isBooking ? '📅 New Booking Request' : '📬 New Contact Message'}</h1>
      <p>From your portfolio at tabassumauthoy.me</p>
    </div>
    <div class="body">
      <div class="field">
        <label>Sender Name</label>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <label>Email Address</label>
        <div class="value"><a href="mailto:${email}" style="color:#0d9488">${email}</a></div>
      </div>
      <div class="field">
        <label>${isBooking ? 'Booking Details' : 'Message'}</label>
        <div class="value">${message?.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
      <a href="https://www.linkedin.com/in/tabassum-authoy" class="cta">Reply via LinkedIn</a>
    </div>
    <div class="footer">
      <p>This notification was sent automatically from your Authoy Portfolio CMS.</p>
      <p>You can reply directly to <strong>${email}</strong> to respond.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transport.sendMail({
      from: `"Authoy Portfolio" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      replyTo: email,
      subject,
      html: htmlBody,
      text: `New message from ${name} (${email}):\n\n${message}`,
    });
    console.log(`✉️  Notification email sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Failed to send email notification:', err.message);
    // Don't throw — email failure should not break the API response
  }
}

module.exports = { sendContactNotification };
