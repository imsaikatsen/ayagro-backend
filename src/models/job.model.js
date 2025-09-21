const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true }, // job title
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract'],
      required: true,
    },
    location: { type: String },
    salary: { type: String },
    deadline: { type: Date },
    vacancy: { type: Number },
    description: { type: String, required: true }, // rich text HTML
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
