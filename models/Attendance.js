const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  location: String,
  status: { type: String, default: 'Present' }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);