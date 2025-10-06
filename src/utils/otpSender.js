const axios = require('axios');
// const nodemailer = require('nodemailer'); // You forgot to require this
require('dotenv').config(); // Ensure environment variables are loaded

function formatPhone(phone) {
  if (phone.startsWith('01')) {
    return '880' + phone.slice(1);
  }
  return phone;
}

// Send OTP via Email
async function sendOtpToEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Ayagro Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code ',
    html: `
        <div style="font-family:Arial, sans-serif; line-height:1.5;">
          <h2>Hi there, </h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="background:#f2f2f2; padding:10px 20px; display:inline-block; border-radius:8px;">
            ${otp}
          </h1>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <br />
          <p>— Ayagro Security Team</p>
        </div>
      `,
  };

  await transporter.sendMail(mailOptions);
}

// Send OTP via Alpha SMS
async function sendOtpToPhone(phone, otp) {
  const formattedPhone = formatPhone(phone);
  const smsText = `Ayagro OTP : ${otp}`;

  try {
    const response = await axios.post('https://api.sms.net.bd/sendsms', null, {
      params: {
        api_key: process.env.ALPHA_SMS_API_KEY,
        msg: smsText,
        to: formattedPhone,
      },
    });

    if (response.data.error !== 0) {
      console.error('❌ SMS sending failed:', response.data);
      throw new Error('Failed to send OTP via Alpha SMS');
    }
  } catch (error) {
    console.error('❌ SMS send error:', error.message);
    throw new Error('Failed to send OTP via Alpha SMS');
  }
}

module.exports = {
  sendOtpToEmail,
  sendOtpToPhone,
};
