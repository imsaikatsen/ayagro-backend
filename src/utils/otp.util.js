function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiry(minutes = 5) {
  return new Date(Date.now() + minutes * 60000);
}

module.exports = {
  generateOtp,
  getExpiry,
};
