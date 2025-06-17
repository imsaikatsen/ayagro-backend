async function sendOtpToEmail(email, otp) {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  // In real app, use nodemailer or similar here
}

async function sendOtpToPhone(phone, otp) {
  console.log(`Sending OTP ${otp} to phone: ${phone}`);
  // In real app, use SMS gateway (like Twilio) here
}

module.exports = {
  sendOtpToEmail,
  sendOtpToPhone,
};
