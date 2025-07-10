const axios = require('axios');
require('dotenv').config();

function formatPhone(phone) {
  if (phone.startsWith('01')) {
    return '880' + phone.slice(1);
  }
  return phone;
}

async function sendSMS(phone, message) {
  const formattedPhone = formatPhone(phone);

  try {
    const response = await axios.post('https://api.sms.net.bd/sendsms', null, {
      params: {
        api_key: process.env.ALPHA_SMS_API_KEY,
        msg: message,
        to: formattedPhone,
      },
    });

    if (response.data.error !== 0) {
      console.error('❌ SMS sending failed:', response.data);
    } else {
      console.log('✅ SMS sent:', response.data);
    }
  } catch (error) {
    console.error('❌ SMS error:', error.message);
  }
}

module.exports = sendSMS;
