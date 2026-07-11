const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'student', 'company_hr', 'industry_supervisor', 'academic_supervisor', 'department_coordinator'], 
    default: 'student' 
  },
  department: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  phone: String,
  profilePic: String
});

module.exports = mongoose.model('User', UserSchema);