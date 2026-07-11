const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: String,
  skillsRequired: [String],
  location: String,
  postedDate: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: String, default: 'Open' } // 'Open', 'Closed'
});

module.exports = mongoose.model('Internship', InternshipSchema);