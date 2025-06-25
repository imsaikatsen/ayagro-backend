async function sendOtpToEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendOtpToPhone(phone, otp) {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
}

module.exports = {
  sendOtpToEmail,
  sendOtpToPhone,
};
