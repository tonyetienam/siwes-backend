const mongoose = require('mongoose');
const EvaluationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  comments: String,
  submittedDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Evaluation', EvaluationSchema);