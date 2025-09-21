const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    coverLetter: { type: String }, // rich text HTML
    cv: { type: String, required: true }, // store filename or cloud URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
