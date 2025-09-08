const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
});

module.exports = mongoose.model('Module', moduleSchema);
